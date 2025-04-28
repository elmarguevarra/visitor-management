<template>
  <div class="container mt-4">
    <h3>Visitor Access</h3>
    <form @submit.prevent="getItemsById" class="row g-3 mb-3">
      <div class="col-md-6">
        <label for="registrationId" class="form-label">Registration ID</label>
        <input
          type="text"
          class="form-control"
          id="registrationId"
          v-model="formData.registrationId"
          readonly
        />
      </div>
    </form>

    <div v-if="isFetchDataLoading" class="alert alert-info mt-3">
      <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
      Verifying visitor...
    </div>
    <div v-else-if="visitor.registrationId && !isFetchDataLoading && isVisitToday" class="alert alert-success mt-3">
      <span><strong>{{ visitor.visitorName }}</strong> is scheduled to visit today.</span>
    </div>
    <div v-else-if="(visitor.registrationId && !isFetchDataLoading && !isVisitToday && errorMsg === '')" class="alert alert-warning mt-3">
      No scheduled visit for today.
    </div>

    <div v-if="visitor.registrationId && isVisitToday && !visitor.hasArrived" class="col-12">
      <button @click="setVisitorArrived" class="btn btn-primary" :disabled="isSetArrivedDataLoading">
        <span v-if="isSetArrivedDataLoading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
        Check-in
      </button>
    </div>
    <div v-if="visitor.hasArrived && !errorMsg" class="alert alert-success mt-3">
      Arrived on <strong>{{ formatDateAndTime(visitor.arrivalTime) }}</strong>
    </div>

    <div v-if="visitor.registrationId && isVisitToday && visitor.hasArrived && !visitor.hasDeparted" class="col-12">
      <button @click="setVisitorDeparted" class="btn btn-secondary" :disabled="isSetDepartedDataLoading">
        <span v-if="isSetDepartedDataLoading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
        Check-out
      </button>
    </div>
    <div v-if="visitor.hasDeparted && !errorMsg" class="alert alert-success mt-3">
      Departed on <strong>{{ formatDateAndTime(visitor.departureTime) }}</strong>
    </div>

    <h6 class="alert alert-danger mt-4" v-if="errorMsg">{{ errorMsg }}</h6>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'VerifyVisitorView',
  props: {
    registrationId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      visitor: {
        residentId: null,
        residentName: null,
        residentContact: null,
        visitorName: null,
        visitDate: null,
        arrivalTime: null,
        departureTime: null,
        hasArrived: false,
        hasDeparted: false
      },
      formData: {
        registrationId: this.registrationId || '',
      },
      errorMsg: '',
      isFetchDataLoading: false,
      isSetArrivedDataLoading: false,
      isSetDepartedDataLoading: false,
    };
  },
  computed: {
    visitDateObject() {
      return this.visitor.visitDate ? new Date(this.visitor.visitDate) : null;
    },
    isVisitToday() {
      if (!this.visitDateObject) return false;
      const today = new Date();
      return (
        this.visitDateObject.getFullYear() === today.getFullYear() &&
        this.visitDateObject.getMonth() === today.getMonth() &&
        this.visitDateObject.getDate() === today.getDate()
      );
    }
  },
  watch: {
    registrationId(newVal) {
      if (newVal) {
        this.formData.registrationId = newVal;
        this.fetchData(newVal);
      }
    }
  },
  methods: {
    async fetchData(id) {
      this.isFetchDataLoading = true;
      try {
        const response = await axios.get(
          `${process.env.VUE_APP_API_ENDPOINT}visitor/${id}`
        );
        this.visitor = response.data;
        this.errorMsg = '';
      } catch (error) {
        console.error(error);
        this.visitor = { registrationId: '', visitorName: '', visitDate: '', hasArrived: false };
        this.errorMsg = error.response?.data?.message || 'Error retrieving data';
      } finally {
        this.isFetchDataLoading = false;
      }
    },
    async setVisitorArrived() {
      this.isSetArrivedDataLoading = true;
      const updateData = {
        registrationId: this.registrationId,
        registrationTime: this.registrationTime,
        residentName: this.visitor.residentName,
        residentId: this.visitor.residentId,
        visitorName: this.visitor.visitorName,
        visitDate: this.visitor.visitDate,
        arrivalTime: new Date(),
        departureTime: this.visitor.departureTime,
        hasArrived: true,
        hasDeparted: this.visitor.hasDeparted
      };
      try {
        const apiUrl = `${process.env.VUE_APP_API_ENDPOINT}visitor`;
        const response = await axios.post(apiUrl, updateData);
        console.log('Update successful:', response.data);
        this.visitor = response.data;
        this.errorMsg = '';
      } catch (error) {
        console.log(error);
        this.errorMsg = 'Error updating check-in status';
      } finally {
        this.isSetArrivedDataLoading = false;
      }
    },
    async setVisitorDeparted() {
      this.isSetDepartedDataLoading = true;
      const updateData = {
        registrationId: this.registrationId,
        registrationTime: this.registrationTime,
        residentName: this.visitor.residentName,
        residentId: this.visitor.residentId,
        visitorName: this.visitor.visitorName,
        visitDate: this.visitor.visitDate,
        arrivalTime: this.visitor.arrivalTime,
        departureTime: new Date(),
        hasArrived: this.visitor.hasArrived,
        hasDeparted: true
      };
      try {
        const response = await axios.post(process.env.VUE_APP_API_ENDPOINT, updateData);
        console.log('Update successful:', response.data);
        this.visitor = response.data;
        this.errorMsg = '';
      } catch (error) {
        console.log(error);
        this.errorMsg = 'Error updating check-in status';
      } finally {
        this.isSetDepartedDataLoading = false;
      }
    },

    formatDateAndTime(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };
      const timeOptions = { hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true };
      const formattedDate = date.toLocaleDateString(undefined, dateOptions);
      const formattedTime = date.toLocaleTimeString(undefined, timeOptions);
      return `${formattedDate} at ${formattedTime}`;
    },
    formatTime(dateString) {
      if (!dateString) return '';
      const options = { hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true };
      return new Date(dateString).toLocaleTimeString(undefined, options);
    },
  },
  mounted() {
    if (this.registrationId) {
      this.fetchData(this.registrationId);
    }
  }
};
</script>