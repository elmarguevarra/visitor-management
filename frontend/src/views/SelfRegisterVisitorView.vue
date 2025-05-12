<template>
  <div class="container mt-4">
    <h3 class="mb-3" style="margin-left: -0.5rem">Self-Register</h3>
    <div>
      <form
        v-if="
          !errorMsg &&
          !isGetInviteByTokenLoading &&
          !isGetVisitRequestByTokenLoading
        "
        @submit.prevent="requestVisit"
        class="row g-3"
      >
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
              class="spinner-border spinner-border-sm me-2"
              role="status"
              aria-hidden="true"
            ></span>
            Submit
          </button>
        </div>
      </form>
      <div v-if="isGetInviteByTokenLoading" class="alert alert-info mt-3">
        <span
          class="spinner-border spinner-border-sm me-2"
          role="status"
          aria-hidden="true"
        ></span>
        Verifying Invitation...
      </div>
      <div
        v-if="
          !isGetVisitRequestByTokenLoading &&
          visitRequest &&
          visitRequest.requestStatus === 'PENDING' &&
          !isGetInviteByTokenLoading
        "
        class="alert alert-info mt-3"
      >
        <span
          class="spinner-border spinner-border-sm me-2"
          role="status"
          aria-hidden="true"
        ></span>
        Waiting for Approval...
      </div>
      <div
        v-if="
          !isGetVisitRequestByTokenLoading &&
          visitRequest &&
          visitRequest.requestStatus === 'DECLINED' &&
          !isGetInviteByTokenLoading
        "
        class="alert alert-danger mt-3 text-center"
      >
        Request has been declined!
      </div>
      <div
        v-if="
          !isGetVisitRequestByTokenLoading &&
          visitRequest &&
          visitRequest.requestStatus === 'APPROVED' &&
          !isGetInviteByTokenLoading
        "
        class="alert alert-success mt-3 text-center"
      >
        Request has been approved!
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
          (!visitRequest || visitRequest.requestStatus !== 'DECLINED')
        "
        class="mt-2 mb-0 text-muted text-center small fst-italic"
      >
        Expires on
        {{ formatDateAndTime(new Date(invitation.inviteLinkExpiration)) }}.
      </p>
      <h6
        class="alert alert-danger mt-4"
        v-if="
          errorMsg &&
          !isRequestVisitLoading &&
          !isGetInviteByTokenLoading &&
          !isGetVisitRequestByTokenLoading
        "
      >
        {{ errorMsg }}
      </h6>
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
} from '@/services/apiService'
import { useVisitRequestStore } from '@/stores/visitRequestStore'
import { getYearMonthDay, formatDate, formatDateAndTime } from '@/utils'

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
    const yearMonthDateToday = getYearMonthDay(new Date())

    const invitation = ref(null)
    const visitRequest = ref(null)
    const visitor = ref(null)
    const residentId = ref(null)

    const formData = ref({
      visitorName: null,
      visitDate: yearMonthDateToday,
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
        visitDate: formData.value.visitDate,
        requestStatus: 'PENDING',
      }
      try {
        const response = await postVisitRequest(requestVisitData)
        console.log(response)
        visitRequest.value = response
        visitRequestStore.addVisitRequest(response)
        await extendInviteLinkExpiration(response)
        errorMsg.value = ''
      } catch (error) {
        console.log(error)
        errorMsg.value = 'Error posting data'
      } finally {
        isRequestVisitLoading.value = false
      }
    }

    const getInvite = async () => {
      isGetInviteByTokenLoading.value = true
      try {
        const response = await getInviteByToken(props.inviteToken)
        console.log(response.data)
        invitation.value = response
        if (invitation.value && invitation.value.residentId) {
          formData.value.residentId = invitation.value.residentId
          residentId.value = invitation.value.residentId
        }
        errorMsg.value = ''
      } catch (error) {
        console.log(error)
        errorMsg.value = 'Invite not found or has already expired.'
      } finally {
        isGetInviteByTokenLoading.value = false
      }
    }

    const getVisitRequest = async () => {
      isGetVisitRequestByTokenLoading.value = true
      try {
        const response = await getVisitRequestByToken(props.inviteToken)
        console.log(response)
        visitRequest.value = response
        if (visitRequest.value) {
          formData.value.visitorName = visitRequest.value.visitorName
          formData.value.visitDate = getYearMonthDay(
            new Date(visitRequest.value.visitDate),
          )
          errorMsg.value = ''
          if (visitRequest.value.requestStatus === 'APPROVED') {
            await getVisitor(visitRequest.value.registrationId)
          }
        }
      } catch (error) {
        console.log(error)
        errorMsg.value = 'Visit Request not found or has already expired.'
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
        console.log(
          'inviteData.inviteLinkExpiration: ',
          inviteData.inviteLinkExpiration,
        )
        const response = await postInvite(inviteData)
        console.log(response)
        invitation.value = response
      } catch (error) {
        console.log(error)
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
