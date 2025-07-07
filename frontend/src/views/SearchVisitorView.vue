<template>
  <div class="container mt-2">
    <h4 class="mb-3 text-muted" style="margin-left: -0.2rem">
      Search a Visitor
    </h4>
    <form @submit.prevent="getVisitor" class="row g-3 mb-4">
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
          <span
            v-if="isLoading"
            class="spinner-grow spinner-grow-sm me-2"
            role="status"
            aria-hidden="true"
          ></span>
          Get registration
        </button>
      </div>
    </form>

    <div
      v-if="searchPerformed && visitor.registrationId && !isLoading"
      class="card mt-3"
    >
      <div class="card-body">
        <h5 class="card-title">
          Registration ID: {{ visitor.registrationId }}
        </h5>
        <p class="card-text mb-0">Name: {{ visitor.visitorName }}</p>
        <p class="card-text mb-0">Purpose: {{ visitor.purpose }}</p>

        <p v-if="visitor.hasArrived" class="card-text mb-0">
          Arrived on {{ formatDateAndTime(new Date(visitor.arrivalTime)) }}
        </p>
        <p v-else-if="!visitor.hasArrived" class="card-text mb-0">
          Scheduled on {{ formatDate(new Date(visitor.visitDate)) }}
        </p>
        <p v-if="visitor.hasDeparted" class="card-text mb-0">
          Departed on {{ formatDateAndTime(new Date(visitor.departureTime)) }}
        </p>
      </div>
    </div>
    <div
      v-else-if="searchPerformed && !visitor.registrationId && !isLoading"
      class="alert alert-warning mt-3"
    >
      No registration found.
    </div>

    <h6 class="alert alert-danger mt-4" v-if="errorMsg">{{ errorMsg }}</h6>
  </div>
</template>

<script>
import { getVisitorByRegistrationId } from '@/services/handlerServices'
import { formatDate, formatDateAndTime } from '@/utils'

export default {
  name: 'SearchVisitorView',
  data() {
    return {
      visitor: {
        registrationId: '',
        visitorName: '',
        purpose: '',
      },
      formData: {
        registrationId: '',
      },
      errorMsg: '',
      isLoading: false,
      searchPerformed: false,
    }
  },
  methods: {
    async getVisitor() {
      this.isLoading = true
      this.searchPerformed = true
      const id = this.formData.registrationId
      if (!id) {
        this.errorMsg = 'Please enter an ID'
        this.isLoading = false
        return
      }
      await this.fetchData(id)
      this.$emit('search', id)
      this.isLoading = false
    },

    async fetchData(id) {
      try {
        const response = await getVisitorByRegistrationId(id)
        console.log('response: ', response)
        this.visitor = response
        this.errorMsg = ''
      } catch (error) {
        console.error(error)
        this.visitor = { registrationId: '', visitorName: '', purpose: '' }
        this.errorMsg = error.response?.data?.message || 'Error retrieving data'
      }
    },
    formatDate,
    formatDateAndTime,
  },
}
</script>
