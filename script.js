document.addEventListener("DOMContentLoaded", () => {
    const overlay = document.getElementById("overlay");
    const isMobile = window.innerWidth <= 768;
    
    // Audio Helper
    const playRustle = () => {
        const sound = new Audio("leave rustle.mp3");
        sound.volume = 0.5;
        sound.play().catch(() => {});
    };

    // Configuration — adjusted for mobile
    const numImages = isMobile ? 60 : 150;
    const minSize = isMobile ? 80 : 150;
    const maxSize = isMobile ? 180 : 350;
    const imageSrc = "image 36.png";
    let topZIndex = 100;

    // Mobile auto-scroll helper: scrolls the page when dragging near edges
    let autoScrollInterval = null;
    const startAutoScroll = (direction) => {
        if (autoScrollInterval) return;
        autoScrollInterval = setInterval(() => {
            window.scrollBy(0, direction * 8);
        }, 16);
    };
    const stopAutoScroll = () => {
        if (autoScrollInterval) {
            clearInterval(autoScrollInterval);
            autoScrollInterval = null;
        }
    };

    for (let i = 0; i < numImages; i++) {
        const obElement = document.createElement('div');
        obElement.classList.add('obstruction');
        
        // Random dimensions — smaller on mobile
        const size = Math.random() * (maxSize - minSize) + minSize;
        obElement.style.width = `${size}px`;
        obElement.style.height = `${size}px`;

        const img = document.createElement('img');
        img.src = imageSrc;
        obElement.appendChild(img);

        // Desktop hover effect with sound
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
        const top = Math.random() * 90 - 5;
        const left = Math.random() * 90 - 5; 
        
        obElement.style.top = `${top}%`;
        obElement.style.left = `${left}%`;

        // Random rotation and scale
        const rotation = Math.random() * 180 - 90;
        const scale = Math.random() * 0.4 + 0.8;

        gsap.set(obElement, {
            rotation: rotation,
            scale: scale
        });

        overlay.appendChild(obElement);

        // Initialize GSAP Draggable for each element
        Draggable.create(obElement, {
            type: "x,y",
            edgeResistance: 0.2,
            onPress: function() {
                playRustle();
                topZIndex++;
                this.target.style.zIndex = topZIndex;
                gsap.to(this.target, { scale: scale * 1.1, duration: 0.2 });
            },
            onDrag: function() {
                // On mobile, auto-scroll the page when dragging near top/bottom edges
                if (isMobile) {
                    const pointerY = this.pointerY;
                    const viewH = window.innerHeight;
                    if (pointerY < 80) {
                        startAutoScroll(-1); // scroll up
                    } else if (pointerY > viewH - 80) {
                        startAutoScroll(1); // scroll down
                    } else {
                        stopAutoScroll();
                    }
                }
            },
            onRelease: function() {
                stopAutoScroll();
                gsap.to(this.target, { scale: scale, duration: 0.2 });
            },
            onDragEnd: function() {
                stopAutoScroll();
                const vx = this.deltaX * 8;
                const vy = this.deltaY * 8;

                if (Math.abs(vx) > 10 || Math.abs(vy) > 10) {
                    playRustle();
                    gsap.to(this.target, {
                        x: `+=${vx * 6}`,
                        y: `+=${vy * 6}`,
                        rotation: `+=${vx}`,
                        duration: 1.2,
                        ease: "power2.out"
                    });
                }
            }
        });
    }
});
