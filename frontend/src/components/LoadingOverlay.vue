<template>
  <div class="loading-overlay">
    <div class="spinner-grow text-secondary" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
  </div>
</template>

<script setup></script>

<style scoped>
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(
    255,
    255,
    255,
    0.6
  ); /* Semi-transparent white background */
  z-index: 9999; /* Ensure it's on top of most other content */
  display: flex;
  justify-content: center; /* Center horizontally */
  align-items: center; /* Center vertically */
}

/* Add any additional spinner styling if needed, or rely on Bootstrap's spinner styles */
.spinner-border {
  width: 2rem;
  height: 2rem;
}
</style>
