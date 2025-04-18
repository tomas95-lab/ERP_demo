import {
    forwardRef,
    useImperativeHandle,
    useRef,
    useState,
    useEffect,
  } from "react";
  import * as THREE from "three";
  import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
  import { GLTFLoader, GLTF } from "three/examples/jsm/loaders/GLTFLoader.js";
  
  export const FileDropPreview = forwardRef((_props, ref) => {
    const dropRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [fileUrl, setFileUrl] = useState<string | null>(null);
    const [fileName, setFileName] = useState<string | null>(null);
  
    const resetViewer = () => {
      setFileUrl(null);
      setFileName(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    };
  
    useImperativeHandle(ref, () => ({
      reset: resetViewer,
    }));
  
    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (!file) return;
      loadFile(file);
    };
  
    const loadFile = (file: File) => {
      const url = URL.createObjectURL(file);
      setFileUrl(url);
      setFileName(file.name);
    };
  
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) loadFile(file);
    };
  
    const handleClick = () => {
      if (!fileUrl && fileInputRef.current) {
        fileInputRef.current.click();
      }
    };
  
    return (
      <div
        ref={dropRef}
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="w-full h-full bg-white rounded-xl flex items-center justify-center text-sm text-muted-foreground border-2 border-dashed relative cursor-pointer"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".glb,.gltf,image/*,application/pdf"
          onChange={handleFileChange}
          className="hidden"
        />
        {fileUrl ? (
          fileName?.match(/\.(jpg|jpeg|png|gif)$/i) ? (
            <img src={fileUrl} alt="preview" className="max-h-[280px]" />
          ) : fileName?.endsWith(".pdf") ? (
            <iframe src={fileUrl} className="w-full h-full" title="PDF preview" />
          ) : (
            <ThreePreview fileUrl={fileUrl} />
          )
        ) : (
          <p>Click or drag a file to preview</p>
        )}
      </div>
    );
  });
  
  function ThreePreview({ fileUrl }: { fileUrl: string }) {
    const canvasRef = useRef<HTMLDivElement>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  
    useEffect(() => {
      if (!canvasRef.current) return;
  
      const container = canvasRef.current;
      const width = container.clientWidth -2;
      const height = container.clientHeight;
  
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0xf0f0f0);
  
      const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
      camera.position.set(0, 0, 5);
      cameraRef.current = camera;
  
      const renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(width, height);
      rendererRef.current = renderer;
  
      container.innerHTML = "";
      container.appendChild(renderer.domElement);
  
      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.enablePan = false;
  
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
      const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
      directionalLight.position.set(5, 10, 7.5);
      scene.add(ambientLight, directionalLight);
  
      const loader = new GLTFLoader();
      loader.load(
        fileUrl,
        (gltf: GLTF) => {
          const model = gltf.scene;
          scene.add(model);
  
          const box = new THREE.Box3().setFromObject(model);
          const size = box.getSize(new THREE.Vector3()).length();
          const center = box.getCenter(new THREE.Vector3());
  
          model.position.sub(center);
          camera.position.z = size * 1.2;
          controls.target.set(0, 0, 0);
        },
        undefined,
        (error: unknown) => {
          console.error("Error loading GLTF model:", error);
        }
      );
  
      const animate = () => {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
      };
  
      animate();
  
      const observer = new ResizeObserver((entries) => {
        for (const entry of entries) {
          if (!rendererRef.current || !cameraRef.current) return;
          const { width, height } = entry.contentRect;
          cameraRef.current.aspect = width / height;
          cameraRef.current.updateProjectionMatrix();
          rendererRef.current.setSize(width, height);
        }
      });
  
      observer.observe(container);
  
      return () => {
        observer.disconnect();
        renderer.dispose();
        container.innerHTML = "";
      };
    }, [fileUrl]);
  
    return <div ref={canvasRef} className="w-full h-full rounded overflow-hidden" />;
  }
  