# Congreso CheqFirma - Sistema de Gestión y Reportes

Sistema completo de gestión de asientos y reportes automáticos para el Congreso ADN Humano.

## 📊 Sistema Automático de Reporte de Ventas

**Nuevo**: Sistema completo de reportes diarios con Excel, gráficos y proyecciones.

### Características principales:
- ✅ Reporte Excel con 5 pestañas (Resumen, Ventas, Reservas, Problemas, Proyección)
- ✅ KPIs automáticos y gráficos (línea, barras, acumulado)
- ✅ Forecast de ventas con 3 escenarios
- ✅ Detección automática de problemas
- ✅ Automatización diaria vía GitHub Actions

### Inicio rápido:

```bash
# Instalar dependencias
pip install -r requirements.txt

# Configurar (editar reporting/config.yml)
# Ejecutar reporte
python reporting/generate_sales_report.py reporting/config.yml
```

📖 **Documentación completa**: Ver [reporting/README.md](reporting/README.md)

## 🎫 Sistema de Gestión de Asientos

Sistema de gestión de asientos con backend en Netlify Functions y Netlify Blobs.

### Funcionalidades:
- Gestión de asientos (Vendidos, Reservados, Disponibles)
- Reservas con vencimiento automático
- Reportes diarios automáticos
- Integración con WhatsApp y venta virtual

### Estructura:
- `netlify/functions/`: Funciones serverless
- `report/`: Sistema de reportes Python
- `reporting/`: Sistema nuevo de reportes de ventas

## 🚀 Inicio Rápido

1. **Clonar repositorio**
2. **Instalar dependencias**: `npm install` y `pip install -r requirements.txt`
3. **Configurar variables de entorno** (ver documentación específica)
4. **Ejecutar reportes**: Ver [reporting/README.md](reporting/README.md)

## 📚 Documentación

- [Sistema de Reportes de Ventas](reporting/README.md) - Documentación completa del sistema de reportes
- [Backend](README_BACKEND.md) - Documentación del backend Netlify
- [Configuración de Reportes](CONFIGURACION_REPORTES_AUTOMATICOS.md) - Configuración de reportes automáticos

## 🔧 Tecnologías

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Netlify Functions (Node.js)
- **Almacenamiento**: Netlify Blobs
- **Reportes**: Python (pandas, openpyxl)
- **Automatización**: GitHub Actions

## 📝 Licencia

MIT
