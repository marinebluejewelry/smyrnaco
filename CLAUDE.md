# Project: Brand Showcase Experience
**Type:** High-End Immersive Web Experience (No E-commerce)
**Goal:** Awwwards-level visual storytelling using 3D and Scroll Animations.

## Tech Stack (Strict)
- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript (Strict mode)
- **Styling:** Tailwind CSS (No CSS Modules unless absolutely necessary for complex animations)
- **3D Engine:** React Three Fiber (@react-three/fiber) + Drei (@react-three/drei)
- **Animation:** GSAP (GreenSock) + ScrollTrigger
- **State Management:** React Hooks (Zustand if global state is needed later)
- **Package Manager:** npm

## Architecture Guidelines
1.  **Rendering Strategy:** Static Export (SSG). No server-side runtime or API routes.
2.  **Data Source:** No CMS. All content must be stored in `src/lib/data.ts` or similar local files.
3.  **Performance First:**
    - Use `next/dynamic` for heavy 3D components.
    - Use `next/image` for all bitmaps.
    - Ensure 3D models are Draco compressed.
    - Do not block the main thread.
4.  **Responsiveness:**
    - **Desktop:** 3D elements generally on the Right, Text on the Left.
    - **Mobile:** 3D elements move to Top/Background, Text flows below.
    - Always use Tailwind responsive prefixes (`md:`, `lg:`).

## Coding Standards
- **Functional Components:** Use React Functional Components with named exports.
- **Type Safety:** Always define interfaces for component props. Avoid `any`.
- **Clean Code:** Keep components small. Separate Logic (Hooks) from View (JSX).
- **Directory Structure:**
    - `src/components/canvas`: Only R3F/Three.js components.
    - `src/components/dom`: Standard HTML/UI components.
    - `src/app`: Page routing and layout.

## Tone & Style
- Visuals: Minimalist, Luxury, High Contrast (Black/White).
- Code: Senior Architect level. Modular, well-commented, production-ready.