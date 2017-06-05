<template>
<div class="er-nav-menu">
  <el-menu v-if='this.$store.state.showRouter' :default-active="defaultActive" :unique-opened="uniqueOpened" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose" theme="dark" :router="router">
    <el-menu-item index="/">首页</el-menu-item>
    <el-submenu index="2" >
      <template slot="title">商户管理</template>
      <el-menu-item v-if="this.$store.state.role == '1' || this.$store.state.role == '0'" index="/merchants/add">新增商户</el-menu-item>
      <el-menu-item v-if="this.$store.state.role == '100' || this.$store.state.role == '10' || this.$store.state.role == '1' || this.$store.state.role == '0'" index="/merchants">商户列表</el-menu-item>
    </el-submenu>
    <!-- <el-submenu index="3"  v-if="this.$store.state.role == '1000' || this.$store.state.role == '1' || this.$store.state.role == '0'">
      <template slot="title">代理管理</template>
      <el-menu-item index="/agents/add">新增代理</el-menu-item>
      <el-menu-item index="/agents">代理列表</el-menu-item>
    </el-submenu> -->
    <el-submenu index="4">
      <template slot="title">建站商管理</template>
      <el-menu-item v-if="this.$store.state.role == '10' || this.$store.state.role == '1' || this.$store.state.role == '0'" index="/managers/add">新增建站商</el-menu-item>
      <el-menu-item v-if="this.$store.state.role == '10' || this.$store.state.role == '1' || this.$store.state.role == '0'" index="/managers">建站商列表</el-menu-item>
    </el-submenu>
    <el-submenu index="5" v-if="this.$store.state.role=='1' || this.$store.state.role == '0' ">
      <template slot="title">游戏管理</template>
      <el-menu-item index="/games/add">新增游戏</el-menu-item>
      <el-menu-item index="/games">平台游戏列表</el-menu-item>
    </el-submenu>
    <!-- <el-submenu v-if="this.$store.state.role == '1000' ||  this.$store.state.role == '1' || this.$store.state.role == '0'" index="6">
      <template slot="title">玩家管理</template>
      <el-menu-item index="/players/add">新增玩家</el-menu-item>
      <el-menu-item index="/players">玩家列表</el-menu-item>
    </el-submenu> -->
    <el-menu-item v-if="this.$store.state.role == '0' || this.$store.state.role == '1' " index="/numbers">商户号</el-menu-item>
    <el-submenu index="7" v-if="this.$store.state.role != '-1'">
      <template slot="title">个人中心</template>
      <el-menu-item index="/profile">个人信息</el-menu-item>
      <el-menu-item index="/changepassword">修改密码</el-menu-item>
      <el-menu-item index="/merchants/players">玩家列表</el-menu-item>
      <el-menu-item index="/merchants/1/games">游戏列表</el-menu-item>
      <el-menu-item index="/billing">转账记录</el-menu-item>
    </el-submenu>
    <el-menu-item  index="/playerregister">玩家注册</el-menu-item>
  </el-menu>
</div>
</template>

<script>
import { RETRIVE_USER, SHOW_ROUTER } from '@/store/mutation_types'
export default {
  name: 'navMenu',
  props: ['defaultActive'],
  data() {
    return {
      uniqueOpened: true,
      router: true
    }
  },
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    }
  },
  mounted() {
    this.$store.dispatch(RETRIVE_USER).then((res) => {
      this.$store.dispatch(SHOW_ROUTER)
    }).catch((res) => {
      this.$store.dispatch(SHOW_ROUTER)
    })
  }
}
</script>
