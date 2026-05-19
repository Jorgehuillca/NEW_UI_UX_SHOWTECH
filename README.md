# NEW_UI_UX_SHOWTECH

> Renovación y modernización del sitio web corporativo de **SHOWTECH SOLUTIONS SAC** — organizadores de eventos en Lima, Perú.

---

## Descripción

Rediseño completo del frontend y estructura backend del sitio `showtechsolutions.com.pe`, desarrollado íntegramente con código (sin WordPress ni constructores visuales).

**Estética aplicada:** Lujo Cinematográfico — diseño oscuro premium con tipografía editorial, animaciones de scroll y microinteracciones CSS.

---

## Tecnologías utilizadas

| Capa | Tecnología |
|------|------------|
| Frontend | HTML5 semántico, CSS3 modular, JavaScript ES6+ vanilla |
| Backend | PHP 7.4+ (formulario de contacto con `mail()`) |
| Fuentes | Google Fonts — Cormorant Garamond + Sora |
| Iconos | Font Awesome 6.5 (CDN) |
| Control de versiones | Git + GitHub |

---

## Estructura del proyecto

```
showtech/
│
├── index.html          → Página de Inicio
├── nosotros.html       → Página Nosotros
├── servicios.html      → Página Servicios
├── contacto.html       → Página Contacto
│
├── css/
│   ├── style.css       → Estilos globales (variables, navbar, footer, utilidades)
│   ├── index.css       → Estilos exclusivos de Inicio
│   ├── nosotros.css    → Estilos exclusivos de Nosotros
│   ├── servicios.css   → Estilos exclusivos de Servicios
│   └── contacto.css    → Estilos exclusivos de Contacto + formulario
│
├── js/
│   ├── main.js         → Navbar, scroll reveal, contadores, parallax
│   └── contact.js      → Validación y envío del formulario
│
├── backend/
│   ├── contact.php     → Procesamiento del formulario (envío por mail())
│   └── logs/           → Log local de contactos (fallback si mail() falla)
│       └── .gitkeep
│
└── assets/
    └── img/            → Imágenes y logo (agregar archivos reales)
        └── .gitkeep
```

---

## Instalación y ejecución local

### Requisitos
- Navegador moderno (Chrome, Firefox, Edge, Safari)
- Para el formulario de contacto: servidor con PHP 7.4+ (XAMPP, WAMP, Laragon, etc.)

### Pasos

**1. Clonar el repositorio**
```bash
git clone https://github.com/Jorgehuillca/NEW_UI_UX_SHOWTECH.git
cd NEW_UI_UX_SHOWTECH
```

**2. Frontend solo (sin formulario PHP)**

Abrir directamente `index.html` en el navegador. Todas las páginas y estilos funcionan sin servidor.

**3. Con servidor local (para el formulario)**

Con XAMPP/Laragon, copiar la carpeta del proyecto dentro de `htdocs/` y acceder vía:
```
http://localhost/showtech/
```

---

## Configuración del backend (formulario)

Antes de subir a producción, editar `backend/contact.php` y actualizar:

```php
$DEST_EMAIL   = 'contacto@showtechsolutions.com.pe'; // ← email real destino
```

El formulario incluye:
- Validación del lado del cliente (JS) y del servidor (PHP)
- Campo honeypot anti-spam
- Fallback: si `mail()` falla, guarda el contacto en `backend/logs/contacts.log`
- Respuesta JSON para manejo asíncrono (fetch)

---

## Assets — imágenes a reemplazar

Los textos `<!-- REEMPLAZAR -->` en los HTML indican donde insertar imágenes o videos reales del cliente. Actualmente usan URLs de Unsplash como placeholders.

| Sección | Descripción |
|--------|------------|
| Hero principal | Video o foto de gran evento de SHOWTECH |
| About preview | Video corto del equipo en acción |
| Event cards | Fotos reales de Fiestas, Bodas, Corporativos |
| Page heroes | Fotos de portada para cada subpágina |

---

## Funcionalidades implementadas

- [x] Navbar fija con efecto glassmorphism al hacer scroll
- [x] Menú hamburger animado para móviles
- [x] Animaciones de entrada por scroll (IntersectionObserver)
- [x] Contadores animados de estadísticas
- [x] Parallax sutil en el hero
- [x] Formulario de contacto con validación en tiempo real
- [x] Select de tipo de evento en el formulario
- [x] FAQ con `<details>` nativo animado
- [x] Botón de WhatsApp flotante con animación de pulso
- [x] Mapa de Google Maps embebido (filtro oscuro con hover a color)
- [x] Diseño responsive (móvil, tablet, escritorio)
- [x] CSS modular por página
- [x] Accesibilidad: roles ARIA, labels, navegación por teclado

---

## Notas para el administrador del hosting

1. **PHP mail()**: verificar que el hosting tiene habilitado `mail()` o configurar SMTP con PHPMailer.
2. **Número de WhatsApp**: reemplazar `51999999999` por el número real en todos los HTML y `backend/contact.php`.
3. **Google Maps**: actualizar el `src` del `<iframe>` en `contacto.html` con la URL real de la ubicación.
4. **Logo**: colocar el logo real en `assets/img/logo.png` y descomentar la etiqueta `<img>` en la navbar de cada página.
5. **Redes sociales**: actualizar los `href="#"` de todos los íconos de RRSS con los URLs reales.

---

## Contribuidores

- **Jorge Huillca** — Desarrollo frontend & backend, diseño UX/UI
- Practicante en SHOWTECH SOLUTIONS SAC

---

## Licencia

© 2026 SHOWTECH SOLUTIONS SAC · Todos los derechos reservados.  
Proyecto de práctica profesional — SENATI Villa El Salvador.
