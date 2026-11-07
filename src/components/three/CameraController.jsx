import { useEffect, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { MathUtils, Vector3 } from 'three';

export default function CameraController({ motion, mobile, reducedMotion }) {
  const camera = useThree((state) => state.camera);
  const focus = useMemo(() => new Vector3(0, -0.08, 0), []);

  useEffect(() => {
    if (camera.isPerspectiveCamera) {
      camera.fov = mobile ? 39 : 35;
      camera.position.z = mobile ? 10.2 : 9.4;
      camera.updateProjectionMatrix();
    }
    if (motion.current.hasInteracted && motion.current.manualCameraPose) {
      motion.current.manualCameraPose.position.copy(camera.position);
      motion.current.manualCameraPose.focus.copy(focus);
    }
  }, [camera, mobile]);

  useFrame(({ camera }, delta) => {
    if (motion.current.hasInteracted) {
      if (!motion.current.manualCameraPose) {
        motion.current.manualCameraPose = { position: camera.position.clone(), focus: focus.clone() };
      }
      const manualPose = motion.current.manualCameraPose;
      camera.position.copy(manualPose.position);
      focus.copy(manualPose.focus);
      camera.lookAt(focus);
      return;
    }
    const { pointerX, pointerY, scrollProgress } = motion.current;
    const targetX = (mobile ? 0 : 0.04) + (reducedMotion ? 0 : pointerX * (mobile ? 0.04 : 0.12) + scrollProgress * 0.25);
    const targetY = 0.22 + (reducedMotion ? 0 : pointerY * 0.08 + scrollProgress * 0.08);
    const targetZ = mobile ? 10.2 : 9.4;
    camera.position.x = MathUtils.damp(camera.position.x, targetX, 2.6, delta);
    camera.position.y = MathUtils.damp(camera.position.y, targetY, 2.6, delta);
    camera.position.z = MathUtils.damp(camera.position.z, targetZ, 2.3, delta);
    focus.set(reducedMotion ? 0 : scrollProgress * 0.15, -0.08 + (reducedMotion ? 0 : scrollProgress * 0.04), 0);
    camera.lookAt(focus);
    if (!motion.current.cameraPose) {
      motion.current.cameraPose = { position: camera.position.clone(), focus: focus.clone() };
    } else {
      motion.current.cameraPose.position.copy(camera.position);
      motion.current.cameraPose.focus.copy(focus);
    }
  });
  return null;
}
