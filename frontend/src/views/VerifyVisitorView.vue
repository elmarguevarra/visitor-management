<template>
  <div>    
    <form @submit.prevent="getItemsById">
      <div>
        <label for="registrationId">Registration ID</label>
        <input 
          type="text" 
          id="registrationId" 
          v-model="formData.registrationId"
          readonly
        />
      </div>
    </form>
    <h3 v-if="visitor.registrationId">
      Visitor {{ visitor.visitorName }} successfully verified
    </h3>
    <h3 v-else>
      No visitor found or verification failed
    </h3>      
    <h3 class="error" v-if="errorMsg">{{ errorMsg }}</h3>
  </div>
  
</template>

<script>
import axios from 'axios';

export default {
  name: 'VerifyVisitorView',  
  props: {
    registrationId: { 
      type: String,
      default: ''
    }
  },
  data() {
    return {
      visitor: {
        registrationId: '',
        visitorName: ''
      },
      formData: {
        registrationId: this.registrationId || '',
      },      
      errorMsg: '',
    };
  },
  watch: {
    registrationId(newVal) { 
      if (newVal) {
        this.formData.registrationId = newVal;
        this.fetchData(newVal);
      }
    }
  },
  methods: {
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
  },
  mounted() {
    if (this.registrationId) { 
      this.fetchData(this.registrationId);
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
