// Datos de ejemplo para auspicios (vacío - se agregarán cuando consigas sponsors reales)
const defaultSponsors = [];

// Variables globales
let selectedPlan = null;
let selectedPlanPrice = 0;
let currentUser = null;

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Cargar datos desde localStorage o usar defaults
    if (!localStorage.getItem('sponsors')) {
        localStorage.setItem('sponsors', JSON.stringify(defaultSponsors));
    }
    
    if (!localStorage.getItem('gallery')) {
        localStorage.setItem('gallery', JSON.stringify([]));
    }

    if (!localStorage.getItem('users')) {
        localStorage.setItem('users', JSON.stringify([]));
    }

    if (!localStorage.getItem('purchases')) {
        localStorage.setItem('purchases', JSON.stringify([]));
    }

    // Verificar sesión
    checkUserSession();

    // Cargar contenido
    loadSponsors();
    loadGallery();
    loadExpositorVideos();
    
    // Event listeners
    setupEventListeners();
    
    // Formatear inputs de tarjeta
    setupCardFormatting();
}

function setupEventListeners() {
    // Hamburger menu
    const hamburger = document.getElementById('hamburger');
    const nav = document.querySelector('.nav');
    
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            nav.classList.toggle('active');
        });
    }

    // Day filter
    const dayButtons = document.querySelectorAll('.day-btn');
    dayButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            dayButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const targetDay = this.getAttribute('data-day');
            document.querySelectorAll('.day-schedule').forEach(schedule => {
                schedule.classList.remove('active');
            });
            document.getElementById(targetDay).classList.add('active');
        });
    });

    // Gallery filter
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            filterButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const filter = this.getAttribute('data-filter');
            filterGallery(filter);
        });
    });

    // File upload preview
    const fileInput = document.getElementById('fileUpload');
    if (fileInput) {
        fileInput.addEventListener('change', handleFileSelect);
    }

    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
                // Cerrar menu móvil si está abierto
                document.querySelector('.nav').classList.remove('active');
            }
        });
    });
}

// Compartir en redes sociales
function shareOnSocial(platform) {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent('1° Congreso CheqFirma - ADN Humano');
    const text = encodeURIComponent('¡Únete al 1° Congreso CheqFirma! "ADN humano en el marco de las agendas globales" | 19-20 Dic 2025 | Asunción, Paraguay');
    
    let shareUrl = '';
    
    switch(platform) {
        case 'facebook':
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
            break;
        case 'twitter':
            shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${text}`;
            break;
        case 'whatsapp':
            shareUrl = `https://wa.me/?text=${text}%20${url}`;
            break;
        case 'telegram':
            shareUrl = `https://t.me/share/url?url=${url}&text=${text}`;
            break;
        case 'instagram':
            alert('Para compartir en Instagram, por favor copia este enlace: ' + window.location.href);
            navigator.clipboard.writeText(window.location.href);
            return;
        case 'youtube':
            shareUrl = 'https://www.youtube.com/@ForoCheqFirma'; // Reemplazar con canal real
            break;
    }
    
    if (shareUrl) {
        window.open(shareUrl, '_blank', 'width=600,height=400');
    }
}

// Manejo de archivos para preview
let selectedFiles = [];

function handleFileSelect(e) {
    const files = Array.from(e.target.files);
    selectedFiles = [...selectedFiles, ...files];
    displayPreview();
}

function displayPreview() {
    const previewContainer = document.getElementById('previewContainer');
    previewContainer.innerHTML = '';
    
    selectedFiles.forEach((file, index) => {
        const reader = new FileReader();
        const previewItem = document.createElement('div');
        previewItem.className = 'preview-item';
        
        reader.onload = function(e) {
            if (file.type.startsWith('image/')) {
                previewItem.innerHTML = `
                    <img src="${e.target.result}" alt="Preview">
                    <button class="remove-preview" onclick="removePreview(${index})">×</button>
                `;
            } else if (file.type.startsWith('video/')) {
                previewItem.innerHTML = `
                    <video src="${e.target.result}" controls></video>
                    <button class="remove-preview" onclick="removePreview(${index})">×</button>
                `;
            }
            previewContainer.appendChild(previewItem);
        };
        
        reader.readAsDataURL(file);
    });
}

function removePreview(index) {
    selectedFiles.splice(index, 1);
    displayPreview();
}

// Subir media a la galería
function uploadMedia() {
    const name = document.getElementById('uploaderName').value;
    const topic = document.getElementById('uploaderTopic').value;
    
    if (!name || !topic) {
        alert('Por favor completa tu nombre y el tema de tu presentación');
        return;
    }
    
    if (selectedFiles.length === 0) {
        alert('Por favor selecciona al menos una foto o video');
        return;
    }
    
    const gallery = JSON.parse(localStorage.getItem('gallery'));
    
    selectedFiles.forEach(file => {
        const reader = new FileReader();
        reader.onload = function(e) {
            const mediaItem = {
                id: Date.now() + Math.random(),
                uploader: name,
                topic: topic,
                type: file.type.startsWith('image/') ? 'photo' : 'video',
                data: e.target.result,
                date: new Date().toISOString()
            };
            
            gallery.push(mediaItem);
            localStorage.setItem('gallery', JSON.stringify(gallery));
            loadGallery();
        };
        reader.readAsDataURL(file);
    });
    
    // Limpiar formulario
    document.getElementById('uploaderName').value = '';
    document.getElementById('uploaderTopic').value = '';
    document.getElementById('fileUpload').value = '';
    selectedFiles = [];
    document.getElementById('previewContainer').innerHTML = '';
    
    alert('¡Contenido publicado exitosamente!');
}

// Cargar galería
function loadGallery() {
    const gallery = JSON.parse(localStorage.getItem('gallery'));
    const galleryGrid = document.getElementById('galleryGrid');
    
    if (!galleryGrid) return;
    
    if (gallery.length === 0) {
        galleryGrid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--gray);">
                <i class="fas fa-images" style="font-size: 4rem; margin-bottom: 1rem; opacity: 0.3;"></i>
                <p>Aún no hay contenido en la galería</p>
                <p>Los expositores pueden subir fotos y videos de sus presentaciones</p>
            </div>
        `;
        return;
    }
    
    galleryGrid.innerHTML = gallery.map(item => {
        const date = new Date(item.date).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        const mediaTag = item.type === 'photo' ? 
            `<img src="${item.data}" alt="${item.topic}" class="gallery-media">` :
            `<video src="${item.data}" class="gallery-media"></video>`;
        
        return `
            <div class="gallery-item" data-type="${item.type}" onclick="openModal('${item.data}', '${item.type}')">
                ${mediaTag}
                <div class="gallery-info">
                    <h4>${item.topic}</h4>
                    <p>Por: ${item.uploader}</p>
                    <p class="gallery-date">${date}</p>
                </div>
            </div>
        `;
    }).reverse().join('');
}

// Filtrar galería
function filterGallery(filter) {
    const items = document.querySelectorAll('.gallery-item');
    
    items.forEach(item => {
        if (filter === 'all') {
            item.style.display = 'block';
        } else if (filter === 'photos' && item.dataset.type === 'photo') {
            item.style.display = 'block';
        } else if (filter === 'videos' && item.dataset.type === 'video') {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}

// Modal para ver media
function openModal(data, type) {
    const modal = document.getElementById('mediaModal');
    const modalContent = document.getElementById('modalContent');
    
    if (type === 'photo') {
        modalContent.innerHTML = `<img src="${data}" style="max-width: 90%; max-height: 90vh;">`;
    } else {
        modalContent.innerHTML = `<video src="${data}" controls style="max-width: 90%; max-height: 90vh;"></video>`;
    }
    
    modal.style.display = 'block';
}

function closeModal() {
    document.getElementById('mediaModal').style.display = 'none';
}

// Cerrar modal al hacer click fuera
window.onclick = function(event) {
    const modal = document.getElementById('mediaModal');
    if (event.target === modal) {
        closeModal();
    }
}

// Cargar sponsors
function loadSponsors() {
    const sponsors = JSON.parse(localStorage.getItem('sponsors'));
    
    // Main sponsors grid
    const sponsorsGrid = document.getElementById('sponsorsGrid');
    if (sponsorsGrid) {
        if (sponsors.length === 0) {
            sponsorsGrid.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 4rem 2rem;">
                    <i class="fas fa-handshake" style="font-size: 5rem; color: var(--accent-color); margin-bottom: 2rem; opacity: 0.6;"></i>
                    <h3 style="font-size: 2rem; margin-bottom: 1rem; color: var(--primary-color);">Oportunidad de Patrocinio Disponible</h3>
                    <p style="font-size: 1.2rem; color: var(--dark); max-width: 600px; margin: 0 auto; line-height: 1.8;">
                        Esta es tu oportunidad de ser parte del 1° Congreso Médico, Científico, Jurídico, Educativo e Histórico más importante del año.
                        <br><br>
                        <strong>¡Sé el primero en patrocinar este evento único!</strong>
                    </p>
                    <a href="#planes" class="btn-primary" style="margin-top: 2rem; display: inline-block; padding: 1rem 2rem; text-decoration: none;">
                        Ver Paquetes de Patrocinio
                    </a>
                </div>
            `;
        } else {
            sponsorsGrid.innerHTML = sponsors.map(sponsor => `
                <div class="sponsor-item ${sponsor.tier}" onclick="window.open('${sponsor.url}', '_blank')">
                    <img src="${sponsor.logo}" alt="${sponsor.name}" class="sponsor-logo">
                    <h3>${sponsor.name}</h3>
                    <span class="sponsor-tier ${sponsor.tier}">
                        ${sponsor.tier === 'gold' ? '⭐ ORO' : sponsor.tier === 'silver' ? '🥈 PLATA' : '🥉 BRONCE'}
                    </span>
                </div>
            `).join('');
        }
    }
    
    // Sidebar sponsors
    const sidebarSponsors = document.getElementById('sidebarSponsors');
    if (sidebarSponsors) {
        const topSponsors = sponsors.filter(s => s.tier === 'gold').slice(0, 3);
        if (topSponsors.length > 0) {
            sidebarSponsors.innerHTML = topSponsors.map(sponsor => `
                <div class="sponsor-sidebar-item">
                    <a href="${sponsor.url}" target="_blank">
                        <img src="${sponsor.logo}" alt="${sponsor.name}">
                    </a>
                </div>
            `).join('');
        } else {
            sidebarSponsors.innerHTML = '<p style="text-align: center; color: #666; padding: 1rem;">Próximamente</p>';
        }
    }
    
    // Footer sponsors
    const footerSponsors = document.getElementById('footerSponsors');
    if (footerSponsors) {
        if (sponsors.length > 0) {
            footerSponsors.innerHTML = sponsors.slice(0, 5).map(sponsor => `
                <a href="${sponsor.url}" target="_blank">
                    <img src="${sponsor.logo}" alt="${sponsor.name}" class="footer-sponsor-logo">
                </a>
            `).join('');
        } else {
            footerSponsors.innerHTML = '<p style="text-align: center; color: #999;">Próximamente</p>';
        }
    }
}

// Panel de administración
function toggleAdminPanel() {
    const panel = document.getElementById('adminPanel');
    panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
}

function addSponsor() {
    const name = document.getElementById('sponsorName').value;
    const url = document.getElementById('sponsorUrl').value;
    const logo = document.getElementById('sponsorLogo').value;
    const tier = document.getElementById('sponsorTier').value;
    
    if (!name || !url || !logo) {
        alert('Por favor completa todos los campos');
        return;
    }
    
    const sponsors = JSON.parse(localStorage.getItem('sponsors'));
    sponsors.push({ name, url, logo, tier });
    localStorage.setItem('sponsors', JSON.stringify(sponsors));
    
    // Limpiar formulario
    document.getElementById('sponsorName').value = '';
    document.getElementById('sponsorUrl').value = '';
    document.getElementById('sponsorLogo').value = '';
    
    loadSponsors();
    alert('Auspicio agregado exitosamente');
}

// Funciones auxiliares para demostración

// Simular transmisión en vivo
function startLiveStream() {
    const placeholder = document.querySelector('.video-placeholder');
    placeholder.innerHTML = `
        <iframe width="100%" height="100%" 
            src="https://www.youtube.com/embed/live_stream?channel=UCxxxxxxx" 
            frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowfullscreen style="border-radius: 15px;">
        </iframe>
    `;
}

// Función para limpiar datos (útil para testing)
function clearAllData() {
    if (confirm('¿Estás seguro de que quieres borrar todos los datos?')) {
        localStorage.clear();
        location.reload();
    }
}

// Exportar datos
function exportData() {
    const data = {
        sponsors: JSON.parse(localStorage.getItem('sponsors')),
        gallery: JSON.parse(localStorage.getItem('gallery'))
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'cheqfirma_backup.json';
    link.click();
}

// Importar datos
function importData(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            if (data.sponsors) localStorage.setItem('sponsors', JSON.stringify(data.sponsors));
            if (data.gallery) localStorage.setItem('gallery', JSON.stringify(data.gallery));
            location.reload();
        } catch (error) {
            alert('Error al importar datos: ' + error.message);
        }
    };
    reader.readAsText(file);
}

// Añadir funcionalidad de búsqueda en la agenda
function searchSchedule(query) {
    const items = document.querySelectorAll('.schedule-item');
    query = query.toLowerCase();
    
    items.forEach(item => {
        const text = item.textContent.toLowerCase();
        item.style.display = text.includes(query) ? 'flex' : 'none';
    });
}

// Notificaciones push (simulado)
function requestNotificationPermission() {
    if ('Notification' in window) {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                new Notification('Foro Cheq Firma', {
                    body: '¡Gracias por activar las notificaciones! Te avisaremos cuando comience cada presentación.',
                    icon: 'https://via.placeholder.com/128?text=CF'
                });
            }
        });
    }
}

// Countdown para próximo evento
function updateCountdown() {
    const eventDate = new Date('2025-11-15T09:00:00');
    const now = new Date();
    const diff = eventDate - now;
    
    if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        
        return `${days}d ${hours}h ${minutes}m`;
    }
    return 'En vivo ahora';
}

// Inicializar funciones adicionales
setTimeout(() => {
    // Actualizar countdown cada minuto
    setInterval(() => {
        const countdown = updateCountdown();
        const elements = document.querySelectorAll('.countdown');
        elements.forEach(el => el.textContent = countdown);
    }, 60000);
}, 1000);

// ============================================
// SISTEMA DE MONETIZACIÓN Y AUTENTICACIÓN
// ============================================

// Verificar sesión de usuario
function checkUserSession() {
    const session = localStorage.getItem('currentUser');
    if (session) {
        currentUser = JSON.parse(session);
        updateUIForLoggedUser();
    }
}

function updateUIForLoggedUser() {
    const loginBtn = document.getElementById('loginBtn');
    const userMenu = document.getElementById('userMenu');
    const userName = document.getElementById('userName');
    
    if (currentUser) {
        if (loginBtn) loginBtn.style.display = 'none';
        if (userMenu) userMenu.style.display = 'flex';
        if (userName) userName.textContent = currentUser.name;
    } else {
        if (loginBtn) loginBtn.style.display = 'flex';
        if (userMenu) userMenu.style.display = 'none';
    }
}

// Mostrar/Ocultar modales
function showLogin() {
    document.getElementById('authModal').style.display = 'block';
    showAuthTab('login');
}

function closeAuthModal() {
    document.getElementById('authModal').style.display = 'none';
}

function showAuthTab(tab) {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const tabs = document.querySelectorAll('.auth-tab');
    
    tabs.forEach(t => t.classList.remove('active'));
    
    if (tab === 'login') {
        loginForm.style.display = 'block';
        registerForm.style.display = 'none';
        tabs[0].classList.add('active');
    } else {
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
        tabs[1].classList.add('active');
    }
}

// Manejar Login
function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    if (!users || users.length === 0) {
        alert('No hay usuarios registrados. Por favor regístrate primero.');
        showAuthTab('register');
        return;
    }
    
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        // Verificar si el email está validado
        if (!user.emailVerified) {
            alert('Por favor valida tu correo electrónico antes de iniciar sesión.\n\nRevisa tu bandeja de entrada para el enlace de validación.');
            // Mostrar modal de reenvío de validación
            showResendValidationModal(user);
            return;
        }
        
        currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(user));
        updateUIForLoggedUser();
        closeAuthModal();
        
        // Mostrar mensaje de bienvenida
        alert(`¡Bienvenido de nuevo, ${user.name}!`);
    } else {
        alert('Email o contraseña incorrectos');
    }
}

// Manejar Registro
function handleRegister(e) {
    e.preventDefault();
    
    const name = document.getElementById('registerName').value.trim();
    const email = document.getElementById('registerEmail').value.trim();
    const emailConfirm = document.getElementById('registerEmailConfirm').value.trim();
    const whatsapp = document.getElementById('registerWhatsApp').value.trim();
    const password = document.getElementById('registerPassword').value;
    const profession = document.getElementById('registerProfession').value;
    const reportDelivery = document.querySelector('input[name="reportDelivery"]:checked')?.value;
    
    // Validar confirmación de email
    if (email !== emailConfirm) {
        alert('Los correos electrónicos no coinciden. Por favor verifica.');
        document.getElementById('registerEmailConfirm').focus();
        return;
    }
    
    // Validar que el password tenga al menos 6 caracteres
    if (password.length < 6) {
        alert('La contraseña debe tener al menos 6 caracteres');
        return;
    }
    
    // Validar método de entrega del reporte
    if (!reportDelivery) {
        alert('Por favor selecciona cómo deseas recibir tu reporte de registro');
        return;
    }
    
    let users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Si no existe el array, inicializarlo
    if (!users || !Array.isArray(users)) {
        users = [];
    }
    
    // Verificar si el email ya existe
    if (users.find(u => u.email === email)) {
        alert('Este email ya está registrado. Por favor inicia sesión.');
        showAuthTab('login');
        return;
    }
    
    // Generar token de validación único
    const validationToken = generateValidationToken();
    const validationExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 horas
    
    const newUser = {
        id: Date.now(),
        name,
        email,
        whatsapp,
        password,
        profession: profession || '',
        reportDelivery,
        emailVerified: false,
        validationToken: validationToken,
        validationTokenExpiry: validationExpiry.toISOString(),
        createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    // Generar reporte de registro
    const registrationReport = generateRegistrationReport(newUser);
    
    // Enviar reporte según la opción elegida por el usuario
    sendRegistrationReportToUser(newUser, registrationReport, reportDelivery);
    
    // Enviar reporte a CheqFirma (siempre por email y WhatsApp)
    sendRegistrationReportToCheqFirma(newUser, registrationReport);
    
    // Enviar email de validación
    sendEmailValidation(newUser);
    
    // NO hacer auto-login, el usuario debe validar primero
    closeAuthModal();
    
    // Mostrar modal de validación de email
    showEmailValidationModal(newUser);
}

// Función para generar reporte de registro
function generateRegistrationReport(user) {
    const report = `
═══════════════════════════════════════════════════════════════════════════════
                    REPORTE DE REGISTRO - CONGRESO CHEQFIRMA 2025
═══════════════════════════════════════════════════════════════════════════════

📋 INFORMACIÓN DEL REGISTRO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   ID de Usuario: ${user.id}
   Fecha de Registro: ${new Date(user.createdAt).toLocaleString('es-PY', {
       year: 'numeric',
       month: 'long',
       day: 'numeric',
       hour: '2-digit',
       minute: '2-digit'
   })}

👤 DATOS DEL USUARIO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Nombre Completo: ${user.name}
   Correo Electrónico: ${user.email}
   WhatsApp: ${user.whatsapp || 'No proporcionado'}
   Profesión: ${user.profession || 'No especificada'}

✅ ESTADO: REGISTRO COMPLETADO EXITOSAMENTE

📅 INFORMACIÓN DEL EVENTO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Evento: 1° Congreso Internacional CheqFirma 2025
   Fechas: 19 y 20 de Diciembre 2025
   Horario: 19:00 - 22:00 (Hora de Paraguay, GMT-3)
   Lugar: Auditorio "Ruiz Diaz", Manzana de la Rivera, Asunción, Paraguay

📝 PRÓXIMOS PASOS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   1. ⚠️ IMPORTANTE: Valida tu correo electrónico haciendo clic en el enlace que te enviamos
   2. Una vez validado, podrás iniciar sesión con tu email y contraseña
   3. Explora las opciones de asientos presenciales y virtuales
   4. Reserva tu lugar antes de que se agoten
   5. Mantente al día con las actualizaciones del evento

📧 CONTACTO Y SOPORTE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Email: cheqfirma@gmail.com
   WhatsApp: +595 981 123 456
   Horario de Atención: Lunes a Viernes, 9:00 - 18:00 (GMT-3)

═══════════════════════════════════════════════════════════════════════════════
                    ¡Gracias por registrarte en el Congreso CheqFirma 2025!
═══════════════════════════════════════════════════════════════════════════════
    `.trim();
    
    return report;
}

// Función para enviar reporte al usuario según su preferencia
function sendRegistrationReportToUser(user, report, deliveryMethod) {
    if (deliveryMethod === 'email' || deliveryMethod === 'both') {
        const emailSubject = encodeURIComponent('Reporte de Registro - Congreso CheqFirma 2025');
        const emailBody = encodeURIComponent(report);
        const emailUrl = `mailto:${user.email}?subject=${emailSubject}&body=${emailBody}`;
        
        // Guardar URL para envío (no se envía automáticamente por limitaciones del navegador)
        user.registrationEmailUrl = emailUrl;
    }
    
    if (deliveryMethod === 'whatsapp' || deliveryMethod === 'both') {
        if (user.whatsapp) {
            const whatsappMessage = `*✅ REGISTRO EXITOSO - CONGRESO CHEQFIRMA 2025*

👤 *Nombre:* ${user.name}
📧 *Email:* ${user.email}
📱 *WhatsApp:* ${user.whatsapp}
💼 *Profesión:* ${user.profession || 'No especificada'}

✅ *Tu registro ha sido completado exitosamente*

📅 *Evento:*
1° Congreso Internacional CheqFirma 2025
19-20 Diciembre 2025
19:00 - 22:00 (Paraguay GMT-3)

📍 *Lugar:*
Auditorio "Ruiz Diaz", Manzana de la Rivera, Asunción

📝 *Próximos Pasos:*
1. Ya puedes iniciar sesión con tu email y contraseña
2. Explora las opciones de asientos presenciales y virtuales
3. Reserva tu lugar antes de que se agoten

📧 *Contacto:*
Email: cheqfirma@gmail.com
WhatsApp: +595 981 123 456

¡Gracias por registrarte!`;

            const clientPhone = user.whatsapp.replace(/\D/g, '');
            const whatsappUrl = `https://wa.me/${clientPhone}?text=${encodeURIComponent(whatsappMessage)}`;
            user.registrationWhatsAppUrl = whatsappUrl;
            
            // Abrir WhatsApp automáticamente si el usuario eligió WhatsApp o ambos
            setTimeout(() => {
                window.open(whatsappUrl, '_blank');
            }, 500);
        }
    }
    
    // Si eligió email, mostrar opción para enviar
    if (deliveryMethod === 'email' || deliveryMethod === 'both') {
        setTimeout(() => {
            const sendEmail = confirm(`¿Deseas abrir tu cliente de email para recibir el reporte de registro?\n\nEmail: ${user.email}`);
            if (sendEmail && user.registrationEmailUrl) {
                window.location.href = user.registrationEmailUrl;
            }
        }, 1000);
    }
}

// Función para enviar reporte a CheqFirma
function sendRegistrationReportToCheqFirma(user, report) {
    const CHEQFIRMA_EMAIL = 'cheqfirma@gmail.com';
    const CHEQFIRMA_WHATSAPP = '5493536564940'; // Formato sin + para WhatsApp
    
    // Preparar reporte para administrador
    const adminReport = `NUEVO REGISTRO DE USUARIO - CONGRESO CHEQFIRMA 2025

═══════════════════════════════════════════════════════════════════════════════

📋 INFORMACIÓN DEL REGISTRO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   ID de Usuario: ${user.id}
   Fecha de Registro: ${new Date(user.createdAt).toLocaleString('es-PY')}

👤 DATOS DEL NUEVO USUARIO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Nombre Completo: ${user.name}
   Correo Electrónico: ${user.email}
   WhatsApp: ${user.whatsapp || 'No proporcionado'}
   Profesión: ${user.profession || 'No especificada'}
   Método de Entrega de Reporte: ${user.reportDelivery}

═══════════════════════════════════════════════════════════════════════════════`;

    // Preparar email para CheqFirma
    const adminEmailSubject = encodeURIComponent(`Nuevo Registro - ${user.name} - Congreso CheqFirma`);
    const adminEmailBody = encodeURIComponent(adminReport);
    const adminEmailUrl = `mailto:${CHEQFIRMA_EMAIL}?subject=${adminEmailSubject}&body=${adminEmailBody}`;
    
    // Preparar WhatsApp para CheqFirma
    const adminWhatsAppMessage = `*🔔 NUEVO REGISTRO - CONGRESO CHEQFIRMA*

👤 *Nombre:* ${user.name}
📧 *Email:* ${user.email}
📱 *WhatsApp:* ${user.whatsapp || 'No proporcionado'}
💼 *Profesión:* ${user.profession || 'No especificada'}
📅 *Fecha:* ${new Date(user.createdAt).toLocaleString('es-PY')}
📨 *Reporte enviado por:* ${user.reportDelivery}

ID Usuario: ${user.id}`;
    
    const adminWhatsAppUrl = `https://wa.me/${CHEQFIRMA_WHATSAPP}?text=${encodeURIComponent(adminWhatsAppMessage)}`;
    
    // Guardar URLs para envío manual (no automático por limitaciones)
    user.adminEmailUrl = adminEmailUrl;
    user.adminWhatsAppUrl = adminWhatsAppUrl;
    
    // Guardar registro de notificaciones pendientes
    const pendingNotifications = JSON.parse(localStorage.getItem('pendingNotifications') || '[]');
    pendingNotifications.push({
        type: 'new_registration',
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
        adminEmailUrl: adminEmailUrl,
        adminWhatsAppUrl: adminWhatsAppUrl,
        timestamp: new Date().toISOString()
    });
    localStorage.setItem('pendingNotifications', JSON.stringify(pendingNotifications));
    
    console.log('Reporte de registro preparado para CheqFirma');
    console.log('Email URL:', adminEmailUrl);
    console.log('WhatsApp URL:', adminWhatsAppUrl);
}

// Cerrar sesión
function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    
    const loginBtn = document.getElementById('loginBtn');
    const userMenu = document.getElementById('userMenu');
    
    if (loginBtn && userMenu) {
        loginBtn.style.display = 'flex';
        userMenu.style.display = 'none';
    }
    
    alert('Sesión cerrada exitosamente');
}

// Seleccionar plan
function selectPlan(plan, price) {
    // Verificar si el usuario está logueado
    if (!currentUser) {
        alert('Debes iniciar sesión primero para comprar un plan');
        showLogin();
        return;
    }
    
    selectedPlan = plan;
    selectedPlanPrice = price;
    
    // Mostrar modal de pago
    showPaymentModal();
}

function showPaymentModal() {
    const modal = document.getElementById('paymentModal');
    const summary = document.getElementById('paymentSummary');
    
    const planNames = {
        'basic': 'Básico',
        'premium': 'Premium',
        'vip': 'VIP'
    };
    
    summary.innerHTML = `
        <h4>Resumen de Compra</h4>
        <div class="payment-summary-item">
            <span>Plan:</span>
            <span><strong>${planNames[selectedPlan]}</strong></span>
        </div>
        <div class="payment-summary-item">
            <span>Acceso al evento:</span>
            <span>$${selectedPlanPrice}</span>
        </div>
        <div class="payment-summary-total">
            <span>Total a pagar:</span>
            <span>$${selectedPlanPrice}</span>
        </div>
    `;
    
    modal.style.display = 'block';
}

function closePaymentModal() {
    document.getElementById('paymentModal').style.display = 'none';
}

// Métodos de pago - FUNCIÓN LEGACY (no se usa, la función principal está en index.html)
// Esta función se mantiene por compatibilidad pero no debe interferir
// RENOMBRADA para evitar conflictos con window.selectPaymentMethod en index.html
function selectPaymentMethodLegacy(method) {
    try {
        // Verificar si existe el elemento antes de acceder
    const buttons = document.querySelectorAll('.payment-option');
        if (buttons.length > 0) {
            buttons.forEach(btn => {
                if (btn && btn.classList) {
                    btn.classList.remove('active');
                }
            });
            
            // Solo intentar agregar 'active' si event está disponible y el elemento existe
            if (typeof event !== 'undefined' && event && event.target) {
                const closest = event.target.closest('.payment-option');
                if (closest && closest.classList) {
                    closest.classList.add('active');
                }
            }
        }
    
        // Mostrar formulario correspondiente (solo si existen)
        const cardForm = document.getElementById('cardForm');
        const bankForm = document.getElementById('bankForm');
        const paypalForm = document.getElementById('paypalForm');
        
        if (cardForm) cardForm.style.display = 'none';
        if (bankForm) bankForm.style.display = 'none';
        if (paypalForm) paypalForm.style.display = 'none';
    
        if (method === 'card' && cardForm) {
            cardForm.style.display = 'block';
        } else if (method === 'bank' && bankForm) {
            bankForm.style.display = 'block';
        } else if (method === 'paypal' && paypalForm) {
            paypalForm.style.display = 'block';
        }
    } catch (error) {
        // Silenciar errores de esta función legacy
        // La función principal está en index.html
        console.warn('selectPaymentMethod legacy (script.js) - ignorando error:', error);
    }
}

// Procesar pago
function processPayment(e) {
    e.preventDefault();
    
    // Simular procesamiento
    const btn = e.target.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Procesando...';
    btn.disabled = true;
    
        setTimeout(() => {
        // Registrar compra
        const purchases = JSON.parse(localStorage.getItem('purchases'));
        const purchase = {
            id: Date.now(),
            userId: currentUser.id,
            plan: selectedPlan,
            price: selectedPlanPrice,
            date: new Date().toISOString(),
            status: 'completed'
        };
        
        purchases.push(purchase);
        localStorage.setItem('purchases', JSON.stringify(purchases));
        
        btn.innerHTML = originalText;
        btn.disabled = false;
        closePaymentModal();
        
        // Mostrar confirmación
        alert('¡Pago procesado exitosamente! Ya tienes acceso al evento.');
        
        // Mostrar dashboard
        showDashboard();
    }, 2000);
}

function redirectToPayPal() {
    // Redirigir al link de PayPal.me
    const paypalUrl = 'https://www.paypal.me/fernandoferreiramore';
    
    const confirmation = confirm(
        '💳 PAGO CON PAYPAL\n\n' +
        'Serás redirigido a PayPal.me para completar tu pago.\n\n' +
        'Beneficiario: FERNANDO DANIEL FERREIRA MORENO\n' +
        'Monto: $' + selectedPlanPrice + ' USD\n\n' +
        '⚠️ IMPORTANTE:\n' +
        'Después de realizar el pago, envía el comprobante a:\n' +
        'info@cheqfirma.com\n\n' +
        'Incluye tu nombre y email de registro.\n\n' +
        '¿Continuar a PayPal?'
    );
    
    if (confirmation) {
        // Abrir PayPal en nueva ventana
        window.open(paypalUrl, '_blank');
        
        // Registrar compra como pendiente
        const purchases = JSON.parse(localStorage.getItem('purchases'));
        const purchase = {
            id: Date.now(),
            userId: currentUser.id,
            plan: selectedPlan,
            price: selectedPlanPrice,
            date: new Date().toISOString(),
            status: 'pending_paypal',
            paymentMethod: 'paypal'
        };
        
        purchases.push(purchase);
        localStorage.setItem('purchases', JSON.stringify(purchases));
        
        alert('✅ Reserva confirmada!\n\n' +
              'Completa el pago en PayPal y envía el comprobante a:\n' +
              'info@cheqfirma.com\n\n' +
              'Tu acceso será activado una vez confirmemos el pago.');
        
        closePaymentModal();
        showDashboard();
    }
}

function confirmBankTransfer() {
    // Confirmar que el usuario realizará la transferencia
    const confirmation = confirm(
        '✅ CONFIRMACIÓN DE TRANSFERENCIA BANCARIA\n\n' +
        'Por favor, realiza la transferencia a:\n\n' +
        'Beneficiario: FERNANDO DANIEL FERREIRA MORENO\n' +
        'Banco: Banco GNB Paraguay S.A.E.C.A.\n' +
        'Cuenta: 13175552002\n' +
        'Moneda: USD\n\n' +
        '⚠️ IMPORTANTE:\n' +
        'Después de realizar la transferencia, envía el comprobante a:\n' +
        'info@cheqfirma.com\n\n' +
        'Incluye tu nombre y email de registro.\n\n' +
        '¿Confirmas que realizarás la transferencia?'
    );
    
    if (confirmation) {
        // Registrar la compra como pendiente de confirmación
        const purchases = JSON.parse(localStorage.getItem('purchases'));
        const purchase = {
            id: Date.now(),
            userId: currentUser.id,
            plan: selectedPlan,
            price: selectedPlanPrice,
            date: new Date().toISOString(),
            status: 'pending_transfer',
            paymentMethod: 'bank_transfer'
        };
        
        purchases.push(purchase);
        localStorage.setItem('purchases', JSON.stringify(purchases));
        
        alert('✅ Reserva confirmada!\n\n' +
              'Tu acceso ha sido reservado.\n\n' +
              'Recuerda enviar el comprobante de transferencia a:\n' +
              'info@cheqfirma.com\n\n' +
              'Tu acceso será activado una vez confirmemos el pago.');
        
        closePaymentModal();
        showDashboard();
    }
}

function processPaymentExternal() {
    const purchases = JSON.parse(localStorage.getItem('purchases'));
    const purchase = {
        id: Date.now(),
        userId: currentUser.id,
        plan: selectedPlan,
        price: selectedPlanPrice,
        date: new Date().toISOString(),
        status: 'completed'
    };
    
    purchases.push(purchase);
    localStorage.setItem('purchases', JSON.stringify(purchases));
    
    closePaymentModal();
    alert('¡Pago completado! Ya tienes acceso al evento.');
    showDashboard();
}

// Dashboard de usuario
function showDashboard() {
    if (!currentUser) {
        showLogin();
        return;
    }
    
    const modal = document.getElementById('dashboardModal');
    const content = document.getElementById('dashboardContent');
    
    // Obtener compras del usuario
    const purchases = JSON.parse(localStorage.getItem('purchases'));
    const userPurchases = purchases.filter(p => p.userId === currentUser.id);
    const lastPurchase = userPurchases[userPurchases.length - 1];
    
    content.innerHTML = `
        <h4>Bienvenido, ${currentUser.name}!</h4>
        <p>${currentUser.email} | ${currentUser.profession}</p>
    `;
    
    // Información del plan
    const planInfo = document.getElementById('userPlanInfo');
    if (lastPurchase) {
        const planNames = {
            'basic': 'Básico',
            'premium': 'Premium',
            'vip': 'VIP'
        };
        
        planInfo.innerHTML = `
            <div style="background: var(--white); padding: 1.5rem; border-radius: 10px;">
                <h5 style="color: var(--primary-color); margin-bottom: 0.5rem;">Plan ${planNames[lastPurchase.plan]}</h5>
                <p style="color: var(--gray); font-size: 0.9rem;">
                    Comprado el ${new Date(lastPurchase.date).toLocaleDateString('es-ES')}
                </p>
                <p style="color: var(--success-color); font-weight: 600; margin-top: 1rem;">
                    <i class="fas fa-check-circle"></i> Acceso activo
                </p>
            </div>
        `;
    } else {
        planInfo.innerHTML = `
            <p>No tienes ningún plan activo</p>
            <a href="#pricing" onclick="closeDashboard()" style="color: var(--primary-color); text-decoration: none; font-weight: 600;">
                Ver planes disponibles
            </a>
        `;
    }
    
    // Grabaciones
    const recordings = document.getElementById('userRecordings');
    if (lastPurchase && (lastPurchase.plan === 'premium' || lastPurchase.plan === 'vip')) {
        recordings.innerHTML = `
            <div class="recording-item">
                <div>
                    <strong>Dr. Villa - Cardiología</strong>
                    <p style="font-size: 0.8rem; color: var(--gray);">Día 1 - 09:00 AM</p>
                </div>
                <button class="btn-watch" onclick="alert('Reproduciendo video...')">
                    <i class="fas fa-play"></i> Ver
                </button>
            </div>
            <div class="recording-item">
                <div>
                    <strong>Dra. Martínez - Neurociencias</strong>
                    <p style="font-size: 0.8rem; color: var(--gray);">Día 1 - 11:00 AM</p>
                </div>
                <button class="btn-watch" onclick="alert('Reproduciendo video...')">
                    <i class="fas fa-play"></i> Ver
                </button>
            </div>
            ${lastPurchase.plan === 'vip' ? '<p style="color: var(--success-color); margin-top: 1rem;"><i class="fas fa-infinity"></i> Acceso perpetuo a todas las grabaciones</p>' : '<p style="color: var(--gray); margin-top: 1rem;">Acceso disponible por 30 días</p>'}
        `;
    } else {
        recordings.innerHTML = '<p>No tienes acceso a grabaciones. Actualiza a Premium o VIP para acceder.</p>';
    }
    
    // Certificado
    const certificate = document.getElementById('userCertificate');
    if (lastPurchase && lastPurchase.plan === 'vip') {
        certificate.innerHTML = `
            <div class="certificate-preview">
                <div class="certificate-badge"><i class="fas fa-award"></i></div>
                <h5 style="margin-bottom: 1rem;">Certificado Digital Verificado</h5>
                <p style="color: var(--gray); margin-bottom: 1rem;">Foro Científico Cheq Firma 2025</p>
                <button class="btn-download" onclick="downloadCertificate()">
                    <i class="fas fa-download"></i> Descargar
                </button>
                    </div>
        `;
    } else {
        certificate.innerHTML = '<p>El certificado está disponible solo para el plan VIP</p>';
    }
    
    // Material descargable
    const materials = document.getElementById('userMaterials');
    if (lastPurchase && (lastPurchase.plan === 'premium' || lastPurchase.plan === 'vip')) {
        materials.innerHTML = `
            <div class="material-item">
                <span><i class="fas fa-file-pdf"></i> Presentación Dr. Villa.pdf</span>
                <button class="btn-download" onclick="alert('Descargando...')">
                    <i class="fas fa-download"></i>
                </button>
                </div>
            <div class="material-item">
                <span><i class="fas fa-file-pdf"></i> Artículo Dra. Martínez.pdf</span>
                <button class="btn-download" onclick="alert('Descargando...')">
                    <i class="fas fa-download"></i>
                </button>
            </div>
            <div class="material-item">
                <span><i class="fas fa-file-pdf"></i> Guía de Estudio Completa.pdf</span>
                <button class="btn-download" onclick="alert('Descargando...')">
                    <i class="fas fa-download"></i>
                </button>
            </div>
        `;
    } else {
        materials.innerHTML = '<p>No tienes acceso a material descargable. Actualiza a Premium o VIP.</p>';
    }
    
    modal.style.display = 'block';
}

function closeDashboard() {
    document.getElementById('dashboardModal').style.display = 'none';
}

// Descargar certificado
function downloadCertificate() {
    alert('Descargando certificado...\n\nEn producción, aquí se generaría un PDF con el certificado personalizado del usuario.');
}

// Toggle comparación de planes
function toggleComparison() {
    const table = document.getElementById('comparisonTable');
    if (table.style.display === 'none') {
        table.style.display = 'block';
    } else {
        table.style.display = 'none';
    }
}

// Formatear inputs de tarjeta
function setupCardFormatting() {
    const cardNumber = document.getElementById('cardNumber');
    if (cardNumber) {
        cardNumber.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\s/g, '');
            let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
            e.target.value = formattedValue;
        });
    }
    
    const cardExpiry = document.getElementById('cardExpiry');
    if (cardExpiry) {
        cardExpiry.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 2) {
                value = value.slice(0, 2) + '/' + value.slice(2, 4);
            }
            e.target.value = value;
        });
    }
    
    const cardCvv = document.getElementById('cardCvv');
    if (cardCvv) {
        cardCvv.addEventListener('input', function(e) {
            e.target.value = e.target.value.replace(/\D/g, '');
        });
    }
}

// ============================================
// SISTEMA DE PREVENTAS Y DESCUENTOS
// ============================================

let currentDiscount = 40; // Descuento actual (Fase 1)
let appliedCoupon = null;

// Cupones disponibles
const availableCoupons = {
    'ESTUDIANTE20': { discount: 20, description: 'Descuento para estudiantes' },
    'MEDICO15': { discount: 15, description: 'Descuento para médicos' },
    'GRUPO25': { discount: 25, description: 'Descuento grupal (3+ personas)' },
    'VUELVE10': { discount: 10, description: 'Cupón de recuperación' },
    'EARLYBIRD': { discount: 30, description: 'Early Bird especial' }
};

// Inicializar countdown timer
function initPresaleCountdown() {
    // Fecha de fin de la Fase 1 (25 de octubre 2024)
    const endDate = new Date('2024-10-25T23:59:59').getTime();
    
    const countdown = setInterval(() => {
        const now = new Date().getTime();
        const distance = endDate - now;
        
        if (distance < 0) {
            clearInterval(countdown);
            const daysEl = document.getElementById('days');
            const hoursEl = document.getElementById('hours');
            const minutesEl = document.getElementById('minutes');
            const secondsEl = document.getElementById('seconds');
            if (daysEl) daysEl.textContent = '00';
            if (hoursEl) hoursEl.textContent = '00';
            if (minutesEl) minutesEl.textContent = '00';
            if (secondsEl) secondsEl.textContent = '00';
            return;
        }
        
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        const daysEl = document.getElementById('days');
        const hoursEl = document.getElementById('hours');
        const minutesEl = document.getElementById('minutes');
        const secondsEl = document.getElementById('seconds');
        
        if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
        if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
        if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
        if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');
    }, 1000);
}

// Aplicar cupón de descuento
function applyCoupon() {
    const couponCode = document.getElementById('couponCode').value.toUpperCase().trim();
    const messageDiv = document.getElementById('couponMessage');
    
    if (!couponCode) {
        messageDiv.textContent = 'Por favor ingresa un código';
        messageDiv.className = 'coupon-message error';
        messageDiv.style.display = 'block';
        return;
    }
    
    if (availableCoupons[couponCode]) {
        appliedCoupon = availableCoupons[couponCode];
        messageDiv.textContent = `¡Cupón aplicado! ${appliedCoupon.discount}% de descuento adicional - ${appliedCoupon.description}`;
        messageDiv.className = 'coupon-message success';
        messageDiv.style.display = 'block';
        
        // Actualizar precios
        updatePricesWithDiscount();
        
        // Guardar cupón aplicado
        localStorage.setItem('appliedCoupon', JSON.stringify(appliedCoupon));
    } else {
        messageDiv.textContent = 'Código inválido. Verifica e intenta nuevamente.';
        messageDiv.className = 'coupon-message error';
        messageDiv.style.display = 'block';
    }
}

// Copiar cupón al hacer click
function copyCoupon(code) {
    document.getElementById('couponCode').value = code;
    navigator.clipboard.writeText(code);
    alert(`Código "${code}" copiado! Haz click en "Aplicar" para usarlo.`);
}

// Actualizar precios con descuentos
function updatePricesWithDiscount() {
    const originalPrices = {
        basic: 12,
        premium: 42,
        vip: 125
    };
    
    let totalDiscount = currentDiscount;
    if (appliedCoupon) {
        totalDiscount += appliedCoupon.discount;
    }
    
    // No permitir más de 60% de descuento total
    totalDiscount = Math.min(totalDiscount, 60);
    
    // Calcular nuevos precios
    const newPrices = {
        basic: Math.round(originalPrices.basic * (1 - totalDiscount / 100)),
        premium: Math.round(originalPrices.premium * (1 - totalDiscount / 100)),
        vip: Math.round(originalPrices.vip * (1 - totalDiscount / 100))
    };
    
    // Actualizar UI
    document.getElementById('basicPrice').textContent = newPrices.basic;
    document.getElementById('premiumPrice').textContent = newPrices.premium;
    document.getElementById('vipPrice').textContent = newPrices.vip;
    
    // Actualizar ribbons
    document.querySelectorAll('.presale-ribbon').forEach(ribbon => {
        ribbon.textContent = `${totalDiscount}% OFF`;
    });
}

// ============================================
// SISTEMA DE CREDENCIALES DE ACCESO
// ============================================

// Generar credenciales únicas al comprar
function generateForumCredentials(userId, plan) {
    const username = `CF-${userId}-${Date.now().toString(36).toUpperCase()}`;
    const password = generateRandomPassword(12);
    
    return { username, password };
}

function generateRandomPassword(length) {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$%';
    let password = '';
    for (let i = 0; i < length; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
}

// Modificar processPayment para incluir generación de credenciales
const originalProcessPayment = processPayment;
processPayment = function(e) {
    e.preventDefault();
    
    const btn = e.target.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Procesando...';
    btn.disabled = true;
    
    setTimeout(() => {
        // Generar credenciales
        const credentials = generateForumCredentials(currentUser.id, selectedPlan);
        
        // Registrar compra con credenciales
        const purchases = JSON.parse(localStorage.getItem('purchases'));
        const purchase = {
            id: Date.now(),
            userId: currentUser.id,
            plan: selectedPlan,
            price: selectedPlanPrice,
            date: new Date().toISOString(),
            status: 'completed',
            credentials: credentials,
            discount: currentDiscount + (appliedCoupon ? appliedCoupon.discount : 0)
        };
        
        purchases.push(purchase);
        localStorage.setItem('purchases', JSON.stringify(purchases));
        
        btn.innerHTML = originalText;
        btn.disabled = false;
        closePaymentModal();
        
        // Mostrar credenciales al usuario
        showCredentialsModal(credentials, selectedPlan);
    }, 2000);
};

// Modal para mostrar credenciales
function showCredentialsModal(credentials, plan) {
    const planNames = {
        'basic': 'Básico',
        'premium': 'Premium',
        'vip': 'VIP'
    };
    
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'block';
    modal.innerHTML = `
        <div class="modal-dialog">
            <div class="modal-body" style="text-align: center;">
                <div style="font-size: 4rem; color: var(--success-color); margin-bottom: 1rem;">
        <i class="fas fa-check-circle"></i>
                </div>
                <h3 style="color: var(--success-color); margin-bottom: 1rem;">¡Compra Exitosa!</h3>
                <p style="margin-bottom: 2rem;">Tu acceso al 1° Congreso CheqFirma ha sido activado</p>
                
                <div style="background: var(--light); padding: 2rem; border-radius: 15px; margin-bottom: 2rem;">
                    <h4 style="color: var(--primary-color); margin-bottom: 1.5rem;">
                        <i class="fas fa-key"></i> Tus Credenciales de Acceso
                    </h4>
                    <div style="background: var(--white); padding: 1.5rem; border-radius: 10px; margin-bottom: 1rem;">
                        <p style="color: var(--gray); margin-bottom: 0.5rem;">Usuario:</p>
                        <p style="font-size: 1.3rem; font-weight: 700; color: var(--dark);">${credentials.username}</p>
                    </div>
                    <div style="background: var(--white); padding: 1.5rem; border-radius: 10px;">
                        <p style="color: var(--gray); margin-bottom: 0.5rem;">Contraseña:</p>
                        <p style="font-size: 1.3rem; font-weight: 700; color: var(--dark);">${credentials.password}</p>
                    </div>
                </div>
                
                <div style="background: #fef3c7; padding: 1rem; border-radius: 10px; margin-bottom: 2rem;">
                    <p style="color: #92400e;">
                        <i class="fas fa-exclamation-triangle"></i>
                        <strong>Importante:</strong> Guarda estas credenciales en un lugar seguro. 
                        También las hemos enviado a tu email.
                    </p>
                </div>
                
                <div style="display: flex; gap: 1rem; justify-content: center;">
                    <button onclick="copyCredentials('${credentials.username}', '${credentials.password}')" class="btn-submit" style="background: var(--primary-color);">
                        <i class="fas fa-copy"></i> Copiar Credenciales
                    </button>
                    <button onclick="closeCredentialsModal(); showDashboard();" class="btn-submit" style="background: var(--success-color);">
                        <i class="fas fa-th-large"></i> Ir a Mi Cuenta
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Simular envío de email
    sendCredentialsEmail(currentUser.email, credentials, plan);
}

function closeCredentialsModal() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => modal.remove());
}

function copyCredentials(username, password) {
    const text = `Usuario: ${username}\nContraseña: ${password}`;
    navigator.clipboard.writeText(text);
    alert('¡Credenciales copiadas al portapapeles!');
}

// Simular envío de email con credenciales
function sendCredentialsEmail(email, credentials, plan) {
    console.log('Email enviado a:', email);
    console.log('Contenido del email:');
    console.log(`
        =============================================
        1° CONGRESO CHEQFIRMA
        "ADN humano en el marco de las agendas globales"
        =============================================
        
        ¡Gracias por tu compra!
        
        Plan adquirido: ${plan.toUpperCase()}
        
        TUS CREDENCIALES DE ACCESO:
        Usuario: ${credentials.username}
        Contraseña: ${credentials.password}
        
        FECHAS DEL EVENTO: 19-20 Diciembre 2025
        LUGAR: Manzana de la Rivera, Auditorio "Ruiz Diaz"
               Asunción, Paraguay
        
        Para acceder al congreso:
        1. Ve a la sección "Acceder al Foro" en nuestra web
        2. Ingresa con tus credenciales
        3. ¡Disfruta de los 2 días del congreso!
        
        ¿Problemas? Contacta: info@cheqfirma.com
        
        =============================================
    `);
}

// ============================================
// ACCESO AL FORO
// ============================================

// Validar acceso al foro
function accessForum(e) {
    e.preventDefault();
    
    const username = document.getElementById('forumUsername').value.trim();
    const password = document.getElementById('forumPassword').value;
    
    // Buscar en compras
    const purchases = JSON.parse(localStorage.getItem('purchases'));
    const validAccess = purchases.find(p => 
        p.credentials && 
        p.credentials.username === username && 
        p.credentials.password === password
    );
    
    if (validAccess) {
        // Guardar sesión del foro
        localStorage.setItem('forumSession', JSON.stringify({
            username: username,
            plan: validAccess.plan,
            userId: validAccess.userId,
            loginTime: new Date().toISOString()
        }));
        
        // Mostrar contenido del foro
        showForumContent(validAccess);
    } else {
        alert('Credenciales incorrectas. Por favor verifica tu usuario y contraseña.');
    }
}

function showForumContent(purchase) {
    document.getElementById('forumLoginForm').style.display = 'none';
    document.getElementById('forumContent').style.display = 'block';
    
    // Actualizar información
    document.getElementById('displayUsername').textContent = purchase.credentials.username;
    
    const planNames = {
        'basic': 'Básico',
        'premium': 'Premium',
        'vip': 'VIP'
    };
    document.getElementById('displayPlan').textContent = planNames[purchase.plan];
    
    // Mensaje de bienvenida personalizado
    const users = JSON.parse(localStorage.getItem('users'));
    const user = users.find(u => u.id === purchase.userId);
    if (user) {
        document.getElementById('welcomeMessage').textContent = `Bienvenido, ${user.name}! Disfruta de los 2 días del congreso.`;
    }
}

function logoutForum() {
    localStorage.removeItem('forumSession');
    document.getElementById('forumLoginForm').style.display = 'block';
    document.getElementById('forumContent').style.display = 'none';
    document.getElementById('forumUsername').value = '';
    document.getElementById('forumPassword').value = '';
}

// Verificar si ya hay sesión activa al cargar
function checkForumSession() {
    const session = localStorage.getItem('forumSession');
    if (session) {
        const sessionData = JSON.parse(session);
        const purchases = JSON.parse(localStorage.getItem('purchases'));
        const purchase = purchases.find(p => 
            p.credentials && p.credentials.username === sessionData.username
        );
        
        if (purchase) {
            showForumContent(purchase);
        }
    }
}

// Actualizar initializeApp para incluir nuevas funciones
const originalInitializeApp = initializeApp;
initializeApp = function() {
    originalInitializeApp();
    
    // Iniciar countdown
    initPresaleCountdown();
    
    // Verificar sesión del foro
    checkForumSession();
    
    // Cargar cupón guardado
    const savedCoupon = localStorage.getItem('appliedCoupon');
    if (savedCoupon) {
        appliedCoupon = JSON.parse(savedCoupon);
        updatePricesWithDiscount();
    }
    
    // Actualizar contador de cupos restantes (simulado)
    updateRemainingSpots();
};

// Actualizar cupos restantes (simulado)
function updateRemainingSpots() {
    const purchases = JSON.parse(localStorage.getItem('purchases'));
    const phase1Sales = purchases.filter(p => p.discount >= 40).length;
    const remaining = Math.max(0, 50 - phase1Sales);
    
    const spotsElement = document.getElementById('phase1Spots');
    if (spotsElement) {
        spotsElement.textContent = `${remaining} cupos restantes`;
        
        if (remaining <= 10) {
            spotsElement.style.color = 'var(--danger-color)';
            spotsElement.innerHTML = `<i class="fas fa-fire"></i> ¡Solo ${remaining} cupos!`;
        }
    }
}

// ==================== SISTEMA DE VALIDACIÓN DE EMAIL ====================

// Función para generar token de validación único
function generateValidationToken() {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 15);
    return `${timestamp}-${random}`;
}

// Función para enviar email de validación
function sendEmailValidation(user) {
    const validationUrl = `${window.location.origin}${window.location.pathname}?validate=${user.validationToken}&email=${encodeURIComponent(user.email)}`;
    
    const emailSubject = encodeURIComponent('Valida tu correo electrónico - Congreso CheqFirma 2025');
    const emailBody = encodeURIComponent(`¡Hola ${user.name}!

Gracias por registrarte en el Congreso CheqFirma 2025.

Para completar tu registro y poder iniciar sesión, por favor valida tu correo electrónico haciendo clic en el siguiente enlace:

${validationUrl}

Este enlace es válido por 24 horas.

Si no solicitaste este registro, puedes ignorar este mensaje.

¡Nos vemos en el congreso!

Equipo CheqFirma
cheqfirma@gmail.com`);

    const emailUrl = `mailto:${user.email}?subject=${emailSubject}&body=${emailBody}`;
    
    // Guardar URL para envío
    user.validationEmailUrl = emailUrl;
    user.validationUrl = validationUrl;
    
    // Actualizar usuario en localStorage
    let users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex(u => u.id === user.id);
    if (userIndex !== -1) {
        users[userIndex] = user;
        localStorage.setItem('users', JSON.stringify(users));
    }
    
    return { emailUrl, validationUrl };
}

// Función para mostrar modal de validación de email
function showEmailValidationModal(user) {
    const modal = document.createElement('div');
    modal.id = 'emailValidationModal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
    `;
    
    modal.innerHTML = `
        <div style="background: white; padding: 2rem; border-radius: 15px; max-width: 500px; width: 90%; box-shadow: 0 10px 40px rgba(0,0,0,0.3);">
            <div style="text-align: center; margin-bottom: 2rem;">
                <div style="font-size: 4rem; color: var(--color-primary); margin-bottom: 1rem;">
                    <i class="fas fa-envelope-open-text"></i>
                </div>
                <h2 style="color: var(--color-primary); margin-bottom: 0.5rem;">Valida tu correo electrónico</h2>
                <p style="color: var(--color-gray);">Hemos enviado un enlace de validación a:</p>
                <p style="font-weight: 600; color: var(--color-dark); margin-top: 0.5rem;">${user.email}</p>
            </div>
            
            <div style="background: #FEF3C7; padding: 1rem; border-radius: 10px; border-left: 4px solid #F59E0B; margin-bottom: 1.5rem;">
                <p style="margin: 0; color: #92400E; font-size: 0.9rem;">
                    <i class="fas fa-info-circle"></i> <strong>Importante:</strong> Debes validar tu correo electrónico antes de poder iniciar sesión.
                </p>
            </div>
            
            <div style="margin-bottom: 1.5rem;">
                <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Enlace de validación:</label>
                <div style="display: flex; gap: 0.5rem;">
                    <input type="text" id="validationLinkInput" value="${user.validationUrl}" readonly 
                           style="flex: 1; padding: 0.75rem; border: 2px solid #ddd; border-radius: 8px; font-size: 0.85rem;">
                    <button onclick="copyValidationLink()" style="padding: 0.75rem 1rem; background: var(--color-primary); color: white; border: none; border-radius: 8px; cursor: pointer;">
                        <i class="fas fa-copy"></i>
                    </button>
                </div>
            </div>
            
            <div style="display: flex; flex-direction: column; gap: 0.75rem;">
                <button onclick="openValidationEmail('${user.email}')" style="padding: 1rem; background: var(--color-primary); color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer;">
                    <i class="fas fa-envelope"></i> Abrir cliente de email
                </button>
                <button onclick="closeEmailValidationModal()" style="padding: 0.75rem; background: #e5e7eb; color: var(--color-dark); border: none; border-radius: 8px; cursor: pointer;">
                    Entendido, lo haré más tarde
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

// Función para cerrar modal de validación
function closeEmailValidationModal() {
    const modal = document.getElementById('emailValidationModal');
    if (modal) {
        modal.remove();
    }
}

// Función para copiar enlace de validación
function copyValidationLink() {
    const input = document.getElementById('validationLinkInput');
    if (input) {
        input.select();
        document.execCommand('copy');
        alert('✅ Enlace copiado al portapapeles');
    }
}

// Función para abrir email de validación
function openValidationEmail(email) {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === email);
    if (user && user.validationEmailUrl) {
        window.location.href = user.validationEmailUrl;
    }
}

// Función para validar email con token
function validateEmail(token, email) {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === decodeURIComponent(email) && u.validationToken === token);
    
    if (!user) {
        alert('Token de validación inválido o expirado.');
        return false;
    }
    
    // Verificar si el token expiró
    const expiryDate = new Date(user.validationTokenExpiry);
    if (new Date() > expiryDate) {
        alert('El enlace de validación ha expirado. Por favor solicita uno nuevo.');
        // Generar nuevo token
        user.validationToken = generateValidationToken();
        user.validationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
        sendEmailValidation(user);
        return false;
    }
    
    // Marcar email como validado
    user.emailVerified = true;
    delete user.validationToken;
    delete user.validationTokenExpiry;
    
    // Actualizar en localStorage
    const userIndex = users.findIndex(u => u.id === user.id);
    if (userIndex !== -1) {
        users[userIndex] = user;
        localStorage.setItem('users', JSON.stringify(users));
    }
    
    // Mostrar mensaje de éxito
    alert('✅ ¡Correo electrónico validado exitosamente!\n\nYa puedes iniciar sesión con tu email y contraseña.');
    
    // Abrir modal de login con email prellenado
    const authModal = document.getElementById('authModal');
    if (authModal) {
        authModal.style.display = 'block';
        showAuthTab('login');
        setTimeout(() => {
            const emailInput = document.getElementById('loginEmail');
            if (emailInput) {
                emailInput.value = user.email;
            }
        }, 100);
    } else {
        // Si el modal no está disponible, redirigir
        window.location.hash = '#inicio';
        setTimeout(() => {
            if (typeof showAuthTab === 'function') {
                showAuthTab('login');
            }
        }, 500);
    }
    
    return true;
}

// Función para mostrar modal de reenvío de validación
function showResendValidationModal(user) {
    const modal = document.createElement('div');
    modal.id = 'resendValidationModal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
    `;
    
    modal.innerHTML = `
        <div style="background: white; padding: 2rem; border-radius: 15px; max-width: 500px; width: 90%; box-shadow: 0 10px 40px rgba(0,0,0,0.3);">
            <div style="text-align: center; margin-bottom: 2rem;">
                <div style="font-size: 4rem; color: #F59E0B; margin-bottom: 1rem;">
                    <i class="fas fa-exclamation-triangle"></i>
                </div>
                <h2 style="color: var(--color-primary); margin-bottom: 0.5rem;">Email no validado</h2>
                <p style="color: var(--color-gray);">Debes validar tu correo electrónico antes de iniciar sesión.</p>
            </div>
            
            <div style="background: #FEF3C7; padding: 1rem; border-radius: 10px; border-left: 4px solid #F59E0B; margin-bottom: 1.5rem;">
                <p style="margin: 0; color: #92400E; font-size: 0.9rem;">
                    <i class="fas fa-info-circle"></i> Revisa tu bandeja de entrada en: <strong>${user.email}</strong>
                </p>
            </div>
            
            <div style="display: flex; flex-direction: column; gap: 0.75rem;">
                <button onclick="resendValidationEmail('${user.email}')" style="padding: 1rem; background: var(--color-primary); color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer;">
                    <i class="fas fa-paper-plane"></i> Reenviar email de validación
                </button>
                <button onclick="closeResendValidationModal()" style="padding: 0.75rem; background: #e5e7eb; color: var(--color-dark); border: none; border-radius: 8px; cursor: pointer;">
                    Cerrar
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

// Función para cerrar modal de reenvío
function closeResendValidationModal() {
    const modal = document.getElementById('resendValidationModal');
    if (modal) {
        modal.remove();
    }
}

// Función para reenviar email de validación
function resendValidationEmail(email) {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === email);
    
    if (!user) {
        alert('Usuario no encontrado.');
        return;
    }
    
    // Generar nuevo token
    user.validationToken = generateValidationToken();
    user.validationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
    
    // Enviar nuevo email
    sendEmailValidation(user);
    
    // Actualizar en localStorage
    const userIndex = users.findIndex(u => u.id === user.id);
    if (userIndex !== -1) {
        users[userIndex] = user;
        localStorage.setItem('users', JSON.stringify(users));
    }
    
    closeResendValidationModal();
    alert('✅ Email de validación reenviado. Por favor revisa tu bandeja de entrada.');
}

// Verificar si hay token de validación en la URL al cargar la página
window.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('validate');
    const email = urlParams.get('email');
    
    if (token && email) {
        validateEmail(token, email);
        // Limpiar URL
        window.history.replaceState({}, document.title, window.location.pathname + window.location.hash);
    }
});

// ===================================
// SISTEMA DE VIDEOS DE EXPOSITORES
// ===================================

// Base de datos de videos de expositores
// Formato: { id, nombre, especialidad, videoId (YouTube), thumbnail, descripcion }
const expositoresVideos = [
    {
        id: 'chinda-brandolino',
        nombre: 'Dra. Chinda Brandolino',
        especialidad: 'Médico Legista',
        videoId: '', // Agregar ID de YouTube aquí (ej: 'dQw4w9WgXcQ')
        thumbnail: 'images/expositores/chinda-brandolino.jpg',
        descripcion: 'Autora del Nuevo Libro "Hacia el Reinado del Anticristo"',
        pais: '🇦🇷'
    },
    {
        id: 'julio-razona',
        nombre: 'Abg. Julio Razona',
        especialidad: 'Abogado Criminólogo',
        videoId: '', // Agregar ID de YouTube aquí
        thumbnail: 'images/expositores/julio-razona.jpg',
        descripcion: 'Autor de "Agenda de la Resistencia"',
        pais: '🇦🇷'
    },
    {
        id: 'guillermo-rodriguez',
        nombre: 'Dr. Guillermo Rodríguez Dure',
        especialidad: 'Política Internacional',
        videoId: '', // Agregar ID de YouTube aquí
        thumbnail: 'images/expositores/guillermo-rodriguez.jpg',
        descripcion: 'Diputado Nacional - Política y Bioética',
        pais: '🇵🇾'
    },
    {
        id: 'fernando-griffith',
        nombre: 'Dr. Fernando Griffith',
        especialidad: 'Bioquímico',
        videoId: '', // Agregar ID de YouTube aquí
        thumbnail: 'images/expositores/fernando-griffith.jpg',
        descripcion: 'Ex Ministro de Cultura - Investigador',
        pais: '🇵🇾'
    },
    {
        id: 'edgar-villagra',
        nombre: 'Dr. Edgar Villagra',
        especialidad: 'Inmunólogo',
        videoId: '', // Agregar ID de YouTube aquí
        thumbnail: 'images/expositores/edgar-villagra.jpg',
        descripcion: 'Especialista en Inmunología',
        pais: '🇵🇾'
    },
    {
        id: 'victor-villa',
        nombre: 'Dr. Victor Villa',
        especialidad: 'Médico Forense',
        videoId: '', // Agregar ID de YouTube aquí
        thumbnail: 'images/expositores/victor-villa.jpg',
        descripcion: 'Estudios Forenses sobre ADN',
        pais: '🇵🇾'
    },
    {
        id: 'patricia-callisperis',
        nombre: 'Dra. Patricia Callisperis',
        especialidad: 'Médica Terapéutica',
        videoId: '', // Agregar ID de YouTube aquí
        thumbnail: 'images/expositores/patricia-callisperis.jpg',
        descripcion: 'Terapéutica - CDS y Restauración Celular',
        pais: '🇧🇴'
    },
    {
        id: 'dannia-rios',
        nombre: 'Abg. Dannia Ríos Naciff',
        especialidad: 'Derechos Humanos',
        videoId: '', // Agregar ID de YouTube aquí
        thumbnail: 'images/expositores/dannia-rios.jpg',
        descripcion: 'Derechos Humanos y Educación',
        pais: '🇵🇾'
    },
    {
        id: 'atilio-farina',
        nombre: 'Dr. Atilio Fariña',
        especialidad: 'Médico Genetista',
        videoId: '', // Agregar ID de YouTube aquí
        thumbnail: 'images/expositores/atilio-farina.jpg',
        descripcion: 'Especialista en Genética',
        pais: '🇵🇾'
    },
    {
        id: 'edgar-rolon',
        nombre: 'Prof. Edgar Rolón',
        especialidad: 'Historiador',
        videoId: '', // Agregar ID de YouTube aquí
        thumbnail: 'images/expositores/edgar-rolon.jpg',
        descripcion: 'Historia del ADN Paraguayo',
        pais: '🇵🇾'
    },
    {
        id: 'carmen-candia',
        nombre: 'Prof. Carmen Candia',
        especialidad: 'Historiadora',
        videoId: '', // Agregar ID de YouTube aquí
        thumbnail: 'images/expositores/carmen-candia.jpg',
        descripcion: 'ADN Paraguayo y Comparación Mundial',
        pais: '🇵🇾'
    },
    {
        id: 'juan-puerto',
        nombre: 'Abg. Juan Ramiro Puerto',
        especialidad: 'Derecho Digital',
        videoId: '', // Agregar ID de YouTube aquí
        thumbnail: 'images/expositores/juan-puerto.jpg',
        descripcion: 'Defensa de la Identidad Digital',
        pais: '🇵🇾'
    }
];

// Función para mezclar array aleatoriamente (Fisher-Yates)
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Función para cargar videos de expositores
function loadExpositorVideos() {
    const videosGrid = document.getElementById('videosGrid');
    if (!videosGrid) return;

    // Filtrar solo expositores que tienen videoId
    const videosConContenido = expositoresVideos.filter(expositor => expositor.videoId && expositor.videoId.trim() !== '');
    
    // Si no hay videos, mostrar mensaje
    if (videosConContenido.length === 0) {
        videosGrid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; background: rgba(255, 255, 255, 0.1); border-radius: var(--radius-lg); backdrop-filter: blur(10px);">
                <i class="fas fa-video" style="font-size: 3rem; color: rgba(255, 255, 255, 0.7); margin-bottom: 1rem;"></i>
                <p style="color: rgba(255, 255, 255, 0.9); font-size: 1.1rem;">
                    Los videos de los expositores se agregarán próximamente. 
                    <br>Mantente atento para conocer más sobre nuestros expertos.
                </p>
            </div>
        `;
        return;
    }

    // Mezclar aleatoriamente y tomar máximo 6 videos
    const videosAleatorios = shuffleArray(videosConContenido).slice(0, 6);

    // Generar HTML para cada video
    videosGrid.innerHTML = videosAleatorios.map(expositor => {
        const videoUrl = `https://www.youtube.com/embed/${expositor.videoId}?rel=0&modestbranding=1`;
        const thumbnailUrl = expositor.thumbnail || `https://img.youtube.com/vi/${expositor.videoId}/maxresdefault.jpg`;
        
        return `
            <article class="video-card" style="background: rgba(255, 255, 255, 0.1); border-radius: var(--radius-lg); overflow: hidden; backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.2); transition: all 0.3s ease; cursor: pointer;" onclick="openVideoModal('${expositor.videoId}', '${expositor.nombre}', '${expositor.especialidad}')" onmouseover="this.style.transform='translateY(-5px)'; this.style.boxShadow='0 12px 32px rgba(0,0,0,0.3)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none'">
                <div style="position: relative; width: 100%; padding-top: 56.25%; background: #000; overflow: hidden;">
                    <img src="${thumbnailUrl}" alt="${expositor.nombre}" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover;">
                    <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.3); display: flex; align-items: center; justify-content: center; transition: all 0.3s ease;">
                        <div style="width: 70px; height: 70px; background: rgba(255, 122, 26, 0.9); border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);">
                            <i class="fas fa-play" style="color: white; font-size: 1.8rem; margin-left: 4px;"></i>
                        </div>
                    </div>
                    <div style="position: absolute; bottom: 10px; right: 10px; background: rgba(0, 0, 0, 0.7); color: white; padding: 0.25rem 0.75rem; border-radius: 100px; font-size: 0.75rem; font-weight: 600;">
                        <i class="fas fa-clock"></i> Ver video
                    </div>
                </div>
                <div style="padding: 1.5rem;">
                    <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
                        <span style="font-size: 1.2rem;">${expositor.pais}</span>
                        <span style="background: rgba(255, 255, 255, 0.2); color: white; padding: 0.25rem 0.75rem; border-radius: 100px; font-size: 0.7rem; font-weight: 600;">
                            ${expositor.especialidad}
                        </span>
                    </div>
                    <h3 style="color: white; font-size: 1.1rem; font-weight: 700; margin-bottom: 0.5rem;">
                        ${expositor.nombre}
                    </h3>
                    <p style="color: rgba(255, 255, 255, 0.85); font-size: 0.9rem; line-height: 1.5;">
                        ${expositor.descripcion}
                    </p>
                </div>
            </article>
        `;
    }).join('');
}

// Función para abrir modal de video
function openVideoModal(videoId, nombre, especialidad) {
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 2rem;
        animation: fadeIn 0.3s ease;
    `;
    
    modal.innerHTML = `
        <div style="position: relative; width: 100%; max-width: 900px; background: #000; border-radius: var(--radius-lg); overflow: hidden;">
            <button onclick="this.closest('div[style*=\"position: fixed\"]').remove()" style="position: absolute; top: 10px; right: 10px; background: rgba(255, 255, 255, 0.2); color: white; border: none; width: 40px; height: 40px; border-radius: 50%; cursor: pointer; z-index: 10001; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; transition: all 0.3s ease;" onmouseover="this.style.background='rgba(255, 255, 255, 0.3)'" onmouseout="this.style.background='rgba(255, 255, 255, 0.2)'">
                <i class="fas fa-times"></i>
            </button>
            <div style="position: relative; width: 100%; padding-top: 56.25%;">
                <iframe 
                    src="https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1" 
                    style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none;"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowfullscreen>
                </iframe>
            </div>
            <div style="padding: 1.55rem; background: rgba(255, 255, 255, 0.05);">
                <h3 style="color: white; font-size: 1.3rem; margin-bottom: 0.5rem;">${nombre}</h3>
                <p style="color: rgba(255, 255, 255, 0.8); font-size: 1rem;">${especialidad}</p>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Cerrar al hacer clic fuera del video
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    });
    
    // Cerrar con ESC
    document.addEventListener('keydown', function escHandler(e) {
        if (e.key === 'Escape') {
            modal.remove();
            document.removeEventListener('keydown', escHandler);
        }
    });
}

console.log('%c¡Bienvenido al 1° Congreso CheqFirma! 🧬', 'color: #2563eb; font-size: 20px; font-weight: bold;');
console.log('%cADN humano en el marco de las agendas globales', 'color: #7c3aed; font-size: 14px;');
console.log('%c💰 Sistema de monetización activado', 'color: #10b981; font-size: 14px;');
console.log('%c🎟️ Sistema de preventas y credenciales activado', 'color: #ff6b6b; font-size: 14px;');
console.log('%c📍 Asunción, Paraguay | 19-20 Diciembre 2025', 'color: #f59e0b; font-size: 14px;');
console.log('%c🎥 Sistema de videos de expositores activado', 'color: #8b5cf6; font-size: 14px;');
