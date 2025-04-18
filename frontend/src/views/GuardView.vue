<template>
    <div>
      <h2>Get Visitor Registration</h2>
      <hr />
      <GetItemById class="form-section" />
      <router-link to="/">Back to Home</router-link>
    </div>
  </template>
  
  <script>
  import GetItemById from '../components/GetItemById';
  
  export default {
    name: 'GuardView',
    components: {
      GetItemById,
    },
  };
  </script>
  
  <style scoped>
  .form-section {
    display: block;
    margin: 2%;
    justify-content: left;
  }
  </style>