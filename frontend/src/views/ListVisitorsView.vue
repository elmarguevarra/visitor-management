<template>
  <div class="container mt-4">
    <h3 class="mb-3">My Visitors</h3>
    <GetUserItems class="mb-4 border p-3 rounded shadow-sm" :residentId="residentId" />
  </div>
</template>

<script>
import GetUserItems from '../components/GetUserItems';

export default {
  name: 'ListVisitorsView',
  // inject: ['residentId', 'setResidentId', 'isAuthenticated', 'login', 'logout'],
  inject: ['residentId'],
  components: {
    GetUserItems
  }
};
</script>

<style scoped>
/* You can add component-specific styles here if needed */
</style>