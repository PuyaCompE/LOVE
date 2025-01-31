// Function to create falling hearts
function createHeart() {
  const heart = document.createElement('div');
  heart.classList.add('heart-falling');
  heart.style.left = Math.random() * 100 + 'vw';
  heart.style.animationDuration = Math.random() * 3 + 2 + 's'; // Random speed
  document.querySelector('.background').appendChild(heart);

  // Remove heart after animation ends
  heart.addEventListener('animationend', () => {
    heart.remove();
  });
}

// Create hearts at random intervals
setInterval(createHeart, 300);
