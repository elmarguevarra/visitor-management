<template>
  <div class="container mt-2">
    <h4 class="mb-3 text-muted" style="margin-left: -0.2rem">Visitor Access</h4>
    <form @submit.prevent="getItemsById" class="row g-3 mb-3">
      <div class="form-floating mb-1">
        <input
          type="text"
          class="form-control"
          id="registrationId"
          placeholder="registrationId"
          v-model="formData.registrationId"
        />
        <label for="floatingInput">Registration id</label>
      </div>
    </form>

    <div v-if="isFetchDataLoading" class="alert alert-info mt-3">
      <span
        class="spinner-grow spinner-grow-sm me-2"
        role="status"
        aria-hidden="true"
      ></span>
      Verifying visitor...
    </div>
    <div
      v-else-if="visitor.registrationId && !isFetchDataLoading && isVisitToday"
      class="alert alert-success mt-3"
    >
      <span
        ><strong>{{ visitor.visitorName }}</strong> is scheduled to visit
        today.</span
      >
    </div>
    <div
      v-else-if="
        visitor.registrationId &&
        !isFetchDataLoading &&
        !isVisitToday &&
        errorMsg === ''
      "
      class="alert alert-warning mt-3"
    >
      No scheduled visit for today.
    </div>

    <div
      v-if="visitor.registrationId && isVisitToday && !visitor.hasArrived"
      class="col-12"
    >
      <button
        @click="setVisitorArrived"
        class="btn btn-primary"
        :disabled="isSetArrivedDataLoading"
      >
        <span
          v-if="isSetArrivedDataLoading"
          class="spinner-grow spinner-grow-sm me-2"
          role="status"
          aria-hidden="true"
        ></span>
        Check-in
      </button>
    </div>
    <div
      v-if="visitor.hasArrived && !errorMsg"
      class="alert alert-success mt-3"
    >
      Arrived on
      <strong>{{ formatDateAndTime(new Date(visitor.arrivalTime)) }}</strong>
    </div>

    <div
      v-if="
        visitor.registrationId &&
        isVisitToday &&
        visitor.hasArrived &&
        !visitor.hasDeparted
      "
      class="col-12"
    >
      <button
        @click="setVisitorDeparted"
        class="btn btn-secondary"
        :disabled="isSetDepartedDataLoading"
      >
        <span
          v-if="isSetDepartedDataLoading"
          class="spinner-grow spinner-grow-sm me-2"
          role="status"
          aria-hidden="true"
        ></span>
        Check-out
      </button>
    </div>
    <div
      v-if="visitor.hasDeparted && !errorMsg"
      class="alert alert-success mt-3"
    >
      Departed on
      <strong>{{ formatDateAndTime(new Date(visitor.departureTime)) }}</strong>
    </div>

    <h6 class="alert alert-danger mt-4" v-if="errorMsg">{{ errorMsg }}</h6>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import {
  getVisitorByRegistrationId,
  postVisitor,
  sendEmailNotification,
} from '@/services/handlerServices'
import { formatDateAndTime } from '@/utils'
import { useAuthenticationStore } from '@/stores/authenticationStore'

export default {
  name: 'VerifyVisitorView',
  props: {
    registrationId: {
      type: String,
      default: '',
    },
  },
  setup(props) {
    const authenticationStore = useAuthenticationStore()

    const visitor = ref({
      residentId: null,
      residentName: null,
      residentContact: null,
      visitorName: null,
      visitDate: null,
      purpose: null,
      arrivalTime: null,
      departureTime: null,
      hasArrived: false,
      hasDeparted: false,
    })

    const formData = ref({
      registrationId: props.registrationId || '',
    })

    const errorMsg = ref('')
    const isFetchDataLoading = ref(false)
    const isSetArrivedDataLoading = ref(false)
    const isSetDepartedDataLoading = ref(false)

    const visitDateObject = computed(() => {
      return visitor.value.visitDate ? new Date(visitor.value.visitDate) : null
    })

    const isVisitToday = computed(() => {
      if (!visitDateObject.value) return false
      const today = new Date()
      return (
        visitDateObject.value.getFullYear() === today.getFullYear() &&
        visitDateObject.value.getMonth() === today.getMonth() &&
        visitDateObject.value.getDate() === today.getDate()
      )
    })

    const fetchData = async (id) => {
      isFetchDataLoading.value = true
      try {
        const response = await getVisitorByRegistrationId(id)
        visitor.value = response
        errorMsg.value = ''
      } catch (error) {
        console.error(error)
        visitor.value = {
          registrationId: '',
          visitorName: '',
          visitDate: '',
          purpose: '',
          hasArrived: false,
        }
        errorMsg.value =
          error.response?.data?.message || 'Error retrieving data'
      } finally {
        isFetchDataLoading.value = false
      }
    }

    const setVisitorArrived = async () => {
      isSetArrivedDataLoading.value = true
      const updateData = {
        ...visitor.value,
        registrationId: props.registrationId,
        arrivalTime: new Date(),
        hasArrived: true,
      }
      try {
        const response = await postVisitor(updateData)
        console.debug('Update successful:', response.data)
        visitor.value = response
        errorMsg.value = ''
        await sendEmailNotification({
          template: 'VisitorArrivalNotification',
          data: {
            toAddresses: [authenticationStore.userEmail],
            resident_givenName: authenticationStore.userGivenName,
            resident_email: authenticationStore.userEmail,
            visitor_name: visitor.value.visitorName,
            arrival_time: formatDateAndTime(
              new Date(visitor.value.arrivalTime),
            ),
          },
        })
      } catch (error) {
        console.debug(error)
        errorMsg.value = 'Error updating check-in status'
      } finally {
        isSetArrivedDataLoading.value = false
      }
    }

    const setVisitorDeparted = async () => {
      isSetDepartedDataLoading.value = true
      const updateData = {
        ...visitor.value,
        registrationId: props.registrationId,
        departureTime: new Date(),
        hasDeparted: true,
      }
      try {
        const response = await postVisitor(updateData)
        console.debug('Update successful:', response.data)
        visitor.value = response
        errorMsg.value = ''
        await sendEmailNotification({
          template: 'VisitorDepartureNotification',
          data: {
            toAddresses: [authenticationStore.userEmail],
            resident_givenName: authenticationStore.userGivenName,
            resident_email: authenticationStore.userEmail,
            visitor_name: visitor.value.visitorName,
            departure_time: formatDateAndTime(
              new Date(visitor.value.departureTime),
            ),
          },
        })
      } catch (error) {
        console.debug(error)
        errorMsg.value = 'Error updating check-in status'
      } finally {
        isSetDepartedDataLoading.value = false
      }
    }

    onMounted(() => {
      if (props.registrationId) {
        fetchData(props.registrationId)
      }
    })

    return {
      visitor,
      formData,
      errorMsg,
      isFetchDataLoading,
      isSetArrivedDataLoading,
      isSetDepartedDataLoading,
      visitDateObject,
      isVisitToday,
      setVisitorArrived,
      setVisitorDeparted,
      formatDateAndTime,
    }
  },
}
</script>
