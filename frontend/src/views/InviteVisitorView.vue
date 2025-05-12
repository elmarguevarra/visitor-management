<template>
  <div class="container mt-4">
    <h3 class="mb-3">Visitor Invitation</h3>
    <div class="mb-4 border p-3 rounded shadow-sm">
      <form @submit.prevent="generateInviteLink" class="row g-3">
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
          <label for="residentContact" class="form-label"
            >Resident Contact</label
          >
          <input
            type="text"
            class="form-control"
            id="residentContact"
            v-model="formData.residentContact"
            readonly
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
            Generate Link
          </button>
        </div>
      </form>
      <div
        v-if="invitation && invitation.inviteLink"
        class="mt-4 d-flex flex-column align-items-center"
      >
        <p class="mb-1 text-center text-secondary">
          Share this link to register:
        </p>
        <div class="alert alert-info mt-1">
          <div class="d-flex align-items-center flex-wrap">
            <p class="mb-0 me-2 flex-grow-1 text-break small">
              {{ invitation.inviteLink }}
            </p>
            <button
              class="btn btn-outline-secondary btn-sm"
              @click="copyToClipboard(invitation.inviteLink)"
              title="Copy to clipboard"
            >
              Copy
            </button>
          </div>
        </div>
        <p
          v-if="invitation.inviteLinkExpiration"
          class="mt-2 mb-0 text-muted text-center small fst-italic"
        >
          Expires on
          {{ formatDateAndTime(new Date(invitation.inviteLinkExpiration)) }} if
          not used.
        </p>
      </div>

      <h6 class="alert alert-danger mt-4" v-if="errorMsg">{{ errorMsg }}</h6>
    </div>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'
import { postInvite } from '@/services/apiService'
import { useAuthenticationStore } from '@/stores/authenticationStore'
import { formatDateAndTime } from '@/utils'

export default {
  name: 'InviteVisitorView',
  setup() {
    const authenticationStore = useAuthenticationStore()

    const invitation = ref(null)
    const formData = reactive({
      residentId: authenticationStore.userEmail,
      residentName: `${authenticationStore.userGivenName} + ${authenticationStore.userFamilyName}`,
      residentContact: authenticationStore.userPhoneNumber,
    })
    const errorMsg = ref('')
    const isLoading = ref(false)

    const generateInviteLink = async () => {
      isLoading.value = true
      try {
        const inviteData = {
          residentId: formData.residentId,
        }
        const response = await postInvite(inviteData)
        invitation.value = response
      } catch (error) {
        console.error(error)
        errorMsg.value = 'Error generating invite link'
      } finally {
        isLoading.value = false
      }
    }

    const copyToClipboard = async (text) => {
      try {
        await navigator.clipboard.writeText(text)
        alert('Link copied!')
      } catch (err) {
        console.error('Failed to copy text: ', err)
      }
    }

    return {
      formData,
      invitation,
      errorMsg,
      isLoading,
      generateInviteLink,
      copyToClipboard,
      formatDateAndTime,
    }
  },
}
</script>

<style scoped>
/* You can add more subtle styling here if needed */
</style>
