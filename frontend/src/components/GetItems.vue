<template>
  <div>
    <button @click="getItems" class="btn btn-primary mb-3" :disabled="isLoading">
      <span v-if="isLoading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
      Get All Visitors
    </button>
    <div v-for="visitor in visitors" :key="visitor.registrationId" class="card mb-3">
      <div class="card-body">
        <h5 class="card-title">
          Registration ID: {{ visitor.registrationId }}
          <span class="ms-2">Visitor Name: {{ visitor.visitorName }}</span>
        </h5>
        <img :src="visitor.qrCodeDataURL" alt="Visitor QR Code" width="200" height="200" class="img-thumbnail">
      </div>
    </div>
    <h6 class="alert alert-danger mt-4" v-if="errorMsg">{{ errorMsg }}</h6>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'GetItems',

  data() {
    return {
      visitors: [],
      errorMsg: '',
      isLoading: false, // Add loading state
    };
  },
  methods: {
    getItems() {
      this.isLoading = true; // Set loading to true when fetching starts
      axios
        .get(process.env.VUE_APP_API_ENDPOINT)
        .then((response) => {
          console.log(response);
          this.visitors = response.data;
        })
        .catch((error) => {
          console.log(error);
          this.errorMsg = 'Error retrieving data';
        })
        .finally(() => {
          this.isLoading = false; // Set loading to false when fetching completes
        });
    },
  },
};
</script>