<template>
  <div>
    <form @submit.prevent="createItem" class="row g-3">
      <div class="col-md-6">
        <label for="residentId" class="form-label">Resident ID</label>
        <input type="text" class="form-control" id="residentId" v-model="formData.residentId" readonly />
      </div>
      <div class="col-md-6">
        <label for="residentName" class="form-label">Resident Name</label>
        <input type="text" class="form-control" id="residentName" v-model="formData.residentName" readonly />
      </div>
      <div class="col-md-6">
        <label for="residentContact" class="form-label">Resident Contact</label>
        <input type="text" class="form-control" id="residentContact" v-model="formData.residentContact" readonly />
      </div>
      <div class="col-md-6">
        <label for="visitorName" class="form-label">Visitor Name</label>
        <input type="text" class="form-control" id="visitorName" v-model="formData.visitorName" required />
      </div>
      <div class="col-12">
        <button type="submit" class="btn btn-primary">Register</button>
      </div>
    </form>

    <div v-if="response && response.data && response.data.qrCodeDataURL" class="mt-4">
      <h3>Visitor registered successfully!</h3>
      <h4>QR Code:</h4>
      <img :src="response.data.qrCodeDataURL" alt="Visitor QR Code" width="200" height="200" class="img-thumbnail">
      <p class="mt-2">Registration ID: {{ response.data.registrationId }}</p>
    </div>

    <h3 class="alert alert-danger mt-4" v-if="errorMsg">{{ errorMsg }}</h3>
  </div>
</template>

<script>
import axios from 'axios';
// If you were using Ant Design Vue button, you would remove this import
// import { Button as AButton } from 'ant-design-vue';

export default {
  name: 'CreateItem',
  // If you were using Ant Design Vue button, you would remove this component registration
  // components: {
  //   AButton,
  // },
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
    };
  },
  methods: {
    createItem() {
      axios
        .post(process.env.VUE_APP_API_ENDPOINT, this.formData)
        .then((response) => {
          console.log(response);
          this.response = response;
          this.formData.visitorName = '';
          this.errorMsg = '';
        })
        .catch((error) => {
          console.log(error);
          this.errorMsg = 'Error posting data';
        });
    },
  },
};
</script>