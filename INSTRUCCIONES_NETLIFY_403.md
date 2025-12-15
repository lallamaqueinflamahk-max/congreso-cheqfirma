# 🚀 SOLUCIÓN ERROR 403 EN NETLIFY

## ✅ ARCHIVOS CORREGIDOS

He corregido y creado los siguientes archivos para solucionar el error 403:

1. **`netlify.toml`** - Configuración corregida
2. **`_redirects`** - Simplificado y corregido
3. **`.netlifyignore`** - NUEVO: Excluye archivos innecesarios
4. **`.gitignore`** - NUEVO: Para control de versiones

---

## 📋 PASOS PARA SUBIR A NETLIFY

### **OPCIÓN 1: Arrastrar y Soltar (RECOMENDADO)**

1. **Abre Netlify:** https://app.netlify.com/
2. **Inicia sesión** en tu cuenta
3. **Ve a tu sitio** o crea uno nuevo
4. **Arrastra SOLO los archivos necesarios:**
   - ✅ `index.html`
   - ✅ `script.js`
   - ✅ `styles.css`
   - ✅ `netlify.toml`
   - ✅ `_redirects`
   - ✅ `.netlifyignore`
   - ✅ `images/` (carpeta completa)
   - ✅ `imagenes/` (carpeta completa)
   - ✅ `data/` (carpeta completa)
   - ✅ `info/` (carpeta completa)
   - ✅ `VERIFICACION_MOVIL_AUTOMATICA.js`

5. **NO arrastres:**
   - ❌ Archivos `.bat`, `.ps1`, `.vbs`
   - ❌ Archivos `.md`, `.txt`
   - ❌ Carpetas de documentación
   - ❌ Scripts de servidor local

6. **Espera** a que termine el deploy
7. **Verifica** que no haya errores

---

### **OPCIÓN 2: Usar .netlifyignore (AUTOMÁTICO)**

Si arrastras toda la carpeta, Netlify automáticamente ignorará los archivos listados en `.netlifyignore`.

1. **Arrastra TODA la carpeta** `Congreso Foro Cheq Firma` a Netlify
2. **Netlify automáticamente excluirá** los archivos innecesarios
3. **Espera** a que termine el deploy

---

## 🔧 CONFIGURACIÓN EN NETLIFY

### **Verificar Configuración del Sitio:**

1. Ve a **Site settings** > **Build & deploy**
2. Verifica:
   - **Base directory:** (vacío)
   - **Publish directory:** (vacío o `.`)
   - **Build command:** (puede estar vacío)

### **Verificar Archivos Subidos:**

1. Ve a **Deploys** > **Deploy log**
2. Verifica que estos archivos estén presentes:
   - ✅ `index.html`
   - ✅ `netlify.toml`
   - ✅ `_redirects`
   - ✅ `script.js`
   - ✅ `styles.css`

---

## ✅ VERIFICACIÓN POST-DEPLOY

### **1. Verificar que el sitio carga:**
- Abre: `https://tu-sitio.netlify.app`
- Debe cargar sin error 403

### **2. Verificar redirecciones:**
- Todas las rutas deben redirigir a `index.html`
- No debe haber errores 404

### **3. Verificar archivos estáticos:**
- Las imágenes deben cargarse
- Los archivos CSS y JS deben cargarse

---

## 🚨 SI SIGUE EL ERROR 403

### **Causas Comunes:**

1. **Archivos bloqueados:**
   - Verifica que `.netlifyignore` esté presente
   - Verifica que no haya archivos `.bat` o `.ps1` en la raíz

2. **Configuración incorrecta:**
   - Verifica que `netlify.toml` esté en la raíz
   - Verifica que `_redirects` esté en la raíz

3. **Permisos:**
   - Verifica que `index.html` tenga permisos de lectura
   - Verifica que las carpetas tengan permisos correctos

### **Solución:**

1. **Limpia el caché de Netlify:**
   - Ve a **Deploys** > **Trigger deploy** > **Clear cache and deploy site**

2. **Redesplega desde cero:**
   - Elimina el sitio actual
   - Crea uno nuevo
   - Sube solo los archivos necesarios

3. **Verifica los logs:**
   - Ve a **Deploys** > **Deploy log**
   - Busca errores específicos

---

## 📁 ESTRUCTURA CORRECTA PARA NETLIFY

```
/
├── index.html                    ✅ OBLIGATORIO
├── script.js                     ✅ OBLIGATORIO
├── styles.css                    ✅ OBLIGATORIO
├── netlify.toml                  ✅ OBLIGATORIO
├── _redirects                    ✅ OBLIGATORIO
├── .netlifyignore                ✅ RECOMENDADO
├── VERIFICACION_MOVIL_AUTOMATICA.js
├── images/                       ✅ OBLIGATORIO
│   ├── expositores/
│   └── senado/
├── imagenes/                     ✅ OBLIGATORIO
│   └── expositores/
├── data/                         ✅ OBLIGATORIO
└── info/                         ✅ OBLIGATORIO
```

---

## 🎯 CHECKLIST FINAL

- [ ] `netlify.toml` está en la raíz
- [ ] `_redirects` está en la raíz
- [ ] `.netlifyignore` está en la raíz
- [ ] `index.html` está en la raíz
- [ ] Archivos innecesarios están excluidos
- [ ] Sitio redesplegado en Netlify
- [ ] No hay error 403
- [ ] El sitio carga correctamente
- [ ] Las imágenes se cargan
- [ ] Los estilos se aplican

---

**Última actualización:** Diciembre 2025

