/**
 * Servidor Express para Sistema de Venta Móvil por Vendedor
 */

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const QRCode = require('qrcode');
const XLSX = require('xlsx');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;
const DB_PATH = path.join(__dirname, 'database.sqlite');
const QRS_DIR = path.join(__dirname, 'public', 'qrs');

// Asegurar que existe el directorio de QRs
if (!fs.existsSync(QRS_DIR)) {
  fs.mkdirSync(QRS_DIR, { recursive: true });
}

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

// Inicializar base de datos
const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('Error abriendo base de datos:', err.message);
  } else {
    console.log('✅ Base de datos SQLite conectada');
    initDatabase();
  }
});

// Inicializar tablas
function initDatabase() {
  // Tabla de vendedores
  db.run(`
    CREATE TABLE IF NOT EXISTS vendedores (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      vendedor_id TEXT UNIQUE NOT NULL,
      nombre TEXT NOT NULL,
      username TEXT UNIQUE,
      password TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Tabla de asientos
  db.run(`
    CREATE TABLE IF NOT EXISTS asientos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      asiento_fisico_numero INTEGER UNIQUE NOT NULL,
      asiento_estado TEXT NOT NULL DEFAULT 'vacante',
      comprador_email TEXT,
      comprador_whatsapp TEXT,
      vendedor_id TEXT,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (vendedor_id) REFERENCES vendedores(vendedor_id)
    )
  `);

  // Tabla de ventas
  db.run(`
    CREATE TABLE IF NOT EXISTS ventas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      venta_id TEXT UNIQUE NOT NULL,
      vendedor_id TEXT NOT NULL,
      categoria TEXT NOT NULL,
      fecha TEXT NOT NULL,
      canal TEXT NOT NULL,
      medio_pago TEXT NOT NULL,
      precio_unitario REAL,
      precio_promocional_preventa_40off REAL,
      precio_venta REAL NOT NULL,
      cantidad INTEGER NOT NULL DEFAULT 1,
      total REAL NOT NULL,
      comprador_email TEXT,
      comprador_whatsapp TEXT NOT NULL,
      estado_pago TEXT NOT NULL,
      asiento_fisico_numero INTEGER,
      asiento_estado TEXT,
      canal_venta_virtual TEXT,
      pago_tipo TEXT,
      canal_venta_p2p TEXT,
      notas TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (vendedor_id) REFERENCES vendedores(vendedor_id)
    )
  `);

  // Inicializar asientos (1-100)
  db.serialize(() => {
    for (let i = 1; i <= 100; i++) {
      db.run(`INSERT OR IGNORE INTO asientos (asiento_fisico_numero, asiento_estado) VALUES (?, 'vacante')`, [i]);
    }
  });
}

// ============================================
// RUTAS
// ============================================

// Página principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Login page
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Formulario de venta por vendedor
app.get('/v/:vendedor_id', (req, res) => {
  const vendedor_id = req.params.vendedor_id;
  
  // Verificar que el vendedor existe
  db.get('SELECT * FROM vendedores WHERE vendedor_id = ?', [vendedor_id], (err, vendedor) => {
    if (err) {
      return res.status(500).send('Error consultando vendedor');
    }
    if (!vendedor) {
      return res.status(404).send('Vendedor no encontrado');
    }
    
    // Generar QR si no existe
    const baseUrl = req.protocol + '://' + req.get('host');
    const link = `${baseUrl}/v/${vendedor_id}`;
    const qrPath = path.join(QRS_DIR, `${vendedor_id}.png`);
    
    if (!fs.existsSync(qrPath)) {
      QRCode.toFile(qrPath, link, { width: 300, margin: 2 }, (err) => {
        if (err) {
          console.error('Error generando QR:', err);
        }
      });
    }
    
    res.sendFile(path.join(__dirname, 'public', 'venta.html'));
  });
});

// API: Obtener datos del vendedor
app.get('/api/vendedor/:vendedor_id', (req, res) => {
  const vendedor_id = req.params.vendedor_id;
  db.get('SELECT * FROM vendedores WHERE vendedor_id = ?', [vendedor_id], (err, vendedor) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!vendedor) {
      return res.status(404).json({ error: 'Vendedor no encontrado' });
    }
    res.json(vendedor);
  });
});

// API: Guardar venta
app.post('/api/venta', (req, res) => {
  const {
    vendedor_id,
    categoria,
    fecha,
    canal,
    medio_pago,
    precio_unitario,
    precio_promocional_preventa_40off,
    precio_venta,
    cantidad,
    total,
    comprador_email,
    comprador_whatsapp,
    estado_pago,
    asiento_fisico_numero,
    asiento_estado,
    canal_venta_virtual,
    pago_tipo,
    canal_venta_p2p,
    notas
  } = req.body;

  // Validaciones
  if (!vendedor_id || !categoria || !fecha || !canal || !medio_pago || !precio_venta || !cantidad || !comprador_whatsapp || !estado_pago) {
    return res.status(400).json({ error: 'Campos obligatorios faltantes' });
  }

  // Validar email si se proporciona
  if (comprador_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(comprador_email)) {
    return res.status(400).json({ error: 'Email inválido' });
  }

  // Generar ID de venta
  const venta_id = categoria === 'virtual' ? `VIRT-${Date.now()}` : 
                   categoria === 'fisica' ? `FIS-${Date.now()}` : 
                   `RES-${Date.now()}`;

  // Validaciones específicas por canal
  if (canal === 'venta_fisica') {
    if (!asiento_fisico_numero || !asiento_estado) {
      return res.status(400).json({ error: 'Asiento físico requerido para venta física' });
    }

    // Verificar disponibilidad del asiento
    db.get('SELECT * FROM asientos WHERE asiento_fisico_numero = ?', [asiento_fisico_numero], (err, asiento) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (!asiento) {
        return res.status(400).json({ error: 'Asiento no existe' });
      }
      if (asiento.asiento_estado === 'comprado') {
        return res.status(400).json({ error: 'Asiento ya está comprado' });
      }
      if (asiento.asiento_estado === 'reservado' && asiento_estado !== 'comprado') {
        return res.status(400).json({ error: 'Asiento está reservado, debe marcarse como comprado' });
      }

      // Guardar venta
      db.run(`
        INSERT INTO ventas (
          venta_id, vendedor_id, categoria, fecha, canal, medio_pago,
          precio_unitario, precio_promocional_preventa_40off, precio_venta,
          cantidad, total, comprador_email, comprador_whatsapp, estado_pago,
          asiento_fisico_numero, asiento_estado, canal_venta_p2p, notas
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        venta_id, vendedor_id, categoria, fecha, canal, medio_pago,
        precio_unitario || null, precio_promocional_preventa_40off || null, precio_venta,
        cantidad, total, comprador_email || null, comprador_whatsapp, estado_pago,
        asiento_fisico_numero, asiento_estado, canal_venta_p2p || null, notas || null
      ], function(err) {
        if (err) {
          return res.status(500).json({ error: err.message });
        }

        // Actualizar estado del asiento
        db.run('UPDATE asientos SET asiento_estado = ?, comprador_email = ?, comprador_whatsapp = ?, vendedor_id = ?, updated_at = CURRENT_TIMESTAMP WHERE asiento_fisico_numero = ?',
          [asiento_estado, comprador_email || null, comprador_whatsapp, vendedor_id, asiento_fisico_numero],
          (err) => {
            if (err) {
              console.error('Error actualizando asiento:', err);
            }
            res.json({ success: true, venta_id, message: 'Venta registrada exitosamente' });
          }
        );
      });
    });
  } else {
    // Venta virtual (live_virtual o post_transmision)
    db.run(`
      INSERT INTO ventas (
        venta_id, vendedor_id, categoria, fecha, canal, medio_pago,
        precio_unitario, precio_promocional_preventa_40off, precio_venta,
        cantidad, total, comprador_email, comprador_whatsapp, estado_pago,
        canal_venta_virtual, pago_tipo, notas
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      venta_id, vendedor_id, categoria, fecha, canal, medio_pago,
      precio_unitario || null, precio_promocional_preventa_40off || null, precio_venta,
      cantidad, total, comprador_email || null, comprador_whatsapp, estado_pago,
      canal_venta_virtual || null, pago_tipo || null, notas || null
    ], function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ success: true, venta_id, message: 'Venta registrada exitosamente' });
    });
  }
});

// Panel admin
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// API: Obtener todas las ventas con filtros
app.get('/api/ventas', (req, res) => {
  const { canal, vendedor_id, fecha, estado_pago, asiento_estado } = req.query;
  
  let query = 'SELECT v.*, vd.nombre as vendedor_nombre FROM ventas v LEFT JOIN vendedores vd ON v.vendedor_id = vd.vendedor_id WHERE 1=1';
  const params = [];

  if (canal) {
    query += ' AND v.canal = ?';
    params.push(canal);
  }
  if (vendedor_id) {
    query += ' AND v.vendedor_id = ?';
    params.push(vendedor_id);
  }
  if (fecha) {
    query += ' AND v.fecha = ?';
    params.push(fecha);
  }
  if (estado_pago) {
    query += ' AND v.estado_pago = ?';
    params.push(estado_pago);
  }
  if (asiento_estado) {
    query += ' AND v.asiento_estado = ?';
    params.push(asiento_estado);
  }

  query += ' ORDER BY v.created_at DESC';

  db.all(query, params, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// API: Obtener vendedores
app.get('/api/vendedores', (req, res) => {
  db.all('SELECT * FROM vendedores ORDER BY nombre', (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// API: Obtener estado de todos los asientos
app.get('/api/asientos', (req, res) => {
  db.all('SELECT asiento_fisico_numero, asiento_estado, comprador_email, comprador_whatsapp, vendedor_id FROM asientos ORDER BY asiento_fisico_numero', (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    // Asegurar que todos los asientos del 1 al 100 existan
    const asientosMap = {};
    rows.forEach(row => {
      asientosMap[row.asiento_fisico_numero] = row;
    });
    
    // Completar asientos faltantes como vacantes
    for (let i = 1; i <= 100; i++) {
      if (!asientosMap[i]) {
        asientosMap[i] = {
          asiento_fisico_numero: i,
          asiento_estado: 'vacante',
          comprador_email: null,
          comprador_whatsapp: null,
          vendedor_id: null
        };
      }
    }
    
    const asientos = Object.keys(asientosMap).sort((a, b) => a - b).map(key => asientosMap[key]);
    res.json(asientos);
  });
});

// Setup: Crear vendedor
app.get('/setup', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'setup.html'));
});

// API: Crear vendedor
app.post('/api/vendedor', (req, res) => {
  const { vendedor_id, nombre, username, password } = req.body;

  if (!vendedor_id || !nombre) {
    return res.status(400).json({ error: 'vendedor_id y nombre son requeridos' });
  }

  // Si se proporciona username, también debe haber password
  if (username && !password) {
    return res.status(400).json({ error: 'Si se proporciona username, también se requiere password' });
  }

  db.run('INSERT INTO vendedores (vendedor_id, nombre, username, password) VALUES (?, ?, ?, ?)', 
    [vendedor_id, nombre, username || null, password || null], 
    function(err) {
      if (err) {
        if (err.message.includes('UNIQUE')) {
          return res.status(400).json({ error: 'El vendedor_id o username ya existe' });
        }
        return res.status(500).json({ error: err.message });
      }

      // Generar QR
      const baseUrl = req.protocol + '://' + req.get('host');
      const link = `${baseUrl}/v/${vendedor_id}`;
      
      QRCode.toFile(
        path.join(QRS_DIR, `${vendedor_id}.png`),
        link,
        { width: 300, margin: 2 },
        (err) => {
          if (err) {
            console.error('Error generando QR:', err);
          }
          res.json({ 
            success: true, 
            vendedor_id,
            link,
            qr_path: `/qrs/${vendedor_id}.png`
          });
        }
      );
    }
  );
});

// API: Login vendedor
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username y password son requeridos' });
  }

  db.get('SELECT * FROM vendedores WHERE username = ? AND password = ?', [username, password], (err, vendedor) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!vendedor) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Generar QR si no existe
    const baseUrl = req.protocol + '://' + req.get('host');
    const link = `${baseUrl}/v/${vendedor.vendedor_id}`;
    const qrPath = path.join(QRS_DIR, `${vendedor.vendedor_id}.png`);
    
    // Verificar si el QR existe, si no, generarlo
    if (!fs.existsSync(qrPath)) {
      QRCode.toFile(qrPath, link, { width: 300, margin: 2 }, (err) => {
        if (err) {
          console.error('Error generando QR:', err);
        }
      });
    }

    res.json({
      success: true,
      vendedor: {
        vendedor_id: vendedor.vendedor_id,
        nombre: vendedor.nombre,
        link: link,
        qr_path: `/qrs/${vendedor.vendedor_id}.png`
      }
    });
  });
});

// Exportar Excel/CSV
app.get('/api/export/:tipo', (req, res) => {
  const { tipo } = req.params; // ventas_virtuales, ventas_fisicas, reservas_asientos
  const { formato } = req.query; // xlsx o csv

  let query = '';
  let categoria = '';

  if (tipo === 'ventas_virtuales') {
    query = "SELECT * FROM ventas WHERE categoria = 'virtual'";
    categoria = 'virtual';
  } else if (tipo === 'ventas_fisicas') {
    query = "SELECT * FROM ventas WHERE categoria = 'fisica'";
    categoria = 'fisica';
  } else if (tipo === 'reservas_asientos') {
    query = "SELECT * FROM ventas WHERE categoria = 'reserva'";
    categoria = 'reserva';
  } else {
    return res.status(400).json({ error: 'Tipo inválido' });
  }

  db.all(query, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (formato === 'csv') {
      // Exportar CSV
      const headers = Object.keys(rows[0] || {});
      const csv = [
        headers.join(','),
        ...rows.map(row => headers.map(h => `"${row[h] || ''}"`).join(','))
      ].join('\n');

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="${tipo}_${new Date().toISOString().split('T')[0]}.csv"`);
      res.send(csv);
    } else {
      // Exportar Excel
      const ws = XLSX.utils.json_to_sheet(rows);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'datos');
      
      const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename="${tipo}_${new Date().toISOString().split('T')[0]}.xlsx"`);
      res.send(buffer);
    }
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📱 Formulario de venta: http://localhost:${PORT}/v/<vendedor_id>`);
  console.log(`⚙️  Setup: http://localhost:${PORT}/setup`);
  console.log(`👨‍💼 Admin: http://localhost:${PORT}/admin`);
});

