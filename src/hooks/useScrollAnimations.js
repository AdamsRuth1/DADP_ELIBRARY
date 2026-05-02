import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

export function useScrollAnimations(containerRef) {
  useGSAP(() => {
    // Image reveal animation
    gsap.utils.toArray(".animate-section img:not(.no-anim)").forEach((img) => {
      gsap.fromTo(img,
        { scale: 0.8, opacity: 0 },
        {
          scale: 1, opacity: 1,
          duration: 1.2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: img,
            start: "top 85%",
            toggleActions: "play none none reverse"
          }
        }
      );
    });

    // Text zoom animation
    gsap.utils.toArray(".animate-section h1, .animate-section h2, .animate-section h3, .animate-section p").forEach((text) => {
      gsap.fromTo(text,
        { scale: 0.9, opacity: 0, y: 30 },
        {
          scale: 1, opacity: 1, y: 0,
          duration: 1,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: text,
            start: "top 90%",
            toggleActions: "play none none reverse"
          }
        }
      );
    });
  }, { scope: containerRef });
}
