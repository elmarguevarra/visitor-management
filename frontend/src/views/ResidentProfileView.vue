<template>
  <div class="container mt-2">
    <h4 class="mb-3 text-muted" style="margin-left: -0.2rem">Profile</h4>
    <div>
      <form @submit.prevent="generateInviteLink" class="row g-3">
        <div class="col-md-6">
          <label for="residentId" class="form-label">Resident Email</label>
          <input
            type="text"
            class="form-control"
            id="residentId"
            v-model="formData.residentId"
            readonly
          />
        </div>
        <div class="col-md-6">
          <label for="residentName" class="form-label">Resident Name</label>
          <input
            type="text"
            class="form-control"
            id="residentName"
            v-model="formData.residentName"
            readonly
          />
        </div>
        <div class="col-md-6">
          <label for="residentContact" class="form-label"
            >Resident Contact</label
          >
          <input
            type="text"
            class="form-control"
            id="residentContact"
            v-model="formData.residentContact"
            readonly
          />
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { reactive } from 'vue'
import { useAuthenticationStore } from '@/stores/authenticationStore'

export default {
  name: 'ResidentProfileView',
  setup() {
    const authenticationStore = useAuthenticationStore()

    const formData = reactive({
      residentId: authenticationStore.userEmail,
      residentName: `${authenticationStore.userGivenName} ${authenticationStore.userFamilyName}`,
      residentContact: authenticationStore.userPhoneNumber,
    })

    return {
      formData,
    }
  },
}
</script>

<style scoped>
/* You can add more subtle styling here if needed */
</style>
