<template>
  <div class="container mt-4">
    <h3>Verify Visitor</h3>
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
      <span><strong>{{ visitor.visitorName }}</strong> is verified to visit today, <strong>{{ formatDate(visitor.visitDate) }}</strong>.</span>
    </div>
    <div v-else-if="(visitor.registrationId && !isFetchDataLoading && !isVisitToday && errorMsg === '')" class="alert alert-warning mt-3">
      No matching registration found for today.
    </div>

    <div v-if="visitor.registrationId && isVisitToday && !visitor.hasArrived" class="col-12">
      <button @click="setVisitorArrived" class="btn btn-primary" :disabled="isUpdateDataLoading">
        <span v-if="isUpdateDataLoading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
        Check-in
      </button>
    </div>

    <div v-if="visitor.hasArrived && !errorMsg" class="alert alert-success mt-3">
      Visitor has been successfully checked in!
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
        registrationId: '',
        visitorName: '',
        visitDate: '',
        arrivalTime: null,
        hasArrived: false
      },
      formData: {
        registrationId: this.registrationId || '',
      },
      errorMsg: '',
      isFetchDataLoading: false,
      isUpdateDataLoading: false,
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
      this.isUpdateDataLoading = true;
      const updateData = {
        registrationId: this.registrationId,
        hasArrived: true
      };
      try {
        const response = await axios.put(process.env.VUE_APP_API_ENDPOINT, updateData);
        console.log('Update successful:', response.data);
        this.visitor.hasArrived = true;
        this.errorMsg = '';
      } catch (error) {
        console.log(error);
        this.errorMsg = 'Error updating check-in status';
      } finally {
        this.isUpdateDataLoading = false;
      }
    },
    formatDate(dateString) {
      if (!dateString) return '';
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    },
  },
  mounted() {
    if (this.registrationId) {
      this.fetchData(this.registrationId);
    }
  }
};
</script>