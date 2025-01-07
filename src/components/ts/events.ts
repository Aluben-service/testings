// ===========================
// CONSTANTS
// ===========================

const panicKey = localStorage.getItem('panicKey') || '`';

// ===========================
// EVENTS
// ===========================
document.addEventListener('keydown', (event) => {
  if (event.key === panicKey) {
    window.parent.window.location.replace('https://classroom.google.com/h');
  }
});