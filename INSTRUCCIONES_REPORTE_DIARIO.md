# 📋 INSTRUCCIONES PARA GENERAR REPORTE DIARIO DE ASIENTOS

## 🎯 Función Implementada

Se ha creado la función `generateDailyReportPDF()` que genera un reporte diario completo en formato PDF con todos los asientos presenciales vendidos y reservados, incluyendo todos los detalles.

## 📊 Contenido del Reporte

El reporte incluye:

### 1. **Estadísticas Generales**
- Total de asientos (100)
- Asientos vendidos
- Asientos reservados
- Asientos disponibles
- Ingresos totales

### 2. **Asientos Vendidos** (con todos los detalles)
- Número de asiento
- Nombre completo del comprador
- Cédula de Identidad (CI)
- Teléfono
- Email
- Precio pagado
- Método de pago
- Fecha de venta
- ID de reserva

### 3. **Asientos Reservados** (con todos los detalles)
- Número de asiento
- Nombre completo
- Cédula de Identidad (CI)
- Teléfono
- Email
- Método de pago (si está seleccionado)
- Precio
- Fecha de reserva
- ID de reserva

## 🚀 Cómo Usar la Función

### Opción 1: Desde la Consola del Navegador (F12)

1. Abre la página del congreso en tu navegador
2. Presiona `F12` para abrir las herramientas de desarrollador
3. Ve a la pestaña "Console"
4. Escribe el siguiente comando y presiona Enter:

```javascript
generateDailyReportPDF()
```

### Opción 2: Desde el Código

Puedes llamar la función desde cualquier parte del código:

```javascript
await generateDailyReportPDF();
```

## 📧 Envío Automático por Email

La función automáticamente:

1. **Genera el PDF** con el nombre: `Reporte_Diario_Asientos_YYYY-MM-DD.pdf`
2. **Descarga el PDF** automáticamente a tu carpeta de descargas
3. **Abre el cliente de email** para enviar el reporte a:
   - `cheqfirma@gmail.com`
   - `richitexx07@gmail.com`

### ⚠️ Importante

- El PDF se descarga automáticamente
- El cliente de email se abrirá automáticamente con el asunto y cuerpo prellenados
- **DEBES ADJUNTAR MANUALMENTE EL PDF** antes de enviar el email
- Los emails se abrirán con un intervalo de 2 segundos entre cada uno

## 📝 Formato del Email

El email incluye:

- **Asunto:** `Reporte Diario de Asientos - [Fecha] - Congreso CheqFirma`
- **Cuerpo:** Mensaje profesional con información del reporte
- **Adjunto:** Debes adjuntar manualmente el PDF descargado

## 🔄 Programar Reporte Diario Automático

Si deseas que el reporte se genere automáticamente todos los días, puedes agregar esta función al código:

```javascript
// Ejecutar reporte diario a las 23:59 cada día
function scheduleDailyReport() {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(23, 59, 0, 0);
    
    const msUntilMidnight = tomorrow.getTime() - now.getTime();
    
    setTimeout(() => {
        generateDailyReportPDF();
        // Programar para el siguiente día
        setInterval(() => {
            generateDailyReportPDF();
        }, 24 * 60 * 60 * 1000); // Cada 24 horas
    }, msUntilMidnight);
}

// Activar programación (descomentar para activar)
// scheduleDailyReport();
```

## ✅ Verificación

Después de ejecutar la función, verifica:

1. ✅ El PDF se descargó correctamente
2. ✅ El PDF contiene todos los asientos vendidos
3. ✅ El PDF contiene todos los asientos reservados
4. ✅ Todos los detalles están presentes (nombre, CI, teléfono, email, etc.)
5. ✅ Los emails se abrieron correctamente
6. ✅ Adjuntaste el PDF antes de enviar

## 🐛 Solución de Problemas

### Error: "jsPDF no está disponible"
- **Solución:** Recarga la página y espera a que todos los scripts carguen completamente

### El PDF no se descarga
- **Solución:** Verifica que tu navegador permita descargas automáticas

### Los emails no se abren
- **Solución:** Verifica que tengas un cliente de email configurado (Gmail, Outlook, etc.)

### Faltan datos en el reporte
- **Solución:** Verifica que los datos estén guardados correctamente en `localStorage`

## 📞 Contacto

Para más información o soporte, contacta a:
- Email: cheqfirma@gmail.com
- WhatsApp: +5493536564940

---

**Última actualización:** $(Get-Date -Format "yyyy-MM-dd HH:mm")





