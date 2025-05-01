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
        class="alert alert-danger mt-3 text-center">
        Request has been declined
      </div>
      <div v-if="
        !isGetVisitRequestByTokenLoading &&
        visitRequest && 
        visitRequest.requestStatus === 'APPROVED' &&
        !isGetInviteByTokenLoading" 
        class="alert alert-success mt-3 text-center">
        Request has been approved
      </div>
      <div v-if="
        visitor && 
        visitor.qrCodeDataURL"
        class="mt-4 d-flex flex-column align-items-center">
        <p class="mt-2 mb-2 text-center">{{ visitor.visitorName }}</p>
        <img :src="visitor.qrCodeDataURL" alt="Visitor QR Code" width="150" height="150" class="img-thumbnail mb-2">
        <p class="mt-2 mb-0 text-center">Registration ID: {{ visitor.registrationId }}</p>
        <h6 class="alert alert-success mt-3">Registered for visit on <strong>{{ formatDate(new Date(visitor.visitDate)) }}</strong></h6>
        <p class="mt-2 text-muted text-center small">Present this at the gate on the day of your visit.</p>
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
import { postVisitRequest, getInviteByToken, getVisitRequestByToken, getVisitorByRegistrationId } from '@/services/apiService';
import { getYearMonthDay, formatDate } from '@/utils';

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
      visitor: null,
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
    formatDate,
    async requestVisit() {
      this.isRequestVisitLoading = true;
      const requestVisitData = {
        residentId: this.residentId,
        inviteToken: this.inviteToken,
        visitorName: this.formData.visitorName,
        visitDate: this.formData.visitDate,
        requestStatus: "PENDING"
      };
      try {
        const response = await postVisitRequest(requestVisitData);
        console.log(response);
        this.visitRequest = response;
        this.errorMsg = '';
      } catch (error) {
        console.log(error);
        this.errorMsg = 'Error posting data';
      } finally {
        this.isRequestVisitLoading = false;
      }
    },

    async getInvite() {
      this.isGetInviteByTokenLoading = true;
      try {
        const response = await getInviteByToken(this.inviteToken)
        console.log(response.data);
        this.invitation = response;
        if (this.invitation && this.invitation.residentId) {
          this.formData.residentId = this.invitation.residentId;
          this.residentId = this.invitation.residentId;
        }
        this.errorMsg = '';
      } catch (error) {
        console.log(error);
        this.errorMsg = 'Invite not found or has already expired.';
      } finally {
        this.isGetInviteByTokenLoading = false;
      }
    },

    async getVisitRequest() {
      this.isGetVisitRequestByTokenLoading = true;
      try {
        const response = await getVisitRequestByToken(this.inviteToken);
        console.log(response);
        this.visitRequest = response;
        if (this.visitRequest) {
          this.formData.visitorName = this.visitRequest.visitorName;
          this.formData.visitDate = getYearMonthDay(new Date(this.visitRequest.visitDate));
          this.errorMsg = '';
          if(this.visitRequest.requestStatus === 'APPROVED'){
            this.getVisitor(this.visitRequest.registrationId);
          }
        }
      } catch (error) {
        console.log(error);
        this.errorMsg = 'Visit Request not found or has already expired.';
      } finally {
        this.isGetVisitRequestByTokenLoading = false;
      }
    },

    async getVisitor(id) {
      try {
        const response = await getVisitorByRegistrationId(id)
        this.visitor = response;
        this.errorMsg = '';
      } catch (error) {
        console.error(error);
        this.errorMsg = error.response?.data?.message || 'Error retrieving data';
      }
    },
  },
  mounted() {
    if (this.inviteToken) {
      this.getInvite();
      this.getVisitRequest();
    }
  }
};
</script>

<style scoped>
/* You can add more subtle styling here if needed */
</style>