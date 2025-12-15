# 🚀 Generar Reporte AHORA MISMO

## Opción 1: Desde el Navegador (MÁS FÁCIL)

1. Abre el archivo `GENERAR_REPORTE_AHORA.html` en tu navegador
2. Haz clic en el botón **"🚀 Generar Reporte AHORA"**
3. El reporte se generará y se enviará automáticamente a los 3 emails

## Opción 2: Desde PowerShell

1. Abre PowerShell en la carpeta del proyecto
2. Ejecuta: `.\EJECUTAR_REPORTE_AHORA.ps1`
3. Selecciona si usas entorno local o producción

## Opción 3: Desde Línea de Comandos

### Si tienes Netlify Dev corriendo:
```bash
curl "http://localhost:8888/.netlify/functions/sendReportNow?token=cheqfirma2025"
```

### Si el sitio está desplegado:
```bash
curl "https://TU-SITIO.netlify.app/.netlify/functions/sendReportNow?token=cheqfirma2025"
```

## 📧 Emails que recibirán el reporte:

- cheqfirma@gmail.com
- Lallamaqueinflamahk@gmail.com
- richitexx07@gmail.com

## 📊 Contenido del Reporte:

El Excel incluye 5 hojas:

1. **Resumen Financiero**
   - Total vendidos, reservados, disponibles
   - Recuento de plata ganada (pagado)
   - Saldo pendiente (reservas)
   - Total potencial
   - Ocupación actual

2. **Problemas y Soluciones** ⚠️
   - Problemas detectados automáticamente:
     - Reservas por vencer (próximas 12h)
     - Señas sin completar
     - Baja ocupación
     - Datos incompletos
   - Soluciones recomendadas para cada problema
   - Prioridad de cada acción

3. **Vendidos**
   - Lista completa con todos los datos del comprador
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

## ⚙️ Configuración Requerida

Antes de generar reportes, asegúrate de tener configurado en Netlify:

1. **RESEND_API_KEY** - Para envío de emails
2. **REPORT_TOKEN** - Token de seguridad (por defecto: cheqfirma2025)
3. **EMAIL_FROM** - Email remitente
4. **EMAIL_PROVIDER** - 'resend' o 'sendgrid'

## 🔍 Detección Automática de Problemas

El sistema detecta automáticamente:

- ✅ Reservas que vencen en las próximas 12 horas
- ✅ Señas del 50% sin completar
- ✅ Baja ocupación (< 30%)
- ✅ Reservas con datos incompletos (sin email o teléfono)
- ✅ Reservas expiradas (se liberan automáticamente)

Y proporciona soluciones específicas para cada problema.

## 📅 Reportes Programados

El sistema está configurado para generar reportes automáticamente:

1. **Reporte Matutino** - Cada día a las 8:00 AM
2. **Reporte Baja Ventas** - Si ocupación < 10% en 24h
3. **Reporte Fin de Día** - Cada día a las 6:00 PM

Ver `CONFIGURACION_REPORTES_AUTOMATICOS.md` para más detalles.

