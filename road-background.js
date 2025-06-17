// Realistic Winter Road Background - Slowroads.ai Style
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
        this.snowflakes = [];
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
        // Teal/cyan winter sky like slowroads
        this.renderer.setClearColor(0x4A6B7A, 1); 
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        
        // Dense atmospheric fog with teal tint
        this.scene.fog = new THREE.Fog(0x4A6B7A, 20, 120);
        
        // Create lighting
        this.createLighting();
        
        // Create road
        this.createRoad();
        
        // Create landscape
        this.createLandscape();
        
        // Create snow
        this.createSnow();
        
        // Handle window resize
        window.addEventListener('resize', () => this.onWindowResize());
    }

    createLighting() {
        // Cold, dim ambient light
        const ambientLight = new THREE.AmbientLight(0x405060, 0.3);
        this.scene.add(ambientLight);
        
        // Cool directional light with blue tint
        const directionalLight = new THREE.DirectionalLight(0xB0C4DE, 0.4);
        directionalLight.position.set(30, 40, 30);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        this.scene.add(directionalLight);
    }

    createRoad() {
        // Create road geometry
        const roadGeometry = new THREE.PlaneGeometry(this.roadWidth, this.segmentLength * this.numSegments);
        
        // Dark snowy road
        const roadMaterial = new THREE.MeshLambertMaterial({ 
            color: 0x2A2A2A,
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
        // Dim yellow center line
        const lineGeometry = new THREE.BoxGeometry(0.2, 0.01, this.segmentLength * this.numSegments);
        const lineMaterial = new THREE.MeshBasicMaterial({ color: 0xBBA76A });
        
        const centerLine = new THREE.Mesh(lineGeometry, lineMaterial);
        centerLine.position.y = 0.01;
        centerLine.position.z = -this.segmentLength * this.numSegments / 2;
        this.scene.add(centerLine);
        
        // Dim white side lines
        const sideLineMaterial = new THREE.MeshBasicMaterial({ color: 0xA0A0A0 });
        
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
        // Create snowy ground
        const groundGeometry = new THREE.PlaneGeometry(200, 200);
        const groundMaterial = new THREE.MeshLambertMaterial({ color: 0xE8F4F8 });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.position.y = -0.1;
        ground.receiveShadow = true;
        this.scene.add(ground);
        
        // Create distant mountains that stay far away
        this.createDistantMountains();
        
        // Create realistic winter pine trees
        for (let i = 0; i < 50; i++) {
            let x = (Math.random() - 0.5) * 120;
            // Ensure trees are away from road center but can be closer
            if (Math.abs(x) < 8) {
                x = x < 0 ? -8 - Math.random() * 20 : 8 + Math.random() * 20;
            }
            this.createPineTree(
                x,
                0,
                (Math.random() - 0.5) * 200
            );
        }
        
        // Create snowy terrain variations
        for (let i = 0; i < 20; i++) {
            let x = (Math.random() - 0.5) * 100;
            if (Math.abs(x) < 15) {
                x = x < 0 ? -15 - Math.random() * 30 : 15 + Math.random() * 30;
            }
            this.createSnowyMound(
                x,
                -1,
                (Math.random() - 0.5) * 150
            );
        }
    }

    createDistantMountains() {
        // Create mountains very far in the distance
        const numMountains = 15;
        const distance = -250;
        
        for (let i = 0; i < numMountains; i++) {
            this.createDistantMountain(
                (i - numMountains / 2) * 35 + (Math.random() - 0.5) * 25,
                -5,
                distance + (Math.random() - 0.5) * 80,
                25 + Math.random() * 15
            );
        }
    }

    createDistantMountain(x, y, z, height) {
        const mountain = new THREE.Group();
        
        const numPeaks = 1 + Math.floor(Math.random() * 2);
        
        for (let i = 0; i < numPeaks; i++) {
            const peakHeight = height * (0.8 + Math.random() * 0.2);
            const peakWidth = 15 + Math.random() * 10;
            
            const mountainGeometry = new THREE.ConeGeometry(peakWidth, peakHeight, 8);
            
            // Dark silhouette mountains like in slowroads
            const mountainMaterial = new THREE.MeshLambertMaterial({ 
                color: 0x2A3A4A,
                transparent: true,
                opacity: 0.6
            });
            
            const peak = new THREE.Mesh(mountainGeometry, mountainMaterial);
            peak.position.x = (i - numPeaks / 2) * peakWidth * 0.4;
            peak.position.y = peakHeight / 2;
            
            mountain.add(peak);
        }
        
        mountain.position.set(x, y, z);
        this.scene.add(mountain);
        this.mountains.push(mountain);
    }

    createPineTree(x, y, z) {
        const tree = new THREE.Group();
        
        // Dark trunk
        const trunkGeometry = new THREE.CylinderGeometry(0.15, 0.25, 4);
        const trunkMaterial = new THREE.MeshLambertMaterial({ color: 0x2D1B0E });
        const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
        trunk.position.y = 2;
        trunk.castShadow = true;
        tree.add(trunk);
        
        // Create pine tree layers
        const layerColors = [0x1A4A3A, 0x1E5A3E, 0x225A42]; // Dark winter pine colors
        const numLayers = 3 + Math.floor(Math.random() * 2);
        
        for (let i = 0; i < numLayers; i++) {
            const layerRadius = 2.5 - (i * 0.4);
            const layerHeight = 2.5 - (i * 0.3);
            const layerY = 3 + (i * 1.2);
            
            const layerGeometry = new THREE.ConeGeometry(layerRadius, layerHeight, 8);
            const layerMaterial = new THREE.MeshLambertMaterial({ 
                color: layerColors[i % layerColors.length]
            });
            const layer = new THREE.Mesh(layerGeometry, layerMaterial);
            layer.position.y = layerY;
            layer.castShadow = true;
            tree.add(layer);
            
        }
        
        tree.position.set(x, y, z);
        tree.scale.set(
            0.6 + Math.random() * 0.6,
            0.7 + Math.random() * 0.5,
            0.6 + Math.random() * 0.6
        );
        
        this.scene.add(tree);
        this.trees.push(tree);
    }

    createSnowyMound(x, y, z) {
        const moundGeometry = new THREE.SphereGeometry(
            3 + Math.random() * 6,
            12,
            6
        );
        const moundMaterial = new THREE.MeshLambertMaterial({ 
            color: 0xE0F0F8
        });
        const mound = new THREE.Mesh(moundGeometry, moundMaterial);
        mound.position.set(x, y, z);
        mound.scale.y = 0.3 + Math.random() * 0.2;
        mound.receiveShadow = true;
        
        this.scene.add(mound);
        this.hills.push(mound);
    }

    createSnow() {
        // Create realistic snowflakes
        const snowflakeGeometry = new THREE.SphereGeometry(0.02, 4, 3);
        const snowflakeMaterial = new THREE.MeshBasicMaterial({ 
            color: 0xFFFFFF,
            transparent: true,
            opacity: 0.6
        });
        
        // More subtle snow
        for (let i = 0; i < 200; i++) {
            const snowflake = new THREE.Mesh(snowflakeGeometry, snowflakeMaterial);
            
            snowflake.position.set(
                (Math.random() - 0.5) * 80,
                Math.random() * 40 + 5,
                (Math.random() - 0.5) * 150
            );
            
            snowflake.userData = {
                fallSpeed: 0.05 + Math.random() * 0.05,
                driftSpeed: (Math.random() - 0.5) * 0.01,
                initialY: snowflake.position.y
            };
            
            this.scene.add(snowflake);
            this.snowflakes.push(snowflake);
        }
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        
        // Animate snowflakes
        this.snowflakes.forEach(snowflake => {
            snowflake.position.y -= snowflake.userData.fallSpeed;
            snowflake.position.x += snowflake.userData.driftSpeed;
            snowflake.position.z += this.speed * 0.5;
            
            if (snowflake.position.y < -2 || snowflake.position.z > 40) {
                snowflake.position.y = snowflake.userData.initialY + Math.random() * 10;
                snowflake.position.x = (Math.random() - 0.5) * 80;
                snowflake.position.z = -75 - Math.random() * 75;
            }
        });
        
        // Move road segments
        this.roadSegments.forEach((segment, index) => {
            segment.z += this.speed;
            
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
                let newX = (Math.random() - 0.5) * 120;
                if (Math.abs(newX) < 8) {
                    newX = newX < 0 ? -8 - Math.random() * 20 : 8 + Math.random() * 20;
                }
                tree.position.x = newX;
            }
        });
        
        // Move terrain
        this.hills.forEach(hill => {
            hill.position.z += this.speed * 0.4;
            if (hill.position.z > 50) {
                hill.position.z = -150;
                let newX = (Math.random() - 0.5) * 100;
                if (Math.abs(newX) < 15) {
                    newX = newX < 0 ? -15 - Math.random() * 30 : 15 + Math.random() * 30;
                }
                hill.position.x = newX;
            }
        });
        
        // Mountains stay stationary in distance
        
        // Update road position
        this.road.position.z += this.speed;
        if (this.road.position.z > this.segmentLength) {
            this.road.position.z = -this.segmentLength * this.numSegments / 2;
        }
        
        // Update road lines
        this.scene.children.forEach(child => {
            if (child.material && child.material.color && 
                (child.material.color.getHex() === 0xBBA76A || child.material.color.getHex() === 0xA0A0A0)) {
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