document.addEventListener('DOMContentLoaded', () => {
  const profileForm = document.getElementById('profileForm');
  const passwordForm = document.getElementById('passwordForm');
  const imageUpload = document.getElementById('imageUpload');
  
  // Load the user data from localStorage and update the profile page
  const userEmail = localStorage.getItem('loggedInEmail');
  const storedUser = JSON.parse(localStorage.getItem(userEmail));

  if (storedUser) {
    // Populate the form with the existing data
    profileForm.name.value = storedUser.name;
    profileForm.email.value = storedUser.email;
    document.querySelector('.profile-pic').src = storedUser.profilePic || 'admin-profile.jpg'; // Default image if none is uploaded
  }

  // Handle Profile Update Submission
  profileForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = profileForm.name.value;
    const email = profileForm.email.value;
    const profilePic = document.querySelector('.profile-pic').src;

    if (name && email) {
      // Save the updated profile to localStorage
      storedUser.name = name;
      storedUser.email = email;
      storedUser.profilePic = profilePic; // Save the new profile image URL

      localStorage.setItem(userEmail, JSON.stringify(storedUser));
      localStorage.setItem(email, JSON.stringify(storedUser)); // Save new email as key in localStorage

      alert('Profile updated successfully!');
    } else {
      alert('Please fill out all required fields.');
    }
  });

  // Handle Image Upload
  imageUpload.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        document.querySelector('.profile-pic').src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  });

  // Handle Password Update Submission
  passwordForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const currentPassword = passwordForm.currentPassword.value;
    const newPassword = passwordForm.newPassword.value;
    const confirmPassword = passwordForm.confirmPassword.value;

    if (newPassword === confirmPassword) {
      if (currentPassword === storedUser.password) {
        // Update the password in localStorage
        storedUser.password = newPassword;
        localStorage.setItem(userEmail, JSON.stringify(storedUser));
        alert('Password updated successfully!');
        passwordForm.reset();
      } else {
        alert('Current password is incorrect.');
      }
    } else {
      alert('New password and confirm password do not match.');
    }
  });
});
