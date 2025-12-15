# 🎟️ Guía: Sistema de Preventas y Credenciales de Acceso

## 📋 Resumen del Sistema Implementado

Se ha implementado un **sistema completo de preventas online** con descuentos escalonados y **generación automática de credenciales** para acceso al foro durante los 2 días del evento.

---

## 🎯 Características Principales

### 1. ✅ Preventas con Descuentos Escalonados

#### **4 Fases de Descuento:**

| Fase | Período | Descuento | Cupos |
|------|---------|-----------|-------|
| **Fase 1** - Super Early Bird | Hasta 25 Oct | **40% OFF** | Primeros 50 |
| **Fase 2** - Early Bird | 26 Oct - 5 Nov | **30% OFF** | Siguientes 100 |
| **Fase 3** - Preventa Regular | 6 Nov - 10 Nov | **20% OFF** | Hasta 200 |
| **Fase 4** - Última Oportunidad | 11 Nov - 14 Nov | **10% OFF** | Limitados |

#### **Precios con Descuento:**

**Fase 1 Actual (40% OFF):**
- Básico: ~~$12~~ → **$7**
- Premium: ~~$42~~ → **$25**
- VIP: ~~$125~~ → **$75**

### 2. ⏱️ Contador Regresivo en Tiempo Real

- Timer visual con cuenta regresiva
- Actualización automática cada segundo
- Muestra: Días, Horas, Minutos, Segundos
- Genera urgencia para comprar

### 3. 🎫 Sistema de Cupones de Descuento

#### **Cupones Disponibles:**

```
ESTUDIANTE20  → 20% descuento extra para estudiantes
MEDICO15      → 15% descuento extra para médicos
GRUPO25       → 25% descuento extra para grupos (3+)
VUELVE10      → 10% recuperación de carrito abandonado
EARLYBIRD     → 30% descuento especial
```

#### **Cómo Funcionan:**
- Se aplican **SOBRE** el descuento de preventa
- Máximo 60% de descuento total combinado
- Se guardan automáticamente
- Actualizan precios en tiempo real

#### **Ejemplo:**
```
Precio original Premium: $42
Descuento Fase 1:       -40% = $25
Cupón ESTUDIANTE20:     -20% adicional
Precio final:           $17
```

### 4. 🔐 Generación Automática de Credenciales

#### **Al Completar la Compra:**

1. **Se generan automáticamente:**
   - Usuario único: `CF-[UserID]-[Timestamp]`
   - Contraseña segura: 12 caracteres alfanuméricos

2. **Formato de ejemplo:**
   ```
   Usuario:    CF-12345-LK7X9M2
   Contraseña: kRx8mP3nW9qY
   ```

3. **Se muestran inmediatamente:**
   - Modal de confirmación visual
   - Botón para copiar al portapapeles
   - Acceso directo al dashboard

4. **Se envían por email:**
   - Email automático con credenciales
   - Instrucciones de acceso
   - Información del plan comprado

### 5. 🚪 Sistema de Acceso al Foro

#### **Página de Login Dedicada:**
- Sección "Acceder al Foro" en el menú
- Formulario de login con validación
- Mensajes de error claros
- Recuperación de credenciales

#### **Al Ingresar Correctamente:**
- ✅ Acceso al contenido del foro
- ✅ Transmisión en vivo
- ✅ Chat en tiempo real
- ✅ Lista de sesiones del día
- ✅ Controles de video
- ✅ Información del plan activo

#### **Restricciones por Plan:**
- **Básico:** 2-3 charlas seleccionadas
- **Premium:** Todas las sesiones + grabaciones 30 días
- **VIP:** Todo + acceso perpetuo + certificado

---

## 💡 Cómo Probar el Sistema

### Flujo Completo de Compra:

#### **Paso 1: Registrarse**
1. Click en "Iniciar Sesión"
2. Ve a "Registrarse"
3. Completa datos:
   - Nombre: Juan Pérez
   - Email: juan@example.com
   - Contraseña: 12345
   - Profesión: Médico

#### **Paso 2: Ver Preventas**
1. Navega a sección "Preventa"
2. Observa:
   - Countdown timer funcionando
   - 4 fases de descuento
   - Cupos restantes
   - Badges "40% OFF"

#### **Paso 3: Aplicar Cupón (Opcional)**
1. En sección de cupones, ingresa: `MEDICO15`
2. Click "Aplicar"
3. Ver mensaje de éxito
4. Precios actualizados automáticamente

#### **Paso 4: Comprar Plan**
1. Ve a sección "Planes"
2. Nota los precios con descuento aplicado
3. Click "Comprar Ahora" en Premium
4. Elige método de pago (Tarjeta)
5. Datos de prueba:
   ```
   Número: 4242 4242 4242 4242
   Vencimiento: 12/25
   CVV: 123
   Titular: Juan Perez
   ```
6. Click "Pagar Ahora"

#### **Paso 5: Recibir Credenciales**
1. Ver modal de confirmación
2. Copiar credenciales mostradas:
   ```
   Usuario: CF-1234567890-LK7X9M2
   Contraseña: kRx8mP3nW9qY
   ```
3. Revisar consola del navegador (F12) para ver "email enviado"

#### **Paso 6: Acceder al Foro**
1. Click "Acceder al Foro" en el menú
2. Ingresar credenciales recibidas
3. Click "Acceder al Foro"
4. ¡Disfruta del contenido!

---

## 🎨 Diseño Visual

### **Sección de Preventa:**
- ❤️‍🔥 Fondo degradado rojo-naranja llamativo
- ⏰ Countdown timer grande y visible
- 🎯 4 tarjetas de fases con animaciones
- 🎁 Sistema de cupones integrado
- 📊 Contador de cupos restantes

### **Tarjetas de Pricing:**
- 🏷️ Ribbons "40% OFF" en la esquina
- ❌ Precio tachado (antes)
- ✅ Precio actual con descuento
- 🔑 Indicador "Credenciales incluidas"

### **Página de Acceso:**
- 🔒 Icono de seguridad grande
- 📝 Formulario limpio y claro
- ℹ️ Ayuda contextual
- 💬 Mensajes de error amigables

---

## 📧 Email Automático (Simulado)

Cuando un usuario compra, se simula el envío de un email:

```
===================================
FORO CIENTÍFICO CHEQ FIRMA 2025
===================================

¡Gracias por tu compra!

Plan adquirido: PREMIUM

TUS CREDENCIALES DE ACCESO:
Usuario: CF-12345-LK7X9M2
Contraseña: kRx8mP3nW9qY

FECHAS DEL EVENTO: 15-17 Noviembre 2025

Para acceder al foro:
1. Ve a la sección "Acceder al Foro"
2. Ingresa con tus credenciales
3. ¡Disfruta de los 2 días!

¿Problemas? info@cheqfirma.com
===================================
```

**Nota:** En producción, esto debe integrarse con:
- SendGrid
- Mailgun
- Amazon SES
- SMTP configurado

---

## 💾 Estructura de Datos

### **Compra guardada en localStorage:**

```javascript
{
    id: 1699999999999,
    userId: 12345,
    plan: "premium",
    price: 25,
    date: "2024-10-20T15:30:00.000Z",
    status: "completed",
    credentials: {
        username: "CF-12345-LK7X9M2",
        password: "kRx8mP3nW9qY"
    },
    discount: 55  // 40% preventa + 15% cupón
}
```

### **Sesión del foro:**

```javascript
{
    username: "CF-12345-LK7X9M2",
    plan: "premium",
    userId: 12345,
    loginTime: "2025-11-15T09:00:00.000Z"
}
```

---

## 🔒 Seguridad Implementada

### **Validación de Credenciales:**
- ✅ Usuario y contraseña requeridos
- ✅ Validación contra compras registradas
- ✅ Mensajes de error sin revelar información
- ✅ Sesión persistente con localStorage

### **Contraseñas:**
- ✅ 12 caracteres
- ✅ Letras mayúsculas y minúsculas
- ✅ Números
- ✅ Caracteres especiales opcionales
- ✅ Evita caracteres confusos (0/O, 1/l/I)

**Nota:** En producción:
- Usar hash bcrypt para contraseñas
- JWT tokens para sesiones
- HTTPS obligatorio
- Backend para validación real

---

## 📊 Métricas y Reportes

### **Información Disponible:**

```javascript
// Ver todas las compras
localStorage.getItem('purchases')

// Ver usuarios registrados
localStorage.getItem('users')

// Ver cupones aplicados
localStorage.getItem('appliedCoupon')

// Ver sesión activa del foro
localStorage.getItem('forumSession')
```

### **Estadísticas en Consola:**

```javascript
// Abrir consola del navegador (F12) y ejecutar:

// Total de ventas por plan
const purchases = JSON.parse(localStorage.getItem('purchases'));
const byPlan = purchases.reduce((acc, p) => {
    acc[p.plan] = (acc[p.plan] || 0) + 1;
    return acc;
}, {});
console.log('Ventas por plan:', byPlan);

// Ingresos totales
const totalRevenue = purchases.reduce((sum, p) => sum + p.price, 0);
console.log('Ingresos totales: $', totalRevenue);

// Descuentos promedio
const avgDiscount = purchases.reduce((sum, p) => sum + p.discount, 0) / purchases.length;
console.log('Descuento promedio:', avgDiscount.toFixed(1), '%');
```

---

## 🚀 Para Implementar en Producción

### **1. Backend (Node.js + Express)**

```javascript
// server.js
const express = require('express');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');

app.post('/api/create-purchase', async (req, res) => {
    // Generar credenciales
    const credentials = {
        username: `CF-${userId}-${Date.now().toString(36)}`,
        password: generatePassword(12)
    };
    
    // Hash de contraseña
    const hashedPassword = await bcrypt.hash(credentials.password, 10);
    
    // Guardar en base de datos
    await db.purchases.create({
        userId,
        plan,
        price,
        credentials: {
            username: credentials.username,
            password: hashedPassword
        }
    });
    
    // Enviar email
    await sendCredentialsEmail(user.email, credentials, plan);
    
    res.json({ success: true, credentials });
});
```

### **2. Base de Datos (MySQL/PostgreSQL)**

```sql
CREATE TABLE purchases (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    plan VARCHAR(20) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    discount INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE forum_sessions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL,
    login_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_address VARCHAR(45),
    FOREIGN KEY (username) REFERENCES purchases(username)
);
```

### **3. Integración de Email (SendGrid)**

```javascript
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function sendCredentialsEmail(to, credentials, plan) {
    const msg = {
        to: to,
        from: 'noreply@cheqfirma.com',
        subject: 'Tus Credenciales - Foro Cheq Firma 2025',
        templateId: 'd-xxxxxxxxxxxxx',
        dynamic_template_data: {
            username: credentials.username,
            password: credentials.password,
            plan: plan,
            eventDates: '15-17 Noviembre 2025'
        }
    };
    
    await sgMail.send(msg);
}
```

---

## ✅ Checklist de Funcionalidades

- [x] Sección de preventas con 4 fases
- [x] Countdown timer en tiempo real
- [x] Sistema de cupones de descuento
- [x] Actualización automática de precios
- [x] Generación de credenciales únicas
- [x] Modal de confirmación con credenciales
- [x] Botón copiar credenciales
- [x] Email simulado con credenciales
- [x] Página de acceso al foro
- [x] Validación de login
- [x] Sesión persistente
- [x] Contenido del foro con restricciones
- [x] Contador de cupos restantes
- [x] Badges de descuento en tarjetas
- [x] Diseño responsive
- [x] Animaciones y transiciones

---

## 🎉 Beneficios del Sistema

### **Para los Organizadores:**
✅ Mayor conversión con urgencia (countdown)
✅ Segmentación con cupones especiales
✅ Control total de accesos
✅ Métricas de ventas en tiempo real
✅ Gestión automática de credenciales
✅ Reducción de soporte (email automático)

### **Para los Compradores:**
✅ Descuentos atractivos (hasta 60%)
✅ Proceso de compra rápido y seguro
✅ Credenciales recibidas inmediatamente
✅ Acceso garantizado para los 2 días
✅ Múltiples métodos de pago
✅ Soporte y recuperación de acceso

---

## 📞 Soporte y Ayuda

**¿Problemas con las credenciales?**
- Revisar email (incluye spam/promociones)
- Contactar: info@cheqfirma.com
- WhatsApp: +51 999 999 999

**¿Cupón no funciona?**
- Verificar que esté bien escrito (mayúsculas)
- Revisar términos y condiciones
- Contactar soporte

---

**Sistema desarrollado con ❤️ para el Foro Científico Cheq Firma 2025**

