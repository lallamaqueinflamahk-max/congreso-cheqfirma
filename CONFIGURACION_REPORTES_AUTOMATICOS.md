# Configuración de Reportes Automáticos

## 📧 Emails Configurados

Los reportes se envían automáticamente a:
- cheqfirma@gmail.com
- Lallamaqueinflamahk@gmail.com
- richitexx07@gmail.com

## 📊 Tipos de Reportes

### 1. Reporte Matutino (Primera Hora)
**URL:** `/.netlify/functions/scheduledReports?type=morning&token=cheqfirma2025`

**Cuándo:** Cada día a las 8:00 AM

**Contenido:**
- Resumen financiero del día anterior
- Estado actual de todos los asientos
- Problemas detectados
- Recuento de plata ganada

### 2. Reporte Baja Ventas (24h sin ventas)
**URL:** `/.netlify/functions/scheduledReports?type=low-sales&token=cheqfirma2025`

**Cuándo:** Se ejecuta automáticamente si la ocupación es < 10%

**Contenido:**
- Alerta de baja ocupación
- Análisis de problemas
- Recomendaciones de marketing

### 3. Reporte Fin de Día (Recuento Diario)
**URL:** `/.netlify/functions/scheduledReports?type=end-day&token=cheqfirma2025`

**Cuándo:** Cada día a las 6:00 PM

**Contenido:**
- Recuento completo de todas las ventas del día
- Problemas encontrados durante el día
- Resumen financiero del día
- Estado final de asientos

## 🚀 Generar Reporte Ahora

### Opción 1: Desde el navegador
Abrir: `GENERAR_REPORTE_AHORA.html` y hacer clic en "Generar Reporte AHORA"

### Opción 2: Desde línea de comandos
```bash
curl "https://tu-sitio.netlify.app/.netlify/functions/sendReportNow?token=cheqfirma2025"
```

### Opción 3: Solo descargar (sin enviar)
```bash
curl "https://tu-sitio.netlify.app/.netlify/functions/generateReportWithAnalysis?token=cheqfirma2025" --output reporte.xlsx
```

## ⚙️ Configurar Cron Externo

### Usar cron-job.org o similar:

#### Reporte Matutino (8:00 AM)
- URL: `https://tu-sitio.netlify.app/.netlify/functions/scheduledReports?type=morning&token=cheqfirma2025`
- Frecuencia: Diario a las 8:00 AM (hora local)

#### Reporte Fin de Día (6:00 PM)
- URL: `https://tu-sitio.netlify.app/.netlify/functions/scheduledReports?type=end-day&token=cheqfirma2025`
- Frecuencia: Diario a las 6:00 PM (hora local)

#### Reporte Baja Ventas (Monitoreo continuo)
- URL: `https://tu-sitio.netlify.app/.netlify/functions/scheduledReports?type=low-sales&token=cheqfirma2025`
- Frecuencia: Cada 6 horas (para detectar baja ventas)

## 📋 Contenido de los Reportes

Cada reporte Excel incluye 5 hojas:

1. **Resumen Financiero**
   - Total vendidos, reservados, disponibles
   - Recuento de plata ganada (pagado)
   - Saldo pendiente (reservas)
   - Total potencial
   - Ocupación actual

2. **Problemas y Soluciones**
   - Problemas detectados automáticamente
   - Soluciones recomendadas
   - Prioridad de cada problema

3. **Vendidos**
   - Lista completa con todos los datos
   - Monto pagado
   - Fecha de venta

4. **Reservados**
   - Datos del cliente
   - Monto pagado vs saldo pendiente
   - Fecha de vencimiento
   - Estado (Seña 50% o Reserva)

5. **Disponibles**
   - Lista de asientos disponibles
   - Precio actual

## 🔒 Seguridad

Todos los endpoints están protegidos con token:
- Token por defecto: `cheqfirma2025`
- Configurar en Netlify: `REPORT_TOKEN`

## 📝 Notas

- Los reportes se generan en tiempo real desde el backend
- Los problemas se detectan automáticamente
- Las reservas expiradas se limpian automáticamente antes de generar el reporte
- El sistema detecta: reservas por vencer, señas sin completar, baja ocupación, datos incompletos

