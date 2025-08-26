<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { userManager } from '../auth/authConfig'
import { useAuthenticationStore } from '../stores/authenticationStore'
import { useAuthorizationStore } from '../stores/authorizationStore'
import { ACTIONS } from '../constants/actions'

const router = useRouter()
const authenticationStore = useAuthenticationStore()
const authorizationStore = useAuthorizationStore()

onMounted(async () => {
  try {
    const user = await userManager.signinRedirectCallback()
    if (user) {
      await authenticationStore.loadUser(user)
      await authorizationStore.loadUserPermissions()
    }

    const redirectPath =
      sessionStorage.getItem('postLoginRedirectPath') ||
      (authorizationStore.hasPermissionOnAction(ACTIONS.UI.BROWSE_VISITORS)
        ? '/visitors'
        : '/profile')

    sessionStorage.removeItem('postLoginRedirectPath')
    router.push(redirectPath)
  } catch (error) {
    console.error('Error handling sign-in callback:', error)
    router.push('/login-error')
  }
})
</script>
