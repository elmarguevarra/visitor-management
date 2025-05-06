<template>
  <div class="full-page-image-container">
    <picture>
      <source srcset="/landing-mobile.png" media="(max-width: 768px)">
      <img
        src="/landing.png"
        alt="Full Page Image"
        class="full-page-image"
      >
    </picture>

    <!-- Button Overlay at Bottom -->
    <div class="button-overlay">
      <button @click='authenticationStore.signIn' class="btn">Get Started</button>
    </div>
  </div>
</template>

<script>
import { useAuthenticationStore } from '@/stores/authenticationStore';

export default {
  name: 'LandingView',
  setup(){
    const authenticationStore = useAuthenticationStore()

    return {
      authenticationStore
    }
  }
};
</script>

<style scoped>
.full-page-image-container {
  position: relative;
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
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1;
  text-align: center;
}

.btn {
  padding: 10px 25px;
  font-size: 1rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}
</style>
