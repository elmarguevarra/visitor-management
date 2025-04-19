<template>
  <div class="container mt-4">
    <h3 class="mb-3">Register visitor</h3>
    <CreateItem class="mb-4 border p-3 rounded shadow-sm" @resident-id-updated="updateResidentId" />
    <br />
    <h3 class="mb-3">Get all visitors</h3>
    <GetUserItems class="mb-4 border p-3 rounded shadow-sm" :residentId="residentIdForGetItems" />
  </div>
</template>

<script>
import CreateItem from '../components/CreateItem';
import GetUserItems from '../components/GetUserItems';

export default {
  name: 'ResidentView',
  components: {
    GetUserItems,
    CreateItem,
  },
  data() {
    return {
      residentIdForGetItems: null,
    };
  },
  methods: {
    updateResidentId(residentId) {
      this.residentIdForGetItems = residentId;
    },
  },
};
</script>

<style scoped>
/* You can add component-specific styles here if needed */
</style>