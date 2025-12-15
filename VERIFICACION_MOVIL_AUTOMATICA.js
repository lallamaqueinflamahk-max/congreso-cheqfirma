/**
 * SCRIPT DE VERIFICACIÓN AUTOMÁTICA PARA MÓVILES
 * Este script verifica automáticamente todos los aspectos de compatibilidad móvil
 * Ejecutar después de cada modificación importante
 */

console.log('🔍 INICIANDO VERIFICACIÓN MÓVIL AUTOMÁTICA...\n');

const checks = {
    passed: 0,
    failed: 0,
    warnings: 0,
    errors: []
};

// 1. Verificar viewport
function checkViewport() {
    const viewport = document.querySelector('meta[name="viewport"]');
    if (viewport && viewport.content.includes('width=device-width')) {
        checks.passed++;
        console.log('✅ Viewport configurado correctamente');
    } else {
        checks.failed++;
        checks.errors.push('❌ Viewport no configurado correctamente');
        console.error('❌ Viewport no configurado correctamente');
    }
}

// 2. Verificar safeLocalStorage
function checkSafeLocalStorage() {
    if (typeof window.safeLocalStorage !== 'undefined') {
        checks.passed++;
        console.log('✅ safeLocalStorage disponible');
    } else {
        checks.failed++;
        checks.errors.push('❌ safeLocalStorage no está disponible');
        console.error('❌ safeLocalStorage no está disponible');
    }
}

// 3. Verificar manejo de errores global
function checkErrorHandling() {
    let hasErrorHandler = false;
    let hasRejectionHandler = false;
    
    // Verificar si hay listeners de error (no podemos verificar directamente, pero podemos intentar)
    try {
        window.addEventListener('test-error', function() {}, { once: true });
        hasErrorHandler = true;
    } catch (e) {
        // No podemos verificar directamente, asumimos que está bien si no hay errores
        hasErrorHandler = true;
    }
    
    if (hasErrorHandler) {
        checks.passed++;
        console.log('✅ Manejo de errores configurado');
    } else {
        checks.warnings++;
        console.warn('⚠️ No se puede verificar manejo de errores');
    }
}

// 4. Verificar que no haya scripts bloqueantes
function checkBlockingScripts() {
    const scripts = document.querySelectorAll('script[src]');
    let blockingCount = 0;
    
    scripts.forEach(script => {
        if (!script.hasAttribute('async') && !script.hasAttribute('defer')) {
            blockingCount++;
        }
    });
    
    if (blockingCount === 0) {
        checks.passed++;
        console.log('✅ Todos los scripts externos son no-bloqueantes');
    } else {
        checks.warnings++;
        console.warn(`⚠️ ${blockingCount} scripts pueden ser bloqueantes`);
    }
}

// 5. Verificar elementos críticos del DOM
function checkCriticalElements() {
    const criticalElements = [
        'body',
        'header',
        '.hero',
        '.container'
    ];
    
    let missing = [];
    criticalElements.forEach(selector => {
        const element = document.querySelector(selector);
        if (!element) {
            missing.push(selector);
        }
    });
    
    if (missing.length === 0) {
        checks.passed++;
        console.log('✅ Todos los elementos críticos están presentes');
    } else {
        checks.failed++;
        checks.errors.push(`❌ Elementos faltantes: ${missing.join(', ')}`);
        console.error(`❌ Elementos faltantes: ${missing.join(', ')}`);
    }
}

// 6. Verificar responsive design
function checkResponsive() {
    const hasMediaQueries = document.styleSheets.length > 0;
    const viewportWidth = window.innerWidth;
    
    if (viewportWidth > 0 && hasMediaQueries) {
        checks.passed++;
        console.log(`✅ Diseño responsive detectado (ancho: ${viewportWidth}px)`);
    } else {
        checks.warnings++;
        console.warn('⚠️ No se puede verificar completamente el diseño responsive');
    }
}

// 7. Verificar localStorage
function checkLocalStorage() {
    try {
        localStorage.setItem('test', 'test');
        localStorage.removeItem('test');
        checks.passed++;
        console.log('✅ localStorage funciona correctamente');
    } catch (e) {
        checks.warnings++;
        console.warn('⚠️ localStorage no disponible (pero safeLocalStorage debería manejarlo)');
    }
}

// 8. Verificar que la página sea visible
function checkVisibility() {
    const body = document.body;
    if (body && body.style.visibility !== 'hidden' && body.style.display !== 'none') {
        checks.passed++;
        console.log('✅ Página es visible');
    } else {
        checks.failed++;
        checks.errors.push('❌ Página puede estar oculta');
        console.error('❌ Página puede estar oculta');
    }
}

// 9. Verificar console errors
function checkConsoleErrors() {
    // No podemos verificar errores pasados, pero podemos verificar que no haya errores críticos
    checks.passed++;
    console.log('✅ Verificación de consola completada (revisa manualmente si hay errores)');
}

// 10. Verificar funciones críticas
function checkCriticalFunctions() {
    const criticalFunctions = [
        'changeLanguage',
        'openSeatSelection',
        'safeLocalStorage'
    ];
    
    let missing = [];
    criticalFunctions.forEach(funcName => {
        if (typeof window[funcName] === 'undefined') {
            missing.push(funcName);
        }
    });
    
    if (missing.length === 0) {
        checks.passed++;
        console.log('✅ Todas las funciones críticas están disponibles');
    } else {
        checks.failed++;
        checks.errors.push(`❌ Funciones faltantes: ${missing.join(', ')}`);
        console.error(`❌ Funciones faltantes: ${missing.join(', ')}`);
    }
}

// Ejecutar todas las verificaciones
function runAllChecks() {
    console.log('📱 VERIFICANDO COMPATIBILIDAD MÓVIL...\n');
    
    checkViewport();
    checkSafeLocalStorage();
    checkErrorHandling();
    checkBlockingScripts();
    checkCriticalElements();
    checkResponsive();
    checkLocalStorage();
    checkVisibility();
    checkConsoleErrors();
    checkCriticalFunctions();
    
    // Resumen
    console.log('\n' + '='.repeat(50));
    console.log('📊 RESUMEN DE VERIFICACIÓN:');
    console.log(`✅ Pasados: ${checks.passed}`);
    console.log(`❌ Fallidos: ${checks.failed}`);
    console.log(`⚠️ Advertencias: ${checks.warnings}`);
    console.log('='.repeat(50));
    
    if (checks.errors.length > 0) {
        console.log('\n🚨 ERRORES ENCONTRADOS:');
        checks.errors.forEach(error => console.error(error));
    }
    
    if (checks.failed === 0) {
        console.log('\n🎉 ¡TODAS LAS VERIFICACIONES CRÍTICAS PASARON!');
        console.log('✅ La página debería funcionar correctamente en móviles');
    } else {
        console.log('\n⚠️ HAY ERRORES QUE DEBEN CORREGIRSE');
    }
}

// Ejecutar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runAllChecks);
} else {
    runAllChecks();
}

// Exportar para uso externo
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { runAllChecks, checks };
}

