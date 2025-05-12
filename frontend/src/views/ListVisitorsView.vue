<template>
  <div class="container mt-2">
    <h4 class="mb-3 text-muted" style="margin-left: -0.5rem">My Visitors</h4>
    <GetUserItems :residentId="residentId" />
  </div>
</template>

<script setup>
import GetUserItems from '../components/GetResidentVisitors.vue'
</script>

<style scoped>
/* You can add component-specific styles here if needed */
</style>
