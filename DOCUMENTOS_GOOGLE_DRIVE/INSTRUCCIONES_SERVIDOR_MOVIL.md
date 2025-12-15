# Cómo Acceder al Sitio desde el Celular

## Problema
El sitio funciona en tu computadora pero no desde el celular porque los archivos locales (`file://`) no son accesibles desde otros dispositivos.

## Solución: Servidor Local

### Paso 1: Preparar la Red
1. **Asegúrate de que tu computadora y celular estén en la misma red WiFi**
   - Misma red = mismo router/modem
   - No uses datos móviles en el celular

### Paso 2: Iniciar el Servidor

**Opción A: Script Automático (Recomendado)**
1. Haz doble clic en `SERVIDOR_LOCAL.bat`
2. Se abrirá una ventana con instrucciones
3. Anota la dirección IP que aparece (ejemplo: `192.168.1.100`)

**Opción B: PowerShell**
1. Haz doble clic en `SERVIDOR_LOCAL_POWERSHELL.ps1`
2. Si te pide permisos, acepta
3. Anota la dirección IP que aparece

**Opción C: Manual con Python**
```bash
# Abre PowerShell o CMD en la carpeta del proyecto
python -m http.server 8000
```

### Paso 3: Acceder desde el Celular

1. **Abre el navegador en tu celular** (Chrome, Safari, etc.)

2. **Escribe la dirección**:
   ```
   http://[TU_IP]:8000
   ```
   Ejemplo: `http://192.168.1.100:8000`

3. **Presiona Enter**

4. **¡Listo!** El sitio debería cargar en tu celular

## Solución de Problemas

### "No se puede conectar"
- ✅ Verifica que ambos dispositivos estén en la misma WiFi
- ✅ Verifica que el firewall de Windows no esté bloqueando
- ✅ Asegúrate de que el servidor esté corriendo (ventana abierta)

### "No encuentro mi IP"
1. En la computadora, abre CMD o PowerShell
2. Escribe: `ipconfig`
3. Busca "IPv4" o "Dirección IPv4"
4. Anota ese número (ejemplo: 192.168.1.100)

### "Python no encontrado"
**Instalar Python:**
1. Ve a: https://www.python.org/downloads/
2. Descarga e instala Python
3. Durante la instalación, marca "Add Python to PATH"
4. Reinicia la computadora
5. Vuelve a ejecutar el script

### "El sitio carga pero no funciona bien"
- ✅ Asegúrate de usar `http://` (no `https://`)
- ✅ Verifica que el puerto sea `:8000`
- ✅ Prueba limpiar la caché del navegador del celular

## Alternativa: Usar ngrok (Acceso desde Internet)

Si quieres acceder desde cualquier lugar (no solo misma WiFi):

1. **Instala ngrok**: https://ngrok.com/download
2. **Inicia el servidor local** (como arriba)
3. **En otra ventana, ejecuta**:
   ```bash
   ngrok http 8000
   ```
4. **Copia la URL** que aparece (ejemplo: `https://abc123.ngrok.io`)
5. **Abre esa URL en tu celular** desde cualquier lugar

## Nota Importante

- El servidor debe estar **corriendo** mientras uses el sitio desde el celular
- Si cierras la ventana del servidor, el sitio dejará de funcionar
- Para detener el servidor, presiona `Ctrl+C` en la ventana

## Verificación Rápida

✅ Computadora y celular en misma WiFi  
✅ Servidor corriendo (ventana abierta)  
✅ IP correcta en el celular  
✅ Formato: `http://[IP]:8000`  

Si todo está correcto, debería funcionar perfectamente.

