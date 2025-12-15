// Servidor HTTP simple usando Node.js
// Para acceder desde celular en la misma red WiFi

const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');

const PORT = 8000;

// Obtener IP local
function getLocalIP() {
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]) {
            if (iface.family === 'IPv4' && !iface.internal) {
                return iface.address;
            }
        }
    }
    return 'localhost';
}

// MIME types
const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.wav': 'audio/wav',
    '.mp4': 'video/mp4',
    '.woff': 'application/font-woff',
    '.ttf': 'application/font-ttf',
    '.eot': 'application/vnd.ms-fontobject',
    '.otf': 'application/font-otf',
    '.wasm': 'application/wasm'
};

const server = http.createServer((req, res) => {
    console.log(`${req.method} ${req.url}`);

    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', '*');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');

    let filePath = '.' + req.url;
    if (filePath === './') {
        filePath = './index.html';
    }

    const extname = String(path.extname(filePath)).toLowerCase();
    const contentType = mimeTypes[extname] || 'application/octet-stream';

    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code === 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end('<h1>404 - Archivo no encontrado</h1>', 'utf-8');
            } else {
                res.writeHead(500);
                res.end(`Error del servidor: ${error.code}`, 'utf-8');
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

const localIP = getLocalIP();

console.log('='.repeat(60));
console.log('  SERVIDOR LOCAL PARA ACCESO DESDE CELULAR');
console.log('='.repeat(60));
console.log();
console.log(`Servidor iniciado en el puerto ${PORT}`);
console.log();
console.log('INSTRUCCIONES:');
console.log('1. Asegúrate de que tu celular y PC estén en la misma red WiFi');
console.log('2. En tu celular, abre el navegador y ve a:');
console.log();
console.log(`   http://${localIP}:${PORT}`);
console.log();
console.log('   O desde la misma PC:');
console.log(`   http://localhost:${PORT}`);
console.log();
console.log('3. Presiona Ctrl+C para detener el servidor');
console.log();
console.log('='.repeat(60));
console.log();

server.listen(PORT, () => {
    console.log(`Servidor corriendo en http://${localIP}:${PORT}`);
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

