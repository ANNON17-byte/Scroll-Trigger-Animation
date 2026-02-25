GSAP Scroll-Triggered Frame Animation

A scroll-driven hero animation built using GSAP, ScrollTrigger, and canvas rendering.
This project transforms a 9-second video into a frame-by-frame cinematic experience fully controlled by scroll position.

Overview

The hero section is pinned during scroll and renders a sequence of 248 frames onto a canvas element. The animation progress is directly mapped to scroll progress, allowing smooth forward and backward interaction.

The implementation avoids React state updates during scroll and relies on canvas rendering for maximum performance and smooth playback.

Features

248-frame scroll-controlled animation

GSAP ScrollTrigger with scrub smoothing

Canvas-based rendering for performance

Frame preloading before animation start

Pinned hero section during scroll

Staggered headline and statistics animation

Responsive canvas resizing

Optimized rendering without layout reflows

Tech Stack

React 18

TypeScript (strict mode)

GSAP

GSAP ScrollTrigger

Tailwind CSS

Vite

How It Works

All frames are preloaded before ScrollTrigger refreshes to ensure smooth playback.

Scroll progress is mapped to a frame index based on total frame count. As the user scrolls, the calculated frame index updates and the corresponding image is drawn onto the canvas.

The hero section is pinned during scroll to create a cinematic storytelling effect. Scrub smoothing is applied to ensure natural interpolation between frames.

Animations for headline, subtitle, and statistics are handled using GSAP timelines with staggered transitions.

Project Structure

The project contains a HeroSection component responsible for:

Frame preloading

Canvas rendering

ScrollTrigger configuration

Timeline-based entrance and exit animations

Frames are stored inside the public frames directory and named sequentially.

Performance Considerations

No React state updates during scroll

Frame rendering handled directly via canvas context

Only transform and opacity properties animated

Single ScrollTrigger instance

Resize listener ensures correct canvas scaling

Overlay and text animations use GPU-accelerated transforms

Use Cases

This approach is suitable for:

Product storytelling sections

Portfolio hero animations

Landing page cinematic interactions

Marketing microsites
