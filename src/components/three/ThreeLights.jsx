import { Environment, Lightformer } from '@react-three/drei';

export default function ThreeLights() {
  return (
    <>
      <ambientLight intensity={0.34} />
      <directionalLight
        position={[-4, 6, 5]}
        intensity={3.1}
        color="#fff2d7"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-bias={-0.00015}
      />
      <pointLight position={[4, 1.3, 3]} intensity={34} distance={11} color="#d8ae68" />
      <spotLight position={[0, 6, -2]} angle={0.56} penumbra={0.8} intensity={3} color="#fff8e9" />
      <Environment resolution={128} background={false}>
        <Lightformer form="rect" intensity={3.6} position={[0, 4.5, -4]} scale={[6, 4.5, 1]} color="#fff3da" />
        <Lightformer form="rect" intensity={2.1} position={[-4, 1, 2]} scale={[2.4, 5, 1]} color="#c59a52" />
        <Lightformer form="rect" intensity={2.7} position={[4, 2, 1]} scale={[2, 4, 1]} color="#f0d4a4" />
        <Lightformer form="rect" intensity={1.2} position={[0, -2, 3]} scale={[5, 1.4, 1]} color="#805a2a" />
      </Environment>
    </>
  );
}
