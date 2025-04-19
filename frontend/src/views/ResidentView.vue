<template>
  <div class="container mt-4">
    <h2 class="mb-4">Register Visitor</h2>
    <CreateItem class="mb-4 border p-3 rounded shadow-sm" />
    <hr class="my-5" />
    <h2 class="mb-4">Get All Visitors</h2>
    <GetItems class="mb-4 border p-3 rounded shadow-sm" />
  </div>
</template>

<script>
import CreateItem from '../components/CreateItem';
import GetItems from '../components/GetItems';

export default {
  name: 'ResidentView',
  components: {
    GetItems,
    CreateItem,
  },
};
</script>

<style scoped>
/* You can add component-specific styles here if needed */
</style>