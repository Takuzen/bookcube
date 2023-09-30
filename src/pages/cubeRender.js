import { useEffect } from 'react';
import * as THREE from 'three';

const BookCube = () => {
  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(500, 500);
    renderer.setClearColor(0xFFFFFF, 1);
    document.getElementById('book-cube-container').appendChild(renderer.domElement);

    const geometry = new THREE.BoxGeometry(4, 4, 4);
    const materials = [];

    for (let i = 0; i < 6; i++) {
      const img = new Image();
      img.src = `/book-cover${i}.png`;

      img.onload = () => {
        const texture = new THREE.Texture(img);
        texture.needsUpdate = true;
        const aspectRatio = img.width / img.height;

        // Update UV mapping here based on aspect ratio if needed

        const material = new THREE.MeshBasicMaterial({ map: texture });
        materials.push(material);

        if (materials.length === 6) {
          const cube = new THREE.Mesh(geometry, materials);
          scene.add(cube);
          camera.position.z = 10;

          const animate = () => {
            requestAnimationFrame(animate);
            cube.rotation.x += 0.005;
            cube.rotation.y += 0.005;
            renderer.render(scene, camera);
          };

          animate();
        }
      };
    }
  }, []);

  return <div id="book-cube-container"></div>;
};

export default BookCube;