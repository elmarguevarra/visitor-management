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
    </div>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'
import {
  postVisitor,
  sendNotification as sendEmailNotification,
} from '@/services/handlerServices'
import { getYearMonthDay, formatDate } from '@/utils'
import { useAuthenticationStore } from '@/stores/authenticationStore'
import { useNotificationsStore } from '@/stores/notificationsStore'

export default {
  name: 'CreateVisitor',
  setup() {
    const authenticationStore = useAuthenticationStore()
    const notificationsStore = useNotificationsStore()

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
    const notifMsg = ref('')
    const isLoading = ref(false)
    const showToast = ref(false)

    const registerVisitor = async () => {
      isLoading.value = true
      try {
        const result = await postVisitor(formData)
        visitor.value = result

        notificationsStore.addNotification(
          `${visitor.value.visitorName} has been registered for visit on ${visitor.value.visitDate} .`,
        )

        try {
          await sendEmailNotification({
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

          notificationsStore.addNotification(
            `Invitation has been sent to ${visitor.value.visitorEmail}.`,
          )
        } catch (error) {
          console.error(error)
          errorMsg.value =
            'Failed to send invitation email. Please share QR code manually.'
          notificationsStore.addNotification(errorMsg.value, 'error')
        }
      } catch (error) {
        console.error(error)
        errorMsg.value = 'Failed to register visitor. Please try again later.'
        notificationsStore.addNotification(errorMsg.value, 'error')
      } finally {
        formData.visitorName = ''
        formData.visitorEmail = ''
        formData.visitDate = today
        formData.purpose = ''
        errorMsg.value = ''

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
      showToast,
      notifMsg,
    }
  },
}
</script>

<style scoped>
.btn-close-sm {
  /* This is a common way to resize the SVG, adjust as needed */
  background-size: 1em 1em;
}
</style>
