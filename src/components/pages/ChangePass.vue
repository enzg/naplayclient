<template>
<div class="er-frame-container">
  <div class="er-block-container er-login-container">
    <h1 class="er-login-title">修改密码</h1>
    <div class="er-login-form">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="旧密码" prop="oldPassword">
          <el-input v-model="form.oldPassword" type="password"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input v-model="form.newPassword" type="password"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit('form')" size="large" class="er-login-button">确认修改</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</div>
</template>
<script>
import { CHANGE_PASS } from '@/store/mutation_types'
import {
  zeusFetch
} from '@/libs/awsLib'
export default {
  data() {
    return {
      form: {
        oldPassword: '',
        newPassword: ''
      },
      rules: {
        oldPassword: [{
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          },
          {
            min: 6,
            max: 12,
            message: '长度在 6 到 12 个字符',
            trigger: 'blur'
          }
        ],
        newPassword: [{
            required: true,
            message: '请输入新密码',
            trigger: 'blur'
          },
          {
            min: 6,
            max: 12,
            message: '长度在 6 到 12 个字符',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    changePassword(payload){
      const passwordInfo = {...payload}
      return this.$store.dispatch(CHANGE_PASS,passwordInfo)
    },
    onSubmit(formName) {
      const updatePass = {
        url: '/update_password',
        method: 'post',
        data:{
          username:this.$store.state.username,
          password:this.form.newPassword
        }
      }
      this.$refs[formName].validate((valid) => {
        let loading = this.$loading({
          target: "#frameWrapper"
        })
        if (valid) {
          this.changePassword(this.form).then(result =>{
            zeusFetch(updatePass).then((result)=>{
              console.log(result);
              loading.close()   //关闭loading
              this.addSuccess()
              this.$router.replace({path: '/'})
            })

          }).catch(result=>{
            loading.close()
            this.addError()
            return false
          })
        } else {
          loading.close()
          return false
        }
      })
    },
    addSuccess() { this.$message({ type: 'success', message: '修改密码成功!' }) },
    addError(errMsg) {
      let dfMsg = '操作错误'
      if (!errMsg) { errMsg = dfMsg }
      this.$message({
        type: 'error',
        message: errMsg
      })
    }
  }
}
</script>
