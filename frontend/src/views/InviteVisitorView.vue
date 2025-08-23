<template>
  <div class="container mt-2">
    <h4 class="mb-4" style="margin-left: -0.2rem">Invite a Visitor</h4>
    <div>
      <form @submit.prevent="generateInviteLink" class="row g-3">
        <div class="col-12">
          <Button :loading="isLoading" icon="bi bi-link-45deg">
            Generate Link
          </Button>
        </div>
      </form>
      <form @submit.prevent="sendInviteEmail" class="row g-3">
        <div
          v-if="invitation && invitation.inviteLink"
          class="mt-4 d-flex flex-column align-items-center"
        >
          <div
            class="alert alert-info mt-4 border-0 shadow-sm p-3"
            :class="{ 'opacity-50': isLoading }"
          >
            <div class="d-flex align-items-center">
              <div
                class="px-2 py-1 small text-truncate text-secondary flex-grow-1 me-2 non-selectable-text"
                style="max-width: 250px"
                :title="invitation.inviteLink"
              >
                {{ shortenLink(invitation.inviteLink) }}
                <span
                  v-if="!isInviteLinkShared && !isLoading"
                  class="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle"
                >
                  <span class="visually-hidden">Fresh link</span>
                </span>
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
import { onMounted, ref } from 'vue'
import { postInvite, sendEmailNotification } from '@/services/handlerServices'
import { useAuthenticationStore } from '@/stores/authenticationStore'
import { formatDateAndTime } from '@/utils'
import { useNotificationsStore } from '@/stores/notificationsStore'
import 'bootstrap-icons/font/bootstrap-icons.css'
import Button from '@/components/Button.vue'

export default {
  components: {
    Button,
  },
  name: 'InviteVisitorView',
  setup() {
    const authenticationStore = useAuthenticationStore()
    const notificationsStore = useNotificationsStore()

    const invitation = ref(null)
    const emailAddressToSend = ref('')
    const errorMsg = ref('')
    const isInviteLinkShared = ref(false)
    const isLoading = ref(false)

    const generateInviteLink = async () => {
      isLoading.value = true
      try {
        const inviteData = {
          residentId: authenticationStore.userEmail,
        }
        const response = await postInvite(inviteData)
        invitation.value = response
        isInviteLinkShared.value = false
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
        isInviteLinkShared.value = true
      } catch (error) {
        notificationsStore.addNotification(
          'Failed to send invitation email.',
          'error',
        )
      }
    }

    const shortenLink = (link, startLength = 20, endLength = 10) => {
      if (!link) return ''
      if (link.length <= startLength + endLength) return link
      return (
        link.substring(0, startLength) +
        '...' +
        link.substring(link.length - endLength)
      )
    }

    onMounted(async () => {
      await generateInviteLink()
    })

    return {
      invitation,
      errorMsg,
      isLoading,
      emailAddressToSend,
      isInviteLinkShared,
      generateInviteLink,
      copyToClipboard,
      sendInviteEmail,
      formatDateAndTime,
      shortenLink,
    }
  },
}
</script>

<style scoped>
.btn-primary {
  background: linear-gradient(90deg, #1e90ff, #0077cc);
  border: none;
}

.non-selectable-text {
  user-select: none;
  -webkit-user-select: none; /* Safari */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* IE10+/Edge */
}
</style>
