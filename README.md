# LEXORA — Premium Law Firm

LEXORA is a fictional international law firm website built as a frontend demonstration. It pairs an editorial, dark luxury visual system with an interactive Three.js justice scale, scroll-driven motion, and a responsive set of firm information sections.

## Technologies

- React and JavaScript
- Vite
- Three.js with React Three Fiber and Drei
- GSAP and ScrollTrigger
- Lucide React
- CSS

The site has no backend, API keys, or paid services. The contact form validates locally in the browser and does not send or store submissions.

## Run locally

Requirements: Node.js 20.19+ and npm.

```bash
npm install
npm run dev
```

Vite prints the local development URL after startup.

## Production build

```bash
npm run build
npm run preview
```

The static production files are written to `dist/`.

## Project structure

```text
src/
  components/
    layout/       Navigation, footer, and loading curtain
    sections/     Hero, about, practice, team, process, contact, and more
    three/        R3F scene, justice scale, camera, and lighting
    ui/           Buttons, headings, and animated counters
  data/           Navigation and demonstration content
  hooks/          Responsive state and GSAP reveal system
  styles/         Global design system and reduced-motion rules
public/
  assets/         Local fictional attorney portrait illustrations
```

## The 3D scene

`Scene3D.jsx` renders a real React Three Fiber scene. `JusticeScales.jsx` builds the scale from Three.js cylinders, spheres, torus rings, boxes, cones, and a lathed bowl profile. Each pan hangs from three detailed metal strands. The model uses metallic PBR materials, a studio environment assembled from local Drei lightformers, directional and point lighting, and a small set of subtle Drei sparkles. No 3D image or video is used in place of the model.

The desktop canvas caps its device pixel ratio at 1.5; mobile uses a ratio of 1, disables shadows and antialiasing, and renders fewer particles. The camera and sculpture scale adapt to the viewport. The WebGL scene is isolated behind an error boundary; when WebGL is unavailable, the hero displays a clear fallback notice.

## Interaction and animation

- Dragging rotates the scale freely through full horizontal turns and tilts it vertically. Pointer capture supports mouse and touch. Arrow keys rotate it when the scene is focused.
- Once a user rotates the scale, the scene switches to manual control and holds both the selected model angle and camera composition while scrolling. Before interaction, the camera and scale perform a restrained scroll transition as the hero exits.
- A `DRAG TO EXPLORE` hint and a manual-view status show how to interact. The practice cards use subtle 3D hover movement.
- `useGSAPAnimations.js` creates one scoped ScrollTrigger timeline per major section, with distinct heading masks, image reveals, directional entrances, perspective movement, and staggered cards. A thin progress line tracks the page scroll. `gsap.context()` reverts animations on cleanup.
- Reduced-motion preferences show all content without the reveal choreography or automatic camera movement; direct mouse, touch, and keyboard control remain available.

## Deploy to Vercel

Import this repository into Vercel or run the Vercel CLI from the project directory. The project uses Vite's standard static output and includes `vercel.json` with the build command and `dist` output directory. No environment variables are required.

## Demonstration content

LEXORA, its attorneys, contact details, statistics, testimonials, and case experience are fictional demonstration content. Attorney illustrations are original local SVG artwork and do not depict actual people. The figures “20+ years,” “500+ cases,” and “98% satisfaction” are not verified business claims. Testimonials are fabricated samples, not customer reviews. No legal services are offered by this demo site.
