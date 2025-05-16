<template>
  <div
    class="d-flex flex-column justify-content-center align-items-center vh-100 text-center bg-light px-3"
  >
    <h1 class="display-4 text-danger mb-3">Access Denied</h1>
    <p class="lead mb-4">You do not have permission to view this page.</p>
    <p v-if="justSignedUp" class="mb-3">
      Thank you for signing up! Your account is awaiting administrator approval.
      Please be patient while your access is reviewed.
    </p>
    <p>
      If you believe this is an error or your account should already be active,
      please contact your administrator or
      <button @click="goHome" class="btn btn-primary btn-sm ms-2">
        Return to Home
      </button>
    </p>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

function goHome() {
  router.push('/')
}
</script>
