<template>
  <div>
    <form @submit.prevent="createItem">
      <div>
        <label for="residentId">Resident ID </label>
        <input type="text" id="residentId" v-model="formData.residentId" readonly='true' />
      </div>
      <div>
        <label for="residentName">Resident Name</label>
        <input type="text" id="residentName" v-model="formData.residentName" readonly='true'/>
      </div>
      <div>
        <label for="residentContact">Resident Contact</label>
        <input type="text" id="residentContact" v-model="formData.residentContact" readonly='true'/>
      </div>
      <div>
        <label for="visitorName">Visitor Name</label>
        <input type="text" id="visitorName" v-model="formData.visitorName" required/>
      </div>            
      <div>
        <button class='primary-button'>Register</button>
      </div>
    </form>
    <div v-if="response && response.data && response.data.qrCodeDataURL">
      <h3>Visitor registered successfully!</h3>
      <h4>QR Code:</h4>
      <img :src="response.data.qrCodeDataURL" alt="Visitor QR Code" width="200" height="200">
      <p>Registration ID: {{ response.data.registrationId }}</p>
    </div>
    <h3 class="error" v-if="errorMsg">{{ errorMsg }}</h3>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'CreateItem',
  data() {
    return {
      formData: {
        residentId: '1234',
        residentName: 'Elmar Guevarra',
        residentContact: '+6309123456',
        visitorName: '',
      },
      errorMsg: '',
      response: '',
    }
  },
  methods: {
    createItem() {
      axios
        .post(process.env.VUE_APP_API_ENDPOINT, this.formData)
        .then((response) => {
          console.log(response)
          this.response = response
          this.formData.visitorName = ''
          this.errorMsg = ''
        })
        .catch((error) => {
          console.log(error)
          this.errorMsg = 'Error posting data'
        })
    },
  },
}
</script>

<style scoped>

</style>