<template>
  <div id="mainApp">
    <user-list/>
  </div>
</template>

<script>
import UserList from './Users/UserList.vue'
export default {
  name:'mainApp',
  components: { UserList }
}
</script>
<style lang="scss">
#mainApp {
  font-family: Sans-Serif;
}
</style>
