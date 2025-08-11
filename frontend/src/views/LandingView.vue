<template>
  <div class="full-page-image-container">
    <picture>
      <source srcset="/landing-mobile.png" media="(max-width: 768px)" />
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
  bottom: 67%;
  left: 24%;
  transform: translateX(-50%);
  z-index: 2;
  text-align: center;
}

.btn {
  padding: 8px 30px;
  font-size: 0.8rem;
  background-color: #479ffc;
  color: white;
  border: none;
  cursor: pointer;
  z-index: 2;
}

.btn:active {
  background-color: #357abd; /* A slightly darker shade */
  transform: scale(0.95); /* Slightly scale down the button */
  transition: transform 0.1s ease-in-out; /* Smooth transition for the scale */
}
</style>
