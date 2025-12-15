# 🌐 CONFIGURACIÓN DNS PARA DOMINIO
## Congreso CheqFirma

---

## 📋 INFORMACIÓN GENERAL

**Dominio:** [Tu dominio aquí]  
**Sitio:** Congreso CheqFirma  
**Fecha:** Diciembre 2025

---

## 🔧 CONFIGURACIONES DNS POR PROVEEDOR DE HOSTING

### **1. GITHUB PAGES**

Si vas a alojar el sitio en GitHub Pages:

**Registros DNS a configurar:**
```
Tipo: A
Nombre: @
Valor: 185.199.108.153

Tipo: A
Nombre: @
Valor: 185.199.109.153

Tipo: A
Nombre: @
Valor: 185.199.110.153

Tipo: A
Nombre: @
Valor: 185.199.111.153

Tipo: CNAME
Nombre: www
Valor: [tu-usuario].github.io
```

**Configuración en GitHub:**
1. Ve a Settings > Pages en tu repositorio
2. En "Custom domain", ingresa tu dominio
3. Marca "Enforce HTTPS"

---

### **2. NETLIFY**

Si vas a alojar el sitio en Netlify:

**Registros DNS a configurar:**
```
Tipo: A
Nombre: @
Valor: 75.2.60.5

Tipo: CNAME
Nombre: www
Valor: [tu-sitio].netlify.app
```

**O usar solo CNAME (recomendado):**
```
Tipo: ALIAS o ANAME
Nombre: @
Valor: [tu-sitio].netlify.app

Tipo: CNAME
Nombre: www
Valor: [tu-sitio].netlify.app
```

**Configuración en Netlify:**
1. Ve a Site settings > Domain management
2. Agrega tu dominio personalizado
3. Sigue las instrucciones para verificar el dominio

---

### **3. VERCEL**

Si vas a alojar el sitio en Vercel:

**Registros DNS a configurar:**
```
Tipo: A
Nombre: @
Valor: 76.76.21.21

Tipo: CNAME
Nombre: www
Valor: cname.vercel-dns.com
```

**Configuración en Vercel:**
1. Ve a Project Settings > Domains
2. Agrega tu dominio
3. Sigue las instrucciones para configurar DNS

---

### **4. CLOUDFLARE PAGES**

Si vas a usar Cloudflare Pages:

**Registros DNS a configurar:**
```
Tipo: CNAME
Nombre: @
Valor: [tu-sitio].pages.dev

Tipo: CNAME
Nombre: www
Valor: [tu-sitio].pages.dev
```

**O si usas Cloudflare como DNS:**
- Cloudflare maneja automáticamente los registros
- Solo necesitas apuntar el dominio a los nameservers de Cloudflare

---

### **5. HOSTING TRADICIONAL (cPanel, Plesk, etc.)**

Si tienes un hosting tradicional:

**Registros DNS a configurar:**
```
Tipo: A
Nombre: @
Valor: [IP del servidor proporcionada por tu hosting]

Tipo: CNAME
Nombre: www
Valor: [tu-dominio.com]
```

**O si el hosting proporciona un dominio temporal:**
```
Tipo: A
Nombre: @
Valor: [IP del servidor]

Tipo: CNAME
Nombre: www
Valor: [dominio-temporal-del-hosting]
```

---

### **6. AMAZON S3 + CLOUDFRONT (AWS)**

Si usas AWS S3 + CloudFront:

**Registros DNS a configurar:**
```
Tipo: A
Nombre: @
Valor: [IP de CloudFront - proporcionada por AWS]

Tipo: CNAME
Nombre: www
Valor: [distribución-cloudfront].cloudfront.net
```

**O usar Route 53 (recomendado):**
- Route 53 maneja automáticamente los registros
- Solo necesitas crear un hosted zone y actualizar nameservers

---

## 📝 REGISTROS DNS ADICIONALES RECOMENDADOS

### **Registros MX (si necesitas email):**
```
Tipo: MX
Nombre: @
Prioridad: 10
Valor: mail.[tu-dominio.com]

O usar servicio de email profesional:
Tipo: MX
Nombre: @
Prioridad: 10
Valor: mx1.google.com (si usas Google Workspace)
```

### **Registros TXT (verificación y seguridad):**
```
Tipo: TXT
Nombre: @
Valor: "v=spf1 include:_spf.google.com ~all" (si usas Google Workspace)

Tipo: TXT
Nombre: @
Valor: "google-site-verification=[código]" (para Google Search Console)
```

---

## 🔒 CONFIGURACIÓN SSL/HTTPS

### **Certificado SSL Gratuito:**

1. **Let's Encrypt (automático en muchos hostings)**
   - Se configura automáticamente al apuntar el dominio
   - Renovación automática

2. **Cloudflare (gratis)**
   - Activa SSL/TLS en Cloudflare
   - Modo: Flexible o Full (según tu hosting)

3. **Certificado del hosting**
   - Muchos hostings incluyen SSL gratuito
   - Actívalo desde el panel de control

---

## ⚙️ PASOS GENERALES PARA CONFIGURAR DNS

### **1. Obtener información del hosting:**
- IP del servidor (si es hosting tradicional)
- Dominio temporal o URL del servicio
- Nameservers (si aplica)

### **2. Acceder a tu registrador de dominio:**
- GoDaddy
- Namecheap
- Google Domains
- Cloudflare
- Otro registrador

### **3. Configurar los registros DNS:**
- Ve a la sección de DNS/Nameservers
- Agrega los registros A, CNAME, etc.
- Guarda los cambios

### **4. Esperar propagación:**
- Tiempo típico: 24-48 horas
- Puede ser más rápido (1-4 horas) o más lento (hasta 72 horas)
- Verifica con: https://www.whatsmydns.net/

### **5. Verificar configuración:**
- Usa herramientas como:
  - https://dnschecker.org/
  - https://www.whatsmydns.net/
  - `nslookup` o `dig` desde terminal

---

## 🚀 CONFIGURACIÓN RÁPIDA RECOMENDADA

### **Opción 1: Netlify (Más fácil y rápido)**
1. Sube tu carpeta a Netlify
2. Agrega dominio personalizado
3. Configura estos DNS:
   ```
   A: @ → 75.2.60.5
   CNAME: www → [tu-sitio].netlify.app
   ```
4. SSL automático incluido

### **Opción 2: Cloudflare Pages (Recomendado)**
1. Conecta tu repositorio a Cloudflare Pages
2. Agrega dominio personalizado
3. Cloudflare configura DNS automáticamente
4. SSL automático incluido

### **Opción 3: GitHub Pages (Gratis)**
1. Sube tu sitio a un repositorio GitHub
2. Activa GitHub Pages
3. Configura dominio personalizado
4. Configura los registros A y CNAME mostrados arriba
5. SSL automático incluido

---

## 📧 EMAIL DEL SITIO

Si quieres usar email con tu dominio (ej: info@tudominio.com):

### **Opción 1: Google Workspace**
- Costo: ~$6/mes por usuario
- Configuración DNS:
  ```
  MX: @ → aspmx.l.google.com (prioridad 1)
  MX: @ → alt1.aspmx.l.google.com (prioridad 5)
  MX: @ → alt2.aspmx.l.google.com (prioridad 5)
  MX: @ → alt3.aspmx.l.google.com (prioridad 10)
  MX: @ → alt4.aspmx.l.google.com (prioridad 10)
  TXT: @ → "v=spf1 include:_spf.google.com ~all"
  ```

### **Opción 2: Zoho Mail (Gratis)**
- Gratis para hasta 5 usuarios
- Configuración similar a Google Workspace

### **Opción 3: Email del hosting**
- Muchos hostings incluyen email
- Configuración desde el panel de control

---

## ✅ CHECKLIST DE CONFIGURACIÓN

- [ ] Elegir proveedor de hosting
- [ ] Obtener información de DNS del hosting
- [ ] Acceder al panel de tu registrador de dominio
- [ ] Configurar registros A y/o CNAME
- [ ] Configurar registro CNAME para www (opcional pero recomendado)
- [ ] Esperar propagación DNS (24-48 horas)
- [ ] Verificar que el sitio carga correctamente
- [ ] Verificar que SSL/HTTPS funciona
- [ ] Configurar email (opcional)
- [ ] Verificar que www redirige correctamente

---

## 🔍 HERRAMIENTAS ÚTILES

### **Verificar DNS:**
- https://dnschecker.org/
- https://www.whatsmydns.net/
- https://mxtoolbox.com/

### **Verificar SSL:**
- https://www.ssllabs.com/ssltest/

### **Verificar velocidad:**
- https://pagespeed.web.dev/
- https://gtmetrix.com/

---

## 📞 SOPORTE

Si necesitas ayuda con la configuración DNS:

1. **Contacta a tu registrador de dominio** - Pueden ayudarte con la configuración
2. **Contacta a tu proveedor de hosting** - Tienen guías específicas
3. **Documentación oficial:**
   - GitHub Pages: https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site
   - Netlify: https://docs.netlify.com/domains-https/custom-domains/
   - Vercel: https://vercel.com/docs/concepts/projects/domains

---

**Nota:** Los valores de IP y dominios mostrados son ejemplos. Debes reemplazarlos con los valores reales proporcionados por tu proveedor de hosting.

**Fecha de creación:** Diciembre 2025  
**Para:** Congreso CheqFirma

