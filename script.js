// Function to create floating hearts
function createHeart() {
    const heart = document.createElement('div');
    heart.classList.add('heart');
    heart.style.left = Math.random() * 100 + 'vw';
    heart.style.animationDuration = Math.random() * 2 + 3 + 's'; // Random duration between 3-5 seconds
    heart.style.opacity = Math.random();
    document.querySelector('.hearts').appendChild(heart);

    // Remove the heart after the animation ends
    setTimeout(() => {
        heart.remove();
    }, 5000); // Adjust this value to match the animation duration
}

// Create hearts every 300ms
setInterval(createHeart, 300);
