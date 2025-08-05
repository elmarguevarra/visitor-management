<template>
  <div class="toast-container position-fixed top-0 end-0 p-3">
    <div
      id="liveToast"
      class="toast align-items-center bg-light border-0 small-toast"
      :class="{ show: notifications.isVisible }"
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      <div class="d-flex">
        <div class="toast-body">
          {{ notifications.message }}
        </div>
        <button
          type="button"
          class="btn-close me-2 m-auto"
          style="font-size: 0.5rem"
          @click="closeToast"
          aria-label="Close"
        ></button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useNotificationsStore } from '@/stores/notificationStore'

const notifications = useNotificationsStore()
</script>

<style scoped></style>
