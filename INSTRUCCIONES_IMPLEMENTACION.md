# Instrucciones de Implementación - Sistema de Asientos

## ✅ Lo que está implementado

### Backend (Netlify Functions)
1. ✅ `netlify/functions/seats-store.js` - Helper centralizado de asientos
2. ✅ `netlify/functions/confirmPurchase.js` - Confirmar compra sin pop-ups
3. ✅ `netlify/functions/getSeats.js` - Obtener asientos desde backend
4. ✅ `netlify/functions/generateDailyReport.js` - Generar Excel con 4 hojas
5. ✅ `netlify/functions/sendDailyReport.js` - Enviar reporte por email automático
6. ✅ `whatsappTemplates.js` - 8 templates de mensajes listos

### Frontend Helpers
1. ✅ `js/seats-api.js` - Reemplaza localStorage y elimina pop-ups

## 📋 Pasos para completar la migración

### 1. Instalar dependencias
```bash
npm install
```

### 2. Configurar variables de entorno en Netlify
Ir a: Netlify Dashboard > Site settings > Environment variables

Agregar:
```
REPORT_TOKEN=cheqfirma2025
EMAIL_PROVIDER=resend
RESEND_API_KEY=re_tu_api_key_aqui
EMAIL_FROM=noreply@cheqfirma.com
EMAIL_TO=cheqfirma@gmail.com
```

### 3. Actualizar frontend para usar backend

**Reemplazar en `index.html`:**

#### ANTES (localStorage):
```javascript
seatsData[seatNumber] = 'sold';
localStorage.setItem('seatsData', JSON.stringify(seatsData));
```

#### DESPUÉS (Backend):
```javascript
await window.seatsAPI.confirmPurchase({
  seatNumber: seatNumber,
  buyerName: customerName,
  buyerEmail: customerEmail,
  buyerPhone: customerPhone,
  paymentMethod: 'transferencia',
  paidAmount: 150000,
  totalAmount: 150000,
  isDeposit: false
});
```

#### ANTES (alert):
```javascript
alert('Asiento vendido!');
```

#### DESPUÉS (Notificación):
```javascript
window.seatsAPI.showNotification('success', 'Compra confirmada');
```

#### ANTES (mailto:):
```javascript
window.location.href = `mailto:${email}?subject=...`;
```

#### DESPUÉS (Backend):
```javascript
await window.seatsAPI.sendEmail({
  to: email,
  subject: '...',
  body: '...'
});
```

#### ANTES (window.open):
```javascript
window.open(`https://wa.me/${phone}?text=...`, '_blank');
```

#### DESPUÉS (Backend):
```javascript
await window.seatsAPI.sendWhatsApp(phone, message);
```

### 4. Eliminar código antiguo

Buscar y eliminar/reemplazar:
- Todos los `alert()`, `confirm()`, `prompt()`
- Todos los `mailto:`
- Todos los `window.open('wa.me/...')`
- Lógica de `localStorage.setItem('seatsData', ...)`
- Lógica de `localStorage.getItem('seat_X', ...)`

### 5. Probar funciones

#### Generar reporte manualmente:
```bash
curl "https://tu-sitio.netlify.app/.netlify/functions/generateDailyReport?token=cheqfirma2025" --output reporte.xlsx
```

#### Enviar reporte por email:
```bash
curl "https://tu-sitio.netlify.app/.netlify/functions/sendDailyReport?token=cheqfirma2025"
```

### 6. Programar reporte diario

#### Opción A: Cron externo (cron-job.org)
- URL: `https://tu-sitio.netlify.app/.netlify/functions/sendDailyReport?token=cheqfirma2025`
- Frecuencia: Diario a las 9:00 AM

#### Opción B: Netlify Scheduled Functions (si el plan lo permite)
Agregar en `netlify.toml`:
```toml
[[plugins]]
  package = "@netlify/plugin-scheduled-functions"

[[schedules]]
  cron = "0 9 * * *"
  function = "sendDailyReport"
```

## 🔍 Verificación

### Checklist:
- [ ] Variables de entorno configuradas
- [ ] Dependencias instaladas (`npm install`)
- [ ] Frontend actualizado para usar `window.seatsAPI`
- [ ] Eliminados todos los `alert()`, `mailto:`, `window.open`
- [ ] Reporte se genera correctamente
- [ ] Email llega con Excel adjunto
- [ ] Asientos se guardan en backend (Netlify Blobs)

## 📞 Soporte

Si hay problemas:
1. Revisar logs en Netlify Dashboard > Functions
2. Verificar variables de entorno
3. Probar funciones individualmente con curl
4. Revisar consola del navegador para errores de frontend

