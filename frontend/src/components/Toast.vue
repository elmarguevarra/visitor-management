<template>
  <div class="toast-container position-fixed top-0 end-0 p-3">
    <div
      v-for="n in notifications.notifications"
      :key="n.id"
      class="toast align-items-center border-0 show mb-2 text-white"
      :class="{
        'toast-info': n.type === 'info',
        'toast-warning': n.type === 'warning',
        'toast-success': n.type === 'success',
        'toast-error': n.type === 'error',
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
          class="btn-close btn-close-white me-2 m-auto"
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

<style scoped>
.toast-info {
  background-color: rgba(13, 110, 253, 0.9); /* Bootstrap primary blue */
  color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.toast-warning {
  background-color: rgba(255, 193, 7, 0.9); /* Bootstrap warning yellow */
  color: #212529;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.toast-success {
  background: linear-gradient(
    90deg,
    rgba(30, 144, 255, 0.9),
    rgba(0, 119, 204, 0.8)
  );
  color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  font-weight: 500;
  backdrop-filter: blur(2px);
}
.toast-error {
  background-color: rgba(220, 53, 69, 0.9); /* Bootstrap danger red */
  color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
</style>
