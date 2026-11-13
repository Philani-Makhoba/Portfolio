
/* =========================================================
   PHILANI MAK0BA PORTFOLIO
   GLOBAL JAVASCRIPT
   ========================================================= */

(() => {
    "use strict";


    /* =====================================================
       INITIALISE PORTFOLIO
       ===================================================== */

    function initialisePortfolio() {
        initSmoothScrolling();
        initMobileNavigation();
        initGlobalNetwork();
    }


    /* =====================================================
       1. SMOOTH SCROLLING
       ===================================================== */

    function initSmoothScrolling() {

        document.querySelectorAll('a[href^="#"]').forEach(anchor => {

            const selector = anchor.getAttribute("href");

            // Ignore empty and placeholder links.
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


    /* =====================================================
       2. RESPONSIVE MOBILE NAVIGATION
       ===================================================== */

    function initMobileNavigation() {

        const navbars = document.querySelectorAll("nav.navbar");

        const desktopQuery = window.matchMedia("(min-width: 901px)");

        navbars.forEach(nav => {

            const toggle = nav.querySelector(".nav-toggle");
            const links = nav.querySelector(".nav-links");

            // Only initialise navigation where the required
            // hamburger button and navigation list exist.
            if (!toggle || !links) {
                return;
            }


            /* ---------------------------------------------
               CLOSE MOBILE MENU
               --------------------------------------------- */

            function closeMenu(returnFocus = false) {

                nav.classList.remove("is-open");

                toggle.setAttribute("aria-expanded", "false");

                toggle.setAttribute(
                    "aria-label",
                    "Open navigation menu"
                );

                if (returnFocus) {
                    toggle.focus();
                }

            }


            /* ---------------------------------------------
               OPEN / CLOSE MOBILE MENU
               --------------------------------------------- */

            function toggleMenu() {

                const willOpen =
                    toggle.getAttribute("aria-expanded") !== "true";

                nav.classList.toggle("is-open", willOpen);

                toggle.setAttribute(
                    "aria-expanded",
                    String(willOpen)
                );

                toggle.setAttribute(
                    "aria-label",
                    willOpen
                        ? "Close navigation menu"
                        : "Open navigation menu"
                );

            }


            /* ---------------------------------------------
               HAMBURGER BUTTON
               --------------------------------------------- */

            toggle.addEventListener("click", toggleMenu);


            /* ---------------------------------------------
               CLOSE AFTER SELECTING A PAGE
               --------------------------------------------- */

            links.querySelectorAll("a").forEach(link => {

                link.addEventListener("click", () => {
                    closeMenu(false);
                });

            });


            /* ---------------------------------------------
               CLOSE WHEN CLICKING OUTSIDE
               --------------------------------------------- */

            document.addEventListener("click", event => {

                if (!nav.contains(event.target)) {
                    closeMenu(false);
                }

            });


            /* ---------------------------------------------
               CLOSE WITH ESCAPE KEY
               --------------------------------------------- */

            document.addEventListener("keydown", event => {

                if (
                    event.key === "Escape" &&
                    nav.classList.contains("is-open")
                ) {
                    closeMenu(true);
                }

            });


            /* ---------------------------------------------
               CLOSE WHEN RETURNING TO DESKTOP VIEW
               --------------------------------------------- */

            const handleBreakpointChange = event => {

                if (event.matches) {
                    closeMenu(false);
                }

            };

            if (desktopQuery.addEventListener) {

                desktopQuery.addEventListener(
                    "change",
                    handleBreakpointChange
                );

            } else {

                // Compatibility with older browsers.
                desktopQuery.addListener(handleBreakpointChange);

            }

        });

    }


    /* =====================================================
       3. GLOBAL CONSTELLATION NETWORK
       ===================================================== */

    function initGlobalNetwork() {

        // Avoid creating more than one background canvas.
        if (document.querySelector(".site-network-canvas")) {
            return;
        }


        /* ---------------------------------------------
           CREATE CANVAS
           --------------------------------------------- */

        const canvas = document.createElement("canvas");

        canvas.className = "site-network-canvas";

        canvas.setAttribute("aria-hidden", "true");

        document.body.prepend(canvas);

        const ctx = canvas.getContext("2d");

        if (!ctx) {

            canvas.remove();

            return;

        }


        /* ---------------------------------------------
           USER PREFERENCES
           --------------------------------------------- */

        const reducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        const isMobile = window.matchMedia(
            "(max-width: 768px)"
        ).matches;


        /* ---------------------------------------------
           ANIMATION VARIABLES
           --------------------------------------------- */

        let width = 0;

        let height = 0;

        let particles = [];

        let animationFrame = null;

        let lastFrameTime = 0;

        // Limit rendering to approximately 30 frames per second.
        const frameInterval = 1000 / 30;


        /* ---------------------------------------------
           MOUSE POINTER
           --------------------------------------------- */

        const pointer = {
            x: null,
            y: null
        };


        /* =================================================
           3.1 RESIZE CANVAS
           ================================================= */

        function resizeCanvas() {

            width = window.innerWidth;

            height = window.innerHeight;

            const pixelRatio = Math.min(
                window.devicePixelRatio || 1,
                1.5
            );

            canvas.width = Math.round(width * pixelRatio);

            canvas.height = Math.round(height * pixelRatio);

            canvas.style.width = width + "px";

            canvas.style.height = height + "px";


            // Scale canvas to accommodate high-density displays.
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


        /* =================================================
           3.2 CREATE PARTICLES
           ================================================= */

        function createParticles() {

            particles = [];

            const area = width * height;

            const minimum = isMobile ? 25 : 40;

            const maximum = isMobile ? 42 : 95;

            const count = Math.max(
                minimum,
                Math.min(
                    maximum,
                    Math.round(area / 15000)
                )
            );


            for (let i = 0; i < count; i++) {

                particles.push({

                    x: Math.random() * width,

                    y: Math.random() * height,

                    // Slow horizontal and vertical movement.
                    vx: (Math.random() - 0.5) * 0.25,

                    vy: (Math.random() - 0.5) * 0.25,

                    radius: Math.random() * 1.1 + 0.8,

                    // A small percentage of particles are gold.
                    highlighted: Math.random() < 0.07

                });

            }

        }


        /* =================================================
           3.3 DRAW NETWORK CONNECTIONS
           ================================================= */

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


                    // Only connect particles that are close enough.
                    if (distance >= connectionDistance) {
                        continue;
                    }


                    const opacity = (
                        1 - distance / connectionDistance
                    ) * lineOpacity;


                    // Steel-blue connecting lines.
                    ctx.beginPath();

                    ctx.moveTo(first.x, first.y);

                    ctx.lineTo(second.x, second.y);

                    ctx.strokeStyle =
                        `rgba(49, 91, 125, ${opacity})`;

                    ctx.lineWidth = 0.8;

                    ctx.stroke();


                    // Add occasional travelling signals.
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


        /* =================================================
           3.4 TRAVELLING GOLD SIGNAL PULSES
           ================================================= */

        function drawSignalPulse(
            first,
            second,
            i,
            j,
            time
        ) {

            const progress = (
                time * 0.00009 +
                i * 0.17 +
                j * 0.11
            ) % 1;


            // Calculate the signal position between two nodes.
            const x = first.x + (
                second.x - first.x
            ) * progress;


            const y = first.y + (
                second.y - first.y
            ) * progress;


            ctx.beginPath();

            ctx.arc(
                x,
                y,
                1.8,
                0,
                Math.PI * 2
            );


            ctx.fillStyle = "rgba(199, 139, 58, 0.85)";

            ctx.shadowColor = "#C78B3A";

            ctx.shadowBlur = 7;

            ctx.fill();

            ctx.shadowBlur = 0;

        }


        /* =================================================
           3.5 DRAW PARTICLE NODES
           ================================================= */

        function drawParticles() {

            particles.forEach(particle => {

                ctx.beginPath();

                ctx.arc(
                    particle.x,
                    particle.y,
                    particle.highlighted
                        ? 2
                        : particle.radius,
                    0,
                    Math.PI * 2
                );


                ctx.fillStyle = particle.highlighted

                    ? "rgba(199, 139, 58, 0.85)"

                    : "rgba(49, 91, 125, 0.65)";


                ctx.fill();

            });

        }


        /* =================================================
           3.6 INTERACTIVE MOUSE CONNECTIONS
           ================================================= */

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

                ctx.moveTo(
                    particle.x,
                    particle.y
                );

                ctx.lineTo(
                    pointer.x,
                    pointer.y
                );


                ctx.strokeStyle =
                    `rgba(49, 91, 125, ${opacity})`;

                ctx.lineWidth = 0.9;

                ctx.stroke();

            });

        }


        /* =================================================
           3.7 MOVE PARTICLES
           ================================================= */

        function moveParticles() {

            particles.forEach(particle => {

                particle.x += particle.vx;

                particle.y += particle.vy;


                // Reappear on the opposite horizontal edge.
                if (particle.x < -5) {

                    particle.x = width + 5;

                }

                if (particle.x > width + 5) {

                    particle.x = -5;

                }


                // Reappear on the opposite vertical edge.
                if (particle.y < -5) {

                    particle.y = height + 5;

                }

                if (particle.y > height + 5) {

                    particle.y = -5;

                }

            });

        }


        /* =================================================
           3.8 DRAW COMPLETE NETWORK
           ================================================= */

        function drawNetwork(time, move = false) {

            ctx.clearRect(
                0,
                0,
                width,
                height
            );


            if (move && !reducedMotion) {

                moveParticles();

            }


            drawConnections(time);

            drawPointerConnections();

            drawParticles();

        }


        /* =================================================
           3.9 ANIMATION LOOP
           ================================================= */

        function animate(time) {

            animationFrame = null;


            if (document.hidden) {
                return;
            }


            // Control rendering frequency.
            if (time - lastFrameTime >= frameInterval) {

                lastFrameTime = time;

                drawNetwork(time, true);

            }


            startAnimation();

        }


        /* ---------------------------------------------
           START ANIMATION
           --------------------------------------------- */

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


        /* ---------------------------------------------
           STOP ANIMATION
           --------------------------------------------- */

        function stopAnimation() {

            if (animationFrame !== null) {

                cancelAnimationFrame(animationFrame);

                animationFrame = null;

            }

        }


        /* =================================================
           3.10 MOUSE MOVEMENT
           ================================================= */

        window.addEventListener("pointermove", event => {

            // Mouse movement only; ignore touch interactions.
            if (event.pointerType !== "mouse") {
                return;
            }


            pointer.x = event.clientX;

            pointer.y = event.clientY;

        }, { passive: true });


        // Clear the mouse position when it leaves the window.
        window.addEventListener("pointerout", event => {

            if (!event.relatedTarget) {

                pointer.x = null;

                pointer.y = null;

            }

        });


        /* =================================================
           3.11 PAGE VISIBILITY
           ================================================= */

        document.addEventListener("visibilitychange", () => {

            if (document.hidden) {

                stopAnimation();

            } else {

                startAnimation();

            }

        });


        /* =================================================
           3.12 WINDOW RESIZING
           ================================================= */

        window.addEventListener("resize", resizeCanvas, {
            passive: true
        });


        /* =================================================
           3.13 START NETWORK
           ================================================= */

        resizeCanvas();

        startAnimation();

    }


    /* =====================================================
       START APPLICATION
       ===================================================== */

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
