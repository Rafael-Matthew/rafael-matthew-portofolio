import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Box, Cylinder, Sphere, Text } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

export default function HeroScene3D() {
  const groupRef = useRef<THREE.Group>(null);
  
  // Setup GSAP scroll trigger for this specific group
  useGSAP(() => {
    if (!groupRef.current) return;
    
    // When scrolling down, move the hero objects up and fade/scale them
    gsap.to(groupRef.current.position, {
      y: 5,
      ease: 'power1.inOut',
      scrollTrigger: {
        trigger: '#hero-section',
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
      }
    });

    gsap.to(groupRef.current.rotation, {
      x: 0.2,
      y: -0.5,
      ease: 'power1.inOut',
      scrollTrigger: {
        trigger: '#hero-section',
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
      }
    });
  });

  return (
    <group ref={groupRef} position={[2, 0, 0]}>
      {/* Laptop Representation (Stylized) */}
      <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
        <group position={[0, -0.5, 0]} rotation={[0.2, -0.4, 0]}>
          {/* Base */}
          <Box args={[3, 0.1, 2]} position={[0, 0, 0]}>
            <meshStandardMaterial color="#4A4D5E" roughness={0.3} metalness={0.8} />
          </Box>
          {/* Screen */}
          <Box args={[3, 2, 0.1]} position={[0, 1, -0.95]} rotation={[-0.1, 0, 0]}>
            <meshStandardMaterial color="#252734" roughness={0.1} metalness={0.8} />
          </Box>
          {/* Screen Glow */}
          <Box args={[2.8, 1.8, 0.05]} position={[0, 1, -0.89]} rotation={[-0.1, 0, 0]}>
            <meshBasicMaterial color="#FF9100" />
          </Box>
        </group>
      </Float>

      {/* Database Cylinder */}
      <Float speed={1.5} rotationIntensity={1} floatIntensity={2}>
        <group position={[2.5, 1, -1]}>
          <Cylinder args={[0.4, 0.4, 0.3, 32]} position={[0, 0.4, 0]}>
            <meshStandardMaterial color="#FF9100" roughness={0.2} metalness={0.5} />
          </Cylinder>
          <Cylinder args={[0.4, 0.4, 0.3, 32]} position={[0, 0, 0]}>
            <meshStandardMaterial color="#FF9100" roughness={0.2} metalness={0.5} />
          </Cylinder>
          <Cylinder args={[0.4, 0.4, 0.3, 32]} position={[0, -0.4, 0]}>
            <meshStandardMaterial color="#FF9100" roughness={0.2} metalness={0.5} />
          </Cylinder>
        </group>
      </Float>

      {/* Floating Code Snippet Card */}
      <Float speed={2.5} rotationIntensity={0.2} floatIntensity={1.5}>
        <Box args={[1.5, 2, 0.05]} position={[-2, 1.5, -2]} rotation={[0.2, 0.5, -0.1]}>
          <meshStandardMaterial color="#333646" roughness={0.8} />
          <Text position={[0, 0.5, 0.03]} fontSize={0.15} color="#FF9100" maxWidth={1.2}>
            {'const dev = "Rafael";\nreturn <Epic3D />'}
          </Text>
        </Box>
      </Float>

      {/* Abstract Cloud Icon (Spheres) */}
      <Float speed={1.2} rotationIntensity={0.5} floatIntensity={2}>
        <group position={[-1.5, -1.5, 1]} scale={0.5}>
          <Sphere args={[0.5, 32, 32]} position={[-0.5, 0, 0]}>
            <meshStandardMaterial color="#FFFFFF" roughness={0.1} />
          </Sphere>
          <Sphere args={[0.7, 32, 32]} position={[0, 0.2, 0]}>
            <meshStandardMaterial color="#FFFFFF" roughness={0.1} />
          </Sphere>
          <Sphere args={[0.5, 32, 32]} position={[0.5, -0.1, 0]}>
            <meshStandardMaterial color="#FFFFFF" roughness={0.1} />
          </Sphere>
        </group>
      </Float>
    </group>
  );
}
