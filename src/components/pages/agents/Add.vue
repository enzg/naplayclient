<template>
  <div class="er-frame-container">
    <div class="er-block-container er-frame-title">
      <h1>{{ frameTitle }}</h1>
    </div>
    <div class="er-block-container">
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email" r></el-input>
        </el-form-item>
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username"></el-input>
        </el-form-item>
        <el-form-item label="昵称" prop="nick">
          <el-input v-model="form.nick"></el-input>
        </el-form-item>
        <el-form-item label="点数" prop="points">
          <el-input v-model="form.points" @change="points2Num"></el-input>
        </el-form-item>

        <el-form-item label="状态" prop="enabled">
          <el-select v-model="form.enabled" placeholder="设置启用／停用">
            <el-option label="启用" value="1"></el-option>
            <el-option label="停用" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input type="textarea" v-model="form.remark"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit('form')">立即创建</el-button>
          <el-button @click="resetForm('form')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import {
  awsFetch
} from '@/libs/awsLib'
export default {
  data() {
    return {
      frameTitle: '创建下级代理',
      gamesData: [],
      form: {
        email: '',
        username: '',
        nick:'',
        password:'Hello@1234',
        points: '',
        enabled: '',
        remark: ''
      },
      rules: {
        email: [
          { type: 'email', required: true, message: '请输入正确邮箱', trigger: 'blur' }
        ],
        username: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        points: [
          { type: 'number', required: true, message: '请输入正确点数', trigger: 'blur' }
        ],
        enabled: [
          { required: true, message: '请选择', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
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
        url: '/agents',
        method: 'post',
        data:this.form
      }
      awsFetch(request).then(result=>{
        loading.close();    //关闭loading
        this.addSuccess();  //成功提示
        this.$router.replace('/agents')

      }).catch(err=>{
        loading.close()    //关闭loading
        this.addError()
        this.$router.replace('/login')
      })
    },
    addSuccess() {
      this.$message({
        type: 'success',
        message: '成功创建!'
      });
    },
    addError(errMsg) {
      let dfMsg = '创建出错';
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
    },
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
