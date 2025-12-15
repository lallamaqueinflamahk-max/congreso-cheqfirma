# 🚀 Inicio Rápido

## 1. Instalar dependencias

```bash
pip install -r requirements.txt
```

## 2. Configurar

```bash
# Copiar ejemplo
copy config\config.example.yaml config\config.yaml

# Editar config.yaml con tus datos
```

## 3. Generar datos de prueba

```bash
python scripts/generate_demo_data.py
```

## 4. Ejecutar

```bash
python -m report.run
```

## ✅ Resultado

- Excel generado en `reports/reporte_adn_humano_YYYY-MM-DD.xlsx`
- Email enviado (si está configurado)
- Logs en `report.log`

---

## 📧 Configurar Gmail

1. Ir a: https://myaccount.google.com/security
2. Activar "2-Step Verification"
3. Generar "App Password" para Mail
4. Usar esa contraseña en `config.yaml` (no la contraseña normal)

---

## 📊 Estructura del Excel

1. **RESUMEN GENERAL**: Totales y métricas
2. **VENDIDOS**: Lista completa con origen
3. **RESERVADOS**: Reservas activas con vencimientos
4. **VACANTES**: Asientos disponibles
5. **CANCELACIONES**: Cancelaciones y reembolsos
6. **AUDIT**: Log de acciones automáticas

---

## 🔄 Automatizar

**Windows:**
- Task Scheduler → Nueva tarea
- Acción: `python.exe -m report.run`
- Frecuencia: Diaria

**Linux/Mac:**
```bash
# Agregar a crontab
0 8 * * * cd /ruta/proyecto && python3 -m report.run
```

