import { Canvas } from '@react-three/fiber';
import { Environment, Preload } from '@react-three/drei';
import { Suspense, useEffect } from 'react';
import Lenis from 'lenis';
import HeroScene3D from './HeroScene3D';
import AboutScene3D from './AboutScene3D';
import SkillsOrbit3D from './SkillsOrbit3D';
import ContactScene3D from './ContactScene3D';

function LenisSetup() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);
  return null;
}

export default function Scene3D() {
  return (
    <>
      <LenisSetup />
      <div className="fixed inset-0 w-full h-full z-[-1] pointer-events-none">
        <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
          <Suspense fallback={null}>
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} intensity={1} color="#FF9100" />
            
            {/* Global environment for reflection */}
            <Environment preset="city" />

            {/* Scroll-triggered 3D elements */}
            <HeroScene3D />
            <AboutScene3D />
            <SkillsOrbit3D />
            <ContactScene3D />

            <Preload all />
          </Suspense>
        </Canvas>
      </div>
    </>
  );
}
