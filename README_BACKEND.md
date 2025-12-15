# Sistema de Gestión de Asientos - Backend

## Descripción
Sistema completo de gestión de asientos para el Congreso CheqFirma con backend real usando Netlify Functions y Netlify Blobs.

## Arquitectura

### Modelo de Datos
- **Persistencia**: Netlify Blobs (única fuente de verdad)
- **Estados**: SOLD, RESERVED, AVAILABLE
- **Estructura por asiento**:
  ```javascript
  {
    seatNumber: number,
    seatType: 'presencial',
    ticketType: 'general',
    status: 'SOLD' | 'RESERVED' | 'AVAILABLE',
    buyerName: string,
    buyerEmail: string,
    buyerPhone: string,
    paymentMethod: string,
    paidAmount: number,
    totalAmount: number,
    reservationExpiresAt: ISO string | null,
    createdAt: ISO string,
    updatedAt: ISO string,
    notes: string | null
  }
  ```

### Funciones Netlify

#### 1. `seats-store.js` (Helper)
- Gestión centralizada de asientos
- Funciones: `getAllSeats()`, `getSeat()`, `saveSeat()`, `getSeatsByStatus()`, `cleanExpiredReservations()`

#### 2. `confirmPurchase.js`
- **POST** `/.netlify/functions/confirmPurchase`
- Confirma compra/reserva de asiento
- Valida datos y actualiza estado
- Sin pop-ups ni alerts

#### 3. `getSeats.js`
- **GET** `/.netlify/functions/getSeats`
- Obtiene todos los asientos o filtrados
- Reemplaza lectura de localStorage

#### 4. `generateDailyReport.js`
- **GET** `/.netlify/functions/generateDailyReport?token=XXX`
- Genera Excel con 4 hojas: Resumen, Vendidos, Reservados, Disponibles
- Protegido con token

#### 5. `sendDailyReport.js`
- **GET** `/.netlify/functions/sendDailyReport?token=XXX`
- Genera reporte y lo envía por email automáticamente
- Usa Resend o SendGrid

## Variables de Entorno

Configurar en Netlify Dashboard > Site settings > Environment variables:

```bash
# Seguridad
REPORT_TOKEN=cheqfirma2025

# Email
EMAIL_PROVIDER=resend  # o 'sendgrid'
RESEND_API_KEY=re_xxxxx  # Si usas Resend
SENDGRID_API_KEY=SG.xxxxx  # Si usas SendGrid
EMAIL_FROM=noreply@cheqfirma.com
EMAIL_TO=cheqfirma@gmail.com
```

## Políticas de Cupos

1. **Confirmación**: Solo con pago total o seña del 50%
2. **Reservas sin pago**: Duran 24 horas
3. **Señas**: Deben completarse hasta 2 días antes del evento
4. **Reembolso**: 50% si avisa con 2 días de anticipación o si el asiento es revendido
5. **No asistencia**: Acceso a streaming o grabación post-evento

## Templates de WhatsApp

Archivo: `whatsappTemplates.js`

Templates disponibles:
- `reservationPendingFirst()` - Primer aviso (24h)
- `reservationPendingLast()` - Último aviso
- `depositReminder()` - Recordatorio de saldo
- `promoEnded()` - Fin de promoción
- `paymentConfirmed()` - Confirmación de pago
- `attendanceInquiry()` - Duda por asistencia
- `seatReleased()` - Liberación de asiento
- `lastSeats()` - Últimos cupos

## Uso

### Generar y enviar reporte diario manualmente:
```bash
curl "https://tu-sitio.netlify.app/.netlify/functions/sendDailyReport?token=cheqfirma2025"
```

### Obtener todos los asientos:
```bash
curl "https://tu-sitio.netlify.app/.netlify/functions/getSeats"
```

### Confirmar compra desde frontend:
```javascript
await fetch('/.netlify/functions/confirmPurchase', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    seatNumber: 55,
    buyerName: 'Juan Pérez',
    buyerEmail: 'juan@example.com',
    buyerPhone: '+595981234567',
    paymentMethod: 'transferencia',
    paidAmount: 150000,
    totalAmount: 150000,
    isDeposit: false
  })
});
```

## Programación Automática

### Opción 1: Netlify Scheduled Functions (si el plan lo permite)
Agregar en `netlify.toml`:
```toml
[[plugins]]
  package = "@netlify/plugin-scheduled-functions"

[[schedules]]
  cron = "0 9 * * *"  # Diario a las 9 AM
  function = "sendDailyReport"
```

### Opción 2: Cron externo
Usar servicio como cron-job.org o similar:
```
URL: https://tu-sitio.netlify.app/.netlify/functions/sendDailyReport?token=cheqfirma2025
Frecuencia: Diario a las 9:00 AM
```

## Instalación

```bash
npm install
```

## Desarrollo Local

```bash
netlify dev
```

Las funciones estarán disponibles en:
- `http://localhost:8888/.netlify/functions/confirmPurchase`
- `http://localhost:8888/.netlify/functions/getSeats`
- `http://localhost:8888/.netlify/functions/generateDailyReport`
- `http://localhost:8888/.netlify/functions/sendDailyReport`

## Notas Importantes

- ✅ Backend es la única fuente de verdad
- ✅ No hay pop-ups ni alerts bloqueantes
- ✅ Emails reales con adjuntos Excel
- ✅ Reportes reflejan estado exacto
- ✅ Sistema auditable y escalable

