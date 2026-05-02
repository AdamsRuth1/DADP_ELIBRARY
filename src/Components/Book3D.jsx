import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function Book3D({ logoSrc }) {
  const bookRef = useRef();
  const containerRef = useRef();
  const rotation = useRef({ x: -10, y: -20 });
  const isDragging = useRef(false);
  const previousMousePosition = useRef({ x: 0, y: 0 });
  const rotationTween = useRef(null);

  useGSAP(() => {
    // Floating animation (only for the container so it doesn't conflict with rotate)
    gsap.to(containerRef.current, {
      y: -20,
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });

    // Start auto rotation
    startAutoRotate();
  }, { scope: containerRef });

  const startAutoRotate = () => {
    if (rotationTween.current) rotationTween.current.kill();
    rotationTween.current = gsap.to(rotation.current, {
      y: rotation.current.y + 360,
      duration: 25,
      repeat: -1,
      ease: "none",
      onUpdate: () => {
        if (bookRef.current) {
          gsap.set(bookRef.current, { 
            rotateX: rotation.current.x, 
            rotateY: rotation.current.y 
          });
        }
      }
    });
  };

  const handlePointerDown = (e) => {
    isDragging.current = true;
    previousMousePosition.current = { x: e.clientX, y: e.clientY };
    if (rotationTween.current) rotationTween.current.kill();
    
    document.addEventListener("pointermove", handlePointerMove);
    document.addEventListener("pointerup", handlePointerUp);
    
    // Change cursor
    document.body.style.cursor = "grabbing";
  };

  const handlePointerMove = (e) => {
    if (!isDragging.current) return;
    
    const deltaX = e.clientX - previousMousePosition.current.x;
    const deltaY = e.clientY - previousMousePosition.current.y;
    
    rotation.current.x -= deltaY * 0.6;
    rotation.current.y += deltaX * 0.6;
    
    // Cap X rotation so it doesn't flip completely upside down easily
    rotation.current.x = Math.max(-60, Math.min(60, rotation.current.x));
    
    if (bookRef.current) {
      gsap.set(bookRef.current, { 
        rotateX: rotation.current.x, 
        rotateY: rotation.current.y 
      });
    }
    
    previousMousePosition.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = () => {
    isDragging.current = false;
    document.removeEventListener("pointermove", handlePointerMove);
    document.removeEventListener("pointerup", handlePointerUp);
    document.body.style.cursor = "default";
    
    startAutoRotate();
  };

  // Ensure listeners are cleaned up if unmounted during drag
  useEffect(() => {
    return () => {
      document.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("pointerup", handlePointerUp);
      document.body.style.cursor = "default";
    };
  }, []);

  // Dimensions scaled up by 50%
  const bookWidth = 360;  // 240 * 1.5
  const bookHeight = 510; // 340 * 1.5
  const bookDepth = 68;   // 45 * 1.5
  const halfW = bookWidth / 2;
  const halfH = bookHeight / 2;
  const halfD = bookDepth / 2;

  const faceBase = "absolute top-1/2 left-1/2 rounded-sm shadow-inner pointer-events-none";

  return (
    <div 
      className="relative w-full max-w-lg aspect-[3/4] flex justify-center items-center perspective-[1500px] cursor-grab active:cursor-grabbing" 
      ref={containerRef}
      onPointerDown={handlePointerDown}
    >
      <div 
        ref={bookRef}
        className="relative"
        style={{ 
          width: `${bookWidth}px`, 
          height: `${bookHeight}px`, 
          transformStyle: 'preserve-3d', 
          transform: 'rotateX(-10deg) rotateY(-20deg)' 
        }}
      >
        {/* Front Cover */}
        <div 
          className={`${faceBase} bg-[#1F3D2B] flex items-center justify-center border-r-[3px] border-y-[3px] border-[#162c1f] shadow-2xl overflow-hidden`}
          style={{ 
            width: `${bookWidth}px`, 
            height: `${bookHeight}px`, 
            transform: `translate(-50%, -50%) translateZ(${halfD}px)` 
          }}
        >
          {/* Logo */}
          <img src={logoSrc} alt="NACWC Logo" className="w-3/4 h-auto drop-shadow-2xl z-10 no-anim pointer-events-none select-none" draggable={false} />
          
          {/* Cover decorative lines */}
          <div className="absolute left-8 top-0 bottom-0 w-1.5 bg-black/20 z-0"></div>
          <div className="absolute left-11 top-0 bottom-0 w-[2px] bg-black/10 z-0"></div>
          <div className="absolute inset-x-0 bottom-8 h-1.5 bg-[#C5A64D]/30 z-0"></div>
        </div>

        {/* Back Cover */}
        <div 
          className={`${faceBase} bg-[#162c1f] border-l-[3px] border-y-[3px] border-[#0f2015]`}
          style={{ 
            width: `${bookWidth}px`, 
            height: `${bookHeight}px`, 
            transform: `translate(-50%, -50%) rotateY(180deg) translateZ(${halfD}px)` 
          }}
        >
          <div className="absolute right-8 top-0 bottom-0 w-1.5 bg-black/20"></div>
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 text-center opacity-20">
            <span className="text-[#C5A64D] text-6xl font-extrabold uppercase tracking-widest">NACWC</span>
          </div>
        </div>

        {/* Right Edge (Pages) */}
        <div 
          className={`${faceBase} bg-[#f4f4f4] border-y border-gray-300`}
          style={{ 
            width: `${bookDepth}px`, 
            height: `${bookHeight - 8}px`, 
            transform: `translate(-50%, -50%) rotateY(90deg) translateZ(${halfW - 2}px)`,
            backgroundImage: "repeating-linear-gradient(0deg, #e5e5e5, #e5e5e5 1px, #f4f4f4 1px, #f4f4f4 4px)"
          }}
        />

        {/* Left Edge (Spine) */}
        <div 
          className={`${faceBase} bg-[#0a140e] border-y border-black flex flex-col justify-between py-10 items-center`}
          style={{ 
            width: `${bookDepth}px`, 
            height: `${bookHeight}px`, 
            transform: `translate(-50%, -50%) rotateY(-90deg) translateZ(${halfW}px)` 
          }}
        >
          <div className="w-full h-1.5 bg-[#C5A64D]/50"></div>
          <div className="text-[#C5A64D] text-lg font-bold tracking-[0.2em] -rotate-90 whitespace-nowrap mt-24 opacity-80">
            DADP E-LIBRARY
          </div>
          <div className="w-full h-1.5 bg-[#C5A64D]/50"></div>
        </div>

        {/* Top Edge (Pages) */}
        <div 
          className={`${faceBase} bg-[#eaeaea]`}
          style={{ 
            width: `${bookWidth - 6}px`, 
            height: `${bookDepth - 2}px`, 
            transform: `translate(-50%, -50%) rotateX(90deg) translateZ(${halfH - 1}px)`,
            backgroundImage: "repeating-linear-gradient(90deg, #d5d5d5, #d5d5d5 1px, #eaeaea 1px, #eaeaea 4px)"
          }}
        />

        {/* Bottom Edge (Pages) */}
        <div 
          className={`${faceBase} bg-[#eaeaea]`}
          style={{ 
            width: `${bookWidth - 6}px`, 
            height: `${bookDepth - 2}px`, 
            transform: `translate(-50%, -50%) rotateX(-90deg) translateZ(${halfH - 1}px)`,
            backgroundImage: "repeating-linear-gradient(90deg, #d5d5d5, #d5d5d5 1px, #eaeaea 1px, #eaeaea 4px)"
          }}
        />
      </div>
    </div>
  );
}
