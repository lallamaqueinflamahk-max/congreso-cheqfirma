# 📦 Guía de Instalación - Sistema de Reportes ADN Humano

## Paso 1: Verificar Python

```bash
python --version
# Debe ser Python 3.11 o superior
```

## Paso 2: Instalar Dependencias

```bash
pip install -r requirements.txt
```

## Paso 3: Configurar

1. **Copiar archivo de configuración:**
```bash
copy config\config.example.yaml config\config.yaml
```

2. **Editar `config/config.yaml`:**
   - Fecha del evento: `event.date`
   - Fuente de datos: `datasource.type` (csv o postgresql)
   - Email: `email.sender_email` y `email.app_password`

3. **Configurar Gmail App Password:**
   - Ir a: https://myaccount.google.com/security
   - Activar "2-Step Verification"
   - Ir a "App passwords"
   - Generar nueva contraseña para "Mail"
   - Usar esa contraseña (16 caracteres) en `config.yaml`

## Paso 4: Generar Datos de Demostración

```bash
python scripts/generate_demo_data.py
```

Esto crea `data/seats.csv` con datos de ejemplo.

## Paso 5: Ejecutar Reporte

```bash
python -m report.run
```

El reporte se generará en `reports/reporte_adn_humano_YYYY-MM-DD.xlsx`

## ✅ Verificación

- ✅ Reporte Excel generado en `reports/`
- ✅ Email enviado (si está configurado)
- ✅ Logs en `report.log`

---

## 🔧 Configuración Avanzada

### Usar PostgreSQL

1. Crear base de datos:
```sql
CREATE DATABASE congreso;
```

2. Ejecutar schema:
```bash
psql -U postgres -d congreso -f database/schema.sql
```

3. Actualizar `config.yaml`:
```yaml
datasource:
  type: "postgresql"
  host: "localhost"
  dbname: "congreso"
  user: "postgres"
  password: "tu_password"
```

### Programar Ejecución Automática

**Windows (Task Scheduler):**
- Acción: `python.exe -m report.run`
- Directorio: ruta del proyecto
- Frecuencia: Diaria a las 8:00 AM

**Linux/Mac (Cron):**
```bash
0 8 * * * cd /ruta/al/proyecto && /usr/bin/python3 -m report.run
```

