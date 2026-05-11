import { useEffect, useRef } from "react";
import * as THREE from "three";

const vertexShader = `
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uInfluence;
  attribute float aBand;
  attribute float aSeed;
  varying float vBand;
  varying float vGlow;

  void main() {
    vec3 pos = position;
    float waveA = sin((pos.x * 2.2) + (uTime * 0.55) + (aSeed * 6.2831));
    float waveB = sin((pos.x * 5.2) - (uTime * 0.34) + (aBand * 2.1));
    float bandDrift = sin(uTime * 0.16 + aBand * 3.6) * 0.22;

    pos.y += (waveA * 0.18 + waveB * 0.055) + bandDrift;
    pos.z += sin((pos.x * 1.4) + (uTime * 0.42) + aSeed) * 0.58;

    vec2 mouseDelta = pos.xy - uMouse;
    float mouseDistance = max(length(mouseDelta), 0.001);
    float mouseField = smoothstep(3.2, 0.0, mouseDistance) * uInfluence;
    vec2 tangent = vec2(-mouseDelta.y, mouseDelta.x) / mouseDistance;

    pos.xy += tangent * mouseField * 0.42;
    pos.z += mouseField * 0.85;

    vec4 modelViewPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * modelViewPosition;
    gl_PointSize = (3.4 + mouseField * 5.4 + sin(aSeed * 9.0 + uTime) * 1.1) * (1.0 / -modelViewPosition.z) * 5.6;

    vBand = aBand;
    vGlow = mouseField;
  }
`;

const fragmentShader = `
  varying float vBand;
  varying float vGlow;

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    float alpha = smoothstep(0.5, 0.08, d);

    vec3 blue = vec3(0.12, 0.58, 1.0);
    vec3 cyan = vec3(0.15, 0.95, 0.92);
    vec3 red = vec3(1.0, 0.16, 0.24);
    vec3 violet = vec3(0.75, 0.22, 1.0);
    vec3 color = mix(blue, cyan, smoothstep(0.0, 0.35, vBand));
    color = mix(color, violet, smoothstep(0.35, 0.7, vBand));
    color = mix(color, red, smoothstep(0.68, 1.0, vBand));
    color += vGlow * vec3(0.35, 0.08, 0.06);

    gl_FragColor = vec4(color, alpha * 0.68);
  }
`;

const createFlowGeometry = (count: number) => {
  const positions = new Float32Array(count * 3);
  const bands = new Float32Array(count);
  const seeds = new Float32Array(count);
    const bandCenters = [-1.78, -1.05, -0.38, 0.22, 0.86, 1.52];

  for (let i = 0; i < count; i += 1) {
    const bandIndex = i % bandCenters.length;
    const progress = Math.random();
    const x = -6.2 + progress * 12.4;
    const y = bandCenters[bandIndex] + (Math.random() - 0.5) * 0.3 + Math.sin(progress * Math.PI * 2) * 0.28;
    const z = (Math.random() - 0.5) * 1.35;

    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;
    bands[i] = bandIndex / (bandCenters.length - 1);
    seeds[i] = Math.random();
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("aBand", new THREE.BufferAttribute(bands, 1));
  geometry.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));

  return geometry;
};

export const InteractiveFlowField = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;

    if (!mount) {
      return undefined;
    }

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(48, 1, 0.1, 100);
    const mouse = new THREE.Vector2(0, 0);
    const targetMouse = new THREE.Vector2(0, 0);
    const clock = new THREE.Clock();
    const isSmallScreen = window.matchMedia("(max-width: 768px)").matches;
    const particleCount = reducedMotion ? 1800 : isSmallScreen ? 1800 : 7600;

    camera.position.set(0, 0, 7);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.setAttribute("aria-hidden", "true");
    renderer.domElement.dataset.flowField = "true";
    renderer.domElement.className = "h-full w-full";
    mount.appendChild(renderer.domElement);

    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uMouse: { value: mouse },
        uInfluence: { value: reducedMotion ? 0 : 1 },
      },
      vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const geometry = createFlowGeometry(particleCount);
    const points = new THREE.Points(geometry, material);
    points.rotation.z = -0.12;
    scene.add(points);

    const resize = () => {
      const width = mount.clientWidth || window.innerWidth;
      const height = mount.clientHeight || window.innerHeight;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };

    const updatePointer = (clientX: number, clientY: number) => {
      const rect = mount.getBoundingClientRect();
      const normalizedX = ((clientX - rect.left) / rect.width) * 2 - 1;
      const normalizedY = -(((clientY - rect.top) / rect.height) * 2 - 1);
      targetMouse.set(normalizedX * 5.2, normalizedY * 3.15);
    };

    const onPointerMove = (event: PointerEvent) => {
      updatePointer(event.clientX, event.clientY);
    };

    const onTouchMove = (event: TouchEvent) => {
      if (event.touches[0]) {
        updatePointer(event.touches[0].clientX, event.touches[0].clientY);
      }
    };

    let animationFrame = 0;
    const render = () => {
      const elapsed = clock.getElapsedTime();
      mouse.lerp(targetMouse, reducedMotion ? 0.02 : 0.065);
      material.uniforms.uTime.value = elapsed;
      points.rotation.y = Math.sin(elapsed * 0.12) * 0.08;
      renderer.render(scene, camera);
      animationFrame = window.requestAnimationFrame(render);
    };

    resize();
    render();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("touchmove", onTouchMove, { passive: true });

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("touchmove", onTouchMove);
      scene.remove(points);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="absolute inset-0 opacity-55 mix-blend-screen md:opacity-85"
      data-testid="interactive-flow-field"
    />
  );
};
