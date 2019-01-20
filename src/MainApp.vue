<template>
  <div id="mainApp">
    <user-list/>
  </div>
</template>

<script>
import io from 'socket.io-client';
import config from '../config.js';
import request from './api/request.js';
import model from './api/model.js';
import UserList from './Users/UserList.vue';
const apiServer = config.apiServer;
request.init({ io, apiServer });
model.init({ request, apiServer});

export default {
  name:'mainApp',
  components: { UserList },
  provide: function() { return {model} }
}
</script>
<style lang="scss">
#mainApp {
  font-family: Sans-Serif;
}
</style>
