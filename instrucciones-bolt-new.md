# 🚀 GUÍA: Subir Horizon UI a Bolt.new

## ⚠️ IMPORTANTE - Lee esto primero

Este es un BUILD COMPILADO (código ya procesado). Bolt.new podrá mostrarlo pero con limitaciones:
- ✅ La app funcionará visualmente
- ❌ NO podrás editar fácilmente los componentes React
- ❌ NO podrás modificar la lógica de negocio
- ✅ Podrás hacer cambios menores en HTML/CSS

---

## 📦 MÉTODO 1: Subir archivo por archivo (RECOMENDADO)

### Paso 1: Ir a Bolt.new
1. Abre tu navegador
2. Ve a: https://bolt.new
3. Haz clic en "Start building"

### Paso 2: Crear estructura de archivos

En bolt.new, pídele que cree esta estructura:

```
/
├── index.html
└── assets/
    └── [todos los archivos]
```

**Prompt para bolt.new:**
```
Crea un proyecto con la siguiente estructura:
- Un archivo index.html en la raíz
- Una carpeta llamada "assets"
```

### Paso 3: Subir index.html

1. Abre el archivo `index.html` en un editor de texto
2. Copia TODO el contenido
3. En bolt.new, pega el contenido en el archivo index.html

### Paso 4: Subir archivos de assets/

**Opción A - Si bolt.new permite arrastrar archivos:**
1. Arrastra la carpeta `assets/` completa a bolt.new
2. Confirma la subida

**Opción B - Si no funciona arrastrar:**
Tendrás que decirle a bolt.new:
```
Necesito que aceptes archivos externos. 
Voy a subir los archivos de la carpeta assets/.
```

Luego sube estos archivos críticos (los más importantes):
- `index-4c313002.js` (514KB - archivo principal)
- `index-689ba929.css` (116KB - estilos)
- Los otros .js y .css según sea necesario

---

## 📦 MÉTODO 2: Crear proyecto desde cero en Bolt

Si el Método 1 no funciona, usa este prompt en bolt.new:

```
Crea una aplicación React con Vite que:
1. Tenga un archivo index.html con estas características:
   - Carga Google Fonts (Bebas Neue e Inter)
   - Tiene un div#root
   - Carga /assets/index-4c313002.js
   - Carga /assets/index-689ba929.css

2. Crea una carpeta assets/ donde pueda subir:
   - Archivos JavaScript compilados (.js)
   - Archivos CSS compilados (.css)

El código está pre-compilado, solo necesito la estructura para cargar los assets.
```

Luego sube los archivos uno por uno.

---

## 🔧 MÉTODO 3: Desplegar directamente (alternativa)

Si bolt.new no te deja subir tantos archivos, considera:

### A) Netlify/Vercel (GRATIS)
1. Descarga la carpeta `bolt-new-files/`
2. Arrastra toda la carpeta a:
   - https://app.netlify.com/drop
   - O https://vercel.com (con git)

### B) GitHub Pages
1. Sube la carpeta `bolt-new-files/` a un repo
2. Activa GitHub Pages
3. Tu app estará en: `https://tuusuario.github.io/repo`

---

## 📋 Archivos incluidos

- `index.html` - Página principal (LIMPIA, sin scripts de Horizon)
- `assets/` - Todos los archivos compilados:
  - JavaScript (React + lógica)
  - CSS (estilos)
  - SVG icons (íconos)

---

## ⚡ Prueba rápida

Para verificar que funciona:
1. Abre `index.html` en tu navegador local
2. Si ves la app funcionando → los archivos están bien
3. Si ves una página en blanco → falta configurar las rutas

---

## 🆘 Problemas comunes

### "Cannot find module"
- Los archivos en assets/ no se cargaron correctamente
- Verifica que la ruta `/assets/` sea correcta

### "Página en blanco"
- Abre la consola del navegador (F12)
- Revisa errores de carga de archivos

### "404 Not Found"
- Las rutas de los archivos no coinciden
- Verifica que todos los archivos estén en `/assets/`

---

## 🎯 LIMITACIONES

Recuerda que este es código compilado:
- NO puedes editar componentes React fácilmente
- NO puedes cambiar la lógica del negocio
- Solo puedes hacer cambios superficiales (colores, textos en HTML)

**Para edición completa, necesitarías el código fuente original.**

---

## 📞 ¿Necesitas ayuda?

Si bolt.new no acepta los archivos o tienes problemas:
1. Prueba con Netlify Drop (más fácil)
2. O dime qué funcionalidades quieres y te creo una versión nueva desde cero

---

✅ **LISTO PARA SUBIR**
Todos los archivos están en la carpeta: `bolt-new-files/`
