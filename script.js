document.addEventListener("DOMContentLoaded", () => {
    const overlay = document.getElementById("overlay");
    
    // Audio Helper
    const playRustle = () => {
        const sound = new Audio("leave rustle.mp3");
        sound.volume = 0.5;
        sound.play().catch(() => {});
    };

    // Configuration
    // Render more items overall since the layout now extends far down vertically
    const numImages = window.innerWidth > 768 ? 150 : 75; // Render less graphics on mobile for performance
    const imageSrc = "image 36.png";
    let topZIndex = 100;

    for (let i = 0; i < numImages; i++) {
        const obElement = document.createElement('div');
        obElement.classList.add('obstruction');
        
        // Random dimensions for variance (between 150px and 350px)
        const size = Math.random() * 200 + 150;
        obElement.style.width = `${size}px`;
        obElement.style.height = `${size}px`;

        const img = document.createElement('img');
        img.src = imageSrc;
        obElement.appendChild(img);

        // Cumulatively push the image upward and scale it slightly on every hover
        obElement.addEventListener('mouseenter', () => {
            playRustle();

            gsap.to(img, { 
                y: "-=6", 
                scale: "+=0.02", 
                duration: 0.25, 
                ease: "power2.out" 
            });
        });

        // Random positions (viewport %)
        // Ensure they roughly cover the center and edges
        const top = Math.random() * 90 - 5; // -5 to 85%
        const left = Math.random() * 90 - 5; 
        
        obElement.style.top = `${top}%`;
        obElement.style.left = `${left}%`;

        // Random rotation and scale initial via GSAP
        const rotation = Math.random() * 180 - 90; // -90 to 90 degrees
        const scale = Math.random() * 0.4 + 0.8; // 0.8 to 1.2

        gsap.set(obElement, {
            rotation: rotation,
            scale: scale
        });

        overlay.appendChild(obElement);

        // Initialize GSAP Draggable for each element
        Draggable.create(obElement, {
            type: "x,y",
            edgeResistance: 0.2, // Low edge resistance allows users to easily drag out of screen
            onPress: function() {
                playRustle();
                // Instantly bring to front
                topZIndex++;
                this.target.style.zIndex = topZIndex;
                
                // Slight scale-up for interactive response
                gsap.to(this.target, { scale: scale * 1.1, duration: 0.2 });
            },
            onRelease: function() {
                // Scale back down
                gsap.to(this.target, { scale: scale, duration: 0.2 });
            },
            onDragEnd: function() {
                // Faux inertia simulation (flicking) using Delta from drag event
                const vx = this.deltaX * 8;
                const vy = this.deltaY * 8;

                if (Math.abs(vx) > 10 || Math.abs(vy) > 10) {
                    playRustle();
                    // Throw it off! If sufficient flick velocity is detected, let it slide out
                    gsap.to(this.target, {
                        x: `+=${vx * 6}`,
                        y: `+=${vy * 6}`,
                        rotation: `+=${vx}`, // Adds a nice spin during the throw
                        duration: 1.2,
                        ease: "power2.out"
                    });
                }
            }
        });
    }
});
