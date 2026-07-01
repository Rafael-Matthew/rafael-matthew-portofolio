import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Text, Icosahedron } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

const skillNames = [
  "React", "TypeScript", "JavaScript", "TailwindCSS", 
  "Node.js", "MySQL", "MongoDB", "PostgreSQL", 
  "Astro", "GSAP", "Three.js", "Git"
];

export default function SkillsOrbit3D() {
  const groupRef = useRef<THREE.Group>(null);
  const orbitRef = useRef<THREE.Group>(null);

  // Generate random positions on a sphere for the skill nodes
  const nodes = useMemo(() => {
    return skillNames.map((name, i) => {
      const phi = Math.acos(-1 + (2 * i) / skillNames.length);
      const theta = Math.sqrt(skillNames.length * Math.PI) * phi;
      const radius = 3;
      return {
        name,
        position: [
          radius * Math.cos(theta) * Math.sin(phi),
          radius * Math.sin(theta) * Math.sin(phi),
          radius * Math.cos(phi)
        ] as [number, number, number]
      };
    });
  }, []);

  useGSAP(() => {
    if (!groupRef.current) return;
    
    gsap.fromTo(groupRef.current.position,
      { y: -10, scale: 0.2 },
      {
        y: 0,
        scale: 1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '#skills-section',
          start: 'top bottom',
          end: 'center center',
          scrub: 1,
        }
      }
    );
  });

  useFrame((state, delta) => {
    if (orbitRef.current) {
      orbitRef.current.rotation.y += delta * 0.2;
      orbitRef.current.rotation.x += delta * 0.1;
    }
  });

  return (
    <group ref={groupRef} position={[0, -10, -5]}>
      <Float speed={1} rotationIntensity={0.5} floatIntensity={1}>
        <group ref={orbitRef}>
          {nodes.map((node, i) => (
            <group key={i} position={node.position}>
              <Icosahedron args={[0.3, 0]}>
                <meshStandardMaterial color="#FF9100" wireframe />
              </Icosahedron>
              <Text 
                position={[0, 0, 0.5]} 
                fontSize={0.2} 
                color="#FFFFFF"
                anchorX="center"
                anchorY="middle"
              >
                {node.name}
              </Text>
            </group>
          ))}
          
          {/* Center core */}
          <Icosahedron args={[1, 1]} position={[0,0,0]}>
            <meshStandardMaterial color="#333646" roughness={0.5} metalness={0.8} />
          </Icosahedron>
        </group>
      </Float>
    </group>
  );
}
