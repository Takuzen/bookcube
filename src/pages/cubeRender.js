import { useEffect } from 'react';
import * as THREE from 'three';

const BookCube = () => {
  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    const geometry = new THREE.BoxGeometry();
    const materials = [];

    for (let i = 0; i < 6; i++) {
      const texture = new THREE.TextureLoader().load(`/book-cover${i}.png`);
      materials.push(new THREE.MeshBasicMaterial({ map: texture }));
    }

    const cube = new THREE.Mesh(geometry, materials);
    scene.add(cube);

    camera.position.z = 5;

    const animate = () => {
      requestAnimationFrame(animate);
      cube.rotation.x += 0.005;
      cube.rotation.y += 0.005;
      renderer.render(scene, camera);
    };

    animate();
  }, []);

  return <div id="book-cube-container"></div>;
};

export default BookCube;
