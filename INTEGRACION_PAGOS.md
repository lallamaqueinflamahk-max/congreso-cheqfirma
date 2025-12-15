# 💳 Guía de Integración de Pasarelas de Pago Reales

Este documento explica cómo integrar las pasarelas de pago reales en producción.

---

## 🔷 1. Stripe (Recomendado)

### Ventajas
- ✅ Fácil integración
- ✅ Soporte para múltiples monedas
- ✅ Documentación excelente
- ✅ Comisiones competitivas (2.9% + $0.30 USD)
- ✅ Dashboard completo de análisis

### Pasos para Integrar

#### 1. Crear cuenta en Stripe
```
https://stripe.com/
```

#### 2. Obtener API Keys
- Ve a Dashboard > Developers > API Keys
- Copia tu `Publishable key` y `Secret key`

#### 3. Instalar Stripe.js
Agrega en el `<head>` de tu HTML:
```html
<script src="https://js.stripe.com/v3/"></script>
```

#### 4. Inicializar Stripe en JavaScript
```javascript
// En script.js
const stripe = Stripe('tu_publishable_key_aqui');

async function processPaymentWithStripe(amount, planName) {
    try {
        // Crear sesión de pago en el servidor
        const response = await fetch('/create-checkout-session', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                amount: amount * 100, // Stripe usa centavos
                planName: planName,
                userId: currentUser.id
            })
        });
        
        const session = await response.json();
        
        // Redirigir a Stripe Checkout
        const result = await stripe.redirectToCheckout({
            sessionId: session.id
        });
        
        if (result.error) {
            alert(result.error.message);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al procesar el pago');
    }
}
```

#### 5. Backend (Node.js con Express)
```javascript
const express = require('express');
const stripe = require('stripe')('tu_secret_key_aqui');
const app = express();

app.post('/create-checkout-session', async (req, res) => {
    const { amount, planName, userId } = req.body;
    
    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: `Foro Cheq Firma - Plan ${planName}`,
                        description: 'Acceso al evento científico',
                    },
                    unit_amount: amount,
                },
                quantity: 1,
            }],
            mode: 'payment',
            success_url: 'https://tudominio.com/success?session_id={CHECKOUT_SESSION_ID}',
            cancel_url: 'https://tudominio.com/cancel',
            metadata: {
                userId: userId,
                planName: planName
            }
        });
        
        res.json({ id: session.id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Webhook para confirmar pagos
app.post('/webhook', express.raw({type: 'application/json'}), (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;
    
    try {
        event = stripe.webhooks.constructEvent(req.body, sig, 'tu_webhook_secret');
    } catch (err) {
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }
    
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        // Actualizar base de datos con la compra exitosa
        console.log('Pago completado:', session);
    }
    
    res.json({received: true});
});

app.listen(3000, () => console.log('Servidor corriendo en puerto 3000'));
```

---

## 💙 2. PayPal

### Ventajas
- ✅ Reconocimiento mundial
- ✅ Usuarios confían en la marca
- ✅ No necesita tarjeta de crédito
- ✅ Comisiones: 3.4% + tarifa fija

### Pasos para Integrar

#### 1. Crear cuenta PayPal Business
```
https://www.paypal.com/business
```

#### 2. Obtener credenciales
- Ve a Dashboard > Apps & Credentials
- Crea una nueva app REST API
- Copia Client ID y Secret

#### 3. Agregar SDK de PayPal
```html
<script src="https://www.paypal.com/sdk/js?client-id=TU_CLIENT_ID&currency=USD"></script>
```

#### 4. Implementar botón de PayPal
```javascript
// En tu modal de pago, reemplaza el formulario de PayPal con:
function initPayPalButton() {
    paypal.Buttons({
        createOrder: function(data, actions) {
            return actions.order.create({
                purchase_units: [{
                    description: `Foro Cheq Firma - Plan ${selectedPlan}`,
                    amount: {
                        value: selectedPlanPrice.toString()
                    }
                }]
            });
        },
        onApprove: function(data, actions) {
            return actions.order.capture().then(function(details) {
                // Pago exitoso
                console.log('Transacción completada por:', details.payer.name.given_name);
                
                // Guardar compra en base de datos
                fetch('/api/save-purchase', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({
                        userId: currentUser.id,
                        plan: selectedPlan,
                        price: selectedPlanPrice,
                        transactionId: details.id,
                        status: 'completed'
                    })
                }).then(() => {
                    alert('¡Pago completado exitosamente!');
                    closePaymentModal();
                    showDashboard();
                });
            });
        },
        onError: function(err) {
            console.error('Error en el pago:', err);
            alert('Hubo un error al procesar tu pago');
        }
    }).render('#paypal-button-container');
}

// Llamar cuando se muestre el modal de PayPal
initPayPalButton();
```

---

## 🇦🇷 3. Mercado Pago (América Latina)

### Ventajas
- ✅ Muy popular en LATAM
- ✅ Múltiples métodos de pago locales
- ✅ Pagos en cuotas sin tarjeta
- ✅ Comisiones: ~3.99% + $0.99 USD

### Pasos para Integrar

#### 1. Crear cuenta Mercado Pago
```
https://www.mercadopago.com/
```

#### 2. Obtener credenciales
- Ve a Tu negocio > Configuración > Credenciales
- Copia Public Key y Access Token

#### 3. Agregar SDK
```html
<script src="https://sdk.mercadopago.com/js/v2"></script>
```

#### 4. Implementar Checkout
```javascript
const mp = new MercadoPago('TU_PUBLIC_KEY', {
    locale: 'es-PE' // o 'es-AR', 'es-MX', etc.
});

async function createMercadoPagoPayment() {
    try {
        // Crear preferencia en tu backend
        const response = await fetch('/create-preference', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                title: `Foro Cheq Firma - Plan ${selectedPlan}`,
                quantity: 1,
                unit_price: selectedPlanPrice,
                userId: currentUser.id
            })
        });
        
        const preference = await response.json();
        
        // Redirigir al checkout
        mp.checkout({
            preference: {
                id: preference.id
            },
            autoOpen: true
        });
    } catch (error) {
        console.error('Error:', error);
    }
}
```

#### 5. Backend (Node.js)
```javascript
const mercadopago = require('mercadopago');

mercadopago.configure({
    access_token: 'TU_ACCESS_TOKEN'
});

app.post('/create-preference', async (req, res) => {
    const { title, quantity, unit_price, userId } = req.body;
    
    try {
        const preference = {
            items: [{
                title: title,
                quantity: quantity,
                currency_id: 'USD',
                unit_price: unit_price
            }],
            back_urls: {
                success: 'https://tudominio.com/success',
                failure: 'https://tudominio.com/failure',
                pending: 'https://tudominio.com/pending'
            },
            auto_return: 'approved',
            external_reference: userId.toString(),
            notification_url: 'https://tudominio.com/webhook-mp'
        };
        
        const response = await mercadopago.preferences.create(preference);
        res.json({ id: response.body.id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Webhook para notificaciones
app.post('/webhook-mp', async (req, res) => {
    const { type, data } = req.body;
    
    if (type === 'payment') {
        const payment = await mercadopago.payment.findById(data.id);
        
        if (payment.body.status === 'approved') {
            // Actualizar base de datos
            console.log('Pago aprobado:', payment.body);
        }
    }
    
    res.sendStatus(200);
});
```

---

## 🔒 Consideraciones de Seguridad

### 1. HTTPS Obligatorio
```
Todas las pasarelas requieren HTTPS en producción.
Puedes obtener certificado SSL gratis en:
- Let's Encrypt
- Cloudflare
```

### 2. Nunca guardes información de tarjetas
```javascript
// ❌ NUNCA hagas esto:
localStorage.setItem('cardNumber', '1234-5678-9012-3456');

// ✅ CORRECTO: Las pasarelas manejan todo
stripe.createToken(card).then(function(result) {
    // Solo envías el token al servidor
    sendTokenToServer(result.token.id);
});
```

### 3. Validación en el servidor
```javascript
// Siempre valida pagos en el backend
app.post('/verify-payment', async (req, res) => {
    const { paymentId } = req.body;
    
    // Verificar con la API de la pasarela
    const payment = await stripe.paymentIntents.retrieve(paymentId);
    
    if (payment.status === 'succeeded') {
        // Actualizar base de datos
        // Dar acceso al usuario
    }
});
```

---

## 💰 Comparación de Costos

| Pasarela | Comisión Estándar | Mejor Para |
|----------|-------------------|------------|
| **Stripe** | 2.9% + $0.30 | Global, desarrollo fácil |
| **PayPal** | 3.4% + tarifa fija | Clientes que confían en PayPal |
| **Mercado Pago** | ~3.99% + $0.99 | América Latina |

---

## 📊 Recomendación

**Para Foro Cheq Firma, recomiendo:**

1. **Stripe** como pasarela principal
   - Mejor experiencia de desarrollo
   - Excelente documentación
   - Dashboard completo

2. **PayPal** como alternativa
   - Para usuarios sin tarjeta
   - Mayor confianza en la marca

3. **Mercado Pago** si tu audiencia es principalmente de LATAM
   - Métodos de pago locales
   - Pagos en efectivo (Rapipago, PagoFácil)

---

## 🧪 Modo de Prueba

Todas las pasarelas ofrecen modo de prueba:

### Stripe Test Cards
```
Tarjeta exitosa: 4242 4242 4242 4242
Tarjeta declinada: 4000 0000 0000 0002
Requiere 3D Secure: 4000 0027 6000 3184
```

### PayPal Sandbox
```
https://developer.paypal.com/developer/accounts/
Crea cuentas de prueba de comprador y vendedor
```

### Mercado Pago Test
```
Usa las credenciales de test en el dashboard
```

---

## 📞 Soporte

- **Stripe**: https://support.stripe.com/
- **PayPal**: https://www.paypal.com/pe/smarthelp/home
- **Mercado Pago**: https://www.mercadopago.com.pe/ayuda

---

## ✅ Checklist de Implementación

- [ ] Elegir pasarela(s) de pago
- [ ] Crear cuenta business/developer
- [ ] Obtener credenciales (API keys)
- [ ] Implementar SDK en frontend
- [ ] Crear endpoints en backend
- [ ] Configurar webhooks
- [ ] Probar con tarjetas de prueba
- [ ] Implementar manejo de errores
- [ ] Agregar logs de transacciones
- [ ] Configurar HTTPS
- [ ] Probar flujo completo
- [ ] Documentar proceso interno
- [ ] Activar modo producción

---

**Nota**: Este archivo contiene una guía básica. Para implementación completa, consulta la documentación oficial de cada pasarela.

