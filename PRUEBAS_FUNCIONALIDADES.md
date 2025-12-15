# ✅ CHECKLIST DE PRUEBAS - CONGRESO CHEQFIRMA

## 🎯 FUNCIONES PRINCIPALES A PROBAR

### 1. NAVEGACIÓN Y MENÚ
- [ ] Menú hamburguesa (móvil) se abre/cierra correctamente
- [ ] Todos los enlaces del menú navegan correctamente:
  - [ ] Inicio → #inicio
  - [ ] Expositores → #expositores
  - [ ] Agenda → #agenda
  - [ ] Contenido → #contenido
  - [ ] Planes → #planes
  - [ ] Sponsors → #auspicios
  - [ ] Prensa → #prensa
  - [ ] Acceder al Foro → #acceso-foro
- [ ] Scroll suave funciona en todos los enlaces
- [ ] Header sticky se mantiene visible al hacer scroll

### 2. HERO SECTION
- [ ] Contador regresivo muestra días, horas y minutos correctamente
- [ ] Contador se actualiza cada segundo
- [ ] Botón "Reservar mi lugar ahora" abre modal de selección de asientos
- [ ] Botón "Ver agenda completa" navega a sección agenda
- [ ] Badge "DECLARADO DE INTERÉS NACIONAL" es visible
- [ ] Social proof (personas viendo, reservas recientes) se muestra

### 3. SELECCIÓN DE ASIENTOS
- [ ] Modal de selección de asientos se abre correctamente
- [ ] Mapa de asientos se muestra con 100 asientos
- [ ] Asientos disponibles (verdes) son clickeables
- [ ] Asientos reservados (amarillos) muestran tooltip
- [ ] Asientos vendidos (rojos) no son clickeables
- [ ] Al seleccionar un asiento, se muestra información del precio
- [ ] Botón "Continuar" avanza al paso 2
- [ ] Botón "Cerrar" cierra el modal correctamente

### 4. MÉTODOS DE PAGO
- [ ] Paso 2 muestra 4 métodos de pago:
  - [ ] Transferencia Bancaria
  - [ ] PayPal
  - [ ] Western Union
  - [ ] MoneyGram
- [ ] Al seleccionar un método, se muestran los detalles
- [ ] Botón "Continuar" avanza al paso 3
- [ ] Botón "Volver" regresa al paso 1

### 5. FORMULARIO DE RESERVA
- [ ] Paso 3 muestra formulario con campos:
  - [ ] Nombre completo (requerido)
  - [ ] Teléfono/WhatsApp (requerido)
  - [ ] Correo electrónico (requerido)
  - [ ] Subir comprobante de pago (requerido)
- [ ] Validación de campos funciona:
  - [ ] Email debe tener formato válido
  - [ ] Teléfono acepta formato internacional
  - [ ] Archivo debe ser imagen o PDF
  - [ ] Tamaño máximo de archivo se valida
- [ ] Drag & drop de archivo funciona
- [ ] Vista previa del archivo se muestra
- [ ] Botón "Confirmar Reserva" procesa la reserva
- [ ] Mensaje de confirmación se muestra

### 6. PAGOS DESDE PLANES
- [ ] Botones "Pagar con PayPal" abren modal de PayPal
- [ ] Botones "Transferencia Bancaria" abren modal de transferencia
- [ ] Modales muestran información correcta del plan
- [ ] Formularios de pago funcionan correctamente
- [ ] Confirmación de pago se guarda en localStorage

### 7. EXPOSITORES
- [ ] Todas las tarjetas de expositores son clickeables
- [ ] Al hacer clic, se abre modal con biografía completa
- [ ] Modal muestra foto, especialidad, tema y biografía
- [ ] Botón "Cerrar" cierra el modal
- [ ] 13 expositores están visibles (incluyendo Dra. Yolanda Ramírez)

### 8. AGENDA
- [ ] Filtros de día (Día 1 / Día 2) funcionan
- [ ] Al cambiar de día, se muestra la agenda correspondiente
- [ ] Todos los horarios y ponentes son correctos
- [ ] Fotos de expositores en agenda se muestran

### 9. FAQ (Preguntas Frecuentes)
- [ ] Todas las preguntas son clickeables
- [ ] Al hacer clic, se expande/contrae la respuesta
- [ ] Icono cambia (chevron) al expandir/contraer
- [ ] Múltiples preguntas pueden estar abiertas simultáneamente

### 10. RECONOCIMIENTO DEL SENADO
- [ ] Badge en hero section es visible
- [ ] Sección completa del Senado se muestra después del hero
- [ ] Badge en sección de precios es visible
- [ ] Todos los elementos tienen animaciones suaves

### 11. CONTADOR REGRESIVO
- [ ] Muestra días, horas y minutos correctamente
- [ ] Se actualiza cada segundo
- [ ] Calcula correctamente hasta el 19 de diciembre 2025
- [ ] Funciona en diferentes zonas horarias

### 12. RESPONSIVE (MÓVIL)
- [ ] Menú hamburguesa funciona en móvil
- [ ] Todos los modales se adaptan a pantalla pequeña
- [ ] Formularios son usables en móvil
- [ ] Botones tienen tamaño adecuado para touch
- [ ] Texto es legible en móvil

### 13. LOCALSTORAGE
- [ ] Reservas se guardan en localStorage
- [ ] Asientos vendidos se persisten al recargar
- [ ] Datos de usuario se guardan correctamente

### 14. WHATSAPP
- [ ] Botones de WhatsApp abren chat correctamente
- [ ] Mensaje pre-llenado incluye información del evento
- [ ] Número de teléfono es correcto

### 15. ENLACES EXTERNOS
- [ ] Enlaces a PayPal funcionan
- [ ] Enlaces a YouTube funcionan
- [ ] Enlaces a World Council For Health funcionan
- [ ] Todos abren en nueva pestaña

## 🐛 ERRORES CONOCIDOS A VERIFICAR
- [ ] No hay errores en consola del navegador
- [ ] Todas las imágenes cargan correctamente
- [ ] No hay funciones undefined
- [ ] No hay referencias a elementos inexistentes

## 📱 PRUEBAS EN DIFERENTES NAVEGADORES
- [ ] Chrome/Edge
- [ ] Firefox
- [ ] Safari (si es posible)
- [ ] Navegador móvil

## ⚡ RENDIMIENTO
- [ ] Página carga en menos de 3 segundos
- [ ] Animaciones son fluidas (60fps)
- [ ] No hay lag al hacer scroll
- [ ] Modales se abren sin delay

