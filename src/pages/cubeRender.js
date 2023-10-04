import { useEffect } from 'react';
import * as THREE from 'three';

const BookCube = ({ addedBooks }) => {
  useEffect(() => {
    // Remove existing canvas if any
    const container = document.getElementById('book-cube-container');
    const existingCanvas = container.querySelector('canvas');
    if (existingCanvas) {
      container.removeChild(existingCanvas);
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(500, 500);
    renderer.setClearColor(0xFFFFFF, 1);
    container.appendChild(renderer.domElement);

    const geometry = new THREE.BoxGeometry(4, 4, 4);
    const materials = [];
    const loader = new THREE.TextureLoader();

    for (let i = 0; i < 6; i++) {
      const book = addedBooks && addedBooks[i] ? addedBooks[i] : null;
      const imageURL = book ? book.localThumbnail : '/default-cover1.png'; // Use local thumbnail or a default image

      loader.load(
        imageURL, 
        (texture) => {
          const material = new THREE.MeshBasicMaterial({ map: texture });
          materials.push(material);
          
          if (materials.length === 6) {
            // All textures are loaded
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
        }, 
        undefined, 
        (error) => {
          console.error('An error occurred while loading a texture.', error);
        }
      );
    }
  }, [addedBooks]);

  return <div id="book-cube-container"></div>;
};

export default BookCube;