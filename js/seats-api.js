// Helper centralizado para comunicación con backend de asientos
// Reemplaza localStorage y elimina pop-ups

const API_BASE = '/.netlify/functions';

/**
 * Obtener todos los asientos desde backend
 */
async function getAllSeatsFromBackend() {
  try {
    const response = await fetch(`${API_BASE}/getSeats`);
    if (!response.ok) throw new Error('Error obteniendo asientos');
    return await response.json();
  } catch (error) {
    console.error('Error obteniendo asientos:', error);
    // Fallback: retornar array vacío en lugar de alert
    return [];
  }
}

/**
 * Obtener un asiento específico
 */
async function getSeatFromBackend(seatNumber) {
  try {
    const response = await fetch(`${API_BASE}/getSeats?seatNumber=${seatNumber}`);
    if (!response.ok) throw new Error('Error obteniendo asiento');
    return await response.json();
  } catch (error) {
    console.error('Error obteniendo asiento:', error);
    return null;
  }
}

/**
 * Confirmar compra/reserva (reemplaza alert() y pop-ups)
 */
async function confirmPurchase(seatData) {
  try {
    const response = await fetch(`${API_BASE}/confirmPurchase`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(seatData)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Error confirmando compra');
    }

    const result = await response.json();
    
    // Actualizar UI silenciosamente (sin alerts)
    if (typeof updateSeatColors === 'function') {
      updateSeatColors();
    }
    if (typeof updateSeatCounter === 'function') {
      updateSeatCounter();
    }

    return result;
  } catch (error) {
    console.error('Error confirmando compra:', error);
    // Mostrar notificación no bloqueante en lugar de alert
    showNotification('error', error.message);
    throw error;
  }
}

/**
 * Mostrar notificación no bloqueante (reemplaza alert)
 */
function showNotification(type, message) {
  // Crear elemento de notificación
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 1rem 1.5rem;
    background: ${type === 'error' ? '#EF4444' : '#10B981'};
    color: white;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    z-index: 10000;
    max-width: 400px;
    animation: slideIn 0.3s ease;
  `;
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  // Remover después de 5 segundos
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => notification.remove(), 300);
  }, 5000);
}

/**
 * Enviar email (reemplaza mailto:)
 */
async function sendEmail(emailData) {
  try {
    const response = await fetch(`${API_BASE}/send-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(emailData)
    });

    if (!response.ok) {
      throw new Error('Error enviando email');
    }

    return await response.json();
  } catch (error) {
    console.error('Error enviando email:', error);
    showNotification('error', 'Error al enviar email');
    throw error;
  }
}

/**
 * Enviar WhatsApp (reemplaza window.open)
 */
async function sendWhatsApp(phone, message) {
  try {
    const response = await fetch(`${API_BASE}/send-whatsapp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, message })
    });

    if (!response.ok) {
      throw new Error('Error enviando WhatsApp');
    }

    const result = await response.json();
    
    // Si hay URL de fallback, abrir en nueva pestaña (solo si no hay API configurada)
    if (result.whatsappUrl && result.message?.includes('no configurado')) {
      window.open(result.whatsappUrl, '_blank');
    }

    return result;
  } catch (error) {
    console.error('Error enviando WhatsApp:', error);
    showNotification('error', 'Error al enviar WhatsApp');
    throw error;
  }
}

// Exportar funciones globalmente
if (typeof window !== 'undefined') {
  window.seatsAPI = {
    getAllSeats: getAllSeatsFromBackend,
    getSeat: getSeatFromBackend,
    confirmPurchase: confirmPurchase,
    sendEmail: sendEmail,
    sendWhatsApp: sendWhatsApp,
    showNotification: showNotification
  };
}

// CSS para animaciones de notificaciones
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(400px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  @keyframes slideOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(400px);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

