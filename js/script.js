// Smooth scrolling for valid in-page navigation links.
// Ignore placeholder links such as href="#" so they do not trigger
// an invalid querySelector call.
/*
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    const targetSelector = anchor.getAttribute('href');

    if (!targetSelector || targetSelector === '#') {
        return;
    }

    let target;
    try {
        target = document.querySelector(targetSelector);
    } catch (error) {
        return;
    }

    if (!target) {
        return;
    }

    anchor.addEventListener('click', event => {
        event.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});
*/


/* ==========================================
   PHILANI MAK0BA PORTFOLIO
   GLOBAL CONSTELLATION NETWORK BACKGROUND
   ========================================== */

(() => {
    "use strict";

    /* ==========================================
       INITIALISE PORTFOLIO
       ========================================== */

    function initialisePortfolio() {
        initSmoothScrolling();
        initGlobalNetwork();
    }


    /* ==========================================
       SMOOTH SCROLLING
       ========================================== */

    function initSmoothScrolling() {

        document.querySelectorAll('a[href^="#"]').forEach(anchor => {

            const selector = anchor.getAttribute("href");

            if (!selector || selector === "#") {
                return;
            }

            let target;

            try {
                target = document.querySelector(selector);
            } catch (error) {
                return;
            }

            if (!target) {
                return;
            }

            anchor.addEventListener("click", event => {

                event.preventDefault();

                target.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            });

        });

    }


    /* ==========================================
       GLOBAL CONSTELLATION NETWORK
       ========================================== */

    function initGlobalNetwork() {

        // Prevent duplicate canvases
        if (document.querySelector(".site-network-canvas")) {
            return;
        }

        const canvas = document.createElement("canvas");

        canvas.className = "site-network-canvas";
        canvas.setAttribute("aria-hidden", "true");

        document.body.prepend(canvas);

        const ctx = canvas.getContext("2d");

        if (!ctx) {
            canvas.remove();
            return;
        }

        const reducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        let width = 0;
        let height = 0;

        let particles = [];

        let animationFrame = null;
        let lastFrameTime = 0;

        const frameInterval = 1000 / 30;

        const isMobile = window.matchMedia(
            "(max-width: 768px)"
        ).matches;

        const pointer = {
            x: null,
            y: null
        };


        /* ======================================
           RESIZE CANVAS
           ====================================== */

        function resizeCanvas() {

            width = window.innerWidth;
            height = window.innerHeight;

            const pixelRatio = Math.min(
                window.devicePixelRatio || 1,
                1.5
            );

            canvas.width = Math.round(width * pixelRatio);
            canvas.height = Math.round(height * pixelRatio);

            ctx.setTransform(
                pixelRatio,
                0,
                0,
                pixelRatio,
                0,
                0
            );

            createParticles();

            drawNetwork(0);

        }


        /* ======================================
           CREATE PARTICLES
           ====================================== */

        function createParticles() {

            particles = [];

            const area = width * height;

            const minimum = isMobile ? 25 : 40;
            const maximum = isMobile ? 42 : 95;

            const count = Math.max(
                minimum,
                Math.min(maximum, Math.round(area / 15000))
            );

            for (let i = 0; i < count; i++) {

                particles.push({

                    x: Math.random() * width,
                    y: Math.random() * height,

                    vx: (Math.random() - 0.5) * 0.25,
                    vy: (Math.random() - 0.5) * 0.25,

                    radius: Math.random() * 1.1 + 0.8,

                    highlighted: Math.random() < 0.07

                });

            }

        }


        /* ======================================
           DRAW NETWORK CONNECTIONS
           ====================================== */

        function drawConnections(time) {

            const connectionDistance = isMobile ? 105 : 145;
            const lineOpacity = isMobile ? 0.09 : 0.14;

            for (let i = 0; i < particles.length; i++) {

                for (let j = i + 1; j < particles.length; j++) {

                    const first = particles[i];
                    const second = particles[j];

                    const dx = first.x - second.x;
                    const dy = first.y - second.y;

                    const distance = Math.sqrt(
                        dx * dx + dy * dy
                    );

                    if (distance >= connectionDistance) {
                        continue;
                    }

                    const opacity = (
                        1 - distance / connectionDistance
                    ) * lineOpacity;

                    // Steel-blue connecting lines
                    ctx.beginPath();

                    ctx.moveTo(first.x, first.y);
                    ctx.lineTo(second.x, second.y);

                    ctx.strokeStyle =
                        `rgba(49, 91, 125, ${opacity})`;

                    ctx.lineWidth = 0.8;

                    ctx.stroke();


                    // Travelling signal pulses
                    if ((i * 17 + j * 11) % 31 === 0) {

                        drawSignalPulse(
                            first,
                            second,
                            i,
                            j,
                            time
                        );

                    }

                }

            }

        }


        /* ======================================
           TRAVELLING GOLD SIGNAL PULSES
           ====================================== */

        function drawSignalPulse(first, second, i, j, time) {

            const progress = (
                time * 0.00009 + i * 0.17 + j * 0.11
            ) % 1;

            const x = first.x + (
                second.x - first.x
            ) * progress;

            const y = first.y + (
                second.y - first.y
            ) * progress;

            ctx.beginPath();

            ctx.arc(x, y, 1.8, 0, Math.PI * 2);

            ctx.fillStyle = "rgba(199, 139, 58, 0.85)";

            ctx.shadowColor = "#C78B3A";
            ctx.shadowBlur = 7;

            ctx.fill();

            ctx.shadowBlur = 0;

        }


        /* ======================================
           DRAW PARTICLES
           ====================================== */

        function drawParticles() {

            particles.forEach(particle => {

                ctx.beginPath();

                ctx.arc(
                    particle.x,
                    particle.y,
                    particle.highlighted ? 2 : particle.radius,
                    0,
                    Math.PI * 2
                );

                ctx.fillStyle = particle.highlighted
                    ? "rgba(199, 139, 58, 0.85)"
                    : "rgba(49, 91, 125, 0.65)";

                ctx.fill();

            });

        }


        /* ======================================
           MOUSE INTERACTION
           ====================================== */

        function drawPointerConnections() {

            if (
                pointer.x === null ||
                pointer.y === null
            ) {
                return;
            }

            const pointerDistance = 155;

            particles.forEach(particle => {

                const dx = pointer.x - particle.x;
                const dy = pointer.y - particle.y;

                const distance = Math.sqrt(
                    dx * dx + dy * dy
                );

                if (distance >= pointerDistance) {
                    return;
                }

                const opacity = (
                    1 - distance / pointerDistance
                ) * 0.20;

                ctx.beginPath();

                ctx.moveTo(particle.x, particle.y);
                ctx.lineTo(pointer.x, pointer.y);

                ctx.strokeStyle =
                    `rgba(49, 91, 125, ${opacity})`;

                ctx.lineWidth = 0.9;

                ctx.stroke();

            });

        }


        /* ======================================
           MOVE PARTICLES
           ====================================== */

        function moveParticles() {

            particles.forEach(particle => {

                particle.x += particle.vx;
                particle.y += particle.vy;

                // Wrap around screen edges
                if (particle.x < -5) {
                    particle.x = width + 5;
                }

                if (particle.x > width + 5) {
                    particle.x = -5;
                }

                if (particle.y < -5) {
                    particle.y = height + 5;
                }

                if (particle.y > height + 5) {
                    particle.y = -5;
                }

            });

        }


        /* ======================================
           DRAW COMPLETE NETWORK
           ====================================== */

        function drawNetwork(time, move = false) {

            ctx.clearRect(0, 0, width, height);

            if (move && !reducedMotion) {
                moveParticles();
            }

            drawConnections(time);
            drawPointerConnections();
            drawParticles();

        }


        /* ======================================
           ANIMATION LOOP
           ====================================== */

        function animate(time) {

            animationFrame = null;

            if (document.hidden) {
                return;
            }

            if (time - lastFrameTime >= frameInterval) {

                lastFrameTime = time;

                drawNetwork(time, true);

            }

            startAnimation();

        }


        function startAnimation() {

            if (
                reducedMotion ||
                document.hidden ||
                animationFrame !== null
            ) {
                return;
            }

            animationFrame = requestAnimationFrame(animate);

        }


        function stopAnimation() {

            if (animationFrame !== null) {

                cancelAnimationFrame(animationFrame);

                animationFrame = null;

            }

        }


        /* ======================================
           MOUSE MOVEMENT
           ====================================== */

        window.addEventListener("pointermove", event => {

            if (event.pointerType !== "mouse") {
                return;
            }

            pointer.x = event.clientX;
            pointer.y = event.clientY;

        }, { passive: true });


        window.addEventListener("pointerout", event => {

            if (!event.relatedTarget) {

                pointer.x = null;
                pointer.y = null;

            }

        });


        /* ======================================
           PAGE VISIBILITY
           ====================================== */

        document.addEventListener("visibilitychange", () => {

            if (document.hidden) {
                stopAnimation();
            } else {
                startAnimation();
            }

        });


        /* ======================================
           WINDOW RESIZING
           ====================================== */

        window.addEventListener("resize", resizeCanvas, {
            passive: true
        });


        /* ======================================
           START NETWORK
           ====================================== */

        resizeCanvas();
        startAnimation();

    }


    /* ==========================================
       START APPLICATION
       ========================================== */

    if (document.readyState === "loading") {

        document.addEventListener(
            "DOMContentLoaded",
            initialisePortfolio,
            { once: true }
        );

    } else {

        initialisePortfolio();

    }

})();

