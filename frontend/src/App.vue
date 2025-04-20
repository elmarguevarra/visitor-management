<template>
  <div id="app" class="d-flex flex-column min-vh-100">
    <header class="bg-light shadow-lg">
      <div class="container py-2">
        <nav class="navbar navbar-expand-lg navbar-light">
          <router-link to="/" class="navbar-brand d-flex align-items-center">
            <img src="/logo.png" alt="Website Logo" height="30" class="d-inline-block align-middle me-2">
            AlphineCodeTech
          </router-link>
          <button class="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse justify-content-end" id="navbarNav">
            <ul class="navbar-nav">
              <li class="nav-item">
                <router-link to="/" class="nav-link py-1" active-class="active">Register</router-link>
              </li>
              <li class="nav-item">
                <router-link to="/about" class="nav-link py-1" active-class="active">Visitors</router-link>
              </li>
              <li class="nav-item">
                <router-link to="/services" class="nav-link py-1" active-class="active">Search</router-link>
              </li>
              <li class="nav-item">
                <router-link to="/contact" class="nav-link py-1" active-class="active">Verify</router-link>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    </header>

    <div class="container-fluid p-0 mb-0 hero-image-container">
      <div class="position-relative">
        <img
          src="/banner.png"
          alt="Modern Website Hero Banner"
          class="img-fluid hero-image"
          style="object-fit: cover; width: 100%; height: auto; max-height: 400px; display: block;"
        >
      </div>
    </div>

    <main class="flex-grow-1 py-1">
      <div class="container">
        <router-view></router-view>
      </div>
    </main>

    <footer class="bg-light py-3 mt-4 text-center shadow-sm">
      <div class="container">
        <p class="mb-0">&copy; 2025 AlphineCodeTech. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'App',
};
</script>

<style scoped>
/* Optional: Style for rounded corners at the bottom of the hero image */
.hero-image-container {
  border-bottom-left-radius: 0.5rem;
  border-bottom-right-radius: 0.5rem;
}

/* Responsive adjustments for smaller screens */
@media (max-width: 768px) {
  .hero-image {
    max-height: 300px; /* Adjust height for smaller screens */
  }
}

@media (max-width: 576px) {
  .hero-image {
    max-height: 200px; /* Further adjust height for very small screens */
  }
}
</style>