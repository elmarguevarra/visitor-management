<template>
  <div class="container mt-4">
    <h3 class="mb-3">Self-Register</h3>
    <div class="mb-4 border p-3 rounded shadow-sm">
      <form v-if="!errorMsg && 
        !isGetInviteByTokenLoading &&
        !isGetVisitRequestByTokenLoading" 
        @submit.prevent="requestVisit" 
        class="row g-3">
        <div class="col-md-6">
          <label for="visitorName" class="form-label">Visitor Name</label>
          <input type="text" class="form-control" id="visitorName" v-model="formData.visitorName" required/>
        </div>
        <div class="col-md-6">
          <label for="visitDate" class="form-label">Visit Date</label>
          <input type="date" class="form-control" id="visitDate" v-model="formData.visitDate" required :min="today"/>
        </div>
        <div class="col-12">
          <button v-if="
            !isGetVisitRequestByTokenLoading &&
            !visitRequest && 
            !isGetInviteByTokenLoading" 
            type="submit" 
            class="btn btn-primary" 
            :disabled="isRequestVisitLoading">
            <span v-if="isRequestVisitLoading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Submit
          </button>
        </div>
      </form>
      <div v-if="isGetInviteByTokenLoading" class="alert alert-info mt-3">
        <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
          Verifying Invitation...
      </div>
      <div v-if="
        !isGetVisitRequestByTokenLoading &&
        visitRequest && 
        visitRequest.requestStatus === 'PENDING' &&
        !isGetInviteByTokenLoading" 
        class="alert alert-info mt-3">
        <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
          Waiting for Approval...
      </div>
      <div v-if="
        !isGetVisitRequestByTokenLoading &&
        visitRequest && 
        visitRequest.requestStatus === 'DECLINED' &&
        !isGetInviteByTokenLoading" 
        class="alert alert-danger mt-3">
        Request has been declined
      </div>
      <div v-if="
        !isGetVisitRequestByTokenLoading &&
        visitRequest && 
        visitRequest.requestStatus === 'APPROVED' &&
        !isGetInviteByTokenLoading" 
        class="alert alert-success mt-3">
        Request has been approved
      </div>
      <h6 class="alert alert-danger mt-4" v-if="
        errorMsg && 
        !isRequestVisitLoading && 
        !isGetInviteByTokenLoading && 
        !isGetVisitRequestByTokenLoading">
          {{ errorMsg }}
      </h6>
    </div>
  </div>
</template>

<script>
import { getYearMonthDay } from '@/utils';
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
    const yearMonthDateToday = getYearMonthDay(new Date());
    return {
      invitation: null,
      visitRequest: null,
      residentId: null,
      formData: {
        visitorName: null,
        visitDate: yearMonthDateToday
      },
      errorMsg: '',
      isGetInviteByTokenLoading: false,
      isGetVisitRequestByTokenLoading: false,
      isRequestVisitLoading: false,
      today: yearMonthDateToday
    };
  },
  methods: {
    requestVisit() {
      this.isRequestVisitLoading = true;
      const requestVisitData = {
        residentId: this.residentId,
        inviteToken: this.inviteToken,
        visitorName: this.formData.visitorName,
        visitDate: this.formData.visitDate
      };
      const apiUrl = `${process.env.VUE_APP_API_ENDPOINT}visit-request`;
      axios
        .post(apiUrl, requestVisitData)
        .then((response) => {
          console.log(response);
          this.visitRequest = response.data;
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
            this.residentId = this.invitation.residentId;
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
    },
    getVisitRequestByToken() {
      this.isGetVisitRequestByTokenLoading = true;
      const apiUrl = `${process.env.VUE_APP_API_ENDPOINT}visit-request/${this.inviteToken}`;
      axios
        .get(apiUrl)
        .then((response) => {
          console.log(response);
          this.visitRequest = response.data;
          if (this.visitRequest) {
            this.formData.visitorName = this.visitRequest.visitorName;
            this.formData.visitDate = getYearMonthDay(new Date(this.visitRequest.visitDate));
            this.errorMsg = '';
          }
        })
        .catch((error) => {
          console.log(error);
          this.errorMsg = 'Visit Request not found or has already expired.';
        })
        .finally(() => {
          this.isGetVisitRequestByTokenLoading = false;
        });
    }
  },
  mounted() {
    if (this.inviteToken) {
      this.getInviteByToken();
      this.getVisitRequestByToken();
    }
  }
};
</script>

<style scoped>
/* You can add more subtle styling here if needed */
</style>