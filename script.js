// Video error handling
const video = document.querySelector('video');
if (video) {
    video.addEventListener('error', (e) => {
        console.error('Video error:', e);
        const videoContainer = video.parentElement;
        if (videoContainer) {
            const fallbackImage = videoContainer.querySelector('img');
            if (fallbackImage) {
                fallbackImage.style.display = 'block';
                video.style.display = 'none';
            }
        }
    });
}

// Image error handling
document.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', (e) => {
        console.error('Image failed to load:', img.src);
        if (img.classList.contains('profile-image')) {
            img.src = 'assets/images/me.JPG';
        }
    });
});

// Performance optimization
document.addEventListener('DOMContentLoaded', () => {
    // Lazy load images
    const images = document.querySelectorAll('img[loading="lazy"]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                observer.unobserve(img);
            }
        });
    });

    images.forEach(img => {
        if (img.dataset.src) {
            imageObserver.observe(img);
        }
    });
}); 