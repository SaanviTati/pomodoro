// Enhanced Road Background using Three.js
class RoadBackground {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.road = null;
        this.roadSegments = [];
        this.trees = [];
        this.hills = [];
        this.mountains = [];
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
        // Muted dusky sky color
        this.renderer.setClearColor(0x6B7B8C, 1); 
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        
        // Enhanced fog for atmospheric depth
        this.scene.fog = new THREE.Fog(0x6B7B8C, 30, 150);
        
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
        // Dimmer ambient light for muted atmosphere
        const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
        this.scene.add(ambientLight);
        
        // Softer directional light with warm tone
        const directionalLight = new THREE.DirectionalLight(0xFFE4B5, 0.6);
        directionalLight.position.set(50, 50, 50);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        this.scene.add(directionalLight);
    }

    createRoad() {
        // Create road geometry
        const roadGeometry = new THREE.PlaneGeometry(this.roadWidth, this.segmentLength * this.numSegments);
        
        // Darker, more muted road material
        const roadMaterial = new THREE.MeshLambertMaterial({ 
            color: 0x2C2C2C,
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
        // Muted yellow center line
        const lineGeometry = new THREE.BoxGeometry(0.2, 0.01, this.segmentLength * this.numSegments);
        const lineMaterial = new THREE.MeshBasicMaterial({ color: 0xD4AF37 });
        
        const centerLine = new THREE.Mesh(lineGeometry, lineMaterial);
        centerLine.position.y = 0.01;
        centerLine.position.z = -this.segmentLength * this.numSegments / 2;
        this.scene.add(centerLine);
        
        // Dim white side lines
        const sideLineMaterial = new THREE.MeshBasicMaterial({ color: 0xC0C0C0 });
        
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
        // Create ground with muted brown/tan color
        const groundGeometry = new THREE.PlaneGeometry(200, 200);
        const groundMaterial = new THREE.MeshLambertMaterial({ color: 0x8B7355 });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.position.y = -0.1;
        ground.receiveShadow = true;
        this.scene.add(ground);
        
        // Create mountains in the background
        this.createMountains();
        
        // Create trees away from road (no greenery on road)
        for (let i = 0; i < 40; i++) {
            let x = (Math.random() - 0.5) * 100;
            // Ensure trees are far from road center
            if (Math.abs(x) < 15) {
                x = x < 0 ? -15 - Math.random() * 30 : 15 + Math.random() * 30;
            }
            this.createTree(
                x,
                0,
                (Math.random() - 0.5) * 200
            );
        }
        
        // Create distant hills
        for (let i = 0; i < 15; i++) {
            let x = (Math.random() - 0.5) * 120;
            // Keep hills away from immediate road area
            if (Math.abs(x) < 20) {
                x = x < 0 ? -20 - Math.random() * 40 : 20 + Math.random() * 40;
            }
            this.createHill(
                x,
                -2,
                (Math.random() - 0.5) * 150
            );
        }
    }

    createMountains() {
        // Create multiple mountain ranges at different distances
        for (let range = 0; range < 3; range++) {
            const numMountains = 8 - range * 2;
            const distance = -80 - range * 40;
            const height = 25 - range * 5;
            
            for (let i = 0; i < numMountains; i++) {
                this.createMountain(
                    (i - numMountains / 2) * 30 + (Math.random() - 0.5) * 20,
                    -5,
                    distance + (Math.random() - 0.5) * 30,
                    height,
                    range
                );
            }
        }
    }

    createMountain(x, y, z, baseHeight, rangeIndex) {
        const mountain = new THREE.Group();
        
        // Create multiple peaks for more realistic mountain shape
        const numPeaks = 2 + Math.floor(Math.random() * 3);
        
        for (let i = 0; i < numPeaks; i++) {
            const peakHeight = baseHeight * (0.6 + Math.random() * 0.4);
            const peakWidth = 8 + Math.random() * 12;
            
            const mountainGeometry = new THREE.ConeGeometry(peakWidth, peakHeight, 6);
            
            // Muted mountain colors - darker and more distant for far ranges
            let mountainColor;
            switch (rangeIndex) {
                case 0: // Closest range - dark blue-gray
                    mountainColor = new THREE.Color(0x4A5568);
                    break;
                case 1: // Middle range - lighter blue-gray
                    mountainColor = new THREE.Color(0x5A6B7D);
                    break;
                case 2: // Farthest range - very light blue-gray
                    mountainColor = new THREE.Color(0x6B7B8C);
                    break;
            }
            
            const mountainMaterial = new THREE.MeshLambertMaterial({ 
                color: mountainColor,
                transparent: true,
                opacity: 0.8 - rangeIndex * 0.2
            });
            
            const peak = new THREE.Mesh(mountainGeometry, mountainMaterial);
            peak.position.x = (i - numPeaks / 2) * peakWidth * 0.6;
            peak.position.y = peakHeight / 2;
            peak.receiveShadow = true;
            peak.castShadow = true;
            
            mountain.add(peak);
        }
        
        mountain.position.set(x, y, z);
        this.scene.add(mountain);
        this.mountains.push(mountain);
    }

    createTree(x, y, z) {
        const tree = new THREE.Group();
        
        // Trunk with muted brown
        const trunkGeometry = new THREE.CylinderGeometry(0.2, 0.3, 3);
        const trunkMaterial = new THREE.MeshLambertMaterial({ color: 0x5D4037 });
        const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
        trunk.position.y = 1.5;
        trunk.castShadow = true;
        tree.add(trunk);
        
        // Leaves with muted dark green
        const leavesGeometry = new THREE.SphereGeometry(2, 8, 6);
        const leavesMaterial = new THREE.MeshLambertMaterial({ color: 0x2E4B1C });
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
        // Muted earth tones for hills
        const hillMaterial = new THREE.MeshLambertMaterial({ 
            color: new THREE.Color().setHSL(0.08, 0.3, 0.25 + Math.random() * 0.15)
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
                let newX = (Math.random() - 0.5) * 100;
                // Ensure trees stay away from road
                if (Math.abs(newX) < 15) {
                    newX = newX < 0 ? -15 - Math.random() * 30 : 15 + Math.random() * 30;
                }
                tree.position.x = newX;
            }
        });
        
        // Move hills
        this.hills.forEach(hill => {
            hill.position.z += this.speed * 0.3;
            if (hill.position.z > 50) {
                hill.position.z = -150;
                let newX = (Math.random() - 0.5) * 120;
                // Keep hills away from road
                if (Math.abs(newX) < 20) {
                    newX = newX < 0 ? -20 - Math.random() * 40 : 20 + Math.random() * 40;
                }
                hill.position.x = newX;
            }
        });
        
        // Mountains move very slowly for parallax effect
        this.mountains.forEach(mountain => {
            mountain.position.z += this.speed * 0.1;
            if (mountain.position.z > 50) {
                mountain.position.z = -200;
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
                (child.material.color.getHex() === 0xD4AF37 || child.material.color.getHex() === 0xC0C0C0)) {
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