document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');

  loginForm.addEventListener('submit', (e) => {
    e.preventDefault(); // Prevent form submission

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);

    // Check if the email exists in localStorage
    const storedUser = localStorage.getItem(email);
    console.log(`Stored User: ${storedUser}`);

    if (!storedUser) {
      alert('Email not registered. Please register first.');
      window.location.href = 'register.html'; // Redirect to register page
      return;
    }

    // If email exists, parse the stored data
    const user = JSON.parse(storedUser);
    console.log(`Parsed User: ${JSON.stringify(user)}`);

    // Check if the entered password matches the stored password
    if (user.password !== password) {
      alert('Incorrect password. Please try again.');
      return;
    }

    // If login is successful, redirect to dashboard
    alert('Login successful!');
    localStorage.setItem('loggedInEmail', email); // Store logged-in email in localStorage
    window.location.href = 'dashboard.html'; // Change this to your actual dashboard page
  });
});
