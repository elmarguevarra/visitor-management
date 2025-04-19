<template>
  <div class="container mt-4">
    <h3>Get visitor details</h3>
    <form @submit.prevent="getItemsById" class="row g-3 mb-4">
      <div class="col-md-6">
        <label for="registrationId" class="form-label">Registration ID</label>
        <input
          type="text"
          class="form-control"
          id="registrationId"
          v-model="formData.registrationId"
          required
        />
      </div>
      <div class="col-12">
        <button type="submit" class="btn btn-primary" :disabled="isLoading">
          <span v-if="isLoading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
          Get registration
        </button>
      </div>
    </form>

    <div v-if="searchPerformed && visitor.registrationId && !isLoading" class="card mt-3">
      <div class="card-body">
        <h5 class="card-title">
          Registration ID: {{ visitor.registrationId }}
        </h5>
        <p class="card-text">Visitor Name: {{ visitor.visitorName }} on {{ visitor.visitDate }}</p>
      </div>
    </div>
    <div v-else-if="searchPerformed && !visitor.registrationId && !isLoading" class="alert alert-warning mt-3">
      No registration found.
    </div>

    <h6 class="alert alert-danger mt-4" v-if="errorMsg">{{ errorMsg }}</h6>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'GetVisitorView',
  data() {
    return {
      visitor: {
        registrationId: '',
        visitorName: '',
      },
      formData: {
        registrationId: '',
      },
      errorMsg: '',
      isLoading: false,
      searchPerformed: false
    };
  },
  methods: {
    async getItemsById() {
      this.isLoading = true;
      this.searchPerformed = true; 
      const id = this.formData.registrationId;
      if (!id) {
        this.errorMsg = 'Please enter an ID';
        this.isLoading = false; // Reset loading state
        return;
      }
      await this.fetchData(id);
      this.$emit('search', id);
      this.isLoading = false; // Reset loading state after fetching
    },

    async fetchData(id) {
      try {
        const response = await axios.get(
          `${process.env.VUE_APP_API_ENDPOINT}visitor/${id}`
        );
        this.visitor = response.data;
        this.errorMsg = '';
      } catch (error) {
        console.error(error);
        this.visitor = { registrationId: '', visitorName: '' };
        this.errorMsg = error.response?.data?.message || 'Error retrieving data';
      }
    },
  },
};
</script>