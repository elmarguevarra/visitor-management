<template>
  <div>
    <button @click="getItems" class="btn btn-primary mb-3" :disabled="isLoading">
      <span v-if="isLoading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
      Load visitor list
    </button>
    <div v-for="visitor in visitors" :key="visitor.registrationId" class="card mb-3">
      <div class="card-body d-flex flex-column align-items-center">
        <h5 class="card-title text-center mb-2">
          {{ visitor.visitorName }}
        </h5>
        <img :src="visitor.qrCodeDataURL" alt="Visitor QR Code" width="150" height="150" class="img-thumbnail mb-2">
        <p class="card-text text-center mb-0">
          Registration ID: {{ visitor.registrationId }}
        </p>
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
      isLoading: false,
    };
  },
  methods: {
    getItems() {
      this.isLoading = true;
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
          this.isLoading = false;
        });
    },
  },
};
</script>