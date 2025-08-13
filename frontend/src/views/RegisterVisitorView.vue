<template>
  <div class="container mt-2">
    <h4 class="mb-3" style="margin-left: -0.2rem">Register a Visitor</h4>
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
          <Button :loading="isLoading" icon="bi bi-person-plus">
            Register
          </Button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'
import { postVisitor, sendEmailNotification } from '@/services/handlerServices'
import { getYearMonthDay, formatDate } from '@/utils'
import { useAuthenticationStore } from '@/stores/authenticationStore'
import { useNotificationsStore } from '@/stores/notificationsStore'
import Button from '@/components/Button.vue'

export default {
  name: 'CreateVisitor',
  components: {
    Button,
  },
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
          `${visitor.value.visitorName} has been registered for visit on ${formatDate(new Date(visitor.value.visitDate))}.`,
          'success',
        )

        try {
          await sendEmailNotification({
            template: 'VisitorInviteNotification',
            data: {
              toAddresses: [visitor.value.visitorEmail],
              resident_givenName: authenticationStore.userGivenName,
              resident_familyName: authenticationStore.userFamilyName,
              resident_email: authenticationStore.userEmail,
              visitor_email: visitor.value.visitorEmail,
              visitor_name: visitor.value.visitorName,
              visit_date: formatDate(new Date(visitor.value.visitDate)),
              visit_qrCodeDataURL: visitor.value.qrCodeDataURL,
            },
          })

          notificationsStore.addNotification(
            `Invitation has been sent to ${visitor.value.visitorEmail}.`,
            'success',
          )
        } catch (error) {
          console.error(error)
          errorMsg.value =
            'Failed to send invitation email. Please inform the visitor directly.'
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
.form-floating > .form-control {
  border-radius: 12px;
  background-color: #f9fafb;
  border: 1px solid #d1d5db;
  padding: 1rem 0.75rem;
  box-shadow: none;
  transition: all 0.2s ease;
}

.form-floating > .form-control:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.15);
  background-color: white;
}

.form-floating > label {
  padding-left: 0.75rem;
  color: #6b7280;
  transition: all 0.2s ease;
}

.form-floating > .form-control:focus + label {
  color: #2563eb;
}
</style>
