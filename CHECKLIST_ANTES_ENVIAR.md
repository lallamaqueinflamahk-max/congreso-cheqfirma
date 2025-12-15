# ✅ Checklist Antes de Enviar por Google Drive

## 🔒 Seguridad - Archivos que NO deben incluirse

- [ ] `.env` - Contiene credenciales SMTP y tokens
- [ ] `node_modules/` - Muy pesado, se reinstala con `npm install`
- [ ] `*.log` - Archivos de log innecesarios
- [ ] `.git/` - Historial de Git (opcional, pero recomendado excluir)
- [ ] `reports/*.xlsx` - Reportes generados (opcional)
- [ ] Archivos ZIP grandes (excepto los necesarios)

## ✅ Archivos que SÍ deben incluirse

- [x] Todo el código fuente (`index.html`, `js/`, `netlify/`, etc.)
- [x] Configuración (`package.json`, `netlify.toml`, `config/`)
- [x] Scripts (`scripts/`)
- [x] Documentación (archivos `.md`)
- [x] Python (`report/`, `requirements.txt`)
- [x] Datos de ejemplo (`data/seats.csv.example`)
- [x] Imágenes y recursos (`images/`, `imagenes/`)

## 📦 Pasos para Comprimir

### Opción 1: Script Automático (Recomendado)

```powershell
.\COMPRIMIR_PARA_GOOGLE_DRIVE.ps1
```

Este script:
- ✅ Excluye automáticamente `node_modules/`, `.env`, `*.log`, etc.
- ✅ Crea un ZIP con nombre con fecha/hora
- ✅ Muestra el tamaño final
- ✅ Indica la ubicación del archivo

### Opción 2: Manual

1. Selecciona la carpeta `Congreso Foro Cheq Firma`
2. Clic derecho → "Enviar a" → "Carpeta comprimida (en zip)"
3. **IMPORTANTE:** Antes de enviar, verifica que:
   - El archivo `.env` NO esté en el ZIP
   - La carpeta `node_modules/` NO esté en el ZIP

## 📤 Subir a Google Drive

1. Ve a [Google Drive](https://drive.google.com)
2. Clic en "Nuevo" → "Subir archivo" o "Subir carpeta"
3. Selecciona el archivo ZIP generado
4. Espera a que termine la subida
5. Clic derecho en el archivo → "Obtener enlace"
6. Comparte el enlace con el destinatario

## 📋 Información para el Destinatario

Incluye estas instrucciones al compartir:

1. **Extraer el ZIP**
2. **Instalar dependencias:**
   ```bash
   npm install
   ```
3. **Configurar variables de entorno:**
   - Copiar `.env.example` a `.env`
   - Editar `.env` con valores reales
4. **Configurar en Netlify:**
   - Subir el proyecto
   - Configurar variables de entorno en el dashboard

## 📊 Tamaño Esperado

- **Sin `node_modules`:** ~50-100 MB
- **Con `node_modules`:** ~200-500 MB (NO recomendado)

## ✅ Verificación Final

Antes de enviar, verifica:

```powershell
# Verificar que .env no esté en el ZIP (si lo creaste manualmente)
# Abre el ZIP y busca .env - NO debe estar

# Verificar tamaño
# Debe ser razonable (< 200 MB sin node_modules)
```

## 🚀 Listo para Enviar

Una vez completado el checklist, el proyecto está listo para ser compartido por Google Drive.

