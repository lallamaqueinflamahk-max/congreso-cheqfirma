# 📱 Cómo Acceder al Sitio desde tu Celular

## 🚀 Método Rápido (Recomendado)

### Paso 1: Ejecutar el Servidor
1. **Doble clic** en `SERVIDOR_LOCAL.bat`
2. El script detectará automáticamente si tienes Python o Node.js
3. Se mostrará una dirección IP (ejemplo: `192.168.1.100`)

### Paso 2: Conectar desde el Celular
1. **Asegúrate** de que tu celular y PC estén en la **misma red WiFi**
2. En tu celular, abre el navegador (Chrome, Safari, etc.)
3. Escribe la dirección que apareció (ejemplo: `http://192.168.1.100:8000`)
4. ¡Listo! El sitio debería cargar

## 🔧 Métodos Alternativos

### Opción A: Si tienes Python instalado
```bash
# Ejecutar directamente:
python SERVIDOR_LOCAL_PYTHON.py
```

### Opción B: Si tienes Node.js instalado
```bash
# Ejecutar directamente:
node SERVIDOR_LOCAL_NODE.js
```

### Opción C: Usar PowerShell (Windows)
```powershell
# Ejecutar en PowerShell:
python -m http.server 8000
```

Luego en tu celular, abre: `http://[IP_DE_TU_PC]:8000`

## 📋 Cómo Encontrar la IP de tu PC

### En Windows:
1. Abre **PowerShell** o **CMD**
2. Escribe: `ipconfig`
3. Busca **"IPv4"** o **"Dirección IPv4"**
4. Copia el número (ejemplo: `192.168.1.100`)

### En Mac/Linux:
```bash
ifconfig | grep "inet "
```

## ⚠️ Solución de Problemas

### ❌ "No puedo acceder desde el celular"
**Solución:**
- ✅ Verifica que ambos dispositivos estén en la misma WiFi
- ✅ Desactiva el firewall temporalmente o permite el puerto 8000
- ✅ Verifica que la IP sea correcta
- ✅ Asegúrate de escribir `http://` antes de la IP

### ❌ "El servidor no inicia"
**Solución:**
- ✅ Instala Python desde [python.org](https://python.org)
- ✅ O instala Node.js desde [nodejs.org](https://nodejs.org)
- ✅ O usa el método de PowerShell

### ❌ "La página carga pero no funciona bien"
**Solución:**
- ✅ Asegúrate de que el archivo `index.html` esté en la misma carpeta
- ✅ Verifica que todas las carpetas (`images`, `data`, etc.) estén presentes
- ✅ Limpia la caché del navegador del celular

## 🌐 Despliegue Público (Para Acceso desde Cualquier Lugar)

Si quieres que el sitio sea accesible desde cualquier lugar (no solo tu WiFi):

### Opción 1: GitHub Pages (Gratis)
1. Crea un repositorio en GitHub
2. Sube los archivos
3. Activa GitHub Pages en Settings
4. El sitio estará en: `https://tuusuario.github.io/repositorio`

### Opción 2: Netlify (Actualizar Plan)
1. Ve a [netlify.com](https://netlify.com)
2. Actualiza tu plan para tener más límites
3. O usa el plan gratuito con menos tráfico

### Opción 3: Vercel (Gratis)
1. Conecta tu repositorio de GitHub
2. Despliegue automático
3. URL gratuita: `https://tu-proyecto.vercel.app`

## 📝 Notas Importantes

- ⚠️ El servidor local solo funciona mientras está ejecutándose
- ⚠️ Solo funciona en la misma red WiFi
- ✅ Todos los datos se guardan en el navegador (localStorage)
- ✅ Funciona perfectamente en móvil una vez conectado

## 🎯 Resumen Rápido

1. **Ejecuta** `SERVIDOR_LOCAL.bat`
2. **Copia** la IP que aparece
3. **Abre** en el celular: `http://[IP]:8000`
4. **¡Listo!** 🎉

