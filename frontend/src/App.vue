<template>
  <div>
      <div id="logo">
        <img :src="'./logo.png'" />
      </div>
  </div>
  <h2>Smart Gate</h2>
  <hr />  

  <router-view></router-view>

</template>

<script>
export default {
  name: 'App'
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
