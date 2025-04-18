<template>
  <div>    
    <form @submit.prevent="GetItemById">
      <div>
        <label for="registrationId">Registation ID</label>
        <input type="text" id="registrationId" v-model="formData.registrationId" />
      </div>
      <div>
        <button @click="getItemsById">Get Registration</button>
      </div>
    </form>
    <h3 v-if="visitor.registrationId">{{ visitor.registrationId }} . {{ visitor.visitorName }}</h3>      
    <h3 class="error" v-if="errorMsg">{{ errorMsg }}</h3>
  </div>
    
</template>

<script>
import axios from 'axios'

export default {
  name: 'GetItemById',  
  data() {
    return {
      visitor: {
        registrationId: '',
        visitorName: ''
      },
      formData: {
        registrationId: '',
      },      
      errorMsg: '',
    }
  },
  methods: {
    getItemsById() {
      axios
        .get(process.env.VUE_APP_API_ENDPOINT + this.formData.registrationId)
        .then((response) => {
          console.log(response)
          this.visitor = response.data
        })
        .catch((error) => {
          console.log(error)
          this.errorMsg = 'Error retrieving data'
        })
    },
  },
}
</script>

<style scoped>

</style>