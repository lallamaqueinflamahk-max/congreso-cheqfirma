# Sistema de Venta Móvil por Vendedor

Sistema completo para cargar ventas manuales desde celular mediante links y códigos QR únicos por vendedor. Las ventas se registran automáticamente en una base de datos central y se pueden visualizar en un panel de administración.

## 🎯 Características

- ✅ **Links únicos por vendedor** con formato `/v/<vendedor_id>`
- ✅ **Códigos QR automáticos** para cada vendedor
- ✅ **Formulario móvil simple** (1 pantalla) optimizado para celular
- ✅ **3 canales de venta soportados**:
  - Venta Física (asientos físicos)
  - Live Virtual (evento en vivo)
  - Post Transmisión
- ✅ **Panel de administración** con filtros y exportación
- ✅ **Base de datos SQLite** (archivo local, fácil de usar)
- ✅ **Validaciones automáticas** de email, asientos, etc.
- ✅ **Exportación Excel/CSV** de reportes

## 📋 Requisitos

- Node.js 14 o superior
- npm o yarn

## 🚀 Instalación

1. **Instalar dependencias:**

```bash
cd venta-movil
npm install
```

2. **Inicializar base de datos:**

La base de datos se crea automáticamente al iniciar el servidor por primera vez. No es necesario ejecutar comandos adicionales.

## ▶️ Cómo Correr

### Modo Desarrollo (con auto-reload):

```bash
npm run dev
```

### Modo Producción:

```bash
npm start
```

El servidor se iniciará en `http://localhost:3000`

## 📱 Uso del Sistema

### 1. Crear un Vendedor

1. Abre en el navegador: `http://localhost:3000/setup`
2. Completa el formulario:
   - **ID del Vendedor**: Identificador único (ej: `juan_perez`)
   - **Nombre del Vendedor**: Nombre completo (ej: `Juan Pérez`)
   - **Username** (opcional): Para login (ej: `juan_perez`)
   - **Password** (opcional): Requerido si proporcionas username
3. Haz clic en "Crear Vendedor"
4. Se generará automáticamente:
   - Link único: `http://localhost:3000/v/juan_perez`
   - Código QR (descargable)
   - Imagen QR guardada en `/public/qrs/`

### 1.1. Login de Vendedor

1. Abre en el navegador: `http://localhost:3000/login`
2. Ingresa tu **username** y **password** (configurados al crear el vendedor)
3. Después del login verás:
   - Tu código QR para compartir
   - Link directo al formulario de venta
   - Opción para descargar el QR

### 2. Cargar Ventas desde Móvil

1. Abre el link del vendedor en el celular (o escanea el QR)
2. Completa el formulario:
   - Selecciona el **Canal de Venta**
   - Completa los datos requeridos
   - El total se calcula automáticamente
3. Haz clic en "Guardar Venta"
4. Verás confirmación: "Venta Registrada"
5. Puedes cargar otra venta con el botón "Cargar Otra"

### 3. Panel de Administración

1. Abre: `http://localhost:3000/admin`
2. Usa los filtros para buscar ventas:
   - Por canal
   - Por vendedor
   - Por fecha
   - Por estado de pago
   - Por estado de asiento
3. Exporta reportes en Excel o CSV:
   - Ventas Virtuales
   - Ventas Físicas
   - Reservas de Asientos

## 📊 Canales de Venta

### Venta Física (Asientos)

**Campos específicos:**
- `asiento_fisico_numero` (obligatorio)
- `asiento_estado` (obligatorio): `reservado` | `vacante` | `comprado`
- `canal_venta_p2p`: `p2p` (automático)

**Validaciones:**
- El asiento no puede estar ya "comprado"
- Si está "reservado", solo se puede cambiar a "comprado"
- El número de asiento debe existir (1-100)

### Live Virtual

**Campos específicos:**
- `canal_venta_virtual`: `live_event` (automático)
- `pago_tipo`: `pago_live_event` (automático)

### Post Transmisión

**Campos específicos:**
- `canal_venta_virtual`: `post_transmision` (automático)
- `pago_tipo`: `pago_post_transmicion` (automático)

## 🔒 Validaciones

El sistema valida automáticamente:

- ✅ **Email válido** (si se proporciona)
- ✅ **WhatsApp obligatorio**
- ✅ **Precio de venta y cantidad obligatorios**
- ✅ **Asiento físico obligatorio** para ventas físicas
- ✅ **Estado de asiento obligatorio** para ventas físicas
- ✅ **No permitir doble venta** del mismo asiento
- ✅ **Evitar conflictos** de asientos reservados

## 📁 Estructura del Proyecto

```
venta-movil/
├── server.js              # Servidor Express principal
├── package.json          # Dependencias
├── database.sqlite       # Base de datos (se crea automáticamente)
├── public/
│   ├── index.html        # Página principal
│   ├── venta.html       # Formulario de venta móvil
│   ├── admin.html        # Panel de administración
│   ├── setup.html        # Crear vendedores
│   ├── styles.css        # Estilos CSS
│   ├── venta.js          # Script formulario venta
│   ├── admin.js          # Script panel admin
│   ├── setup.js          # Script crear vendedor
│   └── qrs/              # Códigos QR generados
└── README.md             # Esta documentación
```

## 🗄️ Base de Datos

### Tablas

1. **vendedores**
   - `id`: ID autoincremental
   - `vendedor_id`: Identificador único
   - `nombre`: Nombre del vendedor
   - `created_at`: Fecha de creación

2. **ventas**
   - Todos los campos de la venta
   - `venta_id`: ID único (VIRT-xxx, FIS-xxx, RES-xxx)
   - `vendedor_id`: Referencia al vendedor
   - `created_at`: Timestamp automático

3. **asientos**
   - `asiento_fisico_numero`: Número del asiento (1-100)
   - `asiento_estado`: `vacante` | `reservado` | `comprado`
   - `comprador_email`, `comprador_whatsapp`
   - `vendedor_id`: Vendedor que gestiona el asiento
   - `updated_at`: Última actualización

## 🔗 Endpoints API

### GET `/v/:vendedor_id`
Formulario de venta para un vendedor específico.

### POST `/api/venta`
Guardar una nueva venta.

### GET `/api/ventas`
Obtener todas las ventas (con filtros opcionales).

### GET `/api/vendedores`
Obtener lista de vendedores.

### POST `/api/vendedor`
Crear un nuevo vendedor.

### GET `/api/export/:tipo`
Exportar reportes (Excel o CSV).

## 📤 Exportación de Reportes

### Formatos disponibles:
- **Excel (.xlsx)**: `http://localhost:3000/api/export/ventas_virtuales?formato=xlsx`
- **CSV**: `http://localhost:3000/api/export/ventas_virtuales?formato=csv`

### Tipos de reporte:
- `ventas_virtuales`
- `ventas_fisicas`
- `reservas_asientos`

### Con filtros:
```
/api/export/ventas_fisicas?formato=xlsx&canal=venta_fisica&estado_pago=pagado
```

## 🎨 Interfaz Móvil

La interfaz móvil está diseñada para ser:
- ✅ **Extremadamente simple**: inputs grandes, fácil de usar
- ✅ **Responsive**: se adapta a cualquier tamaño de pantalla
- ✅ **Un solo botón**: "Guardar Venta"
- ✅ **Confirmación clara**: "Venta registrada" + botón "Cargar otra"

## 🚀 Despliegue

### Local
El sistema está listo para correr localmente. Solo ejecuta `npm start`.

### Hosting (Heroku, Railway, etc.)

1. Asegúrate de que el puerto sea configurable:
   ```javascript
   const PORT = process.env.PORT || 3000;
   ```

2. La base de datos SQLite se guarda como archivo, asegúrate de tener persistencia de archivos en tu hosting.

3. Variables de entorno (opcional):
   - `PORT`: Puerto del servidor (por defecto 3000)

## 🐛 Troubleshooting

### Error: "Cannot find module"
```bash
npm install
```

### Error: "Port already in use"
Cambia el puerto en `server.js` o usa:
```bash
PORT=3001 npm start
```

### Base de datos no se crea
Verifica permisos de escritura en el directorio del proyecto.

### QR no se genera
Verifica que el directorio `public/qrs/` existe y tiene permisos de escritura.

## 📝 Notas Importantes

- Los IDs de venta se generan automáticamente con formato: `VIRT-`, `FIS-`, `RES-` + timestamp
- Los asientos se inicializan automáticamente del 1 al 100 al crear la base de datos
- Los QRs se guardan en `public/qrs/` con nombre `{vendedor_id}.png`
- La fecha por defecto en el formulario es la fecha actual
- El total se calcula automáticamente: `precio_venta × cantidad`

## 🔐 Seguridad

- El sistema está diseñado para uso interno/local
- No incluye autenticación por defecto (agregar si es necesario para producción)
- Los datos se almacenan localmente en SQLite

## 📞 Soporte

Para problemas o preguntas, revisa los logs del servidor o contacta al equipo de desarrollo.

---

**Desarrollado para Congreso ADN Humano** 🎫

