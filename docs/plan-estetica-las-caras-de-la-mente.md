# Plan: estética de la página «Las caras de la mente» (debajo del filtro)

Objetivo: que todo lo que hay **debajo del filtro de contenidos** de `/works/bloom-states` se vea como el resto de la web (home y Sobre mí), sin cambiar el contenido ni la estructura de datos.

## Reglas que no se pueden romper

1. **No tocar nada por encima del filtro de contenidos.** Eso es, en `app/works/[id]/page.tsx` y `page.module.css`: `.wrap`, `.hero`, `.media`, `.grain`, `.back`, `.card`, `.story`, `.title`, `.lead` y `.more`. Tampoco el filtro: `components/project/ProjectTabs.tsx` y su CSS. Sí se pueden tocar `.actions` y `.reread` (están debajo).
2. **Nada de texto gris** en la página del proyecto. No usar `--ink-70` ni `--ink-40` para texto, ni `opacity` en textos. Toda la jerarquía se hace con tamaño, peso, fuente y color.
3. **Nada de líneas separadoras**: ni `border-top`/`border-bottom` entre elementos, ni `.hr`. Los contornos finos de imágenes (`box-shadow: inset 0 0 0 1px var(--line)`) sí se quedan.
4. **Una sola columna.** Dos columnas solo cuando el contenido es un par o un grupo de tarjetas: los dos pósters, retrato + entidad, las tarjetas de tipografías y las muestras de color.
5. No cambiar textos ni datos de `lib/project-pages.ts`, salvo lo que se pide abajo.
6. Seguir `CLAUDE.md`: usar `graphify query/explain` antes de buscar o leer código. Al terminar, ejecutar `graphify update .`.
7. **No arrancar otro `next dev`** sobre esta carpeta. Ya hay uno en el puerto 3000, y dos servidores comparten `.next` y la rompen (error "Could not find the module … in the React Client Manifest"). Para comprobar, usar `curl http://localhost:3000/works/bloom-states`.

## Lenguaje visual de la web (a lo que hay que acercarse)

Sale de `app/globals.css`, `components/AboutBio.module.css`, `components/FeaturedTabs.module.css`, `components/AboutCarousel.module.css`, `components/AboutSwitch.module.css` y `app/page.module.css`:

| Elemento | Cómo es en la web |
|---|---|
| Título de bloque (home: «Selected works») | `var(--serif)`, 800, `clamp(1.6rem, 3.2vw, 2.6rem)`, `letter-spacing: -0.02em` |
| Subtítulo (Sobre mí: `.lead`) | `var(--read)` (Parkinsans), 600, `clamp(1.15rem, 1.6vw, 1.45rem)`, `line-height: 1.2` |
| Texto | `var(--read)`, `clamp(0.95rem, 1.05vw, 1.05rem)`, `line-height: 1.55` |
| Resaltado `**palabra**` | `<em>`: `font-style: normal; font-family: var(--read); font-weight: 600;` en color (`--blue` en la bio, `--teal-deep` en Experiencia). Aquí: `var(--tone)` |
| Etiquetas pequeñas | `var(--mono)`, `0.64–0.72rem`, mayúsculas, `letter-spacing: 0.14–0.16em` |
| Tarjeta | cristal: `background: var(--glass); backdrop-filter: blur(10px) saturate(1.4); border-radius: var(--radius); box-shadow: 0 8px 32px rgba(23, 21, 15, 0.12);` sin borde |
| Imagen | `border-radius: var(--radius)`, fondo `var(--accent-soft)`, grano y contorno fino (ya lo hace `Picture`) |
| Botones redondos | 44px, `--teal-deep` (anterior) y `--blue` (siguiente), hover en `--ink`, `scale(1.05)` (`FeaturedTabs .prev/.next`) |
| Puntos de carrusel | `AboutCarousel .dot/.dotOn`: 8px, el activo 22px de ancho |
| Cambio de contenido | fundido corto: `AboutBio .text { animation: textIn 0.45s var(--ease) }` con `translateY(8px)` |

`--tone` ya está definido en `<main>`: `--teal-deep` para ilustración y `--blue` para diseño.

## Problemas detectados (debajo del filtro)

1. **La jerarquía está rota.** El `h2` de cada sección (`ProjectSections.module.css .head h2`, hasta 4.8rem) es tan grande como el título del proyecto. Los subtítulos `.sub` (serif 800, hasta 2.3rem) compiten con él. En el resto de la web los títulos de bloque son mucho más contenidos.
2. **Los resaltados no son los de la web.** `.text em` va en negro con peso 700, y en Sobre mí son Parkinsans 600 en color.
3. **Hay dos estilos de tarjeta ajenos a la web.** Las tipografías (`.font`) llevan borde y fondo `--paper`, y las píldoras de impresión (`.chips li`) llevan borde de línea. La web usa cristal sin borde.
4. **Las filas de datos de Tamaños y Retícula** (`.rows`) usan valores serif 800 alineados a la derecha. No se parecen a la tarjeta de datos de la cabecera (`dt` mono arriba, `dd` Parkinsans), que es el patrón de la propia página.
5. **El selector de trastornos** (`Illustrations.tsx`) usa los `.chip` globales, que al estar activos se ponen negros, y su nombre va en serif 800. No encaja con los controles de la web.
6. **Los huecos de imagen vacíos** (`Picture.module.css .empty::before`) tienen un borde discontinuo con aspecto de wireframe.
7. **El cambio de pestaña** no tiene transición coherente. Los `.reveal` dentro de los paneles ocultos se animan desde 34px solo la primera vez que se ve cada pestaña, y la segunda vez aparece de golpe.
8. **Los espacios verticales** entre título de sección, bloques y subapartados son irregulares y muy grandes para una página con pestañas.

## Pasos

### 1. Cabecera de cada sección (`components/project/ProjectSections.module.css`)

- `.head`: pasa a ser una columna con el número encima del título: `flex-direction: column; align-items: flex-start; gap: 8px`.
- `.num`: etiqueta mono `0.68rem`, `letter-spacing: 0.16em`, color `var(--tone)`.
- `.head h2`: `font-size: clamp(1.6rem, 3.2vw, 2.6rem)`, `line-height: 1.05`, `letter-spacing: -0.02em`. Mantener el punto `em` en `var(--tone)` y quitarle la cursiva (`font-style: normal`, como en `globals.css h2 em`).
- Borrar la regla de móvil que fija el tamaño de `.head h2`, porque el `clamp` ya basta.

### 2. Subtítulos y texto

- `.sub`: `font-family: var(--read); font-weight: 600; font-size: clamp(1.15rem, 1.6vw, 1.45rem); line-height: 1.2; letter-spacing: -0.01em; margin-bottom: 0.8em`. Mantener `.subNum` (mono `0.68rem`) pero en `var(--tone)`.
- `.text p`: `font-size: clamp(0.95rem, 1.05vw, 1.05rem); line-height: 1.55`, y `.text p + p { margin-top: 0.9em }`.
- `.text em`: `font-style: normal; font-family: var(--read); font-weight: 600; color: var(--tone);`.
- `.text .note`: `font-size: 0.85rem`, en `var(--ink)` y sin gris.

### 3. Espaciado

- `.section`: `margin-top: clamp(32px, 5vh, 56px)`.
- `.block`: `margin-top: clamp(24px, 4vh, 40px)`. `.block + .block`: `margin-top: clamp(56px, 8vh, 96px)`.
- `.split` `gap`: `clamp(20px, 3vh, 32px)`.
- En `app/works/[id]/page.module.css`, solo `.actions`: `margin-top: clamp(56px, 8vh, 96px)`.

### 4. Cambio de pestaña con fundido (sin `.reveal` dentro de los paneles)

- En `ProjectSections.tsx`, quitar la clase `reveal` de la `<header>` de cada sección y de todos los `div` de bloque (`${styles.block} … reveal` pasa a `${styles.block} …`). El filtro (`ProjectTabs`) conserva su `reveal`; no se toca.
- En `ProjectSections.module.css`, añadir a `.section`: `animation: sectionIn 0.45s var(--ease);` con `@keyframes sectionIn { from { opacity: 0; transform: translateY(8px); } }`, y `@media (prefers-reduced-motion: reduce) { .section { animation: none; } }`. Como el panel pasa de `hidden` a visible, la animación se repite en cada cambio de pestaña.

### 5. Tarjetas de cristal en lugar de bordes

- `.font`: quitar `border` y `background: var(--paper)` y poner la tarjeta de cristal de la tabla. Padding `24px 26px 26px`.
- `.fontName`: `font-family: var(--read); font-weight: 600; font-size: clamp(1.15rem, 1.6vw, 1.4rem); line-height: 1.15`.
- `.font li`: mono `0.68rem`, en `var(--ink)`.
- `.chips li` (CMYK, 300 ppp, sangre): quitar el `border` y usar fondo `var(--glass)`, `backdrop-filter`, `box-shadow: 0 8px 32px rgba(23, 21, 15, 0.12)`, `padding: 0.7em 1.2em` y mono `0.66rem` en mayúsculas.

### 6. Datos de Tamaños y Retícula, como la tarjeta de la cabecera

El patrón es `app/works/[id]/page.module.css .card` (cristal, `dt` mono arriba y `dd` Parkinsans debajo).

- En `ProjectSections.module.css`, sustituir el estilo de `.rows`:
  - `.rows`: tarjeta de cristal (tabla de arriba), `padding: 22px 26px`, `display: grid; gap: 14px`, `width: fit-content; min-width: min(100%, 320px); margin-top: 14px`.
  - `.rows > div`: `display: block; padding: 0` (sin `justify-content`).
  - `.rows dt`: mono `0.64rem`, `letter-spacing: 0.14em`, mayúsculas, `var(--ink)`.
  - `.rows dd`: `margin: 4px 0 0; font-family: var(--read); font-weight: 600; font-size: 1rem; text-align: left`.
- Retícula: los tres grupos van como tarjetas una al lado de otra. Es un grupo de tarjetas, así que entra en la excepción de la regla 4.
  - En `ProjectSections.tsx`, bloque `specs`, sustituir el `b.groups.map(...)` por:

    ```tsx
    <div className={styles.groups}>
      {b.groups.map((g, k) => (
        <div key={k} className={styles.groupCard}>
          <h3 className={styles.kicker}>{L(g.title)}</h3>
          <dl className={styles.facts}>
            {g.rows.map((r, n) => (
              <div key={n}>
                <dt>{L(r.label)}</dt>
                <dd>{L(r.value)}</dd>
              </div>
            ))}
          </dl>
        </div>
      ))}
    </div>
    ```

  - CSS:
    - `.groups { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 14px; margin-top: 20px; max-width: 940px; }`
    - `.groupCard`: la tarjeta de cristal, `padding: 22px 26px`.
    - `.facts { display: grid; gap: 14px; }`, con `dt`/`dd` iguales que `.rows dt`/`.rows dd`.
    - Borrar `.group` y `.group:first-of-type`, que ya no se usan.

### 7. Selector de ilustraciones (`components/project/Illustrations.tsx` + `.module.css`)

Pasarlo al patrón del carrusel de la home (`FeaturedTabs`) y de Sobre mí (`AboutCarousel`): flechas redondas, contador y puntos. No usar `.chip`.

- **Estructura:**
  - Una fila superior con el nombre del trastorno a la izquierda (`.name`) y, a la derecha, contador `01 / 09` (mono `0.72rem`, `letter-spacing: 0.14em`) más dos botones redondos de 44px: anterior en `--teal-deep`/`--on-teal` y siguiente en `--blue`/`--on-blue`, hover `background: var(--ink); color: var(--cream); transform: scale(1.05)`.
  - Debajo, el par de imágenes (`.pair`, se queda en 2 columnas, `max-width: 940px`).
  - Debajo del par, los puntos de `AboutCarousel`: `button` de 8×8px, `border-radius: 4px`, `background: var(--ink)`, `opacity: 0.25`; el activo con `width: 22px; opacity: 1`, transición `width 0.35s cubic-bezier(0.22, 1, 0.36, 1)`. Cada punto lleva `aria-label` con el nombre y `aria-current` si está activo.
- **Flecha:** crear `components/project/Arrow.tsx` con el mismo SVG que `FeaturedTabs.tsx` (`Arrow({ left })`) y usarlo en los botones. No tocar el `Arrow` de `page.tsx`.
- **Teclado:** flechas ← → cambian de trastorno cuando el foco está en el selector. Los botones llevan `aria-label` (añadir `prev`/`next` a `t.project` en `lib/i18n.ts`, en en y es: «Previous»/«Next», «Anterior»/«Siguiente»).
- **Nombre:** `.name` en `var(--read)` 600, `clamp(1.15rem, 1.6vw, 1.45rem)`. Si hay nombre completo (`full`), mostrar las siglas como etiqueta mono encima (por ejemplo `TEA` arriba y «Trastorno del espectro autista» debajo).
- Mantener la animación `pairIn` al cambiar.
- **Móvil (≤760px):** el contador y las flechas pasan debajo del nombre, alineados a la izquierda.

### 8. Huecos de imagen vacíos (`components/project/Picture.module.css`)

- Borrar la regla `.empty::before`, la del borde discontinuo.
- `.hint`: mantener `var(--ink)`. Quitar `opacity: 0.8` de `.icon`.
- `.label`: la etiqueta «Imagen pendiente» pasa a píldora de cristal, como `.file`: `padding: 0.45em 1em; border-radius: 100px; background: var(--glass); box-shadow: 0 8px 32px rgba(23, 21, 15, 0.12)`.
- `.what`: `font-size: 0.85rem`.
- No tocar el resto de `Picture` (contorno fino, grano y radio ya son los de la web).

### 9. Muestras de color

- `.swatch`: añadir `box-shadow: 0 8px 32px rgba(23, 21, 15, 0.12)` además del contorno fino, como las tarjetas de la web. `border-radius: var(--radius)` ya está.
- `.swatch li`: mono `0.68rem`, con el color de texto que ya tienen (blanco en las oscuras y `#17150f` en la blanca).

### 10. Comprobación

1. `npx tsc --noEmit -p .` sin errores.
2. `curl -s http://localhost:3000/works/bloom-states` devuelve 200 y contiene los 8 paneles (`<div id="briefing">`, `… id="reticula" hidden>`). Repetir con `-H "Cookie: lang=en"`.
3. Buscar texto gris en el código de la página: `rg "ink-70|ink-40" components/project app/works/\[id\]` no debe devolver usos en `color:`. El único `--ink-40` permitido era el del borde discontinuo, que se elimina.
4. Buscar separadores: `rg "border-(top|bottom)" components/project` no devuelve nada.
5. Confirmar con `git diff app/works/\[id\]/page.tsx components/project/ProjectTabs.*` que no ha cambiado nada por encima del filtro. En `page.module.css` solo puede cambiar `.actions`.
6. `graphify update .`.

## Fuera de alcance (vistos al analizar, no tocar ahora)

- El `.chip.on` global (filtros de `/works`) se pone negro en lugar de azul. Afecta a otra página.
- La home y Sobre mí usan `--ink-70` en algunos textos secundarios. La regla de «nada de gris» es solo para esta página.
