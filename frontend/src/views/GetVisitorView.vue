<template>
  <div class="container mt-4">
    <h2>Get Visitor Details</h2>
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
        <button type="submit" class="btn btn-primary">Get Registration</button>
      </div>
    </form>

    <div v-if="visitor.registrationId" class="card mt-3">
      <div class="card-body">
        <h5 class="card-title">
          Registration ID: {{ visitor.registrationId }}
        </h5>
        <p class="card-text">Visitor Name: {{ visitor.visitorName }}</p>
      </div>
    </div>

    <h3 class="alert alert-danger mt-4" v-if="errorMsg">{{ errorMsg }}</h3>
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
    };
  },
  methods: {
    async getItemsById() {
      const id = this.formData.registrationId;
      if (!id) {
        this.errorMsg = 'Please enter an ID';
        return;
      }
      await this.fetchData(id);
      this.$emit('search', id);
    },

    async fetchData(id) {
      try {
        const response = await axios.get(
          `${process.env.VUE_APP_API_ENDPOINT}${id}`
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