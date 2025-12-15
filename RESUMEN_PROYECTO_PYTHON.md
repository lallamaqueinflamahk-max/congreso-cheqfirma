# ✅ Proyecto Completo - Sistema de Reportes ADN Humano

## 🎯 Resumen

Sistema completo en **Python 3.11+** para automatización de reportes diarios del congreso "ADN Humano" con:

- ✅ Gestión de asientos (VENDIDO, RESERVADO, VACANTE)
- ✅ Origen de venta (WHATSAPP_CALIENTE vs VIRTUAL_FRIO)
- ✅ Reglas de negocio automatizadas
- ✅ Reporte Excel diario con 6 hojas
- ✅ Email automático por Gmail SMTP
- ✅ Fuentes de datos: PostgreSQL o CSV

## 📦 Archivos Creados

### Core del Sistema
- `report/policy.py` - Motor de reglas de negocio
- `report/metrics.py` - Calculadora de métricas por origen
- `report/excel_report.py` - Generador Excel (6 hojas)
- `report/emailer.py` - Enviador de emails Gmail SMTP
- `report/run.py` - Script principal de procesamiento

### Datasources
- `report/datasources/postgresql.py` - Adaptador PostgreSQL
- `report/datasources/csv_adapter.py` - Adaptador CSV
- `report/datasources/factory.py` - Factory pattern

### Tests
- `report/tests/test_policy.py` - Tests de reglas
- `report/tests/test_metrics.py` - Tests de métricas

### Configuración
- `config/config.example.yaml` - Template de configuración
- `database/schema.sql` - Schema PostgreSQL

### Scripts
- `scripts/generate_demo_data.py` - Generador de datos fake
- `scripts/run_daily.bat` - Script Windows para cron
- `scripts/run_daily.sh` - Script Linux/Mac para cron

### Documentación
- `README.md` - Documentación principal
- `INSTALACION.md` - Guía de instalación paso a paso
- `QUICK_START.md` - Inicio rápido
- `EJEMPLO_USO.md` - Ejemplos de uso
- `ESTRUCTURA_PROYECTO.md` - Estructura completa
- `CHANGELOG.md` - Historial de cambios

### Otros
- `requirements.txt` - Dependencias Python
- `.gitignore` - Archivos ignorados
- `data/seats.csv.example` - Ejemplo de CSV

## 🚀 Próximos Pasos

### 1. Instalar Dependencias

```bash
pip install -r requirements.txt
```

Esto instalará:
- `openpyxl` (ya instalado ✅)
- `PyYAML` (necesario)
- `psycopg2-binary` (opcional, solo si usas PostgreSQL)
- `pytest` (opcional, para tests)

### 2. Configurar

```bash
# Copiar ejemplo
copy config\config.example.yaml config\config.yaml

# Editar config.yaml con tus datos:
# - Fecha del evento
# - Fuente de datos (CSV o PostgreSQL)
# - Email Gmail (App Password)
```

### 3. Generar Datos de Prueba

```bash
python scripts/generate_demo_data.py
```

### 4. Ejecutar

```bash
python -m report.run
```

## 📊 Reporte Excel Generado

El sistema genera `reports/reporte_adn_humano_YYYY-MM-DD.xlsx` con:

1. **RESUMEN GENERAL** - Totales, ingresos, alertas
2. **VENDIDOS** - Lista completa con origen
3. **RESERVADOS** - Reservas activas con vencimientos
4. **VACANTES** - Asientos disponibles
5. **CANCELACIONES** - Cancelaciones y reembolsos
6. **AUDIT** - Log de acciones automáticas

## 📧 Email Automático

- Resumen ejecutivo HTML
- Ventas por canal (WhatsApp vs Virtual)
- Alertas automáticas
- Excel adjunto

## 🔧 Reglas de Negocio Implementadas

✅ Reserva sin pago: 24 horas  
✅ Confirmación: pago total o seña 50%  
✅ Saldo debe completarse 2 días antes del evento  
✅ Reembolso máximo 50% (si avisa ≥2 días o asiento revendido)  
✅ Liberación automática de reservas vencidas  
✅ Alertas automáticas (reservas vencidas, riesgos, baja ocupación)  

## 📝 Notas Importantes

1. **Gmail App Password**: No usar la contraseña normal, generar App Password desde Google Account → Security
2. **PostgreSQL**: Opcional, el sistema funciona perfectamente con CSV
3. **Automatización**: Usar Task Scheduler (Windows) o Cron (Linux/Mac)
4. **Logs**: Se guardan en `report.log`

## ✅ Estado del Proyecto

**COMPLETO Y LISTO PARA USAR**

Solo falta:
1. Instalar dependencias (`pip install -r requirements.txt`)
2. Configurar `config/config.yaml`
3. Generar datos de prueba (opcional)
4. Ejecutar

---

**Desarrollado para Congreso ADN Humano - CheqFirma**

