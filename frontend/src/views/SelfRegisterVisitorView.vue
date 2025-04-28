<template>
  <div class="container mt-4">
    <h3 class="mb-3">Self Registration</h3>
    <div class="mb-4 border p-3 rounded shadow-sm">
      <form v-if="!errorMsg && !isGetInviteByTokenLoading" @submit.prevent="requestVisit" class="row g-3">
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
        <div class="col-12">
          <button v-if="!visitor" type="submit" class="btn btn-primary" :disabled="isRequestVisitLoading">
            <span v-if="isRequestVisitLoading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Submit
          </button>
        </div>
      </form>
      <div v-if="isGetInviteByTokenLoading" class="alert alert-info mt-3">
        <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
          Verifying Invitation...
      </div>
      <div v-if="visitor && visitor.registrationId" class="alert alert-info mt-3">
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
      visitor: null,
      formData: {
        residentId: null,
        visitorName: null,
        visitDate: today,
      },
      errorMsg: '',
      isGetInviteByTokenLoading: false,
      isRequestVisitLoading: false,
      today: today,
    };
  },
  methods: {
    requestVisit() {
      this.isRequestVisitLoading = true;
      const requestVisitData = {
        inviteToken: this.inviteToken,
        visitorName: this.formData.visitorName,
        visitDate: this.formData.visitDate ? new Date(this.formData.visitDate).toISOString() : null,
      };
      const apiUrl = `${process.env.VUE_APP_API_ENDPOINT}visit-request`;
      axios
        .post(apiUrl, requestVisitData)
        .then((response) => {
          console.log(response);
          this.visitor = response.data;
          this.errorMsg = '';
        })
        .catch((error) => {
          console.log(error);
          this.errorMsg = 'Error posting data';
        })
        .finally(() => {
          this.isRequestVisitLoading = false;
      });
    },
    getInviteByToken() {
      this.isGetInviteByTokenLoading = true;
      const apiUrl = `${process.env.VUE_APP_API_ENDPOINT}invite/${this.inviteToken}`;
      axios
        .get(apiUrl)
        .then((response) => {
          console.log(response.data);
          this.invitation = response.data;
          if (this.invitation && this.invitation.residentId) {
            this.formData.residentId = this.invitation.residentId;
          }
          this.errorMsg = '';
        })
        .catch((error) => {
          console.log(error);
          this.errorMsg = 'Invite not found or has already expired.';
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