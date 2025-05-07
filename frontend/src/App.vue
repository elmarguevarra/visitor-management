<template>
  <div id="app" class="d-flex flex-column min-vh-100">
    <header class="bg-light">
      <div class="container py-2">
        <nav class="navbar navbar-expand-lg navbar-light">
          <router-link to="/visitors" class="navbar-brand d-flex align-items-center">
            <img src="/logo.png" alt="Website Logo" height="30" class="d-inline-block align-middle me-2">
            AlphineCodeTech
            <span class="ms-1 badge text-secondary" style="font-size: 0.4rem; align-self: center; background-color: #e0e0e0; font-weight: normal;">Admin</span>
          </router-link>
          <button class="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div v-if="authenticationStore.isLoggedIn" class="collapse navbar-collapse justify-content-end" id="navbarNav">
            <ul class="navbar-nav align-items-center">
              <li class="nav-item">
                <router-link to="/visitors" class="nav-link py-1" active-class="active">Browse</router-link>
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
                <button @click="signOut" class="nav-link py-1 btn btn-link text-decoration-none">Sign out</button>
              </li>
            </ul>
          </div>
          <div v-if="!authenticationStore.isLoggedIn" class="collapse navbar-collapse justify-content-end" id="navbarNav">
            <ul class="navbar-nav align-items-center">
              <li class="nav-item">
                <button @click="signIn" class="nav-link py-1 btn btn-link text-decoration-none">Sign in</button>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    </header>

    <div v-if="$route.path !== '/'" class="container-fluid p-0 mb-0 hero-image-container">
      <div class="position-relative">
        <img
          src="/hero-banner.jpg"
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

    <footer class="bg-light py-3 mt-4 text-center small shadow-sm">
      <div class="container">
        <p class="mb-0">&copy; 2025 E.Guevarra. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>

<script>
import { onMounted } from 'vue';
import { useAuthenticationStore } from './stores/authenticationStore';


export default {
  name: 'App',
  setup() {
    const authenticationStore = useAuthenticationStore();

    onMounted(() => {
      authenticationStore.checkAuthenticationStatus();
    });

    return {
      authenticationStore,
      signIn: authenticationStore.signIn,
      signOut: authenticationStore.signOut,
    };
  }
};
</script>

<style scoped>
/* Optional: Style for rounded corners at the bottom of the hero image */
.hero-image-container {
  border-bottom-left-radius: 0.5rem;
  border-bottom-right-radius: 0.5rem;
  /* Add the box-shadow property here */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* Example shadow */
}

header {
  z-index: 3;
  background-color: transparent !important;
}

footer {
  z-index: 3; 
  background-color: transparent !important;
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