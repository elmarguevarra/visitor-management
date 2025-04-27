<template>
  <div class="container mt-4">
    <h3 class="mb-3">Self Registration</h3>
    <div class="mb-4 border p-3 rounded shadow-sm">
      <form @submit.prevent="generateInviteLink" class="row g-3">
        <div class="col-md-6">
          <label for="residentId" class="form-label">Resident ID</label>
          <input type="text" class="form-control" id="residentId" v-model="formData.residentId" readonly />
        </div>
        <div class="col-md-6">
          <label for="visitorName" class="form-label">Visitor Name</label>
          <input type="text" class="form-control" id="visitorName" v-model="formData.visitorName" required />
        </div>
        <div class="col-md-6">
          <label for="visitDate" class="form-label">Visit Date</label>
          <input type="date" class="form-control" id="visitDate" v-model="formData.visitDate" required :min="today" />
        </div>
        <div v-if="isGetInviteByTokenLoading" class="alert alert-info mt-3">
          <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
            Verifying Invitation...
        </div>
        <div v-else-if="!isGetInviteByTokenLoading" class="col-12">
          <button type="submit" class="btn btn-primary" :disabled="isSubmittedForApprovalLoading">
            <span v-if="isSubmittedForApprovalLoading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Submit
          </button>
        </div>
      </form>
      <div v-if="isSubmittedForApprovalLoading" class="alert alert-info mt-3">
        <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
          Waiting for Approval...
      </div>

      <h6 class="alert alert-danger mt-4" v-if="errorMsg">{{ errorMsg }}</h6>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'InviteVisitorView',
  props: {
    inviteToken: {
      type: String,
      default: ''
    }
  },
  data() {
    const today = new Date().toISOString().split('T')[0];
    console.log("[Debug] today", today);
    return {
      invitation: null,
      formData: {
        residentId: null,
        visitorName: null,
        visitDate: today,
        arrivalTime: null,
        departureTime: null,
        hasArrived: false,
        hasDeparted: false,
      },
      errorMsg: '',
      isGetInviteByTokenLoading: false,
      isSubmittedForApprovalLoading: false,
      today: today,
    };
  },
  methods: {
    getInviteByToken() {
      this.isGetInviteByTokenLoading = true;
      this.errorMsg = '';
      const apiUrl = `${process.env.VUE_APP_API_ENDPOINT}invite/${this.inviteToken}`;
      axios
        .get(apiUrl)
        .then((response) => {
          console.log(response.data);
          this.invitation = response.data;
          if (this.invitation && this.invitation.residentId) {
            this.formData.residentId = this.invitation.residentId;
          }
        })
        .catch((error) => {
          console.log(error);
          this.errorMsg = 'Invite invalid or has expired';
        })
        .finally(() => {
          this.isGetInviteByTokenLoading = false;
        });
    }
  },
  mounted() {
    if (this.inviteToken) {
      this.getInviteByToken();
    }
  }
};
</script>

<style scoped>
/* You can add more subtle styling here if needed */
</style>