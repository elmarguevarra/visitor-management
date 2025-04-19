<template>
  <div id="app" class="d-flex flex-column min-vh-100">
    <header class="mb-3">
      <div class="container p-0">
        <img
          src="/banner.png"
          alt="Website Banner"
          class="img-fluid rounded"
          style="max-height: 300px; object-fit: cover; width: 100%; display: block;"
        >
      </div>
    </header>

    <main class="flex-grow-1 py-4">
      <div class="container">
        <router-view></router-view>
      </div>
    </main>

    <footer class="bg-light py-3 mt-4 text-center shadow-sm">
      <div class="container">
        <p class="mb-0">&copy; 2025 alphinecodetech. All rights reserved.</p>
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
/* You can add component-specific styles here if needed */
</style>