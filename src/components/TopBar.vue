<template>
  <div class="er-top-bar">
    <div class="er-logo-font">
      <a href="/">NA#Platform</a>
    </div>
    <ul class="er-right-tool">
      <li class="er-tool-exit">
        <router-link to="/profile">{{this.$store.state.username}}</router-link>
      </li>
      <li v-if='this.$store.token == 0' class="er-tool-exit">
        <router-link to="/login">登录</router-link>
      </li>
      <li v-if='this.$store.token != 0' class="er-tool-exit">
        <router-link to="/logout">退出</router-link>
      </li>
    </ul>
  </div>
</template>
