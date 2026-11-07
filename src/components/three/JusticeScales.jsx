import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { DoubleSide, MathUtils } from 'three';

const gold = { color: '#c5a46d', metalness: 0.94, roughness: 0.23 };
const paleGold = { color: '#e1c68f', metalness: 0.9, roughness: 0.2 };
const shadowGold = { color: '#866334', metalness: 0.88, roughness: 0.32 };

function HorizontalRing({ radius, tube, y, material = gold }) {
  return (
    <mesh position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
      <torusGeometry args={[radius, tube, 12, 72]} />
      <meshStandardMaterial {...material} />
    </mesh>
  );
}

function ChainStrand({ x, z, length = 1.16 }) {
  const linkCount = 7;
  return (
    <group position={[x, 0, z]}>
      <mesh position={[0, -length / 2, 0]} castShadow>
        <cylinderGeometry args={[0.009, 0.009, length, 8]} />
        <meshStandardMaterial {...paleGold} />
      </mesh>
      {Array.from({ length: linkCount }, (_, index) => (
        <mesh
          key={index}
          position={[0, -0.16 - index * 0.135, 0]}
          rotation={[(index % 2) * Math.PI / 2, 0, index % 2 ? 0.12 : 0]}
          castShadow
        >
          <torusGeometry args={[0.024, 0.0055, 6, 10]} />
          <meshStandardMaterial {...paleGold} />
        </mesh>
      ))}
    </group>
  );
}

function SuspendedPan({ side, reducedMotion }) {
  const swing = useRef(null);
  const strands = [[-0.3, 0], [0.15, 0.26], [0.15, -0.26]];

  useFrame(({ clock }, delta) => {
    if (!swing.current || reducedMotion) return;
    const phase = clock.elapsedTime * 0.54 + (side < 0 ? 0.8 : 0);
    const gentleSway = Math.sin(phase) * 0.008;
    swing.current.rotation.z = MathUtils.damp(swing.current.rotation.z, gentleSway, 1.7, delta);
  });

  return (
    <group position={[side * 1.49, 0, 0]}>
      <mesh position={[0, -0.12, 0]} castShadow>
        <sphereGeometry args={[0.09, 18, 14]} />
        <meshStandardMaterial {...paleGold} />
      </mesh>
      {strands.map(([x, z], index) => <ChainStrand key={index} x={x} z={z} />)}
      <group ref={swing}>
        <mesh position={[0, -1.35, 0]} castShadow receiveShadow>
          <latheGeometry args={[
            [
              [0, 0], [0.16, 0.025], [0.31, 0.075], [0.44, 0.14],
              [0.52, 0.205], [0.55, 0.25], [0.52, 0.285], [0.47, 0.29],
              [0.39, 0.27], [0.28, 0.235], [0.15, 0.205], [0, 0.195],
            ].map(([radius, height]) => ({ x: radius, y: height })),
            48,
          ]} />
          <meshPhysicalMaterial {...gold} clearcoat={0.35} clearcoatRoughness={0.22} side={DoubleSide} />
        </mesh>
        <mesh position={[0, -1.1, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <torusGeometry args={[0.52, 0.028, 10, 48]} />
          <meshStandardMaterial {...paleGold} />
        </mesh>
        <mesh position={[0, -1.08, 0]} castShadow>
          <sphereGeometry args={[0.045, 14, 12]} />
          <meshStandardMaterial {...paleGold} />
        </mesh>
      </group>
    </group>
  );
}

function BeamAssembly({ reducedMotion }) {
  const beam = useRef(null);

  useFrame(({ clock }, delta) => {
    if (!beam.current || reducedMotion) return;
    const idleTilt = Math.sin(clock.elapsedTime * 0.38) * 0.009;
    beam.current.rotation.z = MathUtils.damp(beam.current.rotation.z, idleTilt, 1.6, delta);
  });

  return (
    <group ref={beam} position={[0, 1.46, 0]}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[3.42, 0.105, 0.17]} />
        <meshStandardMaterial {...gold} />
      </mesh>
      <mesh castShadow position={[0, 0.075, 0]}>
        <boxGeometry args={[1.05, 0.055, 0.2]} />
        <meshStandardMaterial {...paleGold} />
      </mesh>
      <mesh position={[0, -0.015, 0]} castShadow>
        <sphereGeometry args={[0.2, 28, 20]} />
        <meshPhysicalMaterial {...paleGold} clearcoat={0.7} />
      </mesh>
      <mesh position={[0, 0.205, 0]} castShadow>
        <sphereGeometry args={[0.09, 20, 16]} />
        <meshStandardMaterial {...gold} />
      </mesh>
      <mesh position={[0, 0.31, 0]} castShadow>
        <coneGeometry args={[0.075, 0.18, 20]} />
        <meshStandardMaterial {...paleGold} />
      </mesh>
      {[-1, 1].map((side) => (
        <group key={side}>
          <mesh position={[side * 1.69, 0, 0]} castShadow>
            <sphereGeometry args={[0.11, 18, 16]} />
            <meshStandardMaterial {...paleGold} />
          </mesh>
          <mesh position={[side * 1.69, 0.08, 0]} castShadow>
            <sphereGeometry args={[0.055, 16, 12]} />
            <meshStandardMaterial {...shadowGold} />
          </mesh>
          <SuspendedPan side={side} reducedMotion={reducedMotion} />
        </group>
      ))}
    </group>
  );
}

export default function JusticeScales({ motion, mobile, reducedMotion }) {
  const sculpture = useRef(null);

  useFrame((_, delta) => {
    if (!sculpture.current) return;
    const { pointerX, pointerY, scrollProgress, hasInteracted } = motion.current;
    const targetRotationY = hasInteracted
      ? motion.current.manualRotationY
      : pointerX * 0.19 + (reducedMotion ? 0 : scrollProgress * Math.PI * 0.48);
    const targetRotationX = hasInteracted
      ? motion.current.manualRotationX
      : pointerY * 0.045 + (reducedMotion ? 0 : Math.sin(scrollProgress * Math.PI) * 0.035);
    const targetX = (mobile ? 0 : 0.32) + pointerX * (mobile ? 0.05 : 0.12) + (reducedMotion ? 0 : scrollProgress * 0.35);
    const targetY = -0.06 - (reducedMotion ? 0 : scrollProgress * 0.17) + pointerY * 0.035;
    const targetScale = (mobile ? 0.78 : 0.94) - (reducedMotion ? 0 : scrollProgress * 0.035);
    sculpture.current.rotation.y = MathUtils.damp(sculpture.current.rotation.y, targetRotationY, 2.4, delta);
    sculpture.current.rotation.x = MathUtils.damp(sculpture.current.rotation.x, targetRotationX, 2.1, delta);
    motion.current.rotationY = sculpture.current.rotation.y;
    motion.current.rotationX = sculpture.current.rotation.x;
    sculpture.current.position.x = MathUtils.damp(sculpture.current.position.x, targetX, 2.2, delta);
    sculpture.current.position.y = MathUtils.damp(sculpture.current.position.y, targetY, 2.2, delta);
    const scale = MathUtils.damp(sculpture.current.scale.x, targetScale, 2, delta);
    sculpture.current.scale.setScalar(scale);
  });

  return (
    <group ref={sculpture}>
      {/* Turned, tiered foot */}
      <mesh position={[0, -1.58, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.9, 1.12, 0.22, 64]} />
        <meshStandardMaterial {...gold} />
      </mesh>
      <mesh position={[0, -1.43, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.76, 0.9, 0.1, 64]} />
        <meshStandardMaterial {...paleGold} />
      </mesh>
      <mesh position={[0, -1.36, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.44, 0.68, 0.12, 48]} />
        <meshStandardMaterial {...shadowGold} />
      </mesh>
      <HorizontalRing radius={0.99} tube={0.026} y={-1.54} material={paleGold} />
      <HorizontalRing radius={0.73} tube={0.02} y={-1.39} material={paleGold} />

      {/* Sculpted central column */}
      <mesh position={[0, -0.15, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.115, 0.19, 2.46, 32, 1]} />
        <meshStandardMaterial {...gold} />
      </mesh>
      <mesh position={[0, -1.11, 0]} castShadow>
        <torusGeometry args={[0.2, 0.035, 10, 32]} />
        <meshStandardMaterial {...paleGold} />
      </mesh>
      <mesh position={[0, 0.88, 0]} castShadow>
        <torusGeometry args={[0.14, 0.022, 10, 28]} />
        <meshStandardMaterial {...paleGold} />
      </mesh>
      <mesh position={[0, 1.13, 0]} castShadow>
        <sphereGeometry args={[0.19, 24, 18]} />
        <meshPhysicalMaterial {...gold} clearcoat={0.55} />
      </mesh>
      <mesh position={[0, 1.28, 0]} castShadow>
        <cylinderGeometry args={[0.13, 0.18, 0.19, 28]} />
        <meshStandardMaterial {...paleGold} />
      </mesh>
      <mesh position={[0, 1.4, 0]} castShadow>
        <sphereGeometry args={[0.075, 18, 14]} />
        <meshStandardMaterial {...gold} />
      </mesh>

      <BeamAssembly reducedMotion={reducedMotion} />
    </group>
  );
}
