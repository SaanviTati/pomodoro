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

        this.renderer = new THREE.WebGLRenderer({ 
            canvas: canvas,
            alpha: true,
            antialias: true
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor(0xFAD4C0, 1); 
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        
        // Create fog
        this.scene.fog = new THREE.Fog(0xFFE3C6, 10, 120);
        
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
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0xFFE3C6, 0.5);
        this.scene.add(ambientLight);
        
        // Cool directional light with blue tint
        const directionalLight = new THREE.DirectionalLight(0xB0C4DE, 0.6);
        directionalLight.position.set(30, 40, 30);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        this.scene.add(directionalLight);
    }

    createRoad() {
        // Create road geometry
        const roadGeometry = new THREE.PlaneGeometry(this.roadWidth, this.segmentLength * this.numSegments);
        
        // Dark road
        const roadMaterial = new THREE.MeshLambertMaterial({ 
            color: 0x5A4C3C,
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
        // Yellow center line
        const lineGeometry = new THREE.BoxGeometry(0.2, 0.01, this.segmentLength * this.numSegments);
        const lineMaterial = new THREE.MeshBasicMaterial({ color: 0xBBA76A });
        
        const centerLine = new THREE.Mesh(lineGeometry, lineMaterial);
        centerLine.position.y = 0.01;
        centerLine.position.z = -this.segmentLength * this.numSegments / 2;
        this.scene.add(centerLine);
        
        // White side lines
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
        // Create Plane in XZ with subdivisions
        const groundGeometry = new THREE.PlaneGeometry(200, 200, 128, 128);

        const pos = groundGeometry.attributes.position;
        for (let i = 0; i < pos.count; i++) {
            const x = pos.getX(i);
            const z = pos.getZ(i);
            const y =
                Math.sin(x * 0.08) * 0.6 +
                Math.cos(z * 0.08) * 0.6 +
                (Math.random() - 0.5) * 0.3;
            pos.setZ(i, y);
        }
        groundGeometry.computeVertexNormals();

        const groundMaterial = new THREE.MeshLambertMaterial({ color: 0x8C5A5A });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.position.y = -1;
        ground.receiveShadow = true;
        this.scene.add(ground);
        
        // Create distant mountains
        this.createDistantMountains();
        
        // Create pine trees
        for (let i = 0; i < 75; i++) {
            let x = (Math.random() - 0.5) * 120;
            // Ensure trees are away from road center
            if (Math.abs(x) < 8) {
                x = x < 0 ? -8 - Math.random() * 20 : 8 + Math.random() * 20;
            }
            this.createPineTree(
                x,
                0,
                (Math.random() - 0.5) * 200
            );
        }

        for (let i = 0; i < 75; i++) {
            let x = (Math.random() - 0.5) * 120;
            if (Math.abs(x) < 8) {
                x = x < 0 ? -8 - Math.random() * 20 : 8 + Math.random() * 20;
            }
            this.createFloralTree(
                x,
                0,
                (Math.random() - 0.5) * 200
            );
        }
        
    }

    createDistantMountains() {
        // Create mountains far in the distance
        const numMountains = 100;
        const distance = -100;
        
        for (let i = 0; i < numMountains; i++) {
            this.createDistantMountain(
                (i - numMountains / 2) * 35 + (Math.random() - 0.5) * 25,
                -5,
                distance + (Math.random() - 0.5) * 30,
                25 + Math.random() * 15
            );
        }
    }

createDistantMountain(x, y, z, height) {
    const mountain = new THREE.Group();
    const numPeaks = 1 + Math.floor(Math.random() * 2);

    for (let i = 0; i < numPeaks; i++) {
        const peakHeight = height * (0.35 + Math.random() * 0.3);
        const baseRadius = 15 + Math.random() * 20;
        const topRadius = baseRadius * 0.4 + Math.random() * 3;
        const segments = 12 + Math.floor(Math.random() * 5);

        //CylinderGeometry
        const geometry = new THREE.CylinderGeometry(
            topRadius,
            baseRadius,
            peakHeight,
            segments,
            5,
            true
        );

        const positionAttr = geometry.attributes.position;
        const variationType = Math.floor(Math.random() * 3);

        for (let j = 0; j < positionAttr.count; j++) {
            const x = positionAttr.getX(j);
            const y = positionAttr.getY(j);
            const z = positionAttr.getZ(j);

            let newY = y;

            // Distortion to flatten/jag/create ridges
            if (variationType === 0 && Math.abs(y - peakHeight / 2) < 0.2) {
                newY = y - 2.5 - Math.random(); // flatten top
            } else if (variationType === 1) {
                newY = y + (Math.random() - 0.5) * 3.0; // jagged slopes
            } else if (variationType === 2) {
                newY = y + Math.sin(x * 1.5 + z * 0.7) * 1.4 * Math.random(); // ridges
            }

            positionAttr.setY(j, newY);
        }

        geometry.computeVertexNormals();

        const material = new THREE.MeshLambertMaterial({
            color: 0x5A4C3C,
            transparent: false,
        });

        const peak = new THREE.Mesh(geometry, material);
        peak.position.x = (i - numPeaks / 2) * baseRadius * 0.5;
        peak.position.y = peakHeight / 2;

        mountain.add(peak);
    }

    mountain.position.set(x, y, z);
    this.scene.add(mountain);
    this.mountains.push(mountain);
}

createFloralTree(x, y, z) {
    const tree = new THREE.Group();

    // Trunk
    const trunkHeight = 3 + Math.random();
    const trunkGeometry = new THREE.CylinderGeometry(0.35, 0.45, trunkHeight, 8, 1);
    const trunkMaterial = new THREE.MeshStandardMaterial({ color: 0x5c3a2e });
    const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
    trunk.position.y = trunkHeight / 2;
    trunk.castShadow = true;
    trunk.receiveShadow = true;
    tree.add(trunk);

    // Canopy group
    const canopy = new THREE.Group();
    const leafColors = [0x769e84, 0x5a7e55, 0x6c8f65];
    const flowerColors = [0xd891a7, 0xe6a9bc, 0xf8d1dd];

    const numLeafBlobs = 6 + Math.floor(Math.random() * 3);
    for (let i = 0; i < numLeafBlobs; i++) {
        const size = 1.3 + Math.random() * 0.5;
        const leafGeometry = new THREE.SphereGeometry(size, 14, 14);
        const leafMaterial = new THREE.MeshStandardMaterial({
            color: leafColors[Math.floor(Math.random() * leafColors.length)]
        });

        const leaf = new THREE.Mesh(leafGeometry, leafMaterial);
        leaf.position.set(
            (Math.random() - 0.5) * 2.2,
            trunkHeight + Math.random() * 1.5,
            (Math.random() - 0.5) * 2.2
        );
        leaf.castShadow = true;
        leaf.receiveShadow = true;
        canopy.add(leaf);

        const flowerCount = 3 + Math.floor(Math.random() * 4);
        for (let j = 0; j < flowerCount; j++) {
            const flowerSize = 0.2 + Math.random() * 0.07;
            const flowerGeometry = new THREE.SphereGeometry(flowerSize, 16, 16);
            const flowerMaterial = new THREE.MeshStandardMaterial({
                color: flowerColors[Math.floor(Math.random() * flowerColors.length)],
                emissive: 0xffaacb,
                emissiveIntensity: 0.4,
                roughness: 0.6,
                metalness: 0.1
            });

            const flower = new THREE.Mesh(flowerGeometry, flowerMaterial);

            // Position relative to leaf center
            flower.position.set(
                (Math.random() - 0.5) * size * 0.8,
                (Math.random() - 0.3) * size * 0.8,
                (Math.random() - 0.5) * size * 0.8
            );

            flower.castShadow = true;
            flower.receiveShadow = true;

            leaf.add(flower);  // add flower
        }
    }

    tree.add(canopy);
    tree.position.set(x, y, z);
    this.scene.add(tree);
    this.trees.push(tree);
}


    createPineTree(x, y, z) {
        const tree = new THREE.Group();
        
        // Dark trunk
        const trunkGeometry = new THREE.CylinderGeometry(0.15, 0.25, 4);
        const trunkMaterial = new THREE.MeshLambertMaterial({ color: 0x8E5A4D });
        const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
        trunk.position.y = 2;
        trunk.castShadow = true;
        tree.add(trunk);
        
        // Create pine tree layers
        const layerColors = [0x5C6B57, 0x66735D, 0x4D5B4A]; // Dark winter pine colors
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

    createSnow() {
        // Create snowflakes
        const snowflakeGeometry = new THREE.SphereGeometry(0.05, 4, 3);
        const snowflakeMaterial = new THREE.MeshBasicMaterial({ 
            color: 0xF9EAE1,
            transparent: true,
            opacity: 0.85
        });
        
        for (let i = 0; i < 10000; i++) {
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