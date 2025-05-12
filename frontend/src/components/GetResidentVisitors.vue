<template>
  <div>
    <p class="card-text placeholder-glow">
      <span v-if="isGetVisitorsLoading" class="placeholder col-5"></span>
    </p>
    <div v-if="isGetVisitorsLoading" class="card" aria-hidden="true">
      <div class="card-body">
        <h6 class="card-title placeholder-glow text-center mb-2">
          <span class="placeholder col-4"></span>
        </h6>
        <div class="mb-2 placeholder-box"></div>
        <p class="card-text placeholder-glow text-center mb-0">
          <span class="placeholder col-8"></span>
        </p>
      </div>
      <div class="card-footer text-muted text-center small">
        <span class="placeholder col-3"></span>
      </div>
    </div>

    <h5 v-if="visitRequests.length > 0" class="mt-4 text-muted">
      Visit Requests
    </h5>
    <div
      v-for="visitRequest in visitRequests"
      :key="visitRequest.inviteToken"
      class="card mb-3"
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
          <button
            @click="approveVisitRequest(visitRequest)"
            class="btn btn-sm btn-primary"
            :disabled="
              requestLoadingStates[visitRequest.inviteToken]?.approve ||
              requestSubmittedState[visitRequest.inviteToken]
            "
          >
            <span
              v-if="requestLoadingStates[visitRequest.inviteToken]?.approve"
              class="spinner-border spinner-border-sm me-2"
              role="status"
              aria-hidden="true"
            >
            </span>
            Approve
          </button>
          <button
            @click="declineVisitRequest(visitRequest)"
            class="btn btn-sm btn-secondary"
            :disabled="
              requestLoadingStates[visitRequest.inviteToken]?.decline ||
              requestSubmittedState[visitRequest.inviteToken]
            "
          >
            <span
              v-if="requestLoadingStates[visitRequest.inviteToken]?.decline"
              class="spinner-border spinner-border-sm me-2"
              role="status"
              aria-hidden="true"
            >
            </span>
            Decline
          </button>
        </div>
      </div>
    </div>

    <p v-if="visitors.length === 0" class="text-muted">No visitors</p>
    <h5 v-if="todayVisitors.length > 0" class="text-muted">Today's</h5>
    <div
      v-for="visitor in todayVisitors"
      :key="visitor.registrationId"
      class="card mb-3"
    >
      <div class="card-body d-flex flex-column align-items-center">
        <h6
          class="card-title text-center mb-2"
          :class="{ 'text-muted': visitor.hasDeparted }"
        >
          {{ visitor.visitorName }}
        </h6>
        <img
          :src="visitor.qrCodeDataURL"
          alt="Visitor QR Code"
          width="150"
          height="150"
          class="img-thumbnail mb-2"
          :class="{ 'opacity-50': visitor.hasDeparted }"
        />
        <p
          class="card-text text-center mb-0"
          :class="{ 'text-muted': visitor.hasDeparted }"
        >
          Registration ID: {{ visitor.registrationId }}
        </p>
      </div>
      <div
        v-if="!visitor.hasArrived"
        class="card-footer text-muted text-center small"
      >
        Scheduled
      </div>
      <div
        v-else-if="visitor.hasArrived && !visitor.hasDeparted"
        class="card-footer text-secondary text-center small"
        style="background-color: #e2e3e5"
      >
        Arrived
      </div>
      <div
        v-else-if="visitor.hasDeparted"
        class="card-footer text-muted text-center small"
      >
        Departed
      </div>
    </div>
    <p
      v-if="todayVisitors.length === 0 && visitors.length > 0"
      class="text-muted"
    >
      No visitors today.
    </p>

    <h5 v-if="upcomingVisitors.length > 0" class="mt-4 text-muted">Upcoming</h5>
    <div
      v-for="visitor in upcomingVisitors"
      :key="visitor.registrationId"
      class="card mb-3"
    >
      <div class="card-body d-flex flex-column align-items-center">
        <h6 class="card-title text-center mb-2">
          {{ visitor.visitorName }} on
          {{ formatDate(new Date(visitor.visitDate)) }}
        </h6>
        <img
          :src="visitor.qrCodeDataURL"
          alt="Visitor QR Code"
          width="150"
          height="150"
          class="img-thumbnail mb-2"
        />
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

    <h5 v-if="expiredVisitors.length > 0" class="mt-4 text-muted">Past</h5>
    <div
      v-for="visitor in expiredVisitors"
      :key="visitor.registrationId"
      class="card mb-3"
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
        class="card-footer text-muted text-center small"
      >
        Scheduled
      </div>
      <div
        v-else-if="visitor.hasArrived && !visitor.hasDeparted"
        class="card-footer text-muted text-center small"
      >
        Arrived
      </div>
      <div
        v-else-if="visitor.hasDeparted"
        class="card-footer text-muted text-center small"
      >
        Departed
      </div>
    </div>
    <p
      v-if="expiredVisitors.length === 0 && visitors.length > 0"
      class="text-muted"
    >
      No past visitors.
    </p>

    <h6 class="alert alert-danger mt-4" v-if="errorMsg">{{ errorMsg }}</h6>
  </div>
</template>

<script>
import { reactive, ref, computed, onMounted } from 'vue'
import {
  getVisitorsByResidentId,
  getVisitRequestsByResidentId,
  postVisitRequest,
  postVisitor,
} from '@/services/apiService'
import { formatDate } from '@/utils'
import { useVisitRequestStore } from '@/stores/visitRequestStore'
import { useVisitorStore } from '@/stores/visitorStore'
import { useAuthenticationStore } from '@/stores/authenticationStore'

export default {
  name: 'GetResidentVisitors',
  setup() {
    const errorMsg = ref('')
    const isGetVisitorsLoading = ref(false)
    const requestLoadingStates = reactive({})
    const requestSubmittedState = reactive({})

    const authenticationStore = useAuthenticationStore()
    const visitRequestStore = useVisitRequestStore()
    const visitorStore = useVisitorStore()

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
          visitDate: visitRequest.visitDate,
        }

        const newVisitor = await postVisitor(newVisitorData)

        const requestVisitData = {
          ...visitRequest,
          requestStatus: 'APPROVED',
          registrationId: newVisitor.registrationId,
        }

        await postVisitRequest(requestVisitData)

        visitRequestStore.removeVisitRequest(visitRequest.inviteToken)
        visitorStore.addVisitor(newVisitor)

        errorMsg.value = ''
      } catch (error) {
        console.log(error)
        errorMsg.value = 'Error posting data'
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
        requestStatus: 'DECLINED',
      }
      try {
        await postVisitRequest(requestVisitData)

        visitRequestStore.removeVisitRequest(visitRequest.inviteToken)

        errorMsg.value = ''
      } catch (error) {
        console.log(error)
        errorMsg.value = 'Error posting data'
        requestSubmittedState[visitRequest.inviteToken] = false
      } finally {
        requestLoadingStates[visitRequest.inviteToken] = { decline: false }
      }
    }

    const getVisitors = async () => {
      isGetVisitorsLoading.value = true
      try {
        const response = await getVisitorsByResidentId(
          authenticationStore.userEmail,
        )
        visitorStore.setVisitors(response)
      } catch (error) {
        console.log(error)
        errorMsg.value = 'Error retrieving data'
      } finally {
        isGetVisitorsLoading.value = false
      }
    }

    const getVisitRequests = async () => {
      try {
        const response = await getVisitRequestsByResidentId(
          authenticationStore.userEmail,
        )
        const pendingVisitRequests = response.filter(
          (v) => v.requestStatus === 'PENDING',
        )
        console.log('pendingVisitRequests: ', pendingVisitRequests)

        visitRequestStore.setVisitRequests(pendingVisitRequests)
      } catch (error) {
        console.log(error)
        errorMsg.value = 'Error retrieving data'
      }
    }

    onMounted(() => {
      getVisitors()
      getVisitRequests()
    })

    return {
      errorMsg,
      isGetVisitorsLoading,
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
