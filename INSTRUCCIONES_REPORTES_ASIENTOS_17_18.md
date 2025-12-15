# 📋 INSTRUCCIONES PARA REPORTES DE ASIENTOS 17 Y 18

## ✅ Asientos Configurados

- **Asiento 17:** Vendido a **Simeona Britez**
- **Asiento 18:** Vendido a **Eulalio Ruiz Díaz**

Los reportes de acreditación ya están generados y guardados en el sistema.

---

## 🔧 CÓMO ACCEDER A LOS REPORTES

### **Opción 1: Desde la Consola del Navegador (Más Rápido)**

1. Abre la página web del congreso
2. Presiona `F12` o `Ctrl+Shift+I` para abrir las herramientas de desarrollador
3. Ve a la pestaña "Console"
4. Ejecuta uno de estos comandos:

#### **Para el Asiento 17 (Simeona Britez):**
```javascript
// Ver el reporte completo
getPresentialSeatReport(17)

// Descargar el reporte como archivo .txt
downloadPresentialSeatReport(17)

// Abrir WhatsApp con el reporte (si tiene teléfono)
openWhatsAppWithReport(17)

// Abrir email con el reporte (si tiene email)
openEmailWithReport(17)
```

#### **Para el Asiento 18 (Eulalio Ruiz Díaz):**
```javascript
// Ver el reporte completo
getPresentialSeatReport(18)

// Descargar el reporte como archivo .txt
downloadPresentialSeatReport(18)

// Abrir WhatsApp con el reporte (si tiene teléfono)
openWhatsAppWithReport(18)

// Abrir email con el reporte (si tiene email)
openEmailWithReport(18)
```

---

### **Opción 2: Desde el Panel de Administración**

Si tienes acceso al panel de administración, los reportes están guardados en:
- `localStorage.getItem('report_17')` - Para Simeona Britez
- `localStorage.getItem('report_18')` - Para Eulalio Ruiz Díaz

---

## 📧 ENVIAR LOS REPORTES

### **Método 1: Por WhatsApp**

1. Abre la consola del navegador (F12)
2. Ejecuta: `openWhatsAppWithReport(17)` o `openWhatsAppWithReport(18)`
3. Se abrirá WhatsApp con el mensaje completo listo para enviar
4. Si el cliente no tiene teléfono registrado, se abrirá WhatsApp para enviar al número de contacto del congreso

### **Método 2: Por Email**

1. Abre la consola del navegador (F12)
2. Ejecuta: `openEmailWithReport(17)` o `openEmailWithReport(18)`
3. Se abrirá tu cliente de email con el reporte completo
4. Si el cliente no tiene email registrado, se enviará a cheqfirma@gmail.com

### **Método 3: Descargar y Enviar Manualmente**

1. Abre la consola del navegador (F12)
2. Ejecuta: `downloadPresentialSeatReport(17)` o `downloadPresentialSeatReport(18)`
3. Se descargará un archivo .txt con el reporte completo
4. Puedes copiar el contenido y enviarlo por cualquier medio

---

## 📄 CONTENIDO DEL REPORTE

Cada reporte incluye:

✅ **Información de la Compra:**
- ID de Reserva
- Fecha de Compra
- Estado del pago

✅ **Datos del Participante:**
- Nombre completo
- Teléfono (si está disponible)
- Email (si está disponible)

✅ **Detalles del Asiento:**
- Número de asiento
- Precio pagado
- Método de pago

✅ **Beneficios Incluidos:**
- Asiento garantizado
- Acceso presencial 2 días
- Material físico
- Coffee breaks
- Networking
- Certificado físico

✅ **Información del Evento:**
- Fechas y horarios
- Lugar exacto
- Instrucciones de acceso

✅ **Contacto y Soporte:**
- Email y WhatsApp de contacto

---

## 🔄 ACTUALIZAR DATOS DE CONTACTO

Si necesitas agregar teléfono o email a los clientes:

1. Abre la consola del navegador (F12)
2. Ejecuta:

```javascript
// Para Simeona Britez (Asiento 17)
let seat17 = JSON.parse(localStorage.getItem('seat_17'));
seat17.customer.phone = '+595XXXXXXXXX'; // Agregar teléfono
seat17.customer.email = 'email@ejemplo.com'; // Agregar email
localStorage.setItem('seat_17', JSON.stringify(seat17));

// Regenerar reporte con nuevos datos
let report17 = sendPresentialSeatReport(seat17);
localStorage.setItem('report_17', JSON.stringify(report17));
```

```javascript
// Para Eulalio Ruiz Díaz (Asiento 18)
let seat18 = JSON.parse(localStorage.getItem('seat_18'));
seat18.customer.phone = '+595XXXXXXXXX'; // Agregar teléfono
seat18.customer.email = 'email@ejemplo.com'; // Agregar email
localStorage.setItem('seat_18', JSON.stringify(seat18));

// Regenerar reporte con nuevos datos
let report18 = sendPresentialSeatReport(seat18);
localStorage.setItem('report_18', JSON.stringify(report18));
```

---

## ⚡ COMANDOS RÁPIDOS

### **Ver Reporte en Consola:**
```javascript
getPresentialSeatReport(17)  // Simeona Britez
getPresentialSeatReport(18)  // Eulalio Ruiz Díaz
```

### **Descargar Reporte:**
```javascript
downloadPresentialSeatReport(17)
downloadPresentialSeatReport(18)
```

### **Enviar por WhatsApp:**
```javascript
openWhatsAppWithReport(17)
openWhatsAppWithReport(18)
```

### **Enviar por Email:**
```javascript
openEmailWithReport(17)
openEmailWithReport(18)
```

---

## 📱 NÚMEROS DE CONTACTO

Si los clientes no tienen teléfono o email registrado, los reportes se pueden enviar a:

- **Email:** cheqfirma@gmail.com
- **WhatsApp:** +549 3536 564940

---

## ✅ VERIFICACIÓN

Para verificar que los reportes están generados:

1. Abre la consola del navegador (F12)
2. Ejecuta: `localStorage.getItem('report_17')` o `localStorage.getItem('report_18')`
3. Deberías ver un objeto JSON con el reporte completo

---

**¡Los reportes están listos para enviar!** 🚀

