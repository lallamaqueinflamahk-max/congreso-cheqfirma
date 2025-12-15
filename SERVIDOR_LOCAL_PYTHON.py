#!/usr/bin/env python3
"""
Servidor HTTP simple para servir el sitio del congreso
Permite acceso desde celular en la misma red WiFi
"""

import http.server
import socketserver
import socket
import webbrowser
from pathlib import Path

PORT = 8000

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Agregar headers CORS y cache
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', '*')
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        super().end_headers()

def get_local_ip():
    """Obtener la IP local de la máquina"""
    try:
        # Conectar a un servidor externo para obtener la IP local
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
        s.close()
        return ip
    except:
        return "localhost"

def main():
    # Cambiar al directorio del script
    script_dir = Path(__file__).parent
    os.chdir(script_dir)
    
    # Obtener IP local
    local_ip = get_local_ip()
    
    print("=" * 60)
    print("  SERVIDOR LOCAL PARA ACCESO DESDE CELULAR")
    print("=" * 60)
    print()
    print(f"Servidor iniciado en el puerto {PORT}")
    print()
    print("INSTRUCCIONES:")
    print("1. Asegúrate de que tu celular y PC estén en la misma red WiFi")
    print("2. En tu celular, abre el navegador y ve a:")
    print()
    print(f"   http://{local_ip}:{PORT}")
    print()
    print("   O desde la misma PC:")
    print(f"   http://localhost:{PORT}")
    print()
    print("3. Presiona Ctrl+C para detener el servidor")
    print()
    print("=" * 60)
    print()
    
    # Abrir en el navegador local
    try:
        webbrowser.open(f'http://localhost:{PORT}')
    except:
        pass
    
    # Iniciar servidor
    with socketserver.TCPServer(("", PORT), MyHTTPRequestHandler) as httpd:
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n\nServidor detenido.")

if __name__ == "__main__":
    import os
    main()

