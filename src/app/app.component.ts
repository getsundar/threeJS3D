import {
  Component,
  ViewChild,
  ElementRef
} from '@angular/core';
import * as THREE from 'three';
declare var require: any;
import OrbitControls from 'three-orbitcontrols';
import GLTFLoader from 'three-gltf-loader';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @ViewChild('rendererContainer') rendererContainer: ElementRef;

  renderer = new THREE.WebGLRenderer();
  scene;
  camera;
  mesh;
  controls;
  light;
  raycaster;
  mouse;
  sprite;
modelLoaded;
  constructor() {
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.scene = new THREE.Scene();
    this.light = new THREE.HemisphereLight(0xbbbbff, 0x444422);
    this.light.position.set(0, 1, 0);
    this.scene.add(this.light);
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.gammaOutput = true;
    this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 80000);
    this.camera.position.set(-1000, 9000, 42000);
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.target.set(0, 0, 20000);
    this.controls.update();
    this.animate();
    const loader = new GLTFLoader();
    loader.load('../assets/models/A320/scene.gltf', (gltf) => {
      this.scene.add(gltf.scene);
      this.modelLoaded=gltf.scene;
    }, undefined, function (e) {
      console.error(e);
    });

    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }
  animate() {
    window.requestAnimationFrame(() => this.animate());
    this.renderer.render(this.scene, this.camera);
    //console.log('check');
  }
  ngOnInit() {
    let count = 0;
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.rendererContainer.nativeElement.appendChild(this.renderer.domElement);
    window.addEventListener('click', (event) => {
      this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      this.raycaster.setFromCamera(this.mouse, this.camera);
      const vec = new THREE.Vector3();
      vec.unproject(this.camera);
      // calculate objects intersecting the picking ray
      const intersects = this.raycaster.intersectObjects(this.scene.children, true);
      console.log('Intersects:::' + intersects.length);

      if (intersects.length !== 0) {
        debugger;
        const numberTexture = new THREE.CanvasTexture(
          document.querySelector('#number')
        );
        const cubeGeometry = new THREE.BoxGeometry(500, 500, 500);

        let mesh = new THREE.Mesh(
          cubeGeometry,
          new THREE.MeshPhongMaterial({
            color: 0x156289,
            emissive: 0x072534,
            side: THREE.DoubleSide,
            shading: THREE.FlatShading
          })
        );
        const vector = new THREE.Vector3( this.mouse.x, this.mouse.y, -1 ).unproject( this.camera );
        mesh.position.set(intersects[0].point.x, intersects[0].point.y, intersects[0].point.z);
        this.scene.add(mesh);
        this.renderer.render(this.scene, this.camera);
      }
    });
    // this.rendererContainer.nativeElement.addEventListener('click', () => {
    //   debugger;
    // });
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
}
