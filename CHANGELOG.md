# Changelog

## [1.0.0] - 2025-12-13

### Agregado
- Sistema completo de gestión de asientos
- Estados: VENDIDO, RESERVADO, VACANTE
- Origen de venta: WHATSAPP_CALIENTE, VIRTUAL_FRIO
- Reglas de negocio:
  - Vencimiento automático de reservas (24h sin pago)
  - Confirmación con pago total o seña 50%
  - Reembolsos (máximo 50%)
- Fuentes de datos: PostgreSQL y CSV
- Reporte Excel con 6 hojas
- Email automático por Gmail SMTP
- Métricas separadas por origen de venta
- Tests básicos
- Scripts de demostración

### Características
- Procesamiento diario automático
- Liberación automática de reservas vencidas
- Alertas automáticas (reservas vencidas, riesgos, baja ocupación)
- Logs detallados
- Configuración flexible por YAML

