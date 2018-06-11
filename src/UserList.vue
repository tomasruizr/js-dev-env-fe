<template>
  <div id="user-list">
    <h1>Users</h1>
    <table>
      <thead>
        <th>&nbsp;</th>
        <th>Id</th>
        <th>First Name</th>
        <th>Last Name</th>
        <th>Email</th>
      </thead>
      <tbody id="user">
        <tr v-for="(user, index) in users" :key= "user.id">
          <td><a href="#" @click="deleteUser(user.id, index)" class="deleteUser">Delete</a></td>
          <td>{{user.id}}</td>
          <td>{{user.firstName}}</td>
          <td>{{user.lastName}}</td>
          <td>{{user.email}}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import user from './models/user';
export default {
  name: 'user-list',
  data: function() {
    return {
      users: []
    }
  },
  mounted: function() {
    let self = this;
    user.get().then(function(result) {
      self.users = result;
    });
  },
  methods: {
    deleteUser(id, index){
      user.delete(id);
      this.users.splice(index,1);      
    }
  } 
    
}
</script>

<style lang="scss">
table th {
  padding: 5px
}
.deleteUser {
  color: green;
}
</style>



