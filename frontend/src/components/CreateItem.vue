<template>
  <div>
    <form @submit.prevent="createItem" class="row g-3">
      <div class="col-md-6">
        <label for="residentId" class="form-label">Resident ID</label>
        <input type="text" class="form-control" id="residentId" v-model="formData.residentId" readonly />
      </div>
      <div class="col-md-6">
        <label for="residentName" class="form-label">Resident Name</label>
        <input type="text" class="form-control" id="residentName" v-model="formData.residentName" readonly />
      </div>
      <div class="col-md-6">
        <label for="residentContact" class="form-label">Resident Contact</label>
        <input type="text" class="form-control" id="residentContact" v-model="formData.residentContact" readonly />
      </div>
      <div class="col-md-6">
        <label for="visitorName" class="form-label">Visitor Name</label>
        <input type="text" class="form-control" id="visitorName" v-model="formData.visitorName" required />
      </div>
      <div class="col-12">
        <button type="submit" class="btn btn-primary" :disabled="isLoading">
          <span v-if="isLoading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
          Register
        </button>
      </div>
    </form>

    <div v-if="response && response.data && response.data.qrCodeDataURL" class="mt-4">
      <h3>Visitor registered successfully!</h3>
      <h4>QR Code:</h4>
      <img :src="response.data.qrCodeDataURL" alt="Visitor QR Code" width="200" height="200" class="img-thumbnail">
      <p class="mt-2">Registration ID: {{ response.data.registrationId }}</p>
    </div>

    <h6 class="alert alert-danger mt-4" v-if="errorMsg">{{ errorMsg }}</h6>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'CreateItem',
  data() {
    return {
      formData: {
        residentId: '1234',
        residentName: 'Elmar Guevarra',
        residentContact: '+6309123456',
        visitorName: '',
      },
      errorMsg: '',
      response: '',
      isLoading: false, // Add a loading state
    };
  },
  methods: {
    createItem() {
      this.isLoading = true; // Set loading to true when the process starts
      axios
        .post(process.env.VUE_APP_API_ENDPOINT, this.formData)
        .then((response) => {
          console.log(response);
          this.response = response;
          this.formData.visitorName = '';
          this.errorMsg = '';
        })
        .catch((error) => {
          console.log(error);
          this.errorMsg = 'Error posting data';
        })
        .finally(() => {
          this.isLoading = false; // Set loading to false when the process completes (success or error)
        });
    },
  },
};
</script>