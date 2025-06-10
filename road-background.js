// Road Background using Three.js
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
        // Get canvas element
        const canvas = document.getElementById('roadCanvas');
        
        // Create scene
        this.scene = new THREE.Scene();
        
        // Create camera
        this.camera = new THREE.PerspectiveCamera(
            75, 
            window.innerWidth / window.innerHeight, 
            0.1, 
            1000
        );
        this.camera.position.set(0, 2, 5);
        this.camera.lookAt(0, 0, 0);
        
        // Create renderer
        this.renderer = new THREE.WebGLRenderer({ 
            canvas: canvas,
            alpha: true,
            antialias: true
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor(0x87CEEB, 1); // Sky blue
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        
        // Add fog for depth
        this.scene.fog = new THREE.Fog(0x87CEEB, 50, 200);
        
        // Create lighting
        this.createLighting();
        
        // Create road
        this.createRoad();
        
        // Create landscape
        this.createLandscape();
        
        // Handle window resize
        window.addEventListener('resize', () => this.onWindowResize());
    }

    createLighting() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
        this.scene.add(ambientLight);
        
        // Directional light (sun)
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(50, 50, 50);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        this.scene.add(directionalLight);
    }

    createRoad() {
        // Create road geometry
        const roadGeometry = new THREE.PlaneGeometry(this.roadWidth, this.segmentLength * this.numSegments);
        
        // Create road material
        const roadMaterial = new THREE.MeshLambertMaterial({ 
            color: 0x404040,
            transparent: true,
            opacity: 0.9
        });
        
        // Create road mesh
        this.road = new THREE.Mesh(roadGeometry, roadMaterial);
        this.road.rotation.x = -Math.PI / 2;
        this.road.position.y = 0;
        this.road.position.z = -this.segmentLength * this.numSegments / 2;
        this.road.receiveShadow = true;
        this.scene.add(this.road);
        
        // Create road lines
        this.createRoadLines();
        
        // Create road segments for animation
        for (let i = 0; i < this.numSegments; i++) {
            const segment = {
                z: i * this.segmentLength - this.segmentLength * this.numSegments / 2,
                curve: (Math.random() - 0.5) * 0.1
            };
            this.roadSegments.push(segment);
        }
    }

    createRoadLines() {
        // Center line
        const lineGeometry = new THREE.BoxGeometry(0.2, 0.01, this.segmentLength * this.numSegments);
        const lineMaterial = new THREE.MeshBasicMaterial({ color: 0xFFFF00 });
        
        const centerLine = new THREE.Mesh(lineGeometry, lineMaterial);
        centerLine.position.y = 0.01;
        centerLine.position.z = -this.segmentLength * this.numSegments / 2;
        this.scene.add(centerLine);
        
        // Side lines
        const sideLineMaterial = new THREE.MeshBasicMaterial({ color: 0xFFFFFF });
        
        const leftLine = new THREE.Mesh(lineGeometry, sideLineMaterial);
        leftLine.position.x = -this.roadWidth / 2;
        leftLine.position.y = 0.01;
        leftLine.position.z = -this.segmentLength * this.numSegments / 2;
        this.scene.add(leftLine);
        
        const rightLine = new THREE.Mesh(lineGeometry, sideLineMaterial);
        rightLine.position.x = this.roadWidth / 2;
        rightLine.position.y = 0.01;
        rightLine.position.z = -this.segmentLength * this.numSegments / 2;
        this.scene.add(rightLine);
    }

    createLandscape() {
        // Create ground
        const groundGeometry = new THREE.PlaneGeometry(200, 200);
        const groundMaterial = new THREE.MeshLambertMaterial({ color: 0x90EE90 });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.position.y = -0.1;
        ground.receiveShadow = true;
        this.scene.add(ground);
        
        // Create trees
        for (let i = 0; i < 50; i++) {
            this.createTree(
                (Math.random() - 0.5) * 100,
                0,
                (Math.random() - 0.5) * 200
            );
        }
        
        // Create hills
        for (let i = 0; i < 20; i++) {
            this.createHill(
                (Math.random() - 0.5) * 150,
                -2,
                (Math.random() - 0.5) * 150
            );
        }
    }

    createTree(x, y, z) {
        const tree = new THREE.Group();
        
        // Trunk
        const trunkGeometry = new THREE.CylinderGeometry(0.2, 0.3, 3);
        const trunkMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
        const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
        trunk.position.y = 1.5;
        trunk.castShadow = true;
        tree.add(trunk);
        
        // Leaves
        const leavesGeometry = new THREE.SphereGeometry(2, 8, 6);
        const leavesMaterial = new THREE.MeshLambertMaterial({ color: 0x228B22 });
        const leaves = new THREE.Mesh(leavesGeometry, leavesMaterial);
        leaves.position.y = 4;
        leaves.castShadow = true;
        tree.add(leaves);
        
        tree.position.set(x, y, z);
        tree.scale.set(
            0.5 + Math.random() * 0.5,
            0.5 + Math.random() * 0.5,
            0.5 + Math.random() * 0.5
        );
        
        this.scene.add(tree);
        this.trees.push(tree);
    }

    createHill(x, y, z) {
        const hillGeometry = new THREE.SphereGeometry(
            5 + Math.random() * 10,
            16,
            8
        );
        const hillMaterial = new THREE.MeshLambertMaterial({ 
            color: new THREE.Color().setHSL(0.25, 0.5, 0.3 + Math.random() * 0.2)
        });
        const hill = new THREE.Mesh(hillGeometry, hillMaterial);
        hill.position.set(x, y, z);
        hill.scale.y = 0.5;
        hill.receiveShadow = true;
        
        this.scene.add(hill);
        this.hills.push(hill);
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        
        // Move road segments
        this.roadSegments.forEach((segment, index) => {
            segment.z += this.speed;
            
            // Reset segments that have passed the camera
            if (segment.z > this.segmentLength * 2) {
                segment.z = -this.segmentLength * this.numSegments / 2;
                segment.curve = (Math.random() - 0.5) * 0.1;
            }
        });
        
        // Animate camera with subtle road curves
        if (this.roadSegments.length > 0) {
            const nearestSegment = this.roadSegments.find(s => s.z > -10 && s.z < 10);
            if (nearestSegment) {
                this.camera.position.x += (nearestSegment.curve - this.camera.position.x) * 0.02;
            }
        }
        
        // Move trees
        this.trees.forEach(tree => {
            tree.position.z += this.speed;
            if (tree.position.z > 50) {
                tree.position.z = -150;
                tree.position.x = (Math.random() - 0.5) * 100;
            }
        });
        
        // Move hills
        this.hills.forEach(hill => {
            hill.position.z += this.speed * 0.3;
            if (hill.position.z > 50) {
                hill.position.z = -150;
                hill.position.x = (Math.random() - 0.5) * 150;
            }
        });
        
        // Update road position
        this.road.position.z += this.speed;
        if (this.road.position.z > this.segmentLength) {
            this.road.position.z = -this.segmentLength * this.numSegments / 2;
        }
        
        // Update road lines
        this.scene.children.forEach(child => {
            if (child.material && child.material.color && 
                (child.material.color.getHex() === 0xFFFF00 || child.material.color.getHex() === 0xFFFFFF)) {
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

// Initialize road background when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new RoadBackground();
});