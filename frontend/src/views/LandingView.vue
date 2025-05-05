<template>
    <div class="full-page-image-container">
      <img
        src="/landing.png"
        alt="Full Page Image"
        class="full-page-image"
      >
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
  
  /* Adjust object-position for smaller screens (example breakpoints) */
  @media (max-width: 768px) {
    .full-page-image {
      object-position: left center; /* Try shifting focus to the left */
    }
  }
  
  @media (max-width: 576px) {
    .full-page-image {
      object-position: left top; /* Further adjust for even smaller screens */
    }
  }
  </style>