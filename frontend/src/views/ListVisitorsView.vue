<template>
  <div class="container mt-2">
    <h4 class="mb-3" style="margin-left: -0.2rem">My Visitors</h4>
    <div>
      <h6 v-if="visitRequests.length > 0" class="mt-4 text-muted">
        Visit Requests
      </h6>
      <div
        v-for="visitRequest in visitRequests"
        :key="visitRequest.inviteToken"
        class="card border-0 shadow-sm mb-3"
      >
        <div
          class="card-body d-flex justify-content-between align-items-center flex-column flex-md-row"
        >
          <div class="mb-2 mb-md-0">
            <h6 class="card-title mb-1">{{ visitRequest.visitorName }}</h6>
            <p class="card-text text-muted small">
              on {{ formatDate(new Date(visitRequest.visitDate)) }}
            </p>
          </div>
          <div class="d-flex flex-column flex-md-row gap-2">
            <Button
              @click="approveVisitRequest(visitRequest)"
              class="btn btn-primary btn-sm me-2"
              icon="bi bi-check-circle"
              :loading="requestLoadingStates[visitRequest.inviteToken]?.approve"
            >
              Approve
            </Button>
            <Button
              @click="declineVisitRequest(visitRequest)"
              class="btn btn-secondary btn-sm me-2"
              icon="bi bi-x-circle"
              :loading="requestLoadingStates[visitRequest.inviteToken]?.decline"
            >
              Decline
            </Button>
          </div>
        </div>
      </div>

      <p v-if="visitors.length === 0" class="text-muted">No visitors.</p>
      <h6 v-if="todayVisitors.length > 0" class="text-muted">Today</h6>
      <div
        v-for="visitor in todayVisitors"
        :key="visitor.registrationId"
        class="card border-0 shadow-sm mb-3"
      >
        <div class="card-body d-flex flex-column align-items-center">
          <h6
            class="card-title text-center mb-2"
            :class="{ 'text-muted': visitor.hasDeparted }"
          ></h6>
          <img
            :src="visitor.qrCodeDataURL"
            alt="Visitor QR Code"
            width="100"
            height="100"
            class="mb-2 border-0 rounded"
            :class="{ 'opacity-50': visitor.hasDeparted }"
          />
          {{ visitor.visitorName }}

          <p
            class="card-text text-center mb-0"
            :class="{ 'text-muted': visitor.hasDeparted }"
          >
            Registration ID: {{ visitor.registrationId }}
          </p>
        </div>
        <div
          v-if="!visitor.hasArrived"
          class="badge bg-light text-secondary px-3 py-2"
        >
          <i class="bi bi-calendar-event me-1"></i> Scheduled
        </div>
        <div
          v-else-if="visitor.hasArrived && !visitor.hasDeparted"
          class="badge bg-light text-secondary px-3 py-2"
        >
          <i class="bi bi-person-check-fill me-1"></i> Arrived
        </div>
        <div
          v-else-if="visitor.hasDeparted"
          class="badge bg-light text-secondary px-3 py-2"
        >
          <i class="bi bi-door-open me-1"></i> Departed
        </div>
      </div>
      <p
        v-if="todayVisitors.length === 0 && visitors.length > 0"
        class="text-muted"
      >
        No visitors today.
      </p>

      <h6 v-if="upcomingVisitors.length > 0" class="mt-4 text-muted">
        Upcoming
      </h6>
      <div
        v-for="visitor in upcomingVisitors"
        :key="visitor.registrationId"
        class="card border-0 shadow-sm mb-3"
      >
        <div class="card-body d-flex flex-column align-items-center">
          <img
            :src="visitor.qrCodeDataURL"
            alt="Visitor QR Code"
            width="100"
            height="100"
            class="mb-2 border-0 rounded"
          />
          <h7 class="card-title text-center mb-2">
            {{ visitor.visitorName }} on
            {{ formatDate(new Date(visitor.visitDate)) }}
          </h7>
          <p class="card-text text-center mb-0">
            Registration ID: {{ visitor.registrationId }}
          </p>
        </div>
      </div>
      <p
        v-if="upcomingVisitors.length === 0 && visitors.length > 0"
        class="text-muted"
      >
        No upcoming visitors.
      </p>

      <h6 v-if="expiredVisitors.length > 0" class="mt-4 text-muted">Past</h6>
      <div
        v-for="visitor in expiredVisitors"
        :key="visitor.registrationId"
        class="card border-0 shadow-sm mb-3"
      >
        <div class="card-body d-flex flex-column text-muted align-items-center">
          <h6 class="card-title text-center mb-2">
            {{ visitor.visitorName }} on
            {{ formatDate(new Date(visitor.visitDate)) }}
          </h6>
          <p class="card-text text-center mb-0">
            Registration ID: {{ visitor.registrationId }}
          </p>
        </div>
        <div
          v-if="!visitor.hasArrived"
          class="badge bg-light text-secondary px-3 py-2"
        >
          <i class="bi bi-person-check-fill me-1"></i> Arrived
        </div>
        <div
          v-else-if="visitor.hasArrived && !visitor.hasDeparted"
          class="badge bg-light text-secondary px-3 py-2"
        >
          <i class="bi bi-person-check-fill me-1"></i> Arrived
        </div>
        <div
          v-else-if="visitor.hasDeparted"
          class="badge bg-light text-secondary px-3 py-2"
        >
          <i class="bi bi-door-open me-1"></i> Departed
        </div>
      </div>
      <p
        v-if="expiredVisitors.length === 0 && visitors.length > 0"
        class="text-muted"
      >
        No past visitors.
      </p>
    </div>
  </div>
</template>

<script>
import { reactive, ref, computed, onMounted } from 'vue'
import {
  getVisitorsByResidentId,
  getVisitRequestsByResidentId,
  postVisitRequest,
  postVisitor,
} from '@/services/handlerServices'
import { formatDate } from '@/utils'
import { useVisitRequestStore } from '@/stores/visitRequestStore'
import { useVisitorStore } from '@/stores/visitorStore'
import { useAuthenticationStore } from '@/stores/authenticationStore'
import { VISIT_REQUEST_STATUS } from '@/constants/status'
import { useNotificationsStore } from '@/stores/notificationsStore'

import { sendEmailNotification } from '@/services/handlerServices'
import Button from '@/components/Button.vue'
import { useUiStore } from '@/stores/uiStore'

export default {
  name: 'GetResidentVisitors',
  components: {
    Button,
  },
  setup() {
    const errorMsg = ref('')
    const requestLoadingStates = reactive({})
    const requestSubmittedState = reactive({})

    const authenticationStore = useAuthenticationStore()
    const visitRequestStore = useVisitRequestStore()
    const visitorStore = useVisitorStore()
    const notificationsStore = useNotificationsStore()
    const uiStore = useUiStore()

    const visitRequests = computed(() => visitRequestStore.visitRequests)
    const visitors = computed(() => visitorStore.visitors)
    const upcomingVisitors = computed(() => visitorStore.filterUpcoming())
    const todayVisitors = computed(() => visitorStore.filterToday())
    const expiredVisitors = computed(() => visitorStore.filterPast())

    const approveVisitRequest = async (visitRequest) => {
      requestLoadingStates[visitRequest.inviteToken] = { approve: true }
      requestSubmittedState[visitRequest.inviteToken] = true
      try {
        const newVisitorData = {
          residentId: visitRequest.residentId,
          visitorName: visitRequest.visitorName,
          visitorEmail: visitRequest.visitorEmail,
          purpose: visitRequest.purpose,
          visitDate: visitRequest.visitDate,
        }

        const newVisitor = await postVisitor(newVisitorData)

        const requestVisitData = {
          ...visitRequest,
          requestStatus: VISIT_REQUEST_STATUS.APPROVED,
          registrationId: newVisitor.registrationId,
        }

        await postVisitRequest(requestVisitData)

        visitRequestStore.removeVisitRequest(visitRequest.inviteToken)
        visitorStore.addVisitor(newVisitor)

        notificationsStore.addNotification(
          `Approved visit request for ${newVisitor.visitorName} on ${formatDate(new Date(newVisitor.visitDate))}.`,
          'success',
        )

        try {
          await sendEmailNotification({
            template: 'VisitRequestApprovalNotification',
            data: {
              toAddresses: [visitRequest.visitorEmail],
              resident_givenName: authenticationStore.userGivenName,
              resident_familyName: authenticationStore.userFamilyName,
              resident_email: authenticationStore.userEmail,
              visitor_email: visitRequest.visitorEmail,
              visitor_name: visitRequest.visitorName,
              visit_date: formatDate(new Date(visitRequest.visitDate)),
              visit_qrCodeDataURL: newVisitor.qrCodeDataURL,
            },
          })

          notificationsStore.addNotification(
            `Notification has been sent to ${visitRequest.visitorEmail}.`,
            'success',
          )
          errorMsg.value = ''
        } catch (error) {
          console.error(error)
          errorMsg.value =
            'Failed to send invitation email. Please inform the visitor directly.'
          notificationsStore.addNotification(errorMsg.value, 'error')
        }
      } catch (error) {
        console.debug(error)
        errorMsg.value = 'Error approving visit request. Please try again.'
        notificationsStore.addNotification(errorMsg.value, 'error')
        requestSubmittedState[visitRequest.inviteToken] = false
      } finally {
        requestLoadingStates[visitRequest.inviteToken] = { approve: false }
      }
    }

    const declineVisitRequest = async (visitRequest) => {
      requestLoadingStates[visitRequest.inviteToken] = { decline: true }
      requestSubmittedState[visitRequest.inviteToken] = true
      const requestVisitData = {
        ...visitRequest,
        requestStatus: VISIT_REQUEST_STATUS.DECLINED,
      }
      try {
        await postVisitRequest(requestVisitData)

        notificationsStore.addNotification(
          `Declined visit request for ${visitRequest.visitorName}.`,
          'success',
        )

        try {
          await sendEmailNotification({
            template: 'VisitRequestDeclineNotification',
            data: {
              toAddresses: [visitRequest.visitorEmail],
              resident_givenName: authenticationStore.userGivenName,
              resident_familyName: authenticationStore.userFamilyName,
              resident_email: authenticationStore.userEmail,
              visitor_email: visitRequest.visitorEmail,
              visitor_name: visitRequest.visitorName,
              visit_date: formatDate(new Date(visitRequest.visitDate)),
            },
          })

          notificationsStore.addNotification(
            `Notification has been sent to ${visitRequest.visitorEmail}.`,
            'success',
          )

          visitRequestStore.removeVisitRequest(visitRequest.inviteToken)
          errorMsg.value = ''
        } catch (error) {
          console.error(error)
          errorMsg.value =
            'Failed to send invitation email. Please share QR code manually.'
          notificationsStore.addNotification(errorMsg.value, 'error')
        }
      } catch (error) {
        console.debug(error)
        errorMsg.value = 'Error declining visit request. Please try again.'
        notificationsStore.addNotification(errorMsg.value, 'error')
        requestSubmittedState[visitRequest.inviteToken] = false
      } finally {
        requestLoadingStates[visitRequest.inviteToken] = { decline: false }
      }
    }

    const getVisitors = async () => {
      uiStore.isLoading = true
      try {
        const response = await getVisitorsByResidentId(
          authenticationStore.userEmail,
        )
        visitorStore.setVisitors(response)
      } catch (error) {
        console.debug(error)
        errorMsg.value = 'Error retrieving data'
      } finally {
        uiStore.isLoading = false
      }
    }

    const getVisitRequests = async () => {
      try {
        const response = await getVisitRequestsByResidentId(
          authenticationStore.userEmail,
        )
        const pendingVisitRequests = response.filter(
          (v) => v.requestStatus === VISIT_REQUEST_STATUS.PENDING,
        )
        visitRequestStore.setVisitRequests(pendingVisitRequests)
      } catch (error) {
        console.debug(error)
        errorMsg.value = 'Error retrieving data'
      }
    }

    onMounted(async () => {
      try {
        uiStore.isLoading = true
        await Promise.all([getVisitors(), getVisitRequests()])
      } finally {
        uiStore.isLoading = false
      }
    })

    return {
      errorMsg,
      visitRequests,
      visitors,
      upcomingVisitors,
      todayVisitors,
      expiredVisitors,
      approveVisitRequest,
      declineVisitRequest,
      formatDate,
      requestLoadingStates,
      requestSubmittedState,
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
