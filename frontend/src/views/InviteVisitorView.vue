<template>
    <div class="container mt-4">
      <h3 class="mb-3">Visitor Invitation</h3>
      <p>Share the link below with your visitor. Their details will be automatically associated with your account.</p>
      <div class="mb-4 border p-3 rounded shadow-sm">
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
        <div class="col-12">
          <button type="submit" class="btn btn-primary" :disabled="isLoading">
            <span v-if="isLoading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
            Generate Link
          </button>
        </div>
      </form>
      <div v-if="visitor && visitor.qrCodeDataURL" class="mt-4 d-flex flex-column align-items-center">
        <p class="mt-2 mb-2 text-center">{{ visitor.visitorName }}</p>
        <img :src="visitor.qrCodeDataURL" alt="Visitor QR Code" width="150" height="150" class="img-thumbnail mb-2">
        <p class="mt-2 mb-0 text-center">Registration ID: {{ visitor.registrationId }}</p>
        <h6 class="alert alert-success mt-3">Registered for visit on <strong>{{ visitor.visitDate }}</strong></h6>
      </div>
  
      <h6 class="alert alert-danger mt-4" v-if="errorMsg">{{ errorMsg }}</h6>
    </div>
    </div>
</template>

  
  <script>
  import axios from 'axios';
  
  export default {
    name: 'InviteVisitorView',
    inject: ['residentId'],
    data() {
      const today = new Date().toISOString().split('T')[0];
      console.log("[Debug] today", today)
      return {
        visitor: null,
        formData: {
          residentId: this.residentId,
          residentName: 'Jua Delacruz',
          residentContact: '+6309123456',
          visitorName: null,
          visitDate: today,
          arrivalTime: null,
          departureTime: null,
          hasArrived: false,
          hasDeparted: false
        },
        errorMsg: '',
        isLoading: false,
        today: today
      };
    },
    methods: {
      createItem() {
        this.isLoading = true;
        axios
          .post(process.env.VUE_APP_API_ENDPOINT, this.formData)
          .then((response) => {
            console.log(response);
            this.visitor = response.data;
            this.formData.visitorName = '';
            this.formData.visitDate = this.today;
            this.errorMsg = '';
          })
          .catch((error) => {
            console.log(error);
            this.errorMsg = 'Error posting data';
          })
          .finally(() => {
            this.isLoading = false;
          });
      },
    }
  };
  </script>