<template>
  <div class="er-frame-container">
    <div class="er-block-container er-login-container">
      <h1 class="er-login-title">登录</h1>
      <div class="er-login-form">
        <el-form ref="form" :model="form" :rules="rules" label-width="80px">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="form.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="form.password" type="password"></el-input>
          </el-form-item>
<!--
          <el-form-item label="角色" prop="role">
            <el-select v-model="form.role" placeholder="选择登录角色">
              <el-option label="超级管理员" value="0"></el-option>
              <el-option label="平台管理员" value="1"></el-option>
              <el-option label="建站管理员" value="10"></el-option>
              <el-option label="商户" value="100"></el-option>
              <el-option label="代理" value="1000"></el-option>
            </el-select>
          </el-form-item> -->
          <el-form-item>
            <el-button type="primary" @click="onSubmit('form')" size="large" class="er-login-button">登录</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>

import { USER_LOGIN,UPDATE_ROLE } from '@/store/mutation_types'
export default {
  data() {
    return {
      gamesData: [],
      form: {
        username: '',
        password: '',
        // role: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 6, max: 50, message: '长度在 6 到 50 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur' }
        ]
        // ,
        // role: [
        //   { required: true, message: '请选择', trigger: 'change' }
        // ]
      }
    }
  },
  methods: {
    doLogin(userInfo) {
      const user = {...userInfo}
      return this.$store.dispatch(USER_LOGIN,user)
    },
    onSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        let loading = this.$loading({
          target: "#frameWrapper"
        })
        if (valid) {
          this.doLogin(this.form).then(result =>{
            loading.close()   //关闭loading
            this.addSuccess()
            console.log(result);
            this.$router.replace({path: '/'})
          }).catch(result=>{
            loading.close()
            this.addError()
            return false
          })
        } else {
          return false
        }
      })
    },
    addSuccess() { this.$message({ type: 'success', message: '登录成功!' }) },
    addError(errMsg) {
      let dfMsg = '登录错误'
      if (!errMsg) { errMsg = dfMsg }
      this.$message({
        type: 'error',
        message: errMsg
      })
    },
    resetForm(formName) { this.$refs[formName].resetFields() },
    points2Num() {
      let num = Number(this.form.points);
      if (this.form.points == num) {
        this.form.points = num;
      } else {
        return
      }
    }
  }
}
</script>
