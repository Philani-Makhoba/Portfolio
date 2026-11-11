// Smooth scrolling for valid in-page navigation links.
// Ignore placeholder links such as href="#" so they do not trigger
// an invalid querySelector call.
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
