// Function to create floating hearts
function createHeart() {
    const heart = document.createElement('div');
    heart.classList.add('heart');
    heart.style.setProperty('--x', Math.random() * 100);
    heart.style.animationDuration = Math.random() * 2 + 3 + 's'; // Random duration between 3-5 seconds
    heart.style.opacity = Math.random();
    document.querySelector('.hearts').appendChild(heart);

    // Remove the heart after the animation ends
    setTimeout(() => {
        heart.remove();
    }, 5000); // Adjust this value to match the animation duration
}

// Function to create confetti pieces
function createConfetti() {
    const confettiPiece = document.createElement('div');
    confettiPiece.classList.add('confetti-piece');
    confettiPiece.style.setProperty('--x', Math.random() * 100);
    confettiPiece.style.animationDuration = Math.random() * 2 + 3 + 's'; // Random duration between 3-5 seconds
    confettiPiece.style.opacity = Math.random();
    confettiPiece.style.backgroundColor = getRandomColor();
    document.querySelector('.confetti').appendChild(confettiPiece);

    // Remove the confetti piece after the animation ends
    setTimeout(() => {
        confettiPiece.remove();
    }, 5000); // Adjust this value to match the animation duration
}

// Function to get a random color
function getRandomColor() {
    const colors = ['#ff6f61', '#ffcc5c', '#88d8b0', '#ffafcc', '#ffc3a0'];
    return colors[Math.floor(Math.random() * colors.length)];
}

// Create hearts every 300ms
setInterval(createHeart, 300);

// Create confetti pieces every 200ms
setInterval(createConfetti, 200);
