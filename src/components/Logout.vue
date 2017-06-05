<template>
  <div class="er-frame-container">
    <div class="er-block-container">
      <div class="er-index">
        <h3>登出系统</h3>
      </div>
    </div>
  </div>
</template>
<script>
import { logout } from '@/api/auth'
import { USER_LOGOUT } from '@/store/mutation_types'
export default {
  data(){
    return {
      countDown:5
    }
  },
  mounted(){
    logout().then(()=>{
      this.$store.dispatch(USER_LOGOUT)
      this.$router.replace('/login')
    }).catch(e=>this.$router.replace('/login'))
  }
}

</script>
