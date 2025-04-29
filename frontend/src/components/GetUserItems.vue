<template>
  <div>
    <p class="card-text placeholder-glow">
      <span v-if="isLoading" class="placeholder col-5"></span>
    </p>
    <div v-if="isLoading" class="card" aria-hidden="true">
      <div class="card-body">
        <h6 class="card-title placeholder-glow text-center mb-2">
          <span class="placeholder col-4"></span>
        </h6>
        <div class="mb-2 placeholder-box"></div>
        <p class="card-text placeholder-glow text-center mb-0">
          <span class="placeholder col-8"></span>
        </p>
      </div>
      <div class="card-footer text-muted text-center small">
        <span class="placeholder col-3"></span>
      </div>
    </div>

    <h5 v-if="visitRequests.length > 0" class="mt-4">Pending Visit Requests</h5>
    <div v-for="visitRequest in visitRequests" :key="visitRequest.inviteToken" class="card mb-3">
      <div class="card-body d-flex flex-column text-muted align-items-center">
        <h6 class="card-title text-center mb-2">
          {{ visitRequest.visitorName }} on {{ formatDate(visitRequest.visitDate) }}
        </h6>
        <button @click="" class="btn btn-primary">
          Approve
        </button>
        <button @click="" class="btn btn-secondary">
          Decline
        </button>
      </div>
    </div>

    <h5 v-if="todayVisitors.length > 0">Today's</h5>
    <div v-for="visitor in todayVisitors" :key="visitor.registrationId" class="card mb-3">
      <div class="card-body d-flex flex-column align-items-center">
        <h6 class="card-title text-center mb-2" :class="{'text-muted': visitor.hasDeparted }">
          {{ visitor.visitorName }}
        </h6>
        <img :src="visitor.qrCodeDataURL" alt="Visitor QR Code" width="150" height="150" class="img-thumbnail mb-2" :class="{ 'opacity-50': visitor.hasDeparted }">
        <p class="card-text text-center mb-0" :class="{'text-muted': visitor.hasDeparted }">
          Registration ID: {{ visitor.registrationId }}
        </p>
      </div>
      <div v-if="!visitor.hasArrived" class="card-footer text-muted text-center small">
        Scheduled
      </div>
      <div v-else-if="visitor.hasArrived && !visitor.hasDeparted" class="card-footer text-secondary text-center small" style="background-color: #e2e3e5;">
        Arrived
      </div>
      <div v-else-if="visitor.hasDeparted" class="card-footer text-muted text-center small">
        Departed
      </div>
    </div>
    <p v-if="todayVisitors.length === 0 && visitors.length > 0" class="text-muted">No visitors today.</p>

    <h5 v-if="upcomingVisitors.length > 0" class="mt-4">Upcoming</h5>
    <div v-for="visitor in upcomingVisitors" :key="visitor.registrationId" class="card mb-3">
      <div class="card-body d-flex flex-column align-items-center">
        <h6 class="card-title text-center mb-2">
          {{ visitor.visitorName }} on {{ formatDate(visitor.visitDate) }}
        </h6>
        <img :src="visitor.qrCodeDataURL" alt="Visitor QR Code" width="150" height="150" class="img-thumbnail mb-2">
        <p class="card-text text-center mb-0">
          Registration ID: {{ visitor.registrationId }}
        </p>
      </div>
    </div>
    <p v-if="upcomingVisitors.length === 0 && visitors.length > 0" class="text-muted">No upcoming visitors.</p>

    <h5 v-if="expiredVisitors.length > 0" class="mt-4">Past</h5>
    <div v-for="visitor in expiredVisitors" :key="visitor.registrationId" class="card mb-3">
      <div class="card-body d-flex flex-column text-muted align-items-center">
        <h6 class="card-title text-center mb-2">
          {{ visitor.visitorName }} on {{ formatDate(visitor.visitDate) }}
        </h6>
        <p class="card-text text-center mb-0">
          Registration ID: {{ visitor.registrationId }}
        </p>
      </div>
      <div v-if="!visitor.hasArrived" class="card-footer text-muted text-center small">
        Scheduled
      </div>
      <div v-else-if="visitor.hasArrived && !visitor.hasDeparted" class="card-footer text-muted text-center small">
        Arrived
      </div>
      <div v-else-if="visitor.hasDeparted" class="card-footer text-muted text-center small">
        Departed
      </div>
    </div>
    <p v-if="expiredVisitors.length === 0 && visitors.length > 0" class="text-muted">No past visitors.</p>

    <h6 class="alert alert-danger mt-4" v-if="errorMsg">{{ errorMsg }}</h6>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'GetUserItems',
  props: {
    residentId: {
      type: String,
      required: true
    },
  },
  data() {
    return {
      visitors: [],
      visitRequests: [],
      errorMsg: '',
      isLoading: false,
      isVisitRequestsLoading: false
    };
  },
  computed: {
    upcomingVisitors() {
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Set to the beginning of today
      return this.visitors.filter(visitor => {
        const visitDate = new Date(visitor.visitDate).setHours(0, 0, 0, 0);
        return visitDate > today;
      });
    },
    todayVisitors() {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      return this.visitors.filter(visitor => {
        const visitDate = new Date(visitor.visitDate).setHours(0, 0, 0, 0);
        return visitDate >= today && visitDate < tomorrow;
      });
    },
    expiredVisitors() {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return this.visitors.filter(visitor => {
        const visitDate = new Date(visitor.visitDate).setHours(0, 0, 0, 0);
        return visitDate < today;
      });
    },
  },
  methods: {
    getItems() {
      this.isLoading = true;
      let apiUrl = process.env.VUE_APP_API_ENDPOINT;
      if (this.residentId) {
        apiUrl += `visitors?residentId=${this.residentId}`;
      }
      axios
        .get(apiUrl)
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
    getVisitRequests() {
      this.isVisitRequestsLoading = true;
      let apiUrl = process.env.VUE_APP_API_ENDPOINT;
      if (this.residentId) {
        apiUrl += `visit-requests?residentId=${this.residentId}`;
      }
      axios
        .get(apiUrl)
        .then((response) => {
          console.log(response);
          this.visitRequests = response.data;
        })
        .catch((error) => {
          console.log(error);
          this.errorMsg = 'Error retrieving data';
        })
        .finally(() => {
          this.isVisitRequestsLoading = false;
        });
    },
    formatDate(dateString) {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    },
  },
  mounted() {
    this.getItems();
    this.getVisitRequests();
  }
};
</script>

<style scoped>
.placeholder-box {
  width: 150px;
  height: 150px;
  background-color: #f8f9fa; /* Very light gray */
  border: 1px solid #eee;
  border-radius: 5px; /* Optional: slight rounding */
  margin: 0 auto; /* Centers the box horizontally */
}
</style>