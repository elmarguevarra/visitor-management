<template>
  <div class="toast-container position-fixed top-0 end-0 p-3">
    <div
      v-for="n in notifications.notifications"
      :key="n.id"
      class="toast align-items-center border-0 small-toast show mb-2"
      :class="{
        'bg-light': n.type === 'info',
        'bg-warning-subtle': n.type === 'warning',
        'bg-success-subtle': n.type === 'success',
        'bg-danger-subtle': n.type === 'error',
      }"
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      <div class="d-flex">
        <div class="toast-body">
          {{ n.message }}
        </div>
        <button
          type="button"
          class="btn-close me-2 m-auto"
          style="font-size: 0.5rem"
          @click="notifications.removeNotification(n.id)"
          aria-label="Close"
        ></button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useNotificationsStore } from '@/stores/notificationsStore'

const notifications = useNotificationsStore()
</script>
