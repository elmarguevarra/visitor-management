<template>
  <div id="app">
    <!-- Banner Section -->
    <header class="banner-container">
      <img src="/banner.png" alt="Website Banner" class="banner-image">
    </header>

    <!-- Main Content -->
    <main class="content-wrapper">
      <router-view></router-view>
    </main>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
/* Root Styles */
:root {
  --primary-font: 'Poppins', 'Segoe UI', Arial, sans-serif;
  --secondary-font: 'Inter', 'Segoe UI', Arial, sans-serif;
  --font-size-base: 1rem; /* 16px */
  --font-size-lg: 2.25rem; /* 36px for h1 */
  --font-size-md: 1.5rem;  /* 24px for h2 */
  --font-size-sm: 1.125rem; /* 18px for h3 */
  --line-height-base: 1.6;
  --line-height-heading: 1.25;
  --font-weight-heading: 600;
  --font-weight-body: 400;
  --letter-spacing-heading: 0.01em;
  --letter-spacing-body: 0.02em;
}

body {
  font-family: var(--secondary-font);
  font-size: var(--font-size-base);
  line-height: var(--line-height-base);
  color: #343a40;
  background: #f8f9fa;
}

h1, h2, h3, h4, h5, h6 {
  font-family: var(--primary-font);
  font-weight: var(--font-weight-heading);
  line-height: var(--line-height-heading);
  letter-spacing: var(--letter-spacing-heading);
  margin-top: 0;
  margin-bottom: 1rem;
  color: #222;
}

h1 {
  font-size: var(--font-size-lg);
}

h2 {
  font-size: var(--font-size-md);
}

h3 {
  font-size: var(--font-size-sm);
}

p,
label,
input,
button {
  font-family: var(--secondary-font);
  font-weight: var(--font-weight-body);
  letter-spacing: var(--letter-spacing-body);
  font-size: var(--font-size-base);
}

label {
  font-size: 1rem;
  color: #495057;
}

input, button {
  font-size: 1rem;
}

@media (max-width: 768px) {
  h1 { font-size: 1.5rem; }
  h2 { font-size: 1.25rem; }
  h3 { font-size: 1.05rem; }
}
#app {
  max-width: 1200px;
  margin: 2rem auto;
  padding: 1rem;
}

/* Banner Section */
.banner-container {
  margin-bottom: 2rem;
  border-radius: var(--border-radius);
  overflow: hidden; /* To contain the border-radius of the image */
  box-shadow: var(--box-shadow);
}

.banner-image {
  display: block; /* Remove extra space below image */
  width: 100%;
  height: auto;
  max-height: 250px; /* Slightly increased max height */
  object-fit: cover;
}

/* Content Wrapper */
.content-wrapper {
  background-color: #fff;
  padding: 1.5rem;
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
}

h2 {
  color: var(--primary-color);
  margin-top: 0;
  margin-bottom: 1.5rem;
  font-weight: 600;
  text-align: center;
}

hr {
  border: 0;
  border-top: 1px solid var(--border-color);
  margin: 1rem 0;
}

/* Form Elements */
.form-section {
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  background-color: #f9f9f9;
  border-radius: var(--border-radius);
  border: 1px solid var(--border-color);
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--text-color);
}

input[type="text"],
input[type="number"],
input[type="email"],
input[type="password"] {
  width: 100%;
  padding: 0.75rem;
  margin-bottom: 1rem;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  font-size: 1rem;
  box-sizing: border-box; /* Important for padding and border not to increase width */
  transition: border-color 0.15s ease-in-out;
}

input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 0.2rem rgba(var(--primary-color-rgb), 0.25); /* Subtle focus ring */
}

.error {
  color: #dc3545; /* Bootstrap's danger color */
  background-color: #f8d7da;
  padding: 0.75rem;
  margin-bottom: 1rem;
  border: 1px solid #f5c6cb;
  border-radius: var(--border-radius);
}

/* Button Styles */
button {
  display: inline-block;
  padding: 0.75rem 1.25rem;
  font-size: 1rem;
  font-weight: 500;
  text-align: center;
  text-decoration: none;
  cursor: pointer;
  border: 1px solid transparent;
  border-radius: var(--border-radius);
  transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}

.primary-button {
  color: #fff;
  background-color: var(--primary-color);
  border-color: var(--primary-color);
}

.primary-button:hover {
  background-color: #0056b3;
  border-color: #0056b3;
}

.secondary-button {
  color: var(--text-color);
  background-color: var(--secondary-color);
  border-color: var(--secondary-color);
}

.secondary-button:hover {
  background-color: #545b62;
  border-color: #4e555b;
  color: #fff;
}

.route-btn {
  margin-left: 0.5rem;
  composes: secondary-button; /* Reusing secondary button styles */
}

/* Responsive Design */
@media (max-width: 768px) {
  #app {
    padding: 0.5rem;
    margin-top: 1rem;
    margin-bottom: 1rem;
  }

  .banner-container {
    margin-bottom: 1.5rem;
  }

  .content-wrapper {
    padding: 1rem;
  }

  h2 {
    font-size: 1.75rem;
    margin-bottom: 1rem;
  }

  .form-section {
    padding: 1rem;
    margin-bottom: 1rem;
  }

  label {
    font-size: 0.9rem;
  }

  input[type="text"],
  input[type="number"],
  input[type="email"],
  input[type="password"],
  button {
    font-size: 0.9rem;
    padding: 0.6rem 1rem;
    margin-bottom: 0.75rem;
  }

  .route-btn {
    margin-left: 0.25rem;
  }
}

/* More subtle adjustments for smaller screens if needed */
@media (max-width: 576px) {
  h2 {
    font-size: 1.5rem;
  }
}
</style>

