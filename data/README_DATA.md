# Documentación de Archivos de Datos

Esta carpeta contiene los archivos Excel y CSV para cargar datos de ventas y reservas del Congreso ADN Humano.

## 📁 Archivos Disponibles

### 1. Ventas Virtuales
- **Excel**: `ventas_virtuales.xlsx`
- **CSV**: `ventas_virtuales.csv`
- **Categoría fija**: `virtual`
- **ID formato**: `VIRT-000001`, `VIRT-000002`, etc.

### 2. Ventas Físicas
- **Excel**: `ventas_fisicas.xlsx`
- **CSV**: `ventas_fisicas.csv`
- **Categoría fija**: `fisica`
- **ID formato**: `FIS-000001`, `FIS-000002`, etc.

### 3. Reservas de Asientos
- **Excel**: `reservas_asientos.xlsx`
- **CSV**: `reservas_asientos.csv`
- **Categoría fija**: `reserva`
- **ID formato**: `RES-000001`, `RES-000002`, etc.

## 📋 Estructura de Archivos

Todos los archivos Excel tienen una hoja llamada **"datos"** con los encabezados en la fila 1.

## 📊 Columnas y Valores Permitidos

### ventas_virtuales.xlsx / ventas_virtuales.csv

| Columna | Tipo | Valores Permitidos / Formato | Requerido |
|---------|------|------------------------------|-----------|
| `id` | Texto | VIRT-000001, VIRT-000002, ... | Sí |
| `categoria` | Texto | `virtual` (fijo) | Sí |
| `fecha` | Fecha | YYYY-MM-DD (ej: 2025-12-15) | Sí |
| `canal_venta_virtual` | Texto | `live_event` \| `post_transmision` | Sí |
| `medio_pago` | Texto | `transferencia_bancaria` \| `paypal` \| `efectivo` \| `otro` | Sí |
| `pago_tipo` | Texto | `pago_live_event` \| `pago_post_transmicion` | Sí |
| `precio_unitario` | Número | Valor numérico (ej: 150000) | Sí |
| `precio_promocional_preventa_40off` | Número | Valor numérico (ej: 90000) | No |
| `precio_venta` | Número | Valor numérico (ej: 150000) | Sí |
| `cantidad` | Número | Valor numérico entero (ej: 1) | Sí |
| `total` | Número | Valor numérico (ej: 150000) | Sí |
| `vendedor_o_referido` | Texto | Nombre del vendedor o referido | No |
| `comprador_email` | Texto | Email válido (ej: comprador@email.com) | No |
| `comprador_whatsapp` | Texto | Número de WhatsApp (ej: +595981234567) | No |
| `estado` | Texto | `pendiente` \| `pagado` \| `cancelado` \| `devuelto` | Sí |
| `notas` | Texto | Notas adicionales | No |

**Ejemplo de registro:**
```
VIRT-000001,virtual,2025-12-15,live_event,transferencia_bancaria,pago_live_event,150000,90000,150000,1,150000,Juan Perez,juan@email.com,+595981234567,pagado,Cliente referido por Maria
```

### ventas_fisicas.xlsx / ventas_fisicas.csv

| Columna | Tipo | Valores Permitidos / Formato | Requerido |
|---------|------|------------------------------|-----------|
| `id` | Texto | FIS-000001, FIS-000002, ... | Sí |
| `categoria` | Texto | `fisica` (fijo) | Sí |
| `fecha` | Fecha | YYYY-MM-DD (ej: 2025-12-15) | Sí |
| `canal_venta_p2p` | Texto | `p2p` (fijo) | Sí |
| `medio_pago` | Texto | `transferencia_bancaria` \| `paypal` \| `efectivo` \| `otro` | Sí |
| `precio_unitario` | Número | Valor numérico (ej: 150000) | Sí |
| `precio_promocional_preventa_40off` | Número | Valor numérico (ej: 90000) | No |
| `precio_venta` | Número | Valor numérico (ej: 150000) | Sí |
| `cantidad` | Número | Valor numérico entero (ej: 1) | Sí |
| `total` | Número | Valor numérico (ej: 150000) | Sí |
| `vendedor_o_referido` | Texto | Nombre del vendedor o referido | No |
| `comprador_email` | Texto | Email válido (ej: comprador@email.com) | No |
| `comprador_whatsapp` | Texto | Número de WhatsApp (ej: +595981234567) | No |
| `asiento_fisico_numero` | Número | Número de asiento (ej: 1, 2, 3, ...) | Sí |
| `asiento_estado` | Texto | `reservado` \| `vacante` \| `comprado` | Sí |
| `estado_pago` | Texto | `pendiente` \| `pagado` \| `cancelado` \| `devuelto` | Sí |
| `notas` | Texto | Notas adicionales | No |

**Ejemplo de registro:**
```
FIS-000001,fisica,2025-12-15,p2p,transferencia_bancaria,150000,90000,150000,1,150000,Maria Garcia,maria@email.com,+595981234568,25,comprado,pagado,Asiento confirmado
```

### reservas_asientos.xlsx / reservas_asientos.csv

| Columna | Tipo | Valores Permitidos / Formato | Requerido |
|---------|------|------------------------------|-----------|
| `id` | Texto | RES-000001, RES-000002, ... | Sí |
| `categoria` | Texto | `reserva` (fijo) | Sí |
| `fecha` | Fecha | YYYY-MM-DD (ej: 2025-12-15) | Sí |
| `vendedor_o_referido` | Texto | Nombre del vendedor o referido | No |
| `comprador_email` | Texto | Email válido (ej: comprador@email.com) | No |
| `comprador_whatsapp` | Texto | Número de WhatsApp (ej: +595981234567) | No |
| `asiento_fisico_numero` | Número | Número de asiento (ej: 1, 2, 3, ...) | Sí |
| `asiento_estado` | Texto | `reservado` \| `vacante` \| `comprado` | Sí |
| `monto_reserva` | Número | Valor numérico (ej: 75000) | Sí |
| `medio_pago` | Texto | `transferencia_bancaria` \| `paypal` \| `efectivo` \| `otro` | Sí |
| `estado_pago` | Texto | `pendiente` \| `pagado` \| `cancelado` | Sí |
| `observaciones` | Texto | Observaciones adicionales | No |

**Ejemplo de registro:**
```
RES-000001,reserva,2025-12-15,Pedro Lopez,pedro@email.com,+595981234569,30,reservado,75000,transferencia_bancaria,pagado,Seña del 50% pagada
```

## 🔢 Formato de IDs

Los IDs son correlativos por categoría (no globales):

- **Ventas Virtuales**: `VIRT-000001`, `VIRT-000002`, `VIRT-000003`, ...
- **Ventas Físicas**: `FIS-000001`, `FIS-000002`, `FIS-000003`, ...
- **Reservas**: `RES-000001`, `RES-000002`, `RES-000003`, ...

## 📅 Formato de Fechas

Todas las fechas deben estar en formato **YYYY-MM-DD** (ISO 8601):
- ✅ Correcto: `2025-12-15`
- ❌ Incorrecto: `15/12/2025`, `12-15-2025`, `15 de diciembre de 2025`

## 💰 Campos Numéricos

Los siguientes campos deben ser números (no texto):
- `precio_unitario`
- `precio_promocional_preventa_40off`
- `precio_venta`
- `cantidad`
- `total`
- `monto_reserva`
- `asiento_fisico_numero`

**Ejemplo:**
- ✅ Correcto: `150000`
- ❌ Incorrecto: `"150000"`, `Gs 150000`, `150.000`

## 📝 Notas Importantes

1. **Encabezados exactos**: Los encabezados deben escribirse exactamente como se muestran (sin tildes, sin espacios extra).

2. **Hoja "datos"**: En los archivos Excel, todos los datos deben estar en la hoja llamada **"datos"**.

3. **Categoría fija**: La columna `categoria` debe tener el valor fijo según el archivo:
   - `ventas_virtuales.*`: siempre `virtual`
   - `ventas_fisicas.*`: siempre `fisica`
   - `reservas_asientos.*`: siempre `reserva`

4. **Sin datos de ejemplo**: Los archivos vienen vacíos (solo con encabezados) listos para cargar datos.

5. **Consistencia**: Mantener consistencia entre Excel y CSV si se usan ambos formatos.

## 🔄 Uso

### Cargar datos en Excel:
1. Abrir el archivo `.xlsx`
2. Ir a la hoja "datos"
3. Comenzar a llenar desde la fila 2 (la fila 1 son los encabezados)
4. Guardar el archivo

### Cargar datos en CSV:
1. Abrir el archivo `.csv` con Excel o un editor de texto
2. Agregar filas con datos separados por comas
3. Guardar el archivo

### Importar desde otro sistema:
Los archivos CSV pueden ser importados directamente desde sistemas que soporten CSV (bases de datos, hojas de cálculo, etc.).

## ⚠️ Validaciones Recomendadas

Antes de cargar datos, verificar:

- [ ] IDs únicos y en formato correcto
- [ ] Fechas en formato YYYY-MM-DD
- [ ] Valores numéricos sin formato de texto
- [ ] Valores de campos con opciones limitadas (estado, medio_pago, etc.) coinciden con los permitidos
- [ ] Categoría correcta según el archivo
- [ ] Asientos físicos no duplicados en reservas y ventas físicas

## 📞 Soporte

Para dudas sobre la estructura de datos o valores permitidos, consultar esta documentación o contactar al equipo de desarrollo.

