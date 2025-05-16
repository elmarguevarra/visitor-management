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
            v-model="formData.Group"
            readonly
            :class="{ 'text-muted': !authenticationStore.userGroup }"
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
  name: 'ProfileView',
  setup() {
    const authenticationStore = useAuthenticationStore()

    const formData = reactive({
      Id: authenticationStore.userEmail,
      Name: `${authenticationStore.userGivenName} ${authenticationStore.userFamilyName}`,
      Contact: authenticationStore.userPhoneNumber,
      Group: authenticationStore.userGroup ?? 'Reviewing...',
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
