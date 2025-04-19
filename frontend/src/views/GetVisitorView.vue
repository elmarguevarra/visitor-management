<template>
  <div>    
    <form @submit.prevent="getItemsById">
      <div>
        <label for="registrationId">Registration ID</label>
        <input 
          type="text" 
          id="registrationId" 
          v-model="formData.registrationId"
        />
      </div>
      <div>
        <button type="submit" class='primary-button'>Get Registration</button>
      </div>
    </form>
    <h3 v-if="visitor.registrationId">
      {{ visitor.registrationId }} . {{ visitor.visitorName }}
    </h3>      
    <h3 class="error" v-if="errorMsg">{{ errorMsg }}</h3>
  </div>
  <router-link to="/">Back to Home</router-link>
</template>

<script>
import axios from 'axios';

export default {
  name: 'GetVisitorView',  
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
    };
  },
  methods: {
    async getItemsById() {
      const id = this.formData.registrationId;
      if (!id) {
        this.errorMsg = 'Please enter an ID';
        return;
      }
      await this.fetchData(id);
      this.$emit('search', id);
    },

    async fetchData(id) {
      try {
        const response = await axios.get(
          `${process.env.VUE_APP_API_ENDPOINT}${id}`
        );
        this.visitor = response.data;
        this.errorMsg = '';
      } catch (error) {
        console.error(error);
        this.visitor = { registrationId: '', visitorName: '' };
        this.errorMsg = error.response?.data?.message || 'Error retrieving data';
      }
    }
  }
};
</script>

<style scoped>
.route-btn {
  margin-left: 10px;
  background-color: #e6e6e6;
}

.error {
  color: #ff4444;
  margin-top: 15px;
}

form {
  margin: 20px 0;
}
</style>
