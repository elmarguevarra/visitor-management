<template>
  <div id="app" class="d-flex flex-column min-vh-100">
    <header class="bg-light">
      <div class="container py-2">
        <nav class="navbar navbar-expand-lg navbar-light">
          <router-link to="/" class="navbar-brand d-flex align-items-center">
            <img src="/logo.png" alt="Website Logo" height="30" class="d-inline-block align-middle me-2">
            AlphineCodeTech
            <span class="ms-1 badge text-secondary" style="font-size: 0.4rem; align-self: center; background-color: #e0e0e0; font-weight: normal;">Admin</span>
          </router-link>
          <button class="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse justify-content-end" id="navbarNav">
            <ul class="navbar-nav align-items-center">
              <li class="nav-item">
                <router-link to="/" class="nav-link py-1" active-class="active">Browse</router-link>
              </li>
              <li class="nav-item">
                <router-link to="/register-visitor" class="nav-link py-1" active-class="active">Register</router-link>
              </li>
              <li class="nav-item">
                <router-link to="/get-visitor" class="nav-link py-1" active-class="active">Search</router-link>
              </li>
              <li class="nav-item">
                <router-link to="/invite-visitor" class="nav-link py-1" active-class="active">Invite</router-link>
              </li>
              <li class="nav-item">
                <button @click="signOutRedirect" class="nav-link py-1 btn btn-link text-decoration-none">Sign out</button>
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
        <p class="mb-0">&copy; 2025 E.Guevarra. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>

<script>
import { signOutRedirect } from './auth/authConfig';


export default {
  name: 'App',
  provide() {
    return {
      residentId: this.currentResidentId,
      setResidentId: this.updateResidentId,
      isAuthenticated: this.isLoggedIn, // Example: track authentication status
      login: this.simulateLogin,       // Placeholder for future login logic
      logout: this.clearResidentId,     // Placeholder for future logout logic
    };
  },
  data() {
    return {
      currentResidentId: '1234', // Hardcoded for now
      isLoggedIn: true, // Assume logged in for now
    };
  },
  methods: {
    updateResidentId(newId) {
      this.currentResidentId = newId;
      // When integrating with the IDP, this method will likely be called
      // after successfully retrieving the resident ID.
      console.log('Resident ID updated:', newId);
    },
    clearResidentId() {
      this.currentResidentId = null;
      this.isLoggedIn = false;
      console.log('Resident ID cleared (simulated logout)');
      // In the future, this would handle actual logout logic.
    },
    simulateLogin() {
      // This is a placeholder for your future login logic.
      // When the user logs in via the IDP, you'll likely:
      // 1. Make an API call to the IDP.
      // 2. Upon successful authentication, retrieve the resident ID.
      // 3. Call this.updateResidentId(fetchedResidentId).
      console.log('Simulating login...');
      // For now, we are already "logged in" with a hardcoded ID.
      // In a real scenario, you would set isLoggedIn to true here.
      this.isLoggedIn = true;
      this.updateResidentId('FETCHED_RESIDENT_ID_AFTER_LOGIN'); // Example after "login"
      // You might also redirect the user after login.
      this.$router.push('/dashboard'); // Example navigation
    },
    async signOutRedirect() {
      await signOutRedirect();
      // this.clearResidentId();
    }
  },
  mounted() {
    console.log('App mounted. Resident ID is:', this.currentResidentId);
    // In a real application, you might check for an existing auth token here
    // and attempt to fetch user info if available.
  },
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