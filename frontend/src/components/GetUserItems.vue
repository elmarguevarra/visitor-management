<template>
  <div>
    <button @click="getItems" class="btn btn-primary mb-3" :disabled="isLoading">
      <span v-if="isLoading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
      Load visitor list
    </button>

    <h5 v-if="todayVisitors.length > 0" class="mt-4">Today's Visitors</h5>
    <div v-for="visitor in todayVisitors" :key="visitor.registrationId" class="card mb-3">
      <div class="card-body d-flex flex-column align-items-center">
        <span
          v-if="visitor.hasArrived"
          class="alert alert-success py-1 px-2 fw-normal position-absolute top-0 end-0 mt-2 me-2"
          style="font-size: 0.6rem; border-radius: 0.8rem;"
        >
          Arrived
        </span>
        <h6 class="card-title text-center mb-2">
          {{ visitor.visitorName }}
        </h6>
        <img :src="visitor.qrCodeDataURL" alt="Visitor QR Code" width="150" height="150" class="img-thumbnail mb-2">
        <p class="card-text text-center mb-0">
          Registration ID: {{ visitor.registrationId }}
        </p>
      </div>
    </div>
    <p v-if="todayVisitors.length === 0 && visitors.length > 0" class="text-muted">No visitors today.</p>

    <h5 v-if="upcomingVisitors.length > 0" class="mt-4">Upcoming Visitors</h5>
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

    <h5 v-if="expiredVisitors.length > 0" class="mt-4">Past Visitors</h5>
    <div v-for="visitor in expiredVisitors" :key="visitor.registrationId" class="card mb-3">
      <div class="card-body d-flex flex-column align-items-center">
        <h6 class="card-title text-center mb-2">
          {{ visitor.visitorName }} on {{ formatDate(visitor.visitDate) }}
        </h6>
        <p class="card-text text-center mb-0">
          Registration ID: {{ visitor.registrationId }}
        </p>
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
      errorMsg: '',
      isLoading: false,
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
    formatDate(dateString) {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    },
  },
};
</script>