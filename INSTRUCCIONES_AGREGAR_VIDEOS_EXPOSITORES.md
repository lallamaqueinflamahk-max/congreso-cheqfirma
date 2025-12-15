# 🎥 INSTRUCCIONES: Cómo Agregar Videos de Expositores

## 📍 Ubicación de la Sección

La sección de videos aparece **justo después de los expositores** y **antes de los testimonios**, diseñada estratégicamente para generar interés y aumentar las ventas de entradas.

---

## 🎯 Características de la Sección

- ✅ **Videos aleatorios**: Se muestran hasta 6 videos aleatorios cada vez que se carga la página
- ✅ **Diseño atractivo**: Fondo azul degradado con efectos visuales
- ✅ **Modal de video**: Al hacer clic, se abre un modal grande para ver el video completo
- ✅ **CTA potente**: Botones llamativos para ver planes y agenda
- ✅ **Responsive**: Se adapta a móviles, tablets y escritorio

---

## 📝 Cómo Agregar Videos

### **Paso 1: Obtener el ID del Video de YouTube**

1. Ve al video de YouTube que quieres agregar
2. Copia la URL del video (ej: `https://www.youtube.com/watch?v=dQw4w9WgXcQ`)
3. El **ID del video** es la parte después de `v=`
   - Ejemplo: Si la URL es `https://www.youtube.com/watch?v=dQw4w9WgXcQ`
   - El ID es: `dQw4w9WgXcQ`

### **Paso 2: Editar el Archivo `script.js`**

1. Abre el archivo `script.js`
2. Busca la sección `// Base de datos de videos de expositores`
3. Encuentra el expositor al que quieres agregar el video
4. Reemplaza el `videoId: ''` con el ID del video

**Ejemplo:**

```javascript
{
    id: 'chinda-brandolino',
    nombre: 'Dra. Chinda Brandolino',
    especialidad: 'Médico Legista',
    videoId: 'dQw4w9WgXcQ', // ← Agregar el ID aquí
    thumbnail: 'images/expositores/chinda-brandolino.jpg',
    descripcion: 'Autora del Nuevo Libro "Hacia el Reinado del Anticristo"',
    pais: '🇦🇷'
}
```

### **Paso 3: Guardar y Probar**

1. Guarda el archivo `script.js`
2. Refresca la página web (F5)
3. Los videos aparecerán automáticamente en la sección

---

## 🎨 Personalización Opcional

### **Cambiar el Número de Videos Mostrados**

En la función `loadExpositorVideos()`, busca esta línea:

```javascript
const videosAleatorios = shuffleArray(videosConContenido).slice(0, 6);
```

Cambia el `6` por el número de videos que quieres mostrar (máximo recomendado: 6-8).

### **Cambiar el Thumbnail (Imagen de Portada)**

Si quieres usar una imagen personalizada en lugar de la de YouTube:

1. Guarda la imagen en `images/expositores/`
2. Actualiza la ruta en el objeto del expositor:

```javascript
thumbnail: 'images/expositores/mi-imagen-personalizada.jpg',
```

---

## 📋 Lista de Expositores Disponibles

Todos los expositores ya están configurados en el sistema. Solo necesitas agregar el `videoId`:

1. ✅ Dra. Chinda Brandolino
2. ✅ Abg. Julio Razona
3. ✅ Dr. Guillermo Rodríguez Dure
4. ✅ Dr. Fernando Griffith
5. ✅ Dr. Edgar Villagra
6. ✅ Dr. Victor Villa
7. ✅ Dra. Patricia Callisperis
8. ✅ Abg. Dannia Ríos Naciff
9. ✅ Dr. Atilio Fariña
10. ✅ Prof. Edgar Rolón
11. ✅ Prof. Carmen Candia
12. ✅ Abg. Juan Ramiro Puerto

---

## 🎯 Estrategia de Contenido

### **Tipos de Videos Recomendados:**

1. **Videos de presentación**: El expositor se presenta y habla de su tema
2. **Videos de conferencias anteriores**: Muestran su experiencia
3. **Videos promocionales**: Hablan específicamente del congreso
4. **Videos educativos**: Muestran su conocimiento sobre el tema

### **Duración Recomendada:**

- **Ideal**: 2-5 minutos (captura atención rápidamente)
- **Máximo**: 10 minutos (para mantener el interés)

---

## ⚠️ Notas Importantes

1. **Solo videos de YouTube**: El sistema está configurado para YouTube. Si tienes videos en otras plataformas, necesitarás modificar el código.

2. **Videos públicos o no listados**: Asegúrate de que los videos sean públicos o "no listados" (no privados), o no se podrán ver.

3. **Si no hay videos**: Si ningún expositor tiene `videoId`, se mostrará un mensaje amigable indicando que los videos se agregarán próximamente.

4. **Orden aleatorio**: Los videos se muestran en orden aleatorio cada vez que se carga la página para dar visibilidad a todos.

---

## 🚀 Ejemplo Completo

```javascript
{
    id: 'julio-razona',
    nombre: 'Abg. Julio Razona',
    especialidad: 'Abogado Criminólogo',
    videoId: 'ABC123xyz', // ← ID del video de YouTube
    thumbnail: 'images/expositores/julio-razona.jpg',
    descripcion: 'Autor de "Agenda de la Resistencia"',
    pais: '🇦🇷'
}
```

---

## ✅ Checklist

- [ ] Obtener IDs de videos de YouTube
- [ ] Editar `script.js` con los IDs
- [ ] Guardar el archivo
- [ ] Probar en la página web
- [ ] Verificar que los videos se muestren correctamente
- [ ] Probar el modal de video (clic en la tarjeta)
- [ ] Verificar en móvil y escritorio

---

## 🆘 Solución de Problemas

### **Los videos no aparecen:**
- Verifica que el `videoId` esté correcto (sin espacios, sin comillas extra)
- Asegúrate de que el video de YouTube sea público o no listado
- Revisa la consola del navegador (F12) para ver errores

### **El modal no se abre:**
- Verifica que el JavaScript esté cargado correctamente
- Revisa que no haya errores en la consola

### **Los videos se ven mal en móvil:**
- La sección es responsive, pero si hay problemas, verifica el CSS

---

**¡Listo!** Una vez que agregues los `videoId`, los videos aparecerán automáticamente en la sección. 🎉

