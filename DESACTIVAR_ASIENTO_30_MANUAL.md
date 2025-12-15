# 🔧 CÓMO DESACTIVAR MANUALMENTE EL ASIENTO 30 DESDE LA CONSOLA

## 📋 PASOS DETALLADOS

### 1️⃣ **ABRIR LA CONSOLA DEL NAVEGADOR**

#### **Método 1: Teclado (Más Rápido)**
- Presiona **`F12`** en tu teclado
- O presiona **`Ctrl + Shift + I`** (Windows/Linux)
- O presiona **`Cmd + Option + I`** (Mac)

#### **Método 2: Menú del Navegador**
- **Chrome/Edge:** Menú (⋮) → **Más herramientas** → **Herramientas para desarrolladores**
- **Firefox:** Menú (☰) → **Más herramientas** → **Herramientas de desarrollo web**
- **Safari:** **Desarrollar** → **Mostrar consola JavaScript** (primero activa el menú Desarrollar en Preferencias)

---

### 2️⃣ **UBICAR LA PESTAÑA "CONSOLE" O "CONSOLA"**

Una vez abiertas las herramientas de desarrollador:
1. Busca la pestaña que dice **"Console"** o **"Consola"**
2. Haz clic en esa pestaña
3. Verás un área de texto donde puedes escribir código

---

### 3️⃣ **COPIAR Y PEGAR ESTE CÓDIGO**

Copia TODO este código y pégalo en la consola, luego presiona **Enter**:

```javascript
// ============================================
// DESACTIVAR COMPLETAMENTE EL ASIENTO 30
// ============================================

// 1. Bloquear alert
const originalAlert = window.alert;
window.alert = function(message) {
    if (typeof message === 'string' && (
        message.includes('Asiento 30') || 
        message.includes('asiento 30') ||
        message.includes('Alicio Rodríguez') ||
        message.includes('Alicio Rodriguez') ||
        message.includes('alicio.osmar@gmail.com') ||
        message.includes('3861536') ||
        message.includes('992448789') ||
        message.includes('marcado como VENDIDO para Alicio')
    )) {
        console.log('🚫 Alert bloqueado:', message);
        return; // No mostrar el alert
    }
    return originalAlert.apply(this, arguments);
};

// 2. Eliminar función si existe
if (typeof window.procesarAsiento30Alicio !== 'undefined') {
    delete window.procesarAsiento30Alicio;
    console.log('✅ Función procesarAsiento30Alicio eliminada');
}

// 3. Bloquear cualquier intento de definir la función
Object.defineProperty(window, 'procesarAsiento30Alicio', {
    set: function(value) {
        console.log('🚫 Intento de definir procesarAsiento30Alicio bloqueado');
    },
    get: function() {
        return undefined;
    },
    configurable: true
});

// 4. Eliminar datos del localStorage
try {
    localStorage.removeItem('report_30');
    localStorage.removeItem('email_report_30');
    localStorage.removeItem('seat_30');
    
    const seatsData = JSON.parse(localStorage.getItem('seatsData') || '{}');
    if (seatsData[30]) {
        delete seatsData[30];
        localStorage.setItem('seatsData', JSON.stringify(seatsData));
    }
    console.log('✅ Datos del asiento 30 eliminados del localStorage');
} catch(e) {
    console.warn('Error al limpiar datos:', e);
}

// 5. Interceptar markSeatAsSoldFromExternalPayment
if (typeof window.markSeatAsSoldFromExternalPayment === 'function') {
    const originalMarkSeat = window.markSeatAsSoldFromExternalPayment;
    window.markSeatAsSoldFromExternalPayment = function(seatNumber, customerName, customerPhone, customerEmail, paymentMethod) {
        if (seatNumber === 30 || seatNumber === '30' || 
            (customerName && customerName.includes('Alicio'))) {
            console.log('🚫 Intento de marcar asiento 30 bloqueado');
            return false;
        }
        return originalMarkSeat.apply(this, arguments);
    };
    console.log('✅ markSeatAsSoldFromExternalPayment protegido');
}

// 6. Interceptar sendPresentialSeatReport
if (typeof window.sendPresentialSeatReport === 'function') {
    const originalSendReport = window.sendPresentialSeatReport;
    window.sendPresentialSeatReport = function(seatData) {
        if (seatData && (
            seatData.seatNumber === 30 || 
            seatData.seatNumber === '30' ||
            (seatData.customer && (
                (seatData.customer.name && seatData.customer.name.includes('Alicio')) ||
                (seatData.customer.email && seatData.customer.email.includes('alicio.osmar'))
            ))
        )) {
            console.log('🚫 Intento de procesar asiento 30 bloqueado');
            return {
                report: '',
                whatsappUrl: '',
                emailUrl: '',
                whatsappMessage: ''
            };
        }
        return originalSendReport.apply(this, arguments);
    };
    console.log('✅ sendPresentialSeatReport protegido');
}

console.log('✅✅✅ ASIENTO 30 COMPLETAMENTE DESACTIVADO ✅✅✅');
```

---

### 4️⃣ **VERIFICAR QUE FUNCIONÓ**

Después de pegar el código, deberías ver en la consola:

```
✅ Función procesarAsiento30Alicio eliminada
✅ Datos del asiento 30 eliminados del localStorage
✅ markSeatAsSoldFromExternalPayment protegido
✅ sendPresentialSeatReport protegido
✅✅✅ ASIENTO 30 COMPLETAMENTE DESACTIVADO ✅✅✅
```

---

### 5️⃣ **RECARGAR LA PÁGINA**

Después de ejecutar el código:
1. Presiona **`Ctrl + R`** (Windows) o **`Cmd + R`** (Mac) para recargar
2. El alert del asiento 30 **NO debería aparecer**

---

## 🎯 **CÓDIGO RÁPIDO (Versión Corta)**

Si quieres algo más rápido, copia y pega esto:

```javascript
// Bloquear alert del asiento 30
window.alert = function(m) { if (typeof m === 'string' && (m.includes('Asiento 30') || m.includes('Alicio'))) { console.log('🚫 Bloqueado:', m); return; } return alert.apply(this, arguments); };
localStorage.removeItem('report_30'); localStorage.removeItem('email_report_30'); localStorage.removeItem('seat_30');
if (window.procesarAsiento30Alicio) delete window.procesarAsiento30Alicio;
console.log('✅ Asiento 30 desactivado');
```

---

## 📸 **UBICACIÓN VISUAL**

```
┌─────────────────────────────────────────┐
│  Navegador (Chrome/Edge/Firefox)       │
├─────────────────────────────────────────┤
│  [Pestañas] [URL] [Favoritos]          │
├─────────────────────────────────────────┤
│                                         │
│  ┌─────────────────────────────────┐   │
│  │  Elements | Console | Network   │   │ ← Pestañas de DevTools
│  ├─────────────────────────────────┤   │
│  │  > [Aquí pegas el código]      │   │ ← Área de la consola
│  │                                 │   │
│  │  ✅ Resultados aparecen aquí    │   │
│  │                                 │   │
│  └─────────────────────────────────┘   │
│                                         │
└─────────────────────────────────────────┘
```

---

## ⚠️ **IMPORTANTE**

- Este código solo funciona **mientras la pestaña está abierta**
- Si cierras y abres la pestaña de nuevo, necesitas ejecutar el código otra vez
- Para una solución permanente, el código ya está en el archivo `index.html`

---

## 🔄 **SI EL ALERT SIGUE APARECIENDO**

1. Ejecuta el código de nuevo
2. Recarga la página con **`Ctrl + Shift + R`** (recarga forzada)
3. Cierra todas las pestañas y abre una nueva
4. Usa modo incógnito para probar





