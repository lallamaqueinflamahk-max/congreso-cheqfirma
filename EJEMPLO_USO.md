# 📖 Ejemplos de Uso

## Ejemplo 1: Ejecución Básica con CSV

```bash
# 1. Generar datos de prueba
python scripts/generate_demo_data.py

# 2. Ejecutar reporte
python -m report.run
```

## Ejemplo 2: Usar PostgreSQL

```yaml
# config/config.yaml
datasource:
  type: "postgresql"
  host: "localhost"
  dbname: "congreso"
  user: "postgres"
  password: "password"
```

```bash
# Crear base de datos
psql -U postgres -c "CREATE DATABASE congreso;"

# Ejecutar schema
psql -U postgres -d congreso -f database/schema.sql

# Ejecutar reporte
python -m report.run
```

## Ejemplo 3: Solo Generar Excel (sin email)

```yaml
# config/config.yaml
email:
  enabled: false
```

## Ejemplo 4: Múltiples Destinatarios

```yaml
email:
  enabled: true
  sender_email: "tu-email@gmail.com"
  app_password: "tu-app-password"
  recipients:
    - "cheqfirma@gmail.com"
    - "Lallamaqueinflamahk@gmail.com"
    - "richitexx07@gmail.com"
```

## Ejemplo 5: Programar con Cron (Linux)

```bash
# Editar crontab
crontab -e

# Agregar línea (ejecutar todos los días a las 8:00 AM)
0 8 * * * cd /ruta/al/proyecto && /usr/bin/python3 -m report.run >> /ruta/al/proyecto/cron.log 2>&1
```

## Ejemplo 6: Programar con Task Scheduler (Windows)

1. Abrir Task Scheduler
2. Crear tarea básica
3. Nombre: "Reporte Diario ADN Humano"
4. Trigger: Diario a las 8:00 AM
5. Acción: Iniciar programa
   - Programa: `python.exe`
   - Argumentos: `-m report.run`
   - Directorio: `C:\ruta\al\proyecto`

## Ejemplo 7: Verificar Logs

```bash
# Ver últimas líneas
tail -f report.log

# Windows
Get-Content report.log -Tail 50
```

## Ejemplo 8: Testing

```bash
# Ejecutar todos los tests
pytest report/tests/

# Con cobertura
pytest report/tests/ --cov=report
```

