<template>
  <button
    :type="type"
    :class="[computedClass]"
    :disabled="loading"
    @click="onClick"
  >
    <i v-if="icon" :class="icon" class="me-1"></i>
    <slot />

    <transition name="pulse" mode="out-in">
      <Spinner v-if="loading" />
    </transition>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Spinner from '@/components/Spinner.vue'
import 'bootstrap-icons/font/bootstrap-icons.css'
import { defineProps, defineEmits } from 'vue'
const emit = defineEmits(['click'])

const props = defineProps({
  type: {
    type: String,
    default: 'submit',
  },
  icon: { type: String, default: '' },
  loading: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  class: { type: String, default: 'btn btn-primary' },
})

const computedClass = computed(() => props.class)

function onClick(event: Event) {
  emit('click', event)
}
</script>

<style scoped>
.btn-primary {
  background: linear-gradient(90deg, #1e90ff, #0077cc);
  border: none;
}

/* Enter animation (spinner appears) */
.pulse-enter-from {
  transform: scale(0.5);
  opacity: 0;
}
.pulse-enter-active {
  animation: pulseIn 0.4s ease forwards;
}

/* Leave animation (spinner disappears smoothly) */
.pulse-leave-from {
  transform: scale(1);
  opacity: 1;
}
.pulse-leave-active {
  animation: pulseOut 0.4s ease forwards;
}

@keyframes pulseIn {
  0% {
    transform: scale(0.5);
    opacity: 0;
  }
  60% {
    transform: scale(1.1);
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes pulseOut {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  40% {
    transform: scale(1.05);
    opacity: 1;
  }
  100% {
    transform: scale(0.5);
    opacity: 0;
  }
}
</style>
