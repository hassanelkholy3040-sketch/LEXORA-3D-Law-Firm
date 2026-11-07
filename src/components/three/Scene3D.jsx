import { Component, useCallback, useEffect, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sparkles } from '@react-three/drei';
import { MathUtils, DoubleSide } from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Scale } from 'lucide-react';
import { useResponsive } from '../../hooks/useResponsive.js';
import { useReducedMotion } from '../../hooks/useReducedMotion.js';
import CameraController from './CameraController.jsx';
import JusticeScales from './JusticeScales.jsx';
import ThreeLights from './ThreeLights.jsx';

gsap.registerPlugin(ScrollTrigger);

function InteractionPlane({ motion, onManualControl }) {
  return (
    <mesh
      position={[0, 0, 3.4]}
      onPointerDown={(event) => {
        event.stopPropagation();
        motion.current.isDragging = true;
        motion.current.lastPointerX = event.nativeEvent.clientX;
        motion.current.lastPointerY = event.nativeEvent.clientY;
        motion.current.manualRotationY = motion.current.rotationY;
        motion.current.manualRotationX = motion.current.rotationX;
        event.target.setPointerCapture(event.pointerId);
      }}
      onPointerMove={(event) => {
        motion.current.pointerX = event.pointer.x;
        motion.current.pointerY = event.pointer.y;
        if (!motion.current.isDragging) return;
        const { clientX, clientY } = event.nativeEvent;
        const deltaX = clientX - motion.current.lastPointerX;
        const deltaY = clientY - motion.current.lastPointerY;
        motion.current.lastPointerX = clientX;
        motion.current.lastPointerY = clientY;
        if (!deltaX && !deltaY) return;
        if (!motion.current.hasInteracted) onManualControl?.();
        motion.current.hasInteracted = true;
        motion.current.manualRotationY += deltaX * 0.01;
        motion.current.manualRotationX = MathUtils.clamp(
          motion.current.manualRotationX + deltaY * 0.01,
          -Math.PI / 2 + 0.12,
          Math.PI / 2 - 0.12,
        );
      }}
      onPointerUp={(event) => {
        motion.current.isDragging = false;
        motion.current.pointerX = 0;
        motion.current.pointerY = 0;
        if (event.target.hasPointerCapture(event.pointerId)) {
        event.target.releasePointerCapture?.(event.pointerId);
        }
      }}
      onPointerCancel={() => {
        motion.current.isDragging = false;
      }}
      onPointerOut={() => {
        if (!motion.current.isDragging) {
          motion.current.pointerX = 0;
          motion.current.pointerY = 0;
        }
      }}
    >
      <planeGeometry args={[100, 60]} />
      <meshBasicMaterial transparent opacity={0} depthWrite={false} side={DoubleSide} />
    </mesh>
  );
}

function SmoothMotion({ motion, mobile, reducedMotion }) {
  const group = useRef(null);
  useFrame((state, delta) => {
    if (!group.current || reducedMotion) return;
    if (motion.current.hasInteracted) return;
    const targetRotationY = Math.sin(state.clock.elapsedTime * 0.11) * 0.018;
    group.current.rotation.y = MathUtils.damp(group.current.rotation.y, targetRotationY, 1.4, delta);
    group.current.rotation.x = MathUtils.damp(group.current.rotation.x, 0, 1.4, delta);
  });
  return (
    <group ref={group}>
      <JusticeScales motion={motion} mobile={mobile} reducedMotion={reducedMotion} />
    </group>
  );
}

function SceneContent({ motion, mobile, reducedMotion, onManualControl }) {
  return (
    <>
      <ThreeLights />
      <CameraController motion={motion} mobile={mobile} reducedMotion={reducedMotion} />
      <SmoothMotion motion={motion} mobile={mobile} reducedMotion={reducedMotion} />
      <Sparkles count={mobile ? 14 : 36} scale={[9, 5.5, 6]} size={1.25} speed={reducedMotion ? 0 : 0.12} opacity={0.28} color="#d9bd86" />
      <InteractionPlane motion={motion} onManualControl={onManualControl} />
    </>
  );
}

function SceneFallbackMessage({ failureReason = 'WebGL is unavailable in this browser.' }) {
  return (
    <div className="scene-fallback" role="img" aria-label="Three-dimensional justice scales are unavailable on this device" data-error={import.meta.env.DEV ? failureReason : undefined}>
      <Scale size={114} strokeWidth={0.8} aria-hidden="true" />
      <span>Interactive 3D rendering is unavailable on this device.</span>
    </div>
  );
}

class SceneErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { failed: false };
  }
  static getDerivedStateFromError(error) { return { failed: true, failureReason: error?.message ?? 'The 3D scene could not be rendered.' }; }
  componentDidCatch(error) {
    this.props.onError?.(error);
  }
  render() {
    if (this.state.failed) {
      return <SceneFallbackMessage failureReason={this.state.failureReason} />;
    }
    return this.props.children;
  }
}

export default function Scene3D({ onReady, onError }) {
  const mobile = useResponsive();
  const reducedMotion = useReducedMotion();
  const rootRef = useRef(null);
  const rendererReady = useRef(false);
  const readinessTimer = useRef(null);
  const [sceneFailed, setSceneFailed] = useState(false);
  const [manualControl, setManualControl] = useState(false);
  const motion = useRef({
    pointerX: 0,
    pointerY: 0,
    scrollProgress: 0,
    manualRotationX: 0,
    manualRotationY: 0,
    rotationX: 0,
    rotationY: 0,
    hasInteracted: false,
    isDragging: false,
    lastPointerX: 0,
    lastPointerY: 0,
  });

  const handleManualControl = useCallback(() => {
    const cameraPose = motion.current.cameraPose;
    if (cameraPose) {
      motion.current.manualCameraPose = {
        position: cameraPose.position.clone(),
        focus: cameraPose.focus.clone(),
      };
    }
    setManualControl(true);
  }, []);

  const handleKeyDown = useCallback((event) => {
    const directions = {
      ArrowLeft: [0, -0.12],
      ArrowRight: [0, 0.12],
      ArrowUp: [-0.1, 0],
      ArrowDown: [0.1, 0],
    };
    const direction = directions[event.key];
    if (!direction) return;
    event.preventDefault();
    if (!motion.current.hasInteracted) handleManualControl();
    motion.current.hasInteracted = true;
    motion.current.manualRotationX = MathUtils.clamp(
      motion.current.rotationX + direction[0],
      -Math.PI / 2 + 0.12,
      Math.PI / 2 - 0.12,
    );
    motion.current.manualRotationY = motion.current.rotationY + direction[1];
  }, [handleManualControl]);

  const handleReady = useCallback(() => {
    rendererReady.current = true;
    if (readinessTimer.current) window.clearTimeout(readinessTimer.current);
    onReady?.();
  }, [onReady]);

  const handleFailure = useCallback((error) => {
    setSceneFailed(true);
    onError?.(error);
    handleReady();
  }, [handleReady, onError]);

  useEffect(() => {
    if (rendererReady.current) return undefined;
    readinessTimer.current = window.setTimeout(() => {
      if (!rendererReady.current) handleFailure(new Error('WebGL could not initialize a renderer.'));
    }, 4000);
    return () => {
      if (readinessTimer.current) window.clearTimeout(readinessTimer.current);
    };
  }, [handleFailure]);

  useEffect(() => {
    const context = gsap.context(() => {
      if (reducedMotion) return;
      gsap.to(motion.current, {
        scrollProgress: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: rootRef.current?.closest('.hero'),
          start: 'top top',
          end: 'bottom top',
          scrub: 0.8,
        },
      });
    }, rootRef);
    return () => context.revert();
  }, [reducedMotion]);

  return (
    <div
      className="scene3d"
      ref={rootRef}
      role="group"
      tabIndex={0}
      aria-label="Interactive three-dimensional justice scales"
      data-view-control={manualControl ? 'manual' : 'cinematic'}
      aria-describedby="scene3d-hint"
      aria-keyshortcuts="ArrowLeft ArrowRight ArrowUp ArrowDown"
      onKeyDown={handleKeyDown}
    >
      <SceneErrorBoundary onError={handleFailure}>
        {sceneFailed ? <SceneFallbackMessage failureReason="WebGL could not initialize a renderer." /> : <Canvas
          className="scene3d__canvas"
          shadows={!mobile}
          dpr={mobile ? 1 : [1, 1.5]}
          camera={{ position: [0, 0.22, mobile ? 10.2 : 9.4], fov: mobile ? 39 : 35, near: 0.1, far: 50 }}
          gl={{ antialias: !mobile, alpha: true, powerPreference: 'high-performance' }}
          onCreated={handleReady}
          fallback={<div className="scene-fallback" role="img" aria-label="Three-dimensional justice scales are unavailable on this device"><Scale size={114} strokeWidth={0.8} aria-hidden="true" /><span>Interactive 3D rendering is unavailable on this device.</span></div>}
        >
          <SceneContent motion={motion} mobile={mobile} reducedMotion={reducedMotion} onManualControl={handleManualControl} />
        </Canvas>}
      </SceneErrorBoundary>
      <span className="scene3d__hint" id="scene3d-hint" aria-live="polite">
        {manualControl ? 'Manual view active · drag or use arrow keys to rotate' : 'Drag to explore · use arrow keys to rotate'}
      </span>
    </div>
  );
}
