<template>
  <div class="container mt-2">
    <h4 class="mb-3" style="margin-left: -0.2rem">My Visitors</h4>

    <template v-if="visitRequests.length > 0">
      <h6 class="sticky-header mt-4 mb-2 text-muted">Visit Requests</h6>
      <div
        v-for="visitRequest in visitRequests"
        :key="visitRequest.inviteToken"
        class="visitor-card shadow-sm mb-3"
      >
        <div
          class="card-content d-flex justify-content-between align-items-center"
        >
          <div class="d-flex align-items-center">
            <i class="bi bi-person-circle fs-3 me-3 text-primary"></i>
            <div>
              <h6 class="card-title mb-0">
                {{ visitRequest.visitorName }}
              </h6>
              <p class="card-text text-muted small mb-0">
                on {{ formatDate(new Date(visitRequest.visitDate)) }}
              </p>
            </div>
          </div>
          <div class="d-flex flex-column flex-md-row gap-2">
            <Button
              @click="approveVisitRequest(visitRequest)"
              class="btn btn-primary btn-xs"
              :loading="requestLoadingStates[visitRequest.inviteToken]?.approve"
              >Approve
            </Button>
            <Button
              @click="declineVisitRequest(visitRequest)"
              class="btn btn-secondary btn-xs"
              :loading="requestLoadingStates[visitRequest.inviteToken]?.decline"
              >Decline
            </Button>
          </div>
        </div>
      </div>
    </template>
    <p v-else-if="allVisitors.length > 0" class="text-muted">
      No pending visit requests.
    </p>

    <template v-if="allVisitors.length > 0">
      <h6 class="sticky-header mt-4 mb-2 text-muted">Visitors</h6>
      <div
        v-for="visitor in allVisitors"
        :key="visitor.registrationId"
        class="visitor-card shadow-sm mb-3 position-relative"
        :class="{ 'visitor-card-past': isPastVisitor(visitor) }"
      >
        <span
          class="status-badge position-absolute top-0 end-0 mt-2 me-2"
          :class="getVisitorStatusClass(visitor)"
        >
          <i class="bi" :class="getVisitorStatusIcon(visitor)"></i>
        </span>

        <div class="card-content d-flex align-items-center">
          <img
            :src="visitor.qrCodeDataURL"
            alt="Visitor QR Code"
            class="visitor-qr me-3"
          />
          <div class="flex-grow-1">
            <h6 class="card-title mb-0">
              {{ visitor.visitorName }}
            </h6>
            <p class="card-text text-muted small mb-0">
              {{ formatDate(new Date(visitor.visitDate)) }}
            </p>
          </div>
        </div>
      </div>
    </template>
    <p v-else-if="visitRequests.length === 0" class="text-muted">
      No visitors.
    </p>
  </div>
</template>

<script>
import { reactive, ref, computed, onMounted } from 'vue'
import {
  getVisitorsByResidentId,
  getVisitRequestsByResidentId,
  postVisitRequest,
  postVisitor,
  sendEmailNotification,
} from '@/services/handlerServices'
import { formatDate } from '@/utils'
import { useVisitRequestStore } from '@/stores/visitRequestStore'
import { useVisitorStore } from '@/stores/visitorStore'
import { useAuthenticationStore } from '@/stores/authenticationStore'
import { VISIT_REQUEST_STATUS } from '@/constants/status'
import { useNotificationsStore } from '@/stores/notificationsStore'
import { useUiStore } from '@/stores/uiStore'
import Button from '@/components/Button.vue'

export default {
  name: 'GetResidentVisitors',
  components: {
    Button,
  },
  setup() {
    const errorMsg = ref('')
    const requestLoadingStates = reactive({})

    const authenticationStore = useAuthenticationStore()
    const visitRequestStore = useVisitRequestStore()
    const visitorStore = useVisitorStore()
    const notificationsStore = useNotificationsStore()
    const uiStore = useUiStore()

    const visitRequests = computed(() => visitRequestStore.visitRequests)

    const allVisitors = computed(() => {
      return [
        ...visitorStore.filterToday(),
        ...visitorStore.filterUpcoming(),
        ...visitorStore.filterPast(),
      ]
    })

    const isPastVisitor = (visitor) => {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const visitDate = new Date(visitor.visitDate)
      visitDate.setHours(0, 0, 0, 0)
      return visitDate < today
    }

    const getVisitorStatusClass = (visitor) => {
      if (visitor.hasDeparted) return 'departed-status'
      if (visitor.hasArrived) return 'arrived-status'
      return 'upcoming-status'
    }

    const getVisitorStatusIcon = (visitor) => {
      if (visitor.hasDeparted) return 'bi-door-open'
      if (visitor.hasArrived) return 'bi-person-check'
      return 'bi-calendar-event'
    }

    const approveVisitRequest = async (visitRequest) => {
      requestLoadingStates[visitRequest.inviteToken] = { approve: true }
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
          `Approved visit request for ${newVisitor.visitorName}.`,
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
            `Notification sent to ${visitRequest.visitorEmail}.`,
            'success',
          )
        } catch (error) {
          notificationsStore.addNotification(
            'Failed to send email. Inform the visitor directly.',
            'error',
          )
        }
      } catch (error) {
        notificationsStore.addNotification(
          'Error approving visit request. Please try again.',
          'error',
        )
      } finally {
        requestLoadingStates[visitRequest.inviteToken] = { approve: false }
      }
    }

    const declineVisitRequest = async (visitRequest) => {
      requestLoadingStates[visitRequest.inviteToken] = { decline: true }
      try {
        const requestVisitData = {
          ...visitRequest,
          requestStatus: VISIT_REQUEST_STATUS.DECLINED,
        }
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
            `Notification sent to ${visitRequest.visitorEmail}.`,
            'success',
          )
          visitRequestStore.removeVisitRequest(visitRequest.inviteToken)
        } catch (error) {
          notificationsStore.addNotification(
            'Failed to send email. Please inform the visitor directly.',
            'error',
          )
        }
      } catch (error) {
        notificationsStore.addNotification(
          'Error declining visit request. Please try again.',
          'error',
        )
      } finally {
        requestLoadingStates[visitRequest.inviteToken] = { decline: false }
      }
    }

    onMounted(async () => {
      uiStore.isLoading = true
      try {
        const [visitorsResponse, requestsResponse] = await Promise.all([
          getVisitorsByResidentId(authenticationStore.userEmail),
          getVisitRequestsByResidentId(authenticationStore.userEmail),
        ])
        visitorStore.setVisitors(visitorsResponse)
        const pendingRequests = requestsResponse.filter(
          (v) => v.requestStatus === VISIT_REQUEST_STATUS.PENDING,
        )
        visitRequestStore.setVisitRequests(pendingRequests)
      } catch (error) {
        console.error('Error fetching data:', error)
        notificationsStore.addNotification(
          'Failed to load visitor data.',
          'error',
        )
      } finally {
        uiStore.isLoading = false
      }
    })

    return {
      errorMsg,
      visitRequests,
      allVisitors,
      approveVisitRequest,
      declineVisitRequest,
      formatDate,
      requestLoadingStates,
      getVisitorStatusClass,
      getVisitorStatusIcon,
      isPastVisitor,
    }
  },
}
</script>

<style scoped>
/* Unified Card Style */
.visitor-card {
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  padding: 1rem;
  background-color: #fff;
  transition: all 0.2s ease-in-out;
  cursor: pointer;
}

.visitor-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.visitor-card-past {
  filter: grayscale(100%);
  opacity: 0.5;
}

.card-content {
  display: flex;
  align-items: center;
  width: 100%;
}

.visitor-qr {
  width: 50px;
  height: 50px;
  border-radius: 8px;
  object-fit: cover;
}

/* Custom extra-small button class */
.btn-xs {
  padding: 4px 10px;
  font-size: 0.75rem;
}

/* Updated badge style for icon-only display */
.status-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  padding: 0;
  border-radius: 50%;
  font-size: 0.8rem;
  font-weight: 600;
  white-space: nowrap;
}

/* Color for upcoming/scheduled */
.status-badge.upcoming-status {
  background-color: #e0f2fe; /* Light blue */
  color: #0b68a8; /* Dark blue text */
}

/* Updated color for arrived */
.status-badge.arrived-status {
  background-color: #1a73e8; /* A vibrant, deep blue */
  color: #fff; /* White text for contrast */
}

/* Color for departed/past (inactive/completed state) */
.status-badge.departed-status,
.status-badge.past-status {
  background-color: #f3f4f6; /* A clean, light gray */
  color: #6b7280; /* Gray text */
}
</style>
