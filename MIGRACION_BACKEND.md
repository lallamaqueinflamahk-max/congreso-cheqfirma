# Migración a Backend Real - Documentación

## Estructura Actual (Frontend)
- **Almacenamiento**: localStorage
  - `seatsData`: {1: 'sold', 2: 'reserved_XXX', ...}
  - `seat_X`: datos completos del asiento
  - `reservation_XXX`: datos de reserva
- **Estados**: 'sold', 'reserved_XXX', 'temp_XXX', null (available)
- **Problemas**: alert(), mailto:, window.open

## Nuevas Funciones Netlify Backend

### 1. `/netlify/functions/seats.js`
- **GET** `/.netlify/functions/seats` - Obtener todos los asientos
- **GET** `/.netlify/functions/seats/:seatNumber` - Obtener asiento específico
- **POST** `/.netlify/functions/seats` - Crear/actualizar asiento
- **Persistencia**: Netlify Blobs (reemplaza localStorage)
- **Estructura de datos**: MANTIENE la estructura actual del frontend

### 2. `/netlify/functions/generate-report.js`
- **GET** `/.netlify/functions/generate-report?token=XXX` - Generar Excel
- **Protección**: Token en query o header Authorization
- **Salida**: Excel con 4 hojas (Resumen, Vendidos, Reservados, Disponibles)
- **Formato**: `reporte_asientos_YYYY-MM-DD.xlsx`

### 3. `/netlify/functions/send-email.js`
- **POST** `/.netlify/functions/send-email` - Enviar email real
- **Reemplaza**: mailto: del frontend
- **Proveedor**: Resend API (configurar RESEND_API_KEY)
- **Fallback**: Encola emails si no hay API key

### 4. `/netlify/functions/send-whatsapp.js`
- **POST** `/.netlify/functions/send-whatsapp` - Enviar WhatsApp
- **Reemplaza**: window.open('wa.me/...')
- **Proveedor**: Twilio API (configurar TWILIO_*)
- **Fallback**: Devuelve URL si no hay API key

## Archivos Creados

1. `netlify/functions/seats.js` - Gestión de asientos
2. `netlify/functions/generate-report.js` - Reportes Excel
3. `netlify/functions/send-email.js` - Envío de emails
4. `netlify/functions/send-whatsapp.js` - Envío de WhatsApp
5. `whatsappTemplates.js` - Templates de mensajes
6. `package.json` - Dependencias (exceljs, @netlify/blobs)
7. `netlify.toml` - Configuración actualizada

## Próximos Pasos (Frontend)

### Reemplazar localStorage por llamadas API:
```javascript
// ANTES (localStorage)
seatsData[seatNumber] = 'sold';
localStorage.setItem('seatsData', JSON.stringify(seatsData));

// DESPUÉS (Backend)
await fetch('/.netlify/functions/seats', {
  method: 'POST',
  body: JSON.stringify({ seatNumber, status: 'sold', ... })
});
```

### Reemplazar mailto: por API:
```javascript
// ANTES
window.location.href = `mailto:${email}?subject=...`;

// DESPUÉS
await fetch('/.netlify/functions/send-email', {
  method: 'POST',
  body: JSON.stringify({ to: email, subject: ..., body: ... })
});
```

### Reemplazar window.open por API:
```javascript
// ANTES
window.open(`https://wa.me/${phone}?text=...`, '_blank');

// DESPUÉS
await fetch('/.netlify/functions/send-whatsapp', {
  method: 'POST',
  body: JSON.stringify({ phone, message: ... })
});
```

### Eliminar alert():
- Reemplazar por actualización silenciosa del UI
- Usar notificaciones visuales no bloqueantes

## Variables de Entorno Netlify

Configurar en Netlify Dashboard > Site settings > Environment variables:

- `RESEND_API_KEY` - Para envío de emails
- `TWILIO_ACCOUNT_SID` - Para WhatsApp
- `TWILIO_AUTH_TOKEN` - Para WhatsApp
- `TWILIO_WHATSAPP_NUMBER` - Número de WhatsApp Business
- `REPORT_TOKEN` - Token para proteger endpoint de reportes

## Instalación

```bash
npm install
```

## Ejecución Local

```bash
netlify dev
```

## Notas Importantes

- **NO se rompe la estructura existente**: Los datos mantienen el mismo formato
- **Migración gradual**: El frontend puede seguir usando localStorage mientras se migra
- **Fallbacks**: Si no hay API keys, las funciones tienen fallbacks seguros
- **Compatibilidad**: Las funciones backend aceptan la misma estructura que el frontend actual

