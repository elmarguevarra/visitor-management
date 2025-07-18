<template>
  <div class="container mt-2">
    <h4 class="mb-3 text-muted" style="margin-left: -0.2rem">
      Register a Visitor
    </h4>
    <div>
      <form @submit.prevent="registerVisitor" class="row g-3">
        <div class="form-floating mb-1">
          <input
            type="text"
            class="form-control"
            id="visitorName"
            placeholder="Juan Delacruz"
            v-model="formData.visitorName"
            required
          />
          <label for="floatingInput">Visitor name</label>
        </div>
        <div class="form-floating mb-1">
          <input
            type="email"
            class="form-control"
            id="visitorEmail"
            placeholder="name@example.com"
            v-model="formData.visitorEmail"
            required
          />
          <label for="floatingInput">Visitor email</label>
        </div>
        <div class="form-floating mb-1">
          <input
            type="text"
            class="form-control"
            id="purpose"
            placeholder="visit"
            v-model="formData.purpose"
            required
          />
          <label for="floatingInput">Purpose</label>
        </div>
        <div class="form-floating mb-1">
          <input
            type="date"
            class="form-control"
            id="visitDate"
            v-model="formData.visitDate"
            required
            :min="today"
            :max="maxCalendarDate"
          />
          <label for="floatingInput">Visit date</label>
        </div>
        <div class="col-12">
          <button type="submit" class="btn btn-primary" :disabled="isLoading">
            <span
              v-if="isLoading"
              class="spinner-grow spinner-grow-sm me-2"
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
  </div>
</template>

<script>
import { ref, reactive } from 'vue'
import { postVisitor, sendNotification } from '@/services/handlerServices'
import { getYearMonthDay, formatDate } from '@/utils'
import { useAuthenticationStore } from '@/stores/authenticationStore'

export default {
  name: 'CreateVisitor',
  setup() {
    const authenticationStore = useAuthenticationStore()

    const today = getYearMonthDay(new Date())

    const maxCalendarDateObject = new Date(today)
    maxCalendarDateObject.setDate(maxCalendarDateObject.getDate() + 7)
    const maxCalendarDate = getYearMonthDay(maxCalendarDateObject)

    const formData = reactive({
      residentId: authenticationStore.userEmail,
      visitorName: null,
      visitorEmail: null,
      visitDate: today,
      purpose: null,
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
        formData.visitorEmail = ''
        formData.visitDate = today
        formData.purpose = ''
        errorMsg.value = ''

        await sendNotification({
          template: 'VisitorInviteNotification',
          data: {
            resident_givenName: authenticationStore.userGivenName,
            resident_familyName: authenticationStore.userFamilyName,
            resident_email: visitor.value.residentId,
            visitor_email: visitor.value.visitorEmail,
            visitor_name: visitor.value.visitorName,
            visit_date: formatDate(new Date(visitor.value.visitDate)),
            visit_qrCodeDataURL: visitor.value.qrCodeDataURL,
          },
        })
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
      maxCalendarDate,
      registerVisitor,
      formatDate,
    }
  },
}
</script>

<style scoped>
/* You can add component-specific styles here if needed */
</style>
