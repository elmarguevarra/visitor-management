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

    <div v-if="isLoading" class="alert alert-info mt-3">
      <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
      Verifying visitor...
    </div>
    <div v-else-if="formData.registrationId && !isLoading && isVisitToday" class="alert alert-success mt-3">
      <span v-if="isVisitToday">Verified <strong>{{ visitor.visitorName }}'s</strong> visit today <strong>{{ formatDate(visitor.visitDate) }}</strong>.</span>
    </div>
    <div v-else-if="(formData.registrationId && !isLoading && !isVisitToday && errorMsg === '')" class="alert alert-warning mt-3">
      No visitor registered for today.
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
        visitDate: ''
      },
      formData: {
        registrationId: this.registrationId || '',
      },
      errorMsg: '',
      isLoading: false, // Add loading state
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
      this.isLoading = true; // Set loading to true when fetching starts
      try {
        const response = await axios.get(
          `${process.env.VUE_APP_API_ENDPOINT}${id}`
        );
        this.visitor = response.data;
        this.errorMsg = '';
      } catch (error) {
        console.error(error);
        this.visitor = { registrationId: '', visitorName: '', visitDate: '' };
        this.errorMsg = error.response?.data?.message || 'Error retrieving data';
      } finally {
        this.isLoading = false; // Set loading to false when fetching completes
      }
    },
    // The form submission is disabled as verification happens automatically
    getItemsById() {
      // This function is intentionally left empty as the verification is triggered by the prop
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