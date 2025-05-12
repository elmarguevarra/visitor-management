<template>
  <div>
    <form @submit.prevent="registerVisitor" class="row g-3">
      <div class="col-md-6">
        <label for="residentId" class="form-label">Resident Email</label>
        <input
          type="text"
          class="form-control"
          id="residentId"
          v-model="formData.residentId"
          readonly
        />
      </div>
      <div class="col-md-6">
        <label for="residentName" class="form-label">Resident Name</label>
        <input
          type="text"
          class="form-control"
          id="residentName"
          v-model="formData.residentName"
          readonly
        />
      </div>
      <div class="col-md-6">
        <label for="residentContact" class="form-label">Resident Contact</label>
        <input
          type="text"
          class="form-control"
          id="residentContact"
          v-model="formData.residentContact"
          readonly
        />
      </div>
      <div class="col-md-6">
        <label for="visitorName" class="form-label">Visitor Name</label>
        <input
          type="text"
          class="form-control"
          id="visitorName"
          v-model="formData.visitorName"
          required
        />
      </div>
      <div class="col-md-6">
        <label for="visitDate" class="form-label">Visit Date</label>
        <input
          type="date"
          class="form-control"
          id="visitDate"
          v-model="formData.visitDate"
          required
          :min="today"
        />
      </div>
      <div class="col-12">
        <button type="submit" class="btn btn-primary" :disabled="isLoading">
          <span
            v-if="isLoading"
            class="spinner-border spinner-border-sm me-2"
            role="status"
            aria-hidden="true"
          ></span>
          Register
        </button>
      </div>
    </form>

    <div
      v-if="visitor && visitor.qrCodeDataURL"
      class="mt-4 d-flex flex-column align-items-center"
    >
      <p class="mt-2 mb-2 text-center">{{ visitor.visitorName }}</p>
      <img
        :src="visitor.qrCodeDataURL"
        alt="Visitor QR Code"
        width="150"
        height="150"
        class="img-thumbnail mb-2"
      />
      <p class="mt-2 mb-0 text-center">
        Registration ID: {{ visitor.registrationId }}
      </p>
      <h6 class="alert alert-success mt-3">
        Registered for visit on
        <strong>{{ formatDate(new Date(visitor.visitDate)) }}</strong>
      </h6>
    </div>

    <h6 class="alert alert-danger mt-4" v-if="errorMsg">{{ errorMsg }}</h6>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'
import { postVisitor } from '@/services/apiService'
import { getYearMonthDay, formatDate } from '@/utils'
import { useAuthenticationStore } from '@/stores/authenticationStore'

export default {
  name: 'CreateVisitor',
  setup() {
    const authenticationStore = useAuthenticationStore()

    const today = getYearMonthDay(new Date())

    const formData = reactive({
      residentId: authenticationStore.userEmail,
      residentName: 'Jua Delacruz',
      residentContact: '+6309123456',
      visitorName: null,
      visitDate: today,
      arrivalTime: null,
      departureTime: null,
      hasArrived: false,
      hasDeparted: false,
    })

    const visitor = ref(null)
    const errorMsg = ref('')
    const isLoading = ref(false)

    const registerVisitor = async () => {
      isLoading.value = true
      try {
        const result = await postVisitor(formData)
        visitor.value = result
        formData.visitorName = ''
        formData.visitDate = today
        errorMsg.value = ''
      } catch (error) {
        console.error(error)
        errorMsg.value = 'Error posting data'
      } finally {
        isLoading.value = false
      }
    }

    return {
      formData,
      visitor,
      errorMsg,
      isLoading,
      today,
      registerVisitor,
      formatDate,
    }
  },
}
</script>
