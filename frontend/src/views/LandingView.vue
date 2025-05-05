<template>
    <div class="full-page-image-container">
      <picture>
        <source srcset="/landing-mobile.png" media="(max-width: 600px)">
        <img
          src="/landing.png"
          alt="Full Page Image"
          class="full-page-image"
        >
      </picture>
    </div>
  </template>
  
  <script>
  export default {
    name: 'LandingView',
  };
  </script>
  
  <style scoped>
  .full-page-image-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    overflow: hidden;
    z-index: -1;
  }
  
  .full-page-image {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center; /* Default center */
  }
  
  </style>