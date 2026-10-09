"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useRef, type ReactNode } from "react";

gsap.registerPlugin(useGSAP, ScrollTrigger, DrawSVGPlugin, SplitText);

// Page animations, run on every page (it sits in the site template):
// entrance, staggered headers, moving vectors, scroll reveals and the
// journey timeline. Nothing moves for visitors who prefer reduced motion.
export function Motion({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const q = gsap.utils.selector(el);
      const mm = gsap.matchMedia();

      mm.add(
        {
          motion: "(prefers-reduced-motion: no-preference)",
          fine: "(pointer: fine)",
        },
        (context) => {
          const { motion, fine } = context.conditions as {
            motion: boolean;
            fine: boolean;
          };
          if (!motion) return;

          // Starting positions are set before the page is revealed.
          gsap.set(el, { autoAlpha: 0 });
          document.documentElement.classList.remove("motion-pending");

          const intro = gsap.timeline({ defaults: { ease: "power3.out" } });
          intro.to(el, { autoAlpha: 1, duration: 0.4 }, 0);

          // Header text arrives one line after another.
          q("[data-stagger]").forEach((group, index) => {
            const items = Array.from(group.children).filter(
              (child) => !child.hasAttribute("data-split"),
            );
            intro.from(
              items,
              { y: 26, autoAlpha: 0, duration: 0.8, stagger: 0.08 },
              index === 0 ? 0.08 : "<0.1",
            );
          });

          // Big headings rise word by word.
          q("[data-split]").forEach((heading) => {
            const split = SplitText.create(heading, {
              type: "words",
              mask: "words",
            });
            intro.from(
              split.words,
              { yPercent: 110, duration: 1, stagger: 0.09, ease: "power4.out" },
              0.15,
            );
          });

          // Vector artwork.
          const cleanups: (() => void)[] = [];
          q("[data-backdrop]").forEach((backdrop) => {
            const v = gsap.utils.selector(backdrop);

            intro
              .from(
                v('[data-v="rings"] [data-ring]'),
                {
                  scale: 0.6,
                  autoAlpha: 0,
                  transformOrigin: "50% 50%",
                  duration: 1.4,
                  stagger: 0.12,
                },
                0,
              )
              .from(
                v('[data-v="steth"] [data-draw]'),
                {
                  drawSVG: "0%",
                  duration: 1.8,
                  stagger: 0.14,
                  ease: "power2.inOut",
                },
                0.1,
              )
              .from(
                v('[data-v="steth"] [data-pop]'),
                {
                  scale: 0,
                  transformOrigin: "50% 50%",
                  duration: 0.7,
                  stagger: 0.08,
                  ease: "back.out(2)",
                },
                1,
              )
              .from(
                v('[data-v="cross"]'),
                {
                  scale: 0.4,
                  rotation: -60,
                  autoAlpha: 0,
                  duration: 1.2,
                  ease: "back.out(1.6)",
                },
                0.25,
              )
              .from(
                v('[data-v="dots"] [data-dot]'),
                {
                  scale: 0,
                  transformOrigin: "50% 50%",
                  duration: 0.4,
                  stagger: { each: 0.01, from: "random" },
                },
                0.5,
              );

            // Gentle, endless movement once they have arrived.
            gsap.to(v('[data-v="steth"] [data-float]'), {
              y: -18,
              rotation: -2.5,
              transformOrigin: "50% 0%",
              duration: 4.5,
              ease: "sine.inOut",
              yoyo: true,
              repeat: -1,
              delay: 2,
            });
            gsap.to(v('[data-v="cross"] [data-float]'), {
              y: 12,
              rotation: 10,
              transformOrigin: "50% 50%",
              duration: 5.5,
              ease: "sine.inOut",
              yoyo: true,
              repeat: -1,
              delay: 1.4,
            });
            gsap.to(v('[data-v="rings"]'), {
              scale: 1.06,
              duration: 6,
              ease: "sine.inOut",
              yoyo: true,
              repeat: -1,
            });
            v('[data-v="dots"]').forEach((grid) => {
              gsap.to(gsap.utils.selector(grid)("[data-dot]"), {
                opacity: 0.25,
                duration: 1.6,
                ease: "sine.inOut",
                delay: 1.2,
                stagger: { each: 0.1, from: "random", repeat: -1, yoyo: true },
              });
            });

            // The whole backdrop drifts as the page scrolls away.
            gsap.to(backdrop, {
              yPercent: 14,
              ease: "none",
              scrollTrigger: {
                trigger: backdrop.parentElement,
                start: "top top",
                end: "bottom top",
                scrub: true,
              },
            });

            // Layers follow the mouse at different depths.
            if (fine) {
              const layers = (
                [
                  ['[data-v="steth"]', 28],
                  ['[data-v="cross"]', -20],
                  ['[data-v="rings"]', 12],
                  ['[data-v="dots"]', -10],
                ] as const
              ).flatMap(([selector, depth]) =>
                v(selector).map((layer) => ({
                  depth,
                  x: gsap.quickTo(layer, "x", {
                    duration: 1.4,
                    ease: "power3",
                  }),
                  y: gsap.quickTo(layer, "y", {
                    duration: 1.4,
                    ease: "power3",
                  }),
                })),
              );
              const onMove = (event: PointerEvent) => {
                const nx = event.clientX / window.innerWidth - 0.5;
                const ny = event.clientY / window.innerHeight - 0.5;
                for (const layer of layers) {
                  layer.x(nx * layer.depth);
                  layer.y(ny * layer.depth);
                }
              };
              window.addEventListener("pointermove", onMove);
              cleanups.push(() =>
                window.removeEventListener("pointermove", onMove),
              );
            }
          });

          // Sections and cards reveal as they scroll into view.
          const reveals = q(".reveal");
          if (reveals.length) {
            gsap.set(reveals, { autoAlpha: 0, y: 34 });
            ScrollTrigger.batch(reveals, {
              start: "top 90%",
              once: true,
              onEnter: (batch) =>
                gsap.to(batch, {
                  autoAlpha: 1,
                  y: 0,
                  duration: 0.85,
                  stagger: 0.1,
                  ease: "power3.out",
                  overwrite: true,
                }),
            });
          }

          // The journey timeline fills in as it scrolls past.
          q("[data-timeline]").forEach((timeline) => {
            const bar = timeline.querySelector("[data-timeline-progress]");
            if (!bar) return;
            gsap.fromTo(
              bar,
              { scaleY: 0 },
              {
                scaleY: 1,
                ease: "none",
                scrollTrigger: {
                  trigger: timeline,
                  start: "top 75%",
                  end: "bottom 60%",
                  scrub: 0.6,
                },
              },
            );
          });

          return () => cleanups.forEach((cleanup) => cleanup());
        },
      );
    },
    { scope: root },
  );

  return (
    <div ref={root} data-motion-root>
      {children}
    </div>
  );
}
