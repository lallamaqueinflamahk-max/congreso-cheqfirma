# 🚀 Comandos Rápidos - Generar Reporte

## GENERAR REPORTE AHORA MISMO

### Opción 1: Botón Flotante (MÁS FÁCIL) ⭐
1. Abre `index.html` en el navegador
2. Busca el botón flotante azul en la esquina inferior derecha: **"Reporte"**
3. Haz clic → El reporte se genera y envía automáticamente a los 3 emails

### Opción 2: Página Dedicada
1. Abre `GENERAR_REPORTE_AHORA.html` en el navegador
2. Haz clic en **"🚀 Generar Reporte AHORA"**

### Opción 3: Consola del Navegador (F12)
```javascript
generarYEnviarReporteAhora()
```

### Opción 4: PowerShell
```powershell
.\EJECUTAR_REPORTE_AHORA.ps1
```

### Opción 5: URL Directa (si está desplegado)
```
https://tu-sitio.netlify.app/.netlify/functions/sendReportNow?token=cheqfirma2025
```

---

## 📧 EMAILS QUE RECIBEN EL REPORTE

- ✅ cheqfirma@gmail.com
- ✅ Lallamaqueinflamahk@gmail.com
- ✅ richitexx07@gmail.com

---

## 📊 QUÉ INCLUYE EL REPORTE

1. **Resumen Financiero** - Recuento de plata ganada
2. **Problemas y Soluciones** - Análisis automático
3. **Vendidos** - Lista completa
4. **Reservados** - Con vencimientos
5. **Disponibles** - Asientos libres

---

## ⚙️ CONFIGURACIÓN REQUERIDA

Antes de usar, configura en Netlify Dashboard:
- `RESEND_API_KEY` - Para envío de emails
- `REPORT_TOKEN` - Token de seguridad (default: cheqfirma2025)

---

## 📅 REPORTES AUTOMÁTICOS

- **Matutino:** 8:00 AM diario
- **Baja Ventas:** Si ocupación < 10%
- **Fin de Día:** 6:00 PM diario

Ver `CONFIGURACION_REPORTES_AUTOMATICOS.md` para configurar cron.

