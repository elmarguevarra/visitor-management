<template>
  <div class="container mt-2">
    <h4 class="mb-3 text-danger" style="margin-left: -0.2rem">Access Denied</h4>
    <div class="alert alert-danger" role="alert">
      <p class="lead mb-2">You do not have permission to view this page.</p>
      <p class="mb-2">
        Thank you for signing up! Your account is awaiting administrator
        approval. Please be patient while your access is reviewed.
      </p>
      <p>
        If you believe this is an error or your access should be different,
        please contact your administrator or
        <button @click="goHome" class="btn btn-primary btn-sm ms-2">
          Return to Home
        </button>
      </p>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

function goHome() {
  router.push('/')
}
</script>
