<template>
  <div class="container mt-2">
    <h4 class="mb-3 text-muted" style="margin-left: -0.2rem">
      Invite a Visitor
    </h4>
    <div>
      <form @submit.prevent="generateInviteLink" class="row g-3">
        <div class="col-12">
          <button type="submit" class="btn btn-primary" :disabled="isLoading">
            <span
              v-if="isLoading"
              class="spinner-grow spinner-grow-sm me-2"
              role="status"
              aria-hidden="true"
            ></span>
            Generate Link
          </button>
        </div>
      </form>
      <form @submit.prevent="sendInviteEmail" class="row g-3">
        <div
          v-if="invitation && invitation.inviteLink"
          class="mt-4 d-flex flex-column align-items-center"
        >
          <p class="mb-1 text-center text-secondary">
            Share this link to register:
          </p>
          <div class="alert alert-success mt-1">
            <div class="d-flex align-items-center">
              <div
                class="border rounded px-2 py-1 bg-white small text-truncate flex-grow-1 me-2"
                style="max-width: 250px"
                :title="invitation.inviteLink"
              >
                {{ invitation.inviteLink }}
              </div>
              <button
                class="btn btn-outline-secondary btn-sm"
                @click="copyToClipboard(invitation.inviteLink)"
                title="Copy to clipboard"
              >
                <i class="bi bi-clipboard"></i>
              </button>
            </div>
            <div class="input-group mt-2">
              <input
                type="email"
                class="form-control"
                required
                v-model="emailAddressToSend"
                placeholder="Enter email to send invite"
              />
              <button class="btn btn-outline-secondary btn-sm" type="submit">
                <i class="bi bi-envelope"></i>
              </button>
            </div>
          </div>
          <p
            v-if="invitation.inviteLinkExpiration"
            class="mt-2 mb-0 text-muted text-center small fst-italic"
          >
            Expires on
            {{ formatDateAndTime(new Date(invitation.inviteLinkExpiration)) }}
            if not used.
          </p>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { postInvite, sendEmailNotification } from '@/services/handlerServices'
import { useAuthenticationStore } from '@/stores/authenticationStore'
import { formatDateAndTime } from '@/utils'
import { useNotificationsStore } from '@/stores/notificationsStore'
import 'bootstrap-icons/font/bootstrap-icons.css'

export default {
  name: 'InviteVisitorView',
  setup() {
    const authenticationStore = useAuthenticationStore()
    const notificationsStore = useNotificationsStore()

    const invitation = ref(null)
    const emailAddressToSend = ref('')
    const errorMsg = ref('')
    const isLoading = ref(false)

    const generateInviteLink = async () => {
      isLoading.value = true
      try {
        const inviteData = {
          residentId: authenticationStore.userEmail,
        }
        const response = await postInvite(inviteData)
        invitation.value = response
      } catch (error) {
        console.error(error)
        errorMsg.value = 'Failed to generate invite link. Please try again.'
        notificationsStore.addNotification(errorMsg.value, 'error')
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

    const sendInviteEmail = async () => {
      if (!emailAddressToSend.value || !invitation.value?.inviteLink) return
      try {
        await sendEmailNotification({
          template: 'VisitorInviteSelfRegisterNotification',
          data: {
            toAddresses: [emailAddressToSend.value],
            self_register_link: invitation.value.inviteLink,
            resident_givenName: authenticationStore.userGivenName,
            resident_familyName: authenticationStore.userFamilyName,
            resident_email: authenticationStore.userEmail,
          },
        })
        notificationsStore.addNotification(
          `Invitation sent to ${emailAddressToSend.value}.`,
          'success',
        )
        emailAddressToSend.value = ''
      } catch (error) {
        notificationsStore.addNotification(
          'Failed to send invitation email.',
          'error',
        )
      }
    }

    return {
      invitation,
      errorMsg,
      isLoading,
      emailAddressToSend,
      generateInviteLink,
      copyToClipboard,
      sendInviteEmail,
      formatDateAndTime,
    }
  },
}
</script>

<style scoped>
/* You can add more subtle styling here if needed */
</style>
