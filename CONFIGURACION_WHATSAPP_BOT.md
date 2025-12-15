# 📱 CONFIGURACIÓN DEL BOT DE WHATSAPP

## 🎯 OPCIONES DEL BOT

El bot de WhatsApp tiene dos opciones principales:

### 🔹 Opción 1: Comprar entrada
### 🔹 Opción 2: Más información

---

## 💬 MENSAJE AUTOMÁTICO INICIAL

Cuando un usuario hace clic en cualquier botón de WhatsApp, se abre con este mensaje:

```
👋 Hola, gracias por tu interés en el Congreso ADN Humano – Paraguay

Elegí una opción para continuar:

🔹 Comprar entrada
🔹 Más información
```

---

## 📋 RESPUESTAS AUTOMÁTICAS POR OPCIÓN

### 🔹 OPCIÓN 1: "Comprar entrada"

**Mensaje que se envía:**
```
Quiero comprar mi entrada para el Congreso ADN Humano (19 y 20 de diciembre).
```

**Cómo se activa:**
- Al hacer clic en el botón "COMPRAR ENTRADA" desde la página
- O cuando el usuario escribe "comprar" o "buy" en el código

---

### 🔹 OPCIÓN 2: "Más información"

**Mensaje que se envía:**
```
Quiero recibir más información sobre el Congreso ADN Humano.
```

**Cómo se activa:**
- Al hacer clic en el botón "Más información por WhatsApp"
- O cuando el usuario escribe "info", "informacion", "más información" o "mas informacion"

---

## 🔧 IMPLEMENTACIÓN TÉCNICA

### Función JavaScript:

```javascript
function openWhatsAppOfficial(option) {
    const whatsappNumber = '5493536564940';
    let message = '';
    
    // Mensaje inicial automático
    if (!option || option === 'initial') {
        message = `👋 Hola, gracias por tu interés en el Congreso ADN Humano – Paraguay

Elegí una opción para continuar:

🔹 Comprar entrada
🔹 Más información`;
    }
    // Opción: Comprar entrada
    else if (option === 'comprar' || option === 'buy') {
        message = `Quiero comprar mi entrada para el Congreso ADN Humano (19 y 20 de diciembre).`;
    }
    // Opción: Más información
    else if (option === 'info' || option === 'informacion' || option === 'más información' || option === 'mas informacion') {
        message = `Quiero recibir más información sobre el Congreso ADN Humano.`;
    }
    // Mensaje personalizado (mantener compatibilidad)
    else {
        message = option;
    }
    
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
}
```

### Botones en la página:

1. **Botón "COMPRAR ENTRADA AHORA"** (Hero section):
   ```html
   onclick="openSeatSelection()"
   ```
   - Abre el modal de selección de asientos directamente

2. **Botón "Más información por WhatsApp"**:
   ```html
   onclick="openWhatsAppOfficial('info')"
   ```
   - Abre WhatsApp con el mensaje de "Más información"

3. **Burbuja flotante de WhatsApp**:
   ```html
   onclick="openWhatsAppOfficial('initial')"
   ```
   - Abre WhatsApp con el mensaje inicial con opciones

---

## 📝 CONFIGURACIÓN EN WHATSAPP BUSINESS

Para que el bot funcione completamente, necesitas configurar respuestas automáticas en WhatsApp Business:

### 1. Mensaje de Ausencia (Fuera de horario):
```
Hola! 👋

Gracias por contactarnos. Estamos fuera de horario, pero te responderemos pronto.

Mientras tanto, puedes:
• Visitar nuestra página: cheqfirma.com
• Ver más información sobre el evento

¡Te esperamos en el Congreso ADN Humano! 🧬
```

### 2. Respuesta Rápida para "Comprar entrada":
```
¡Perfecto! 🎫

Para comprar tu entrada:

1️⃣ Visita: cheqfirma.com
2️⃣ Haz clic en "COMPRAR ENTRADA AHORA"
3️⃣ Selecciona tu asiento
4️⃣ Completa tus datos
5️⃣ Realiza el pago

¿Necesitas ayuda con algún paso? 😊
```

### 3. Respuesta Rápida para "Más información":
```
📋 INFORMACIÓN DEL CONGRESO:

📅 Fecha: 19 y 20 de Diciembre 2025
📍 Lugar: Asunción, Paraguay
👥 13 Expertos Internacionales
💰 Desde 90.000 Gs (40% OFF)

¿Qué te gustaría saber específicamente?
• Información sobre el evento
• Precios y formas de pago
• Agenda completa
• Ubicación y cómo llegar
```

---

## ✅ CHECKLIST DE CONFIGURACIÓN

- [x] Función JavaScript implementada
- [x] Botones actualizados en la página
- [x] Mensaje inicial configurado
- [x] Opción "Comprar entrada" configurada
- [x] Opción "Más información" configurada
- [ ] Respuestas automáticas configuradas en WhatsApp Business
- [ ] Mensaje de ausencia configurado
- [ ] Respuestas rápidas configuradas

---

**Última actualización:** $(Get-Date -Format "yyyy-MM-dd HH:mm")





