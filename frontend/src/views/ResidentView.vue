<template>
    <h3>Register Visitor</h3>
    <CreateItem class="form-section"/>
    <hr />    
    <h3>Get All Visitors</h3>
    <GetItems class="form-section"/>
  </template>
  
  <script>
  import CreateItem from '../components/CreateItem'
  import GetItems from '../components/GetItems'
  export default {
    name: 'ResidentView',
    components: {
      GetItems,
      CreateItem
    },
  }
  </script>
  
  <style>
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
  }
  
  #logo {
      display: flex;
      width: 15%;
      flex-direction: column;
      justify-content: center;
      margin: auto;
  }
  
  .form-section {
    display: block;
    margin: 2%;
    justify-content: left;
  }
  
  .error {
    color: red;
  }
  
  div {
    margin: 1%;
  }
  input {
    margin: 1%;
  }
  label {
    margin: 1%;
  }
  
  </style>
  