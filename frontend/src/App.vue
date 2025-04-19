<template>
  <div id="app">
    <!-- Banner Section -->
    <header class="banner-container">
      <img src="/banner.png" alt="Website Banner" class="banner-image">
    </header>

    <!-- Main Content -->
    <main class="content-wrapper">
      <router-view></router-view>
    </main>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>