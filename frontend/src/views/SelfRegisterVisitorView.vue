<template>
  <div class="container mt-2">
    <h4 class="mb-3 text-muted" style="margin-left: -0.2rem">Self-Register</h4>
    <div>
      <form @submit.prevent="requestVisit" class="row g-3">
        <div class="form-floating mb-1">
          <input
            type="text"
            class="form-control"
            id="visitorName"
            placeholder="Juan Delacruz"
            v-model="formData.visitorName"
            required
            :readonly="visitRequest"
          />
          <label for="floatingInput">Visitor name</label>
        </div>
        <div class="form-floating mb-1">
          <input
            type="text"
            class="form-control"
            id="visitorEmail"
            placeholder="sample@emal.com"
            v-model="formData.visitorEmail"
            required
            :readonly="visitRequest"
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
            :readonly="visitRequest"
          />
          <label for="floatingInput">Purpose</label>
        </div>
        <div class="form-floating mb-1">
          <input
            type="date"
            class="form-control"
            id="visitDate"
            placeholder="visit"
            v-model="formData.visitDate"
            :min="yearMonthDateToday"
            :max="maxCalendarDate"
            required
            :readonly="visitRequest"
          />
          <label for="floatingInput">Visit date</label>
        </div>
        <div class="col-12">
          <button
            v-if="
              !isGetVisitRequestByTokenLoading &&
              !visitRequest &&
              !isGetInviteByTokenLoading
            "
            type="submit"
            class="mb-3 btn btn-primary"
            :disabled="isRequestVisitLoading"
          >
            <span
              v-if="isRequestVisitLoading"
              class="spinner-grow spinner-grow-sm me-2"
              role="status"
              aria-hidden="true"
            ></span>
            Submit
          </button>
        </div>
      </form>
      <div v-if="isGetInviteByTokenLoading" class="alert alert-info mt-3">
        <span
          class="spinner-grow spinner-grow-sm me-2"
          role="status"
          aria-hidden="true"
        ></span>
        Verifying Invitation...
      </div>
      <div
        v-if="
          !isGetVisitRequestByTokenLoading &&
          visitRequest &&
          visitRequest.requestStatus === VISIT_REQUEST_STATUS.PENDING &&
          !isGetInviteByTokenLoading
        "
        class="alert alert-warning mt-3"
      >
        <span
          class="spinner-grow spinner-grow-sm me-2"
          role="status"
          aria-hidden="true"
        ></span>
        Waiting for Approval...
      </div>
      <div v-if="isGetVisitorLoading" aria-hidden="true">
        <div class="card-body">
          <h6 class="card-title placeholder-glow text-center mb-2">
            <span class="placeholder col-4"></span>
          </h6>
          <div class="mb-2 placeholder-box"></div>
          <p class="card-text placeholder-glow text-center mb-0">
            <span class="placeholder col-8"></span>
          </p>
        </div>
      </div>
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
        <p class="mt-0 text-muted text-center small">
          Present this at the gate on the day of your visit.
        </p>
      </div>
      <p
        v-if="
          !errorMsg &&
          invitation &&
          !isGetInviteByTokenLoading &&
          !isGetVisitRequestByTokenLoading &&
          !isGetVisitorLoading &&
          (!visitRequest ||
            visitRequest.requestStatus !== VISIT_REQUEST_STATUS.DECLINED)
        "
        class="mt-2 mb-0 text-muted text-center small fst-italic"
      >
        Expires on
        {{ formatDateAndTime(new Date(invitation.inviteLinkExpiration)) }}.
      </p>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import {
  postVisitRequest,
  postInvite,
  getInviteByToken,
  getVisitRequestByToken,
  getVisitorByRegistrationId,
  sendNotification as sendEmailNotification,
} from '@/services/handlerServices'
import { useVisitRequestStore } from '@/stores/visitRequestStore'
import { getYearMonthDay, formatDate, formatDateAndTime } from '@/utils'
import { VISIT_REQUEST_STATUS } from '@/constants/status'
import { useNotificationsStore } from '@/stores/notificationsStore'
import { useAuthenticationStore } from '@/stores/authenticationStore'

export default {
  name: 'InviteVisitorView',
  props: {
    inviteToken: {
      type: String,
      default: '',
    },
  },
  setup(props) {
    const visitRequestStore = useVisitRequestStore()
    const notificationsStore = useNotificationsStore()
    const authenticationStore = useAuthenticationStore()

    const yearMonthDateToday = getYearMonthDay(new Date())

    const maxCalendarDateObject = new Date(yearMonthDateToday)
    maxCalendarDateObject.setDate(maxCalendarDateObject.getDate() + 7)
    const maxCalendarDate = getYearMonthDay(maxCalendarDateObject)

    const invitation = ref(null)
    const visitRequest = ref(null)
    const visitor = ref(null)
    const residentId = ref(null)

    const formData = ref({
      visitorName: null,
      visitorEmail: null,
      visitDate: yearMonthDateToday,
      purpose: null,
    })

    const errorMsg = ref('')
    const isGetInviteByTokenLoading = ref(false)
    const isGetVisitRequestByTokenLoading = ref(false)
    const isRequestVisitLoading = ref(false)
    const isGetVisitorLoading = ref(false)

    const visitRequests = computed(() => visitRequestStore.visitRequests)

    const requestVisit = async () => {
      isRequestVisitLoading.value = true
      const requestVisitData = {
        residentId: residentId.value,
        inviteToken: props.inviteToken,
        visitorName: formData.value.visitorName,
        visitorEmail: formData.value.visitorEmail,
        visitDate: formData.value.visitDate,
        purpose: formData.value.purpose,
        requestStatus: VISIT_REQUEST_STATUS.PENDING,
      }
      try {
        const response = await postVisitRequest(requestVisitData)
        console.debug(response)
        visitRequest.value = response
        visitRequestStore.addVisitRequest(response)
        await extendInviteLinkExpiration(response)

        notificationsStore.addNotification(
          `Visit request submitted successfully. Please wait for approval.`,
          'success',
        )

        try {
          await sendEmailNotification({
            template: 'VisitRequestNotificationForResident',
            data: {
              resident_givenName: authenticationStore.userGivenName,
              resident_familyName: authenticationStore.userFamilyName,
              resident_email: authenticationStore.userEmail,
              visitor_email: visitRequest.value.visitorEmail,
              visitor_name: visitRequest.value.visitorName,
              visit_date: formatDate(new Date(visitRequest.value.visitDate)),
            },
          })
          notificationsStore.addNotification(
            `Visit request has been sent to resident ${authenticationStore.userGivenName}.`,
            'success',
          )
        } catch (error) {
          console.error(error)
          errorMsg.value =
            'Failed to send visit request email. Please inform the resident directly.'
          notificationsStore.addNotification(errorMsg.value, 'error')
        }
        errorMsg.value = ''
      } catch (error) {
        console.debug(error)
        errorMsg.value = 'Error submitting visit request. Please try again.'
        notificationsStore.addNotification(errorMsg.value, 'error')
      } finally {
        isRequestVisitLoading.value = false
      }
    }

    const getInvite = async () => {
      isGetInviteByTokenLoading.value = true
      try {
        const response = await getInviteByToken(props.inviteToken)
        console.debug('invite:', response.data)
        invitation.value = response
        if (invitation.value && invitation.value.residentId) {
          formData.value.residentId = invitation.value.residentId
          residentId.value = invitation.value.residentId
        }
        errorMsg.value = ''
      } catch (error) {
        console.debug(error)
        errorMsg.value = 'Invite not found or has already expired.'
        notificationsStore.addNotification(errorMsg.value, 'error')
      } finally {
        isGetInviteByTokenLoading.value = false
      }
    }

    const getVisitRequest = async () => {
      isGetVisitRequestByTokenLoading.value = true
      try {
        const response = await getVisitRequestByToken(props.inviteToken)
        console.debug('visitRequest:', response)
        visitRequest.value = response
        if (visitRequest.value) {
          formData.value.visitorName = visitRequest.value.visitorName
          formData.value.visitorEmail = visitRequest.value.visitorEmail
          formData.value.purpose = visitRequest.value.purpose
          formData.value.visitDate = getYearMonthDay(
            new Date(visitRequest.value.visitDate),
          )
          errorMsg.value = ''
          if (
            visitRequest.value.requestStatus === VISIT_REQUEST_STATUS.APPROVED
          ) {
            notificationsStore.addNotification(
              `Visit request has been approved.`,
              'success',
            )
            await getVisitor(visitRequest.value.registrationId)
          } else if (
            visitRequest.value.requestStatus === VISIT_REQUEST_STATUS.DECLINED
          ) {
            notificationsStore.addNotification(
              `Visit request has been declined.`,
              'error',
            )
          }
        }
      } catch (error) {
        console.debug(error)
        errorMsg.value = 'Visit Request not found or has already expired.'
        notificationsStore.addNotification(errorMsg.value, 'error')
      } finally {
        isGetVisitRequestByTokenLoading.value = false
      }
    }

    const getVisitor = async (id) => {
      isGetVisitorLoading.value = true
      try {
        const response = await getVisitorByRegistrationId(id)
        visitor.value = response
        errorMsg.value = ''
      } catch (error) {
        console.error(error)
        errorMsg.value =
          error.response?.data?.message || 'Error retrieving data'
      } finally {
        isGetVisitorLoading.value = false
      }
    }

    const extendInviteLinkExpiration = async (visitRequest) => {
      try {
        const oneDayInMillis = 24 * 60 * 60 * 1000
        const expirationDate = new Date(
          new Date(visitRequest.visitDate).getTime() + oneDayInMillis,
        ).toISOString()
        const inviteData = {
          inviteToken: visitRequest.inviteToken,
          residentId: residentId.value,
          inviteLinkExpiration: expirationDate,
        }
        console.debug(
          'inviteData.inviteLinkExpiration: ',
          inviteData.inviteLinkExpiration,
        )
        const response = await postInvite(inviteData)
        console.debug(response)
        invitation.value = response
      } catch (error) {
        console.debug(error)
        errorMsg.value = 'Error extending expiration of invite link'
      }
    }

    onMounted(() => {
      if (props.inviteToken) {
        getInvite()
        getVisitRequest()
      }
    })

    return {
      invitation,
      visitRequest,
      visitor,
      residentId,
      formData,
      errorMsg,
      isGetInviteByTokenLoading,
      isGetVisitRequestByTokenLoading,
      isRequestVisitLoading,
      isGetVisitorLoading,
      visitRequests,
      requestVisit,
      getInvite,
      getVisitRequest,
      getVisitor,
      extendInviteLinkExpiration,
      formatDate,
      formatDateAndTime,
      yearMonthDateToday,
      maxCalendarDate,
      VISIT_REQUEST_STATUS,
    }
  },
}
</script>

<style scoped>
.placeholder-box {
  width: 150px;
  height: 150px;
  background-color: #f8f9fa; /* Very light gray */
  border: 1px solid #eee;
  border-radius: 5px; /* Optional: slight rounding */
  margin: 0 auto; /* Centers the box horizontally */
}
</style>
