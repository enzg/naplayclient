<template>
  <div id="app" class="app-view">
    <TopBar></TopBar>
    <div class="er-body-view">
      <NavMenu :defaultActive="navMenuAction"></NavMenu>
      <div class="er-frame-view">
        <div id="frameWrapper" class="er-frame-wrapper">
          <transition name="fade">
            <router-view></router-view>
          </transition>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import NavMenu from './components/NavMenu'
import TopBar from './components/TopBar'

export default {
  name: 'app',
  computed:{
    navMenuAction:function(){
      let val = this.$route.path;
      console.log(val);
      return val
    }
  },
  components: { NavMenu, TopBar }
}
</script>

