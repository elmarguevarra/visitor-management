<template>
  <div class="container mt-4">
    <h3 class="mb-3">Register visitor</h3>
    <CreateItem class="mb-4 border p-3 rounded shadow-sm" />
    <br />
    <h3 class="mb-3">Get all visitors</h3>
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