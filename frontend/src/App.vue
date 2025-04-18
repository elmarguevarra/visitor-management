<template>
  <div>
      <div id="logo">
        <img :src="'./logo.png'" />
      </div>
  </div>
  <h2>Hi, I Am SAM</h2>
  <hr />  
  <h3>Register Visitor</h3>
  <CreateItem class="form-section"/>
  <hr />  
  <h3>Get Visitor Registration</h3>
  <GetItemById class="form-section"/>
  <hr />    
  <h3>Get All Visitors</h3>
  <GetItems class="form-section"/>
</template>

<script>
import CreateItem from './components/CreateItem'
import GetItems from './components/GetItems'
import GetItemById from './components/GetItemById'
export default {
  name: 'App',
  components: {
    GetItems,
    CreateItem,
    GetItemById,
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
