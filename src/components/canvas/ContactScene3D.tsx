import { useRef } from 'react';
import { Float, Box, Torus, Cone } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

export default function ContactScene3D() {
  const groupRef = useRef<THREE.Group>(null);
  
  useGSAP(() => {
    if (!groupRef.current) return;
    
    // Animate contact abstract elements from the bottom
    gsap.fromTo(groupRef.current.position, 
      { y: -15, scale: 0.5 },
      {
        y: -15, // This is roughly matching the global scroll layout since canvas is fixed
        scale: 1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '#contact-section',
          start: 'top bottom',
          end: 'center center',
          scrub: 1,
        }
      }
    );
  });

  return (
    <group ref={groupRef} position={[3, -15, -2]}>
      {/* Abstract Envelope/Message block */}
      <Float speed={2} rotationIntensity={1} floatIntensity={1.5}>
        <group rotation={[0.2, -0.4, 0]}>
          <Box args={[2, 1.2, 0.2]}>
            <meshStandardMaterial color="#FF9100" roughness={0.3} />
          </Box>
          <Box args={[1.8, 1, 0.25]} position={[0, 0, 0]}>
            <meshStandardMaterial color="#333646" roughness={0.7} />
          </Box>
          {/* Envelope flap representation */}
          <Cone args={[1.2, 0.8, 4]} position={[0, 0.7, 0.1]} rotation={[0, Math.PI / 4, 0]}>
             <meshStandardMaterial color="#FF9100" roughness={0.3} />
          </Cone>
        </group>
      </Float>

      {/* Floating accent ring */}
      <Float speed={1.5} rotationIntensity={2} floatIntensity={2}>
        <Torus args={[1.5, 0.05, 16, 100]} position={[-1, 1, -1]} rotation={[1, 1, 0]}>
          <meshStandardMaterial color="#4A4D5E" />
        </Torus>
      </Float>
      
      {/* Floating accent block */}
      <Float speed={3} rotationIntensity={1} floatIntensity={1}>
        <Box args={[0.5, 0.5, 0.5]} position={[2, -1, 1]} rotation={[0.5, 0.5, 0]}>
          <meshStandardMaterial color="#252734" />
        </Box>
      </Float>
    </group>
  );
}
