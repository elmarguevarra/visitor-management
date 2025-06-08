<template>
  <LoadingOverlay />
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { userManager } from '@/auth/authConfig'

const router = useRouter()

onMounted(async () => {
  try {
    await userManager.signoutRedirectCallback()
    router.push('/')
  } catch (error) {
    console.error('Error handling sign-out callback:', error)
    router.push('/')
  }
})
</script>
