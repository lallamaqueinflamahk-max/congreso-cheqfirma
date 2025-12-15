# 📁 Estructura Completa del Proyecto

```
congreso-adn-humano/
│
├── report/                          # Módulo principal
│   ├── __init__.py                  # Inicialización del módulo
│   ├── policy.py                    # Reglas de negocio (PolicyEngine)
│   ├── metrics.py                   # Cálculo de métricas por origen
│   ├── excel_report.py              # Generador de Excel (6 hojas)
│   ├── emailer.py                   # Enviador de emails (Gmail SMTP)
│   ├── run.py                       # Script principal de procesamiento
│   │
│   ├── datasources/                 # Adaptadores de datos
│   │   ├── __init__.py
│   │   ├── postgresql.py            # Adaptador PostgreSQL
│   │   ├── csv_adapter.py           # Adaptador CSV con mapping
│   │   └── factory.py               # Factory para crear adaptadores
│   │
│   └── tests/                       # Tests unitarios
│       ├── __init__.py
│       ├── test_policy.py           # Tests de reglas de negocio
│       └── test_metrics.py          # Tests de métricas
│
├── config/                           # Configuración
│   └── config.example.yaml          # Ejemplo de configuración
│
├── data/                             # Datos CSV
│   └── seats.csv.example            # Ejemplo de CSV
│
├── database/                         # Scripts de base de datos
│   └── schema.sql                   # Schema PostgreSQL
│
├── scripts/                          # Scripts auxiliares
│   ├── generate_demo_data.py        # Generar datos de prueba
│   ├── run_daily.bat                # Script Windows para cron
│   └── run_daily.sh                 # Script Linux/Mac para cron
│
├── reports/                          # Reportes Excel generados (gitignore)
│   └── reporte_adn_humano_*.xlsx
│
├── requirements.txt                  # Dependencias Python
├── README.md                         # Documentación principal
├── INSTALACION.md                    # Guía de instalación
├── QUICK_START.md                    # Inicio rápido
├── EJEMPLO_USO.md                    # Ejemplos de uso
├── CHANGELOG.md                      # Historial de cambios
├── .gitignore                        # Archivos ignorados por git
└── .env.example                      # Variables de entorno (opcional)
```

## 📦 Archivos Clave

### Core
- `report/policy.py`: Motor de reglas de negocio
- `report/metrics.py`: Calculadora de métricas
- `report/excel_report.py`: Generador Excel
- `report/emailer.py`: Enviador de emails
- `report/run.py`: Orquestador principal

### Datasources
- `report/datasources/postgresql.py`: Adaptador PostgreSQL
- `report/datasources/csv_adapter.py`: Adaptador CSV
- `report/datasources/factory.py`: Factory pattern

### Configuración
- `config/config.example.yaml`: Template de configuración
- `database/schema.sql`: Schema PostgreSQL

### Utilidades
- `scripts/generate_demo_data.py`: Generador de datos fake
- `scripts/run_daily.*`: Scripts para automatización

## 🔄 Flujo de Ejecución

1. `run.py` carga configuración
2. Factory crea adaptador de datos (PostgreSQL o CSV)
3. Carga todos los asientos
4. `PolicyEngine` aplica reglas (libera vencidas)
5. `MetricsCalculator` calcula métricas
6. `ExcelReportGenerator` genera Excel
7. `EmailSender` envía email con adjunto

## 📊 Datos Generados

- `reports/reporte_adn_humano_YYYY-MM-DD.xlsx`: Excel diario
- `report.log`: Logs de ejecución
- `data/audit_log.csv`: Log de auditoría (si usa CSV)

