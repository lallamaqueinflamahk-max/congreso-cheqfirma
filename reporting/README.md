# Sistema Automático de Reporte de Ventas

Sistema completo para generar reportes diarios de ventas del Congreso ADN Humano con datos actualizados, estadísticas, gráficos y proyecciones.

## 📋 Características

- ✅ **Reporte Excel completo** con 5 pestañas:
  - **Resumen**: KPIs principales, estadísticas y gráficos (línea, barras, acumulado)
  - **Ventas_detalle**: Detalle completo de todas las ventas
  - **Reservas_detalle**: Detalle de reservas con vencimientos
  - **Problemas_detalle**: Incidencias detectadas automáticamente
  - **Proyeccion**: Forecast de ventas con 3 escenarios (conservador/medio/optimista)

- ✅ **Múltiples fuentes de datos**: Netlify Blobs, PostgreSQL, CSV
- ✅ **Automatización diaria** vía GitHub Actions
- ✅ **Gráficos automáticos** en Excel
- ✅ **Proyecciones inteligentes** basadas en promedio móvil y regresión lineal

## 🚀 Cómo Correr Localmente

### 1. Instalar dependencias

```bash
pip install -r requirements.txt
```

### 2. Configurar

Edita `reporting/config.yml` con tus parámetros:

```yaml
datasource:
  type: "netlify_blobs"  # o "postgresql", "csv"
  api_url: "https://tu-sitio.netlify.app/.netlify/functions/getSeats"
  
event:
  date: "2025-12-19T08:00:00"
  name: "Congreso ADN Humano"

capacity: 100
output_dir: "report/output"
```

### 3. Variables de entorno (si usas Netlify Blobs)

```bash
export NETLIFY_TOKEN="tu-token"
export REPORT_TOKEN="cheqfirma2025"
```

### 4. Ejecutar

```bash
python reporting/generate_sales_report.py reporting/config.yml
```

El reporte se generará en `report/output/REPORTE_VENTAS_YYYY-MM-DD.xlsx`

## 🤖 Cómo Corre Automático

### GitHub Actions (Recomendado)

El workflow está configurado en `.github/workflows/daily-sales-report.yml` y se ejecuta:

- **Automáticamente**: Todos los días a las 8:00 AM UTC (4:00 AM hora Paraguay)
- **Manualmente**: Desde la pestaña "Actions" en GitHub

### Configurar Secrets en GitHub

1. Ve a tu repositorio en GitHub
2. Settings → Secrets and variables → Actions
3. Agrega estos secrets:
   - `NETLIFY_TOKEN`: Token de Netlify para acceder a Blobs
   - `REPORT_TOKEN`: Token para autenticación (opcional)

### Resultados

- Los reportes se guardan como **artifacts** en cada ejecución
- Opcionalmente se commitean a `report/output/` para historial

### Alternativa: Netlify Scheduled Function

Si prefieres usar Netlify en lugar de GitHub Actions:

1. Crea `netlify/functions/generateSalesReportScheduled.js`:

```javascript
const { handler } = require('./generateSalesReport');

exports.handler = async (event, context) => {
  // Ejecutar script Python vía subprocess o llamar a API
  // ...
};
```

2. Configura en `netlify.toml`:

```toml
[build]
  functions = "netlify/functions"

[[plugins]]
  package = "@netlify/plugin-scheduled-functions"
  
[[schedules]]
  cron = "0 8 * * *"  # 8 AM UTC diario
  function = "generateSalesReportScheduled"
```

## 📊 Estructura del Reporte

### Pestaña Resumen

- **KPIs**: Ventas total, físico, virtual, reservas, tasa conversión, ingresos, ticket promedio
- **Top Productos/Eventos**
- **Gráficos**:
  - Línea: Ventas por día
  - Barras: Físico vs Virtual
  - Línea: Ventas acumuladas

### Pestaña Ventas_detalle

Columnas: Fecha, Canal, Producto/Evento, Cantidad, Precio, Total, Método de Pago, Estado, Referencia/ID, Vendedor

### Pestaña Reservas_detalle

Columnas: Fecha, Producto/Evento, Cantidad, Estado, Vencimiento, Contacto, Fuente/Canal, Observaciones

### Pestaña Problemas_detalle

Detecta automáticamente:
- Reservas vencidas
- Pagos fallidos/incompletos
- Cupo inconsistente

### Pestaña Proyeccion

Forecast para próximas 2-4 semanas (o hasta fin del evento) con:
- **3 escenarios**: Conservador (70%), Medio (100%), Optimista (130%)
- **Método**: Promedio móvil 7 días + ajuste por tendencia (regresión lineal)
- **Probabilidad**: Basada en conversión histórica reservas→venta y ratio físico/virtual

## 🔧 Fuentes de Datos

### Netlify Blobs (Recomendado)

```yaml
datasource:
  type: "netlify_blobs"
  api_url: "https://tu-sitio.netlify.app/.netlify/functions/getSeats"
```

### PostgreSQL

```yaml
datasource:
  type: "postgresql"
  host: "localhost"
  port: 5432
  dbname: "congreso"
  user: "postgres"
  password: "${DB_PASSWORD}"  # variable de entorno
```

### CSV

```yaml
datasource:
  type: "csv"
  csv_path: "data/seats.csv"
  column_mapping:
    seat_id: "seat_id"
    seat_number: "seat_number"
    # ... más mapeos
```

## 🧪 Tests

Ejecutar tests mínimos:

```bash
pytest reporting/tests/ -v
```

Los tests validan:
- Que las columnas clave existen en el Excel
- Que no hay nulos críticos
- Que las métricas se calculan correctamente

## 📝 Logs

El script genera logs claros en consola:

```
2025-12-15 10:00:00 - INFO - Iniciando generación de reporte de ventas...
2025-12-15 10:00:01 - INFO - Cargando datos...
2025-12-15 10:00:02 - INFO - Cargados 45 asientos
2025-12-15 10:00:02 - INFO - Calculando métricas...
2025-12-15 10:00:03 - INFO - Reporte guardado en: report/output/REPORTE_VENTAS_2025-12-15.xlsx
```

## 🔐 Seguridad

- **No incluir secretos** en el repositorio
- Usar **variables de entorno** para credenciales
- Los tokens se configuran en GitHub Secrets o Netlify Environment Variables

## 📁 Estructura de Archivos

```
reporting/
├── generate_sales_report.py  # Script principal
├── config.yml                 # Configuración
└── README.md                  # Esta documentación

report/
├── datasources/
│   ├── netlify_blobs_adapter.py
│   ├── postgresql.py
│   └── csv_adapter.py
└── output/                    # Reportes generados
    ├── REPORTE_VENTAS_2025-12-15.xlsx
    └── metadata_2025-12-15.json

.github/
└── workflows/
    └── daily-sales-report.yml  # Automatización
```

## 🐛 Troubleshooting

### Error: "No se puede conectar a Netlify Blobs"

- Verifica que `NETLIFY_TOKEN` esté configurado
- Verifica que la URL de la API sea correcta
- Alternativa: Exporta datos a JSON y usa `json_export_path`

### Error: "Módulo no encontrado"

```bash
pip install -r requirements.txt
```

### Error: "No hay datos para generar reporte"

- Verifica que la fuente de datos tenga información
- Revisa los logs para ver cuántos asientos se cargaron

## 📞 Soporte

Para problemas o preguntas, revisa los logs o contacta al equipo de desarrollo.

