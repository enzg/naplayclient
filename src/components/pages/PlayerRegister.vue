<template>
  <div class="er-frame-container">
    <div class="er-block-container er-login-container">
      <h1 class="er-login-title">玩家注册(测试专用)</h1>
      <div class="er-login-form">
        <el-form ref="form" :model="form" :rules="rules" label-width="80px">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="form.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="form.password" type="password"></el-input>
          </el-form-item>
          <el-form-item label="商户" prop="msn" class="er-long-select">
            <el-select v-model="form.msn" placeholder="请选择商户号">
              <el-option v-for="item in msnList" :key="item.sk" :label="item.merchant_name" :value="item.sk+':'+item.merchant_name"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="form.email"></el-input>
          </el-form-item>
          <el-form-item label="性别" prop="gender">
            <el-select v-model="form.gender" placeholder="性别">
              <el-option label="男" value="0"></el-option>
              <el-option label="女" value="1"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="onSubmit('form')" size="large" class="er-login-button">登录</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
import {
  awsFetch,
  zeusFetch
} from '@/libs/awsLib'
import _ from 'lodash'
export default {
  created() {
    let loading = this.$loading({
      target: "#frameWrapper"
    });

    const msnItems = {
      url: '/numbers/',
      method: 'get'
    }
    zeusFetch(msnItems).then(result=>{
      loading.close();    //关闭loading
      const [err, ret] = result

      const msns = _.filter(ret.data.payload.Items,(item)=>{
        return item.current_state == 1
      })
      this.msnList = [...msns]
    }).catch(err=>{
      loading.close();    //关闭loading
    })


  },
  methods:{
    onSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.postData();
        } else {
          return false;
        }
      });
    },
    postData() {
      let loading = this.$loading({
        target: "#frameWrapper"
      });
      const request = {
        url: '/player_register',
        method: 'post',
        data:this.form
      }
      zeusFetch(request).then(result=>{
        loading.close();    //关闭loading
        this.addSuccess();  //成功提示
        this.$router.replace('/players')
      }).catch(err=>{
        loading.close();    //关闭loading
        this.addError()
      })
    },
    addSuccess() {
      this.$message({
        type: 'success',
        message: '成功注册!'
      });
    },
    addError(errMsg) {
      let dfMsg = '注册出错';
      if(!errMsg){
        errMsg = dfMsg;
      }
      this.$message({
        type: 'error',
        message: errMsg
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  },
  data(){
    return {
      msnList:[{
        name:'merchant001',
        sk:'1'
      }],
      form:{
        username:'',
        password:'',
        msn:'',
        email:'',
        gender:'0'
      },
      rules:{
        email: [
          { type: 'email', required: true, message: '请输入正确邮箱', trigger: 'blur' }
        ],
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 6, max: 24, message: '长度在 6 到 24 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur' }
        ],
        msn: [
          { required: true, message: '请选择', trigger: 'change' }
        ]
      }
    }
  }
}

</script>
