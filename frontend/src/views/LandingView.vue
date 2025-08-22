<template>
  <div class="full-page-image-container">
    <picture>
      <source srcset="/landing-mobile.jpeg" media="(max-width: 768px)" />
      <img src="/landing.png" alt="Full Page Image" class="full-page-image" />
    </picture>

    <!-- Button Overlay at Bottom -->
    <div class="button-overlay">
      <Button @click="signIn"> Get Started </Button>
    </div>
  </div>
</template>

<script>
import Button from '@/components/Button.vue'
import { useAuthenticationStore } from '@/stores/authenticationStore'
import { onMounted } from 'vue'

export default {
  components: {
    Button,
  },
  name: 'LandingView',
  setup() {
    const authenticationStore = useAuthenticationStore()

    onMounted(() => {
      window.scrollTo(0, 0)
    })

    return {
      authenticationStore,
      signIn: authenticationStore.signIn,
    }
  },
}
</script>

<style scoped>
.full-page-image-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

.full-page-image {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

.button-overlay {
  position: absolute;
  bottom: 9%; /* Moves the button up from the bottom */
  left: 50%;
  transform: translateX(-50%);
  width: 72%; /* Makes the button wider for better tap target */
  display: flex; /* Enables Flexbox for centering */
  justify-content: center; /* Centers button horizontally */
  z-index: 2;
}

.btn {
  /* Updated padding and font size for a larger button */
  padding: 15px 40px;
  font-size: 1rem;
  font-weight: 600; /* Makes the text bolder */
  background-color: #479ffc;
  color: white;
  border: none;
  border-radius: 8px; /* Adds a slight border-radius for a modern look */
  cursor: pointer;
  width: 100%; /* Ensures the button fills the width of its container */
  max-width: 300px; /* Prevents the button from becoming too wide on large screens */
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2); /* Adds a subtle shadow for depth */
}

.btn:active {
  background-color: #357abd;
  transform: scale(0.98); /* Less aggressive scaling for a smoother feel */
  transition: transform 0.1s ease-in-out;
}
</style>
