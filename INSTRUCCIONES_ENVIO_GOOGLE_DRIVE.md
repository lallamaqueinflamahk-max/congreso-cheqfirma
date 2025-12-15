# Instrucciones para Enviar por Google Drive

## 📦 Preparación Completada

La carpeta del proyecto está lista para ser enviada por Google Drive.

## ✅ Archivos Incluidos

- ✅ Todo el código fuente (HTML, CSS, JavaScript)
- ✅ Funciones Netlify (`netlify/functions/`)
- ✅ Configuración (`netlify.toml`, `package.json`)
- ✅ Scripts de utilidad (`scripts/`)
- ✅ Documentación (archivos `.md`)
- ✅ Configuración Python (`report/`, `config/`)
- ✅ Archivos de datos de ejemplo (`data/`, `database/`)

## ❌ Archivos Excluidos (NO se envían)

- ❌ `node_modules/` - Dependencias de Node.js (se reinstalan con `npm install`)
- ❌ `.git/` - Historial de Git (si existe)
- ❌ `*.log` - Archivos de log
- ❌ `.env` - Variables de entorno con datos sensibles
- ❌ Archivos temporales y caché

## 📋 Pasos para Enviar

### Opción 1: Comprimir y Subir Manualmente

1. **Comprimir la carpeta:**
   - Selecciona la carpeta `Congreso Foro Cheq Firma`
   - Clic derecho → "Enviar a" → "Carpeta comprimida (en zip)"
   - O usa el script: `COMPRIMIR_PARA_GOOGLE_DRIVE.ps1`

2. **Subir a Google Drive:**
   - Ve a [Google Drive](https://drive.google.com)
   - Clic en "Nuevo" → "Subir archivo" o "Subir carpeta"
   - Selecciona el archivo ZIP o la carpeta

### Opción 2: Usar Script Automático

Ejecuta el script PowerShell:
```powershell
.\COMPRIMIR_PARA_GOOGLE_DRIVE.ps1
```

Esto creará un archivo ZIP excluyendo archivos innecesarios.

## 🔐 Seguridad

**IMPORTANTE:** El archivo `.env` NO se incluye porque contiene:
- Credenciales SMTP
- Tokens de seguridad
- Contraseñas de aplicación

**Después de recibir el proyecto:**
1. Copiar `.env.example` a `.env`
2. Configurar las variables con valores reales
3. Ejecutar `npm install` para instalar dependencias

## 📝 Instrucciones para el Receptor

1. **Extraer el archivo ZIP** (si se envió comprimido)

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno:**
   ```bash
   # Copiar ejemplo
   copy .env.example .env
   
   # Editar .env con valores reales
   notepad .env
   ```

4. **Configurar en Netlify:**
   - Subir el proyecto a Netlify
   - Configurar variables de entorno en el dashboard de Netlify:
     - `SMTP_HOST`
     - `SMTP_PORT`
     - `SMTP_USER`
     - `SMTP_APP_PASSWORD`
     - `EMAIL_TO`
     - `REPORT_TOKEN`

## 📊 Tamaño Aproximado

- **Sin `node_modules`:** ~50-100 MB
- **Con `node_modules`:** ~200-500 MB (NO recomendado)

## ✅ Checklist Antes de Enviar

- [ ] Verificar que `.env` NO esté incluido
- [ ] Verificar que `node_modules/` NO esté incluido
- [ ] Verificar que archivos `.log` NO estén incluidos
- [ ] Verificar que `.git/` NO esté incluido (opcional)
- [ ] Comprobar que todos los archivos fuente estén presentes
- [ ] Verificar que la documentación esté completa

## 🚀 Listo para Enviar

El proyecto está preparado y listo para ser compartido por Google Drive.

