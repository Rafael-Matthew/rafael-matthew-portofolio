import { useRef } from 'react';
import { Float, Sphere, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

export default function AboutScene3D() {
  const groupRef = useRef<THREE.Group>(null);
  
  useGSAP(() => {
    if (!groupRef.current) return;
    
    // Parallax entrance when scrolling into About section
    gsap.fromTo(groupRef.current.position, 
      { y: -5, scale: 0.5 },
      {
        y: 0,
        scale: 1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '#about-section',
          start: 'top bottom',
          end: 'center center',
          scrub: 1,
        }
      }
    );
  });

  return (
    <group ref={groupRef} position={[-2, -5, -2]}> {/* Initial position matches GSAP fromTo loosely */}
      <Float speed={2} rotationIntensity={2} floatIntensity={2}>
        <Sphere args={[1.5, 64, 64]}>
          <MeshDistortMaterial 
            color="#FF9100" 
            envMapIntensity={1} 
            clearcoat={0.8} 
            clearcoatRoughness={0} 
            metalness={0.2}
            roughness={0.2}
            distort={0.4} 
            speed={2} 
          />
        </Sphere>
      </Float>
      
      {/* Small accent spheres */}
      <Float speed={3} rotationIntensity={1} floatIntensity={3}>
        <Sphere args={[0.3, 32, 32]} position={[2, 1.5, -1]}>
          <meshStandardMaterial color="#4A4D5E" />
        </Sphere>
      </Float>
      <Float speed={1.5} rotationIntensity={1} floatIntensity={1}>
        <Sphere args={[0.5, 32, 32]} position={[1.5, -1, 1]}>
          <meshStandardMaterial color="#252734" />
        </Sphere>
      </Float>
    </group>
  );
}
