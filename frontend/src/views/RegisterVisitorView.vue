<template>
  <div class="container mt-4">
    <h3 class="mb-3">Visitor Registration</h3>
    <CreateItem class="mb-4 border p-3 rounded shadow-sm"/>
  </div>
</template>

<script>
import CreateItem from '../components/CreateItem';

export default {
  name: 'RegisterVisitorView',
  components: {
    CreateItem,
  },
};
</script>

<style scoped>
/* You can add component-specific styles here if needed */
</style>