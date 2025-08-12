<template>
  <div class="container mt-2">
    <h4 class="mb-3" style="margin-left: -0.2rem">Profile</h4>
    <div>
      <form class="row g-3">
        <div class="form-floating mb-1">
          <input
            type="email"
            class="form-control"
            id="Id"
            placeholder="name@example.com"
            v-model="formData.Id"
            readonly
          />
          <label for="floatingInput">Email</label>
        </div>
        <div class="form-floating mb-1">
          <input
            type="text"
            class="form-control"
            id="Name"
            placeholder="Juan Delacruz"
            v-model="formData.Name"
            readonly
          />
          <label for="floatingInput">Name</label>
        </div>
        <div class="form-floating mb-1">
          <input
            type="text"
            class="form-control"
            id="Contact"
            placeholder="+69053635414"
            v-model="formData.Contact"
            readonly
          />
          <label for="floatingInput">Contact</label>
        </div>
        <div class="form-floating mb-1">
          <input
            type="text"
            class="form-control"
            id="Group"
            placeholder="+69053635414"
            :value="
              !formData.Group || formData.Group.includes('Google')
                ? '...'
                : formData.Group
            "
            readonly
          />
          <label for="floatingInput">Group</label>
        </div>
        <div
          v-if="!authenticationStore.userGroup"
          class="alert alert-info mt-3 border-0 shadow-sm p-3"
        >
          <span
            class="spinner-grow spinner-grow-sm me-2"
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
