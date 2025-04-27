<template>
  <div class="container mt-4">
    <h3 class="mb-3">Visitor Invitation</h3>
    <div class="mb-4 border p-3 rounded shadow-sm">
      <form @submit.prevent="generateInviteLink" class="row g-3">
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
      <div v-if="invitation && invitation.inviteLink" class="mt-4 d-flex flex-column align-items-center">
        <p class="mb-1 text-center text-secondary">Share this link:</p>
        <div class="d-flex align-items-center">
          <p class="me-2 mb-0">{{ invitation.inviteLink }}</p>
          <button class="btn btn-outline-secondary btn-sm" @click="copyToClipboard(invitation.inviteLink)" title="Copy to clipboard">
            Copy
          </button>
        </div>
        <p v-if="invitation.inviteLinkExpiration" class="mt-2 text-muted text-center small">
          Link expires on: {{ formatDateAndTime(invitation.inviteLinkExpiration) }}
        </p>
        <p class="mt-2 text-muted text-center small">Your visitor can use this link to register.</p>
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
      this.errorMsg = '';
      const apiUrl = `${process.env.VUE_APP_API_ENDPOINT}invite`;
      axios
        .post(apiUrl, this.residentId)
        .then((response) => {
          console.log(response);
          this.invitation = response.data;
        })
        .catch((error) => {
          console.log(error);
          this.errorMsg = 'Error generating invite link';
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    copyToClipboard(text) {
      navigator.clipboard.writeText(text)
        .then(() => {
          alert('Link copied!');
        })
        .catch((err) => {
          console.error('Failed to copy text: ', err);
        });
    },
  },
};
</script>

<style scoped>
/* You can add more subtle styling here if needed */
</style>