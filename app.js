import './index.css';

document.getElementById('signup-form').addEventListener('submit', async (e) => {
    e.preventDefault();
  
    const email = document.getElementById('email').value;
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
  
    try {
      const response = await fetch('http://localhost:3000/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, username, password }),
      });
  
      if (response.ok) {
        alert('Account created successfully!');
        document.getElementById('signup-form').style.display = 'none';
        document.getElementById('spotify-linking').style.display = 'block';
      } else {
        alert('Failed to create account');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred. Please try again.');
    }
  });
  
  document.getElementById('link-spotify').addEventListener('click', () => {
    window.location.href = 'http://localhost:3000/auth/spotify';
  });
  