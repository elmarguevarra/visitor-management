<template>
  <div class="container mt-2">
    <h4 class="mb-3 text-muted" style="margin-left: -0.2rem">Profile</h4>
    <div>
      <form class="row g-3">
        <div class="col-md-6">
          <label for="Id" class="form-label">Email</label>
          <input
            type="text"
            class="form-control"
            id="Id"
            v-model="formData.Id"
            readonly
          />
        </div>
        <div class="col-md-6">
          <label for="Name" class="form-label">Name</label>
          <input
            type="text"
            class="form-control"
            id="Name"
            v-model="formData.Name"
            readonly
          />
        </div>
        <div class="col-md-6">
          <label for="Name" class="form-label">Contact</label>
          <input
            type="text"
            class="form-control"
            id="Contact"
            v-model="formData.Contact"
            readonly
          />
        </div>
        <div class="col-md-6">
          <label for="Group" class="form-label">Group</label>
          <input
            type="text"
            class="form-control"
            id="Group"
            :value="
              !formData.Group || formData.Group.includes('Google')
                ? 'Reviewing...'
                : formData.Group
            "
            readonly
          />
        </div>
        <div
          v-if="!authenticationStore.userGroup"
          class="alert alert-info mt-3"
        >
          <span
            class="spinner-border spinner-border-sm me-2"
            role="status"
            aria-hidden="true"
          ></span>
          Waiting for Approval...
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { reactive } from 'vue'
import { useAuthenticationStore } from '@/stores/authenticationStore'

export default {
  name: 'ProfileView',
  setup() {
    const authenticationStore = useAuthenticationStore()

    const formData = reactive({
      Id: authenticationStore.userEmail,
      Name: `${authenticationStore.userGivenName} ${authenticationStore.userFamilyName}`,
      Contact: authenticationStore.userPhoneNumber,
      Group: authenticationStore.userGroup,
    })

    return {
      authenticationStore,
      formData,
    }
  },
}
</script>

<style scoped>
/* You can add more subtle styling here if needed */
</style>
