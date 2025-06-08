<template>
  <div id="app" class="d-flex flex-column min-vh-100">
    <header class="bg-light">
      <div class="container py-2">
        <nav class="navbar navbar-expand-lg navbar-light">
          <router-link
            to="/profile"
            class="navbar-brand d-flex flex-column align-items-start"
          >
            <div class="d-flex align-items-center">
              <img
                src="/logo.png"
                alt="Website Logo"
                height="24"
                class="d-inline-block align-middle me-2"
              />
              <span style="font-size: 1rem">AlphineCodeTech</span>
              <span
                v-if="hasPermission(ACTIONS.SHOW_ADMIN_BADGE)"
                class="ms-1 badge text-secondary"
                style="
                  font-size: 0.3rem;
                  align-self: center;
                  background-color: #e0e0e0;
                  font-weight: normal;
                "
                >Admin</span
              >
              <span
                v-if="hasPermission(ACTIONS.SHOW_GUARD_BADGE)"
                class="ms-1 badge text-secondary"
                style="
                  font-size: 0.3rem;
                  align-self: center;
                  background-color: #e0e0e0;
                  font-weight: normal;
                "
                >Guard</span
              >
            </div>
            <div class="mt-0">
              <p class="mb-0 email-text">
                {{ authenticationStore?.userEmail }}
              </p>
            </div>
          </router-link>
          <button
            v-if="
              $route.name !== 'SelfRegisterVisitorView' &&
              $route.name !== 'VerifyVisitorView'
            "
            class="navbar-toggler border-0"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span class="navbar-toggler-icon"></span>
          </button>
          <div
            v-if="authenticationStore.isLoggedIn"
            class="collapse navbar-collapse justify-content-end"
            id="navbarNav"
          >
            <ul class="navbar-nav align-items-center">
              <li class="nav-item">
                <router-link
                  to="/profile"
                  class="nav-link py-1"
                  active-class="active"
                  >Profile</router-link
                >
              </li>
              <li
                v-if="hasPermission(ACTIONS.BROWSE_VISITORS)"
                class="nav-item"
              >
                <router-link
                  to="/visitors"
                  class="nav-link py-1"
                  active-class="active"
                  >Browse</router-link
                >
              </li>
              <li
                v-if="hasPermission(ACTIONS.REGISTER_VISITOR)"
                class="nav-item"
              >
                <router-link
                  to="/register-visitor"
                  class="nav-link py-1"
                  active-class="active"
                  >Register</router-link
                >
              </li>
              <li v-if="hasPermission(ACTIONS.SEARCH_VISITOR)" class="nav-item">
                <router-link
                  to="/search-visitor"
                  class="nav-link py-1"
                  active-class="active"
                  >Search</router-link
                >
              </li>
              <li v-if="hasPermission(ACTIONS.INVITE_VISITOR)" class="nav-item">
                <router-link
                  to="/invite-visitor"
                  class="nav-link py-1"
                  active-class="active"
                  >Invite</router-link
                >
              </li>
              <li class="nav-item">
                <button
                  @click="signOut"
                  class="nav-link py-1 btn btn-link text-decoration-none"
                >
                  Sign out
                </button>
              </li>
            </ul>
          </div>
          <div
            v-if="!authenticationStore.isLoggedIn"
            class="collapse navbar-collapse justify-content-end"
            id="navbarNav"
          >
            <ul class="navbar-nav align-items-center">
              <li class="nav-item">
                <button
                  @click="signIn"
                  class="nav-link py-1 btn btn-link text-decoration-none"
                >
                  Sign in
                </button>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    </header>

    <div
      v-if="$route.path !== '/'"
      class="container-fluid p-0 mb-0 hero-image-container"
    >
      <div class="position-relative">
        <img
          src="/hero-banner.jpg"
          alt="Modern Website Hero Banner"
          class="img-fluid hero-image"
          style="
            object-fit: cover;
            width: 100%;
            height: auto;
            max-height: 400px;
            display: block;
          "
        />
      </div>
    </div>

    <main class="flex-grow-1 py-1">
      <div
        class="container"
        :class="{ 'opacity-25 pointer-events-none': uiStore.isLoading }"
      >
        <router-view />
      </div>

      <LoadingOverlay v-if="uiStore.isLoading" />
    </main>

    <footer class="bg-light py-3 mt-4 text-center small shadow-sm text-muted">
      <div class="container">
        <p class="mb-0">&copy; 2025 E.Guevarra. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>

<script>
import { onMounted } from 'vue'
import { useAuthenticationStore } from './stores/authenticationStore'
import { useAuthorizationStore } from './stores/authorizationStore'
import { ACTIONS } from './constants/actions'
import LoadingOverlay from './components/LoadingOverlay.vue'
import { useUiStore } from './stores/uiStore'

export default {
  name: 'App',
  setup() {
    const authenticationStore = useAuthenticationStore()
    const authorizationStore = useAuthorizationStore()
    const uiStore = useUiStore()

    onMounted(async () => {
      await authenticationStore.loadUser()
    })

    return {
      authenticationStore,
      authorizationStore,
      hasPermission: authorizationStore.hasPermissionOnAction,
      ACTIONS,
      signIn: authenticationStore.signIn,
      signOut: authenticationStore.signOut,
      uiStore,
    }
  },
}
</script>

<style scoped>
/* Optional: Style for rounded corners at the bottom of the hero image */
.hero-image-container {
  position: relative;
  border-bottom-left-radius: 0.5rem;
  border-bottom-right-radius: 0.5rem;
  /* Add the box-shadow property here */
  /* box-shadow: 0 1px 6px rgba(0, 0, 0, 0.1); */
  z-index: 1;
  overflow: hidden;
}

header {
  z-index: 3;
  background-color: #effafe !important;
}

/* Target the navbar brand text */
.navbar-brand {
  font-size: 1rem; /* Adjust this value to make the text smaller */
  padding-top: 0.2rem; /* Adjust vertical padding if needed */
  padding-bottom: 0.2rem; /* Adjust vertical padding if needed */
}

/* Target the admin badge to make it smaller as well (optional) */
.navbar-brand .badge {
  font-size: 0.4rem !important; /* Adjust the badge size */
}

.email-text {
  font-size: 0.6rem;
  color: #6c757d;
  padding-left: 2.2rem;
}

@media (max-width: 991.98px) {
  .navbar-collapse {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background-color: #effafe !important;
    z-index: 10;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    opacity: 0;
    transition:
      opacity 0.3s ease-in-out,
      height 0.3s ease-in-out;
    overflow: hidden;
  }

  .navbar-collapse.show {
    opacity: 0.9;
    margin-top: 1rem;
    margin-bottom: 1rem;
  }
}

/* Style the navbar toggler to ensure it's above the hero image */
.navbar-toggler {
  z-index: 4; /* Higher than the header's base z-index */
}

/* Style the navbar toggler to ensure it's above the hero image */
.navbar-toggler {
  z-index: 4; /* Higher than the header's base z-index */
}

.navbar-toggler-icon {
  width: 1em;
  height: 1em;
}

footer {
  z-index: 2;
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

@media (max-width: 767px) {
  .hero-image-container::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 1.2rem; /* Adjust the height of the gradient area for mobile */
    background: linear-gradient(
      to bottom,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 1) 100%
    );
    z-index: 2; /* Ensure it's above the image */
  }
}
</style>
