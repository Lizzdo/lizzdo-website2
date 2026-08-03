import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function ThreeHero() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    camera.position.z = window.innerWidth < 768 ? 10 : 6;

    let renderer: THREE.WebGLRenderer | null = null;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
      });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      containerRef.current.appendChild(renderer.domElement);
    } catch (e) {
      console.warn("WebGL is not supported or blocked in this browser. Falling back gracefully.", e);
      if (containerRef.current) {
        containerRef.current.classList.add("bg-gradient-to-br", "from-black", "via-neutral-950", "to-black", "opacity-80");
      }
    }

    // Main torus knot
    const knotGeometry = new THREE.TorusKnotGeometry(1.8, 0.45, 128, 32);
    const knotMaterial = new THREE.MeshPhongMaterial({
      color: 0x00f5ff,
      emissive: 0x00f5ff,
      shininess: 100,
      wireframe: true,
      transparent: true,
      opacity: 0.3,
    });
    const knot = new THREE.Mesh(knotGeometry, knotMaterial);
    scene.add(knot);

    // Inner core
    const coreGeometry = new THREE.IcosahedronGeometry(1.1, 1);
    const coreMaterial = new THREE.MeshPhongMaterial({
      color: 0x111827,
      transparent: true,
      opacity: 0.2,
    });
    const core = new THREE.Mesh(coreGeometry, coreMaterial);
    scene.add(core);

    // Lights
    scene.add(new THREE.AmbientLight(0x404040, 1.5));

    const cyanLight = new THREE.PointLight(0x00f5ff, 3, 50);
    cyanLight.position.set(8, 8, 8);
    scene.add(cyanLight);

    const orangeLight = new THREE.PointLight(0xffcc00, 3, 50);
    orangeLight.position.set(-8, -8, 8);
    scene.add(orangeLight);

    let mouseX = 0,
      mouseY = 0;
    const handleMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", handleMouseMove);

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    const animate = () => {
      requestAnimationFrame(animate);

      knot.rotation.x += 0.003;
      knot.rotation.y += 0.008;
      core.rotation.y -= 0.004;

      // Mouse parallax
      knot.rotation.y += mouseX * 0.015;
      knot.rotation.x += mouseY * 0.015;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 z-0 pointer-events-none opacity-50"
      id="hero-canvas"
    />
  );
}
