document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.querySelector('form');
    
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault(); // Prevent the form from submitting traditionally
      
      const name = document.getElementById('name').value;
      const username = document.getElementById('username').value;
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      const confirmPassword = document.getElementById('confirm-password').value;
  
      // Check if passwords match
      if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
      }
  
      // Save the user data in localStorage
      const user = {
        name: name,
        username: username,
        email: email,
        password: password,
      };
  
      // Store user details in localStorage
      localStorage.setItem(email, JSON.stringify(user));
      
      // Optional: Clear the form after successful registration
      registerForm.reset();
  
      // Redirect to login page after registration
      alert("Registration successful! Please login.");
      window.location.href = 'login.html';
    });
  });
  