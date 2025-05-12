<template>
  <div class="container mt-4">
    <h3 class="mb-3">My Visitors</h3>
    <GetUserItems :residentId="residentId" />
  </div>
</template>

<script setup>
import GetUserItems from '../components/GetResidentVisitors.vue'
</script>

<style scoped>
/* You can add component-specific styles here if needed */
</style>
