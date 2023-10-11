import { useEffect, useContext } from 'react';
import * as THREE from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import { AuthContext } from '../contexts/AuthContext';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getFirestore, doc, updateDoc } from 'firebase/firestore';

export const generateAndUploadGLTF = async (addedBooks, userId, cubeCaption) => {
  console.log('generateAndUploadGLTF called');
  const scene = new THREE.Scene();
  console.log('new scene created');
  const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(500, 500);
  renderer.setClearColor(0xFFFFFF, 1);
  document.body.appendChild(renderer.domElement);  // Temporarily add renderer to document to render the scene
  console.log('temporarily added renderer to document');

  const geometry = new THREE.BoxGeometry(4, 4, 4);
  const materials = [];
  const loader = new THREE.TextureLoader();

  try {
    // Create an array to hold the promises for texture loading
    const textureLoadPromises = [];
  
    for (let i = 0; i < 6; i++) {
      const book = addedBooks && addedBooks[i] ? addedBooks[i] : null;
      const imageURL = book ? book.localThumbnail : '/default-cover1.png';
  
      // Push each texture load promise to the array
      textureLoadPromises.push(new Promise((resolve, reject) => {
        loader.load(
          imageURL,
          (texture) => {
            const material = new THREE.MeshBasicMaterial({ map: texture });
            materials.push(material);
            resolve();  // Resolve the promise as soon as the texture is loaded
          },
          undefined,
          (error) => {
            console.error('An error occurred while loading a texture.', error);
            reject(error);  // Reject the promise on error
          }
        );
      }));
    }
  
    // Wait for all texture load promises to complete
    await Promise.all(textureLoadPromises);
  
    // Now all textures are loaded, create and add the cube to the scene
    const cube = new THREE.Mesh(geometry, materials);
    scene.add(cube);
    camera.position.z = 10;
    renderer.render(scene, camera);
  
  } catch (error) {
    // Handle any errors that occurred during texture loading or cube creation
    console.error('An error occurred:', error);
  }
  console.log('generation finished');

  const exporter = new GLTFExporter();
  exporter.parse(scene, async (gltf) => {
    console.log('Exporter parse called');
    const blob = new Blob([JSON.stringify(gltf)], { type: 'application/json' });
    console.log('Blob created');
    const storage = getStorage();
    console.log('Got storage');
    const db = getFirestore();
    console.log('Got Firestore');
    const storageRef = ref(storage, `users/${userId}/cubes/${cubeCaption}/${cubeCaption}.glb`);
    try {
        const uploadResult = await uploadBytes(storageRef, blob);
        console.log('Upload result:', uploadResult);
        const downloadURL = await getDownloadURL(storageRef);
        console.log('Download URL:', downloadURL);
        const cubeDoc = doc(db, 'users', userId, 'cubes', cubeCaption);
        await updateDoc(cubeDoc, { gltfUrl: downloadURL });
        console.log('Doc updated with gltfUrl:', downloadURL);
    } catch (error) {
        console.error('Error during upload or doc update:', error);
    }
  }, { binary: true });

  document.body.removeChild(renderer.domElement);  // Remove renderer from document once done
};

const BookCube = ({ addedBooks }) => {
  const { userId, setUserId } = useContext(AuthContext);

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
      const imageURL = book ? book.localThumbnail : '/default-cover1.png';

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
  }, [addedBooks, setUserId]);

  return <div id="book-cube-container"></div>;
};

export default BookCube;