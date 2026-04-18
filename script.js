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

    // Automatic Reveal on Double Click / Double Tap
    let lastTapTime = 0;

    const handleReveal = () => {
        // Shuffle obstructions to mimic a human picking them randomly
        const obstructions = Array.from(document.querySelectorAll('.obstruction'));
        obstructions.sort(() => Math.random() - 0.5);
        
        let cumulativeDelay = 0;

        obstructions.forEach((ob, index) => {
            // Human-like delay between each leaf interaction
            cumulativeDelay += Math.random() * 0.1 + 0.05;
            
            // Random direction outward, sweeping effect
            const dirX = Math.random() > 0.5 ? 1 : -1;
            const dirY = Math.random() > 0.5 ? 1 : -1;
            const vx = dirX * (Math.random() * window.innerWidth * 0.8 + 200);
            const vy = dirY * (Math.random() * window.innerHeight * 0.8 + 200);
            
            gsap.to(ob, {
                x: `+=${vx}`,
                y: `+=${vy}`,
                rotation: `+=${Math.random() * 360 - 180}`,
                opacity: 0,
                duration: 1.5 + Math.random(), // Slower and variable
                ease: "power2.out",
                delay: cumulativeDelay,
                onStart: () => {
                    // Play rustle occasionally so it sounds like real sweeping
                    if (index % 5 === 0) playRustle();
                },
                onComplete: () => {
                   ob.style.pointerEvents = "none";
                }
            });
        });
    };

    document.addEventListener("dblclick", handleReveal);

    document.addEventListener("touchstart", (e) => {
        const currentTime = new Date().getTime();
        const tapLength = currentTime - lastTapTime;
        if (tapLength < 300 && tapLength > 0) {
            handleReveal();
            // Prevent default to avoid double fire if browser emulates dblclick
            if (e.cancelable) e.preventDefault();
        }
        lastTapTime = currentTime;
    }, { passive: false });

});
