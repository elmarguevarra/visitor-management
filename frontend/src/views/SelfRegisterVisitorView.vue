<template>
  <div class="container mt-4">
    <h3 class="mb-3">Self Registration</h3>
    <div class="mb-4 border p-3 rounded shadow-sm">
      <form @submit.prevent="generateInviteLink" class="row g-3">
        <div class="col-md-6">
          <label for="visitorName" class="form-label">Visitor Name</label>
          <input type="text" class="form-control" id="visitorName" v-model="formData.visitorName" required />
        </div>
        <div class="col-md-6">
          <label for="visitDate" class="form-label">Visit Date</label>
          <input type="date" class="form-control" id="visitDate" v-model="formData.visitDate" required :min="today" />
        </div>
        <div v-if="!isLoading" class="col-12">
          <button type="submit" class="btn btn-primary" :disabled="isLoading">
            <span v-if="isLoading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Register
          </button>
        </div>
      </form>
      <div v-if="isLoading" class="alert alert-info mt-3">
        <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
          Waiting for Approval...
      </div>

      <h6 class="alert alert-danger mt-4" v-if="errorMsg">{{ errorMsg }}</h6>
    </div>
  </div>
</template>

<script>
// import axios from 'axios';

export default {
  name: 'InviteVisitorView',
  inject: ['residentId'],
  data() {
    const today = new Date().toISOString().split('T')[0];
    console.log("[Debug] today", today);
    return {
      invitation: null,
      formData: {
        residentId: this.residentId,
        residentName: 'Jua Delacruz',
        residentContact: '+6309123456',
        visitorName: null,
        visitDate: today,
        arrivalTime: null,
        departureTime: null,
        hasArrived: false,
        hasDeparted: false,
      },
      errorMsg: '',
      isLoading: false,
      today: today,
    };
  },
  // computed: {
  //   isTokenExpired() {
  //     if (this.invitation && this.invitation.inviteLinkExpiration) {
  //       const expirationDate = new Date(this.invitation.inviteLinkExpiration);
  //       const currentDate = new Date();
  //       return currentDate > expirationDate; // Return true if the token is expired
  //     }
  //     return false; // If there's no expiration date, assume it's not expired
  //   }
  // },
  methods: {
    formatDateAndTime(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };
      const timeOptions = { hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true };
      const formattedDate = date.toLocaleDateString(undefined, dateOptions);
      const formattedTime = date.toLocaleTimeString(undefined, timeOptions);
      return `${formattedDate} at ${formattedTime}`;
   } ,
    generateInviteLink() {
      this.isLoading = true;
      // this.errorMsg = '';
      // const apiUrl = `${process.env.VUE_APP_API_ENDPOINT}invite`;
      // axios
      //   .post(apiUrl, this.residentId)
      //   .then((response) => {
      //     console.log(response);
      //     this.invitation = response.data;
      //   })
      //   .catch((error) => {
      //     console.log(error);
      //     this.errorMsg = 'Error generating invite link';
      //   })
      //   .finally(() => {
      //     this.isLoading = false;
      //   });
    },
  },
};
</script>

<style scoped>
/* You can add more subtle styling here if needed */
</style>