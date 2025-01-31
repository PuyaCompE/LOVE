function check() {
  const checkboxes = document.querySelectorAll('input[type="checkbox"]');
  const announcement = document.getElementById('announcement');
  const heartAnimation = document.getElementById('heart-animation');

  // Check if all checkboxes are checked
  const allChecked = Array.from(checkboxes).every(checkbox => checkbox.checked);

  if (allChecked) {
    // Show the "Happy Anniversary!" message
    announcement.style.display = 'block';

    // Show and animate the heart
    heartAnimation.classList.remove('hidden');
    heartAnimation.style.display = 'block';
  } else {
    // Hide the message and heart if not all checkboxes are checked
    announcement.style.display = 'none';
    heartAnimation.style.display = 'none';
  }
}

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
