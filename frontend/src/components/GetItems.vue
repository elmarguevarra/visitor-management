<template>
  <div>
    <button @click="getItems">Get All Visitors</button>
    <div v-for="visitor in visitors" :key="visitor.registrationId">      
      <h5>Registration ID: {{ visitor.registrationId }} Visitor Name: {{ visitor.visitorName }}</h5>
      <img :src="visitor.qrCodeDataURL" alt="Visitor QR Code" width="200" height="200">            
    </div>
    <h3 class="error" v-if="errorMsg">{{ errorMsg }}</h3>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'GetItems',
  
  data() {
    return {
      visitors: [],
      errorMsg: '',
    }
  },
  methods: {
    getItems() {
      axios
        .get(process.env.VUE_APP_API_ENDPOINT)
        .then((response) => {
          console.log(response)
          this.visitors = response.data
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