import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const TOTAL_FRAMES = 248;
const FRAME_PATH = (i: number): string =>
  `/frames/${String(i).padStart(4, "0")}.jpg`;

const STATS = [
  { value: "97%", label: "Client Satisfaction" },
  { value: "120+", label: "Projects Delivered" },
  { value: "45+", label: "Creative Awards" },
  { value: "99%", label: "On-Time Delivery" },
];

function preloadFrames(): Promise<HTMLImageElement[]> {
  return new Promise((resolve) => {
    const images: HTMLImageElement[] = [];
    let loaded = 0;
    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src = FRAME_PATH(i);
      img.onload = img.onerror = () => {
        loaded++;
        if (loaded === TOTAL_FRAMES) resolve(images);
      };
      images[i - 1] = img;
    }
  });
}

function renderFrame(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  canvas: HTMLCanvasElement
): void {
  if (!img.naturalWidth) return;
  const { width: cw, height: ch } = canvas;
  ctx.clearRect(0, 0, cw, ch);

  const imgR = img.naturalWidth / img.naturalHeight;
  const canR = cw / ch;
  let dw: number, dh: number;

  if (canR > imgR) {
    dw = cw;
    dh = cw / imgR;
  } else {
    dh = ch;
    dw = ch * imgR;
  }

  ctx.drawImage(img, (cw - dw) / 2, (ch - dh) / 2, dw, dh);
}

export default function HeroSection(): React.JSX.Element {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const scrollIndRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef<number>(0);

  useEffect(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    const headline = headlineRef.current;
    const subtitle = subtitleRef.current;
    const stats = statsRef.current;
    const overlay = overlayRef.current;
    const scrollInd = scrollIndRef.current;
    if (!section || !canvas || !headline || !subtitle || !stats || !overlay || !scrollInd) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const setCanvasSize = (): void => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const img = imagesRef.current[currentFrameRef.current];
      if (img?.complete) renderFrame(ctx, img, canvas);
    };
    setCanvasSize();
    window.addEventListener("resize", setCanvasSize);

    const chars = headline.querySelectorAll<HTMLSpanElement>(".char");
    const statItems = stats.querySelectorAll<HTMLDivElement>(".stat-item");

    gsap.set(chars, { opacity: 0, y: 50 });
    gsap.set(subtitle, { opacity: 0, y: 30 });
    gsap.set(statItems, { opacity: 0, y: 40 });
    gsap.set(scrollInd, { opacity: 0 });
    gsap.set(overlay, { opacity: 0 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: "+=5000",
        scrub: 0.5,
        pin: true,
        anticipatePin: 1,
        onUpdate: (self) => {
          const index = Math.min(
            TOTAL_FRAMES - 1,
            Math.max(0, Math.floor(self.progress * (TOTAL_FRAMES - 1)))
          );
          if (index !== currentFrameRef.current) {
            currentFrameRef.current = index;
            const img = imagesRef.current[index];
            if (img?.complete) renderFrame(ctx, img, canvas);
          }
        },
      },
    });

    tl.to(overlay, { opacity: 0.55, duration: 0.08, ease: "none" }, 0);

    tl.to(chars, {
      opacity: 1,
      y: 0,
      stagger: 0.005,
      duration: 0.14,
      ease: "power3.out",
    }, 0.01);

    tl.to(subtitle, {
      opacity: 1,
      y: 0,
      duration: 0.06,
      ease: "power2.out",
    }, 0.08);

    tl.to(statItems, {
      opacity: 1,
      y: 0,
      stagger: 0.015,
      duration: 0.1,
      ease: "power2.out",
    }, 0.12);

    tl.to(scrollInd, { opacity: 1, duration: 0.04, ease: "none" }, 0.18);

    tl.to(scrollInd, { opacity: 0, duration: 0.04, ease: "none" }, 0.32);

    tl.to(subtitle, { y: -80, opacity: 0, duration: 0.1, ease: "none" }, 0.35);

    tl.to(headline, { y: -120, opacity: 0, duration: 0.12, ease: "none" }, 0.38);

    tl.to(stats, { y: -50, opacity: 0, duration: 0.1, ease: "none" }, 0.40);

    tl.to(overlay, { opacity: 0, duration: 0.1, ease: "none" }, 0.50);

    preloadFrames().then((images) => {
      imagesRef.current = images;
      if (images[0]?.complete) renderFrame(ctx, images[0], canvas);
      ScrollTrigger.refresh();
    });

    return () => {
      window.removeEventListener("resize", setCanvasSize);
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative h-screen w-full overflow-hidden bg-[#0a0a0a]"
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full"
      />

      <div
        ref={overlayRef}
        className="pointer-events-none absolute inset-0 bg-black/50"
      />

      <div className="relative z-10 flex h-full flex-col items-center justify-center gap-10 px-6 text-center">
        <h1
          ref={headlineRef}
          className="whitespace-nowrap text-5xl font-extralight tracking-[0.35em] text-white uppercase will-change-transform sm:text-6xl md:text-7xl lg:text-8xl"
        >
          {"WELCOME ITZFIZZ".split("").map((char, i) => (
            <span key={i} className="char inline-block">
              {char === " " ? "\u00A0" : char}
            </span>
          ))}
        </h1>

        <p
          ref={subtitleRef}
          className="max-w-xl text-sm font-light tracking-widest text-white/50 uppercase will-change-transform"
        >
          Crafting digital experiences that move with you
        </p>

        <div
          ref={statsRef}
          className="mt-6 grid grid-cols-2 gap-x-16 gap-y-8 will-change-transform sm:grid-cols-4"
        >
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="stat-item flex flex-col items-center gap-1"
              data-cursor="View"
            >
              <span className="text-3xl font-light tracking-wide text-white">
                {stat.value}
              </span>
              <span className="text-[11px] font-light tracking-widest text-white/40 uppercase">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div
        ref={scrollIndRef}
        className="absolute bottom-10 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2"
        data-cursor="Scroll"
      >
        <span className="text-[10px] tracking-[0.3em] text-white/30 uppercase">
          Scroll
        </span>
        <span className="block h-10 w-px animate-pulse bg-gradient-to-b from-white/40 to-transparent" />
      </div>
    </section>
  );
}
