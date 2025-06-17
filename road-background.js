// road-background.js
document.addEventListener('DOMContentLoaded', () => {
  class RoadBackground {
    constructor() {
      this.scene = null;
      this.camera = null;
      this.renderer = null;
      this.road = null;
      this.roadSegments = [];
      this.trees = [];
      this.hills = [];
      this.speed = 0.5;
      this.roadWidth = 6;
      this.segmentLength = 10;
      this.numSegments = 100;

      this.init();
      this.animate();
    }

    init() {
      const canvas = document.getElementById('roadCanvas');
      if (!canvas) {
        console.error('No canvas with id "roadCanvas" found!');
        return;
      }

      this.scene = new THREE.Scene();
      this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      this.camera.position.set(0, 2, 5);
      this.camera.lookAt(0, 0, 0);

      this.renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.renderer.setPixelRatio(window.devicePixelRatio || 1);
      this.renderer.setClearColor(0x87CEEB, 1);
      this.renderer.shadowMap.enabled = true;
      this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

      this.scene.fog = new THREE.Fog(0x87CEEB, 50, 200);

      this.createLighting();
      this.createRoad();
      this.createLandscape();

      window.addEventListener('resize', () => this.onWindowResize());
    }

    createLighting() {
      const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
      this.scene.add(ambientLight);

      const dir = new THREE.DirectionalLight(0xffffff, 0.8);
      dir.position.set(50, 50, 50);
      dir.castShadow = true;
      dir.shadow.mapSize.width = 2048;
      dir.shadow.mapSize.height = 2048;
      this.scene.add(dir);
    }

    createRoad() {
      const roadGeom = new THREE.PlaneGeometry(this.roadWidth, this.segmentLength * this.numSegments);
      const roadMat = new THREE.MeshLambertMaterial({ color: 0x404040, transparent: true, opacity: 0.9 });
      this.road = new THREE.Mesh(roadGeom, roadMat);
      this.road.rotation.x = -Math.PI / 2;
      this.road.position.set(0, 0, -this.segmentLength * this.numSegments / 2);
      this.road.receiveShadow = true;
      this.scene.add(this.road);

      this.createRoadLines();

      for (let i = 0; i < this.numSegments; i++) {
        this.roadSegments.push({
          z: i * this.segmentLength - this.segmentLength * this.numSegments / 2,
          curve: (Math.random() - 0.5) * 0.1
        });
      }
    }

    createRoadLines() {
      const lineGeom = new THREE.BoxGeometry(0.2, 0.01, this.segmentLength * this.numSegments);
      const centerMat = new THREE.MeshBasicMaterial({ color: 0xFFFF00 });
      const sideMat = new THREE.MeshBasicMaterial({ color: 0xFFFFFF });

      const centerLine = new THREE.Mesh(lineGeom, centerMat);
      centerLine.position.set(0, 0.01, -this.segmentLength * this.numSegments / 2);
      this.scene.add(centerLine);

      const leftLine = centerLine.clone();
      leftLine.material = sideMat;
      leftLine.position.x = -this.roadWidth / 2;
      this.scene.add(leftLine);

      const rightLine = centerLine.clone();
      rightLine.material = sideMat;
      rightLine.position.x = this.roadWidth / 2;
      this.scene.add(rightLine);
    }

    createLandscape() {
      const ground = new THREE.Mesh(
        new THREE.PlaneGeometry(200, 200),
        new THREE.MeshLambertMaterial({ color: 0x90EE90 })
      );
      ground.rotation.x = -Math.PI / 2;
      ground.position.y = -0.1;
      ground.receiveShadow = true;
      this.scene.add(ground);

      for (let i = 0; i < 50; i++) {
        this.createTree((Math.random() - 0.5) * 100, 0, (Math.random() - 0.5) * 200);
      }
      for (let i = 0; i < 20; i++) {
        this.createHill((Math.random() - 0.5) * 150, -2, (Math.random() - 0.5) * 150);
      }
    }

    createTree(x, y, z) {
      const tree = new THREE.Group();
      const trunk = new THREE.Mesh(
        new THREE.CylinderGeometry(0.2, 0.3, 3),
        new THREE.MeshLambertMaterial({ color: 0x8B4513 })
      );
      trunk.position.y = 1.5;
      trunk.castShadow = true;

      const leaves = new THREE.Mesh(
        new THREE.SphereGeometry(2, 8, 6),
        new THREE.MeshLambertMaterial({ color: 0x228B22 })
      );
      leaves.position.y = 4;
      leaves.castShadow = true;

      tree.add(trunk);
      tree.add(leaves);
      tree.position.set(x, y, z);
      const s = 0.5 + Math.random() * 0.5;
      tree.scale.set(s, s, s);

      this.scene.add(tree);
      this.trees.push(tree);
    }

    createHill(x, y, z) {
      const hill = new THREE.Mesh(
        new THREE.SphereGeometry(5 + Math.random() * 10, 16, 8),
        new THREE.MeshLambertMaterial({
          color: new THREE.Color().setHSL(0.25, 0.5, 0.3 + Math.random() * 0.2)
        })
      );
      hill.position.set(x, y, z);
      hill.scale.y = 0.5;
      hill.receiveShadow = true;
      this.scene.add(hill);
      this.hills.push(hill);
    }

    animate() {
      requestAnimationFrame(() => this.animate());

      this.roadSegments.forEach(seg => {
        seg.z += this.speed;
        if (seg.z > this.segmentLength * 2) {
          seg.z = -this.segmentLength * this.numSegments / 2;
          seg.curve = (Math.random() - 0.5) * 0.1;
        }
      });

      const nearest = this.roadSegments.find(s => s.z > -10 && s.z < 10);
      if (nearest) {
        this.camera.position.x += (nearest.curve - this.camera.position.x) * 0.02;
      }

      this.trees.forEach(tree => {
        tree.position.z += this.speed;
        if (tree.position.z > 50) {
          tree.position.z = -150;
          tree.position.x = (Math.random() - 0.5) * 100;
        }
      });

      this.hills.forEach(hill => {
        hill.position.z += this.speed * 0.3;
        if (hill.position.z > 50) {
          hill.position.z = -150;
          hill.position.x = (Math.random() - 0.5) * 150;
        }
      });

      this.road.position.z += this.speed;
      if (this.road.position.z > this.segmentLength) {
        this.road.position.z = -this.segmentLength * this.numSegments / 2;
      }

      this.scene.children.forEach(child => {
        if (
          child.material &&
          child.material.color &&
          (child.material.color.getHex() === 0xffff00 || child.material.color.getHex() === 0xffffff)
        ) {
          child.position.z += this.speed;
          if (child.position.z > this.segmentLength) {
            child.position.z = -this.segmentLength * this.numSegments / 2;
          }
        }
      });

      this.renderer.render(this.scene, this.camera);
    }

    onWindowResize() {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
  }

  new RoadBackground();
});
