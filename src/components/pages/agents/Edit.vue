<template>
  <div class="er-frame-container">
    <div class="er-block-container er-frame-title">
      <h1>{{ frameTitle }}</h1>
    </div>
    <div class="er-block-container">
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email"></el-input>
        </el-form-item>
        <el-form-item label="用户名">
          <div>{{form.child}}</div>
        </el-form-item>
        <el-form-item label="昵称" prop="nick">
          <el-input v-model="form.nick"></el-input>
        </el-form-item>
        <el-form-item label="点数" prop="points">
          <div>{{form.points}}</div>
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
          <el-button type="primary" @click="onSubmit('form')">立即更新</el-button>
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
      frameTitle: '更新下级代理',
      form: {
      },
      rules: {
        email: [
          { type: 'email', required: true, message: '请输入正确邮箱', trigger: 'blur' }
        ],
        username: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        // points: [
        //   { type: 'number', required: true, message: '请输入正确点数', trigger: 'blur' }
        // ],
        enabled: [
          { required: true, message: '请选择', trigger: 'change' }
        ]
      }
    }
  },
  created() {
    let loading = this.$loading({
      target: "#frameWrapper"
    });
    // load all data from show api
    // but only those in the data can be update
    const getItem = {
      url: '/agents/' + this.$route.params.id,
      method: 'get'
    }
    awsFetch(getItem).then(result=>{
      loading.close();    //关闭loading
      this.form = {...result['1'].data.payload.Item}
    }).catch(err=>{
      loading.close();    //关闭loading
    })
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
        url: '/agents/'+this.$route.params.id,
        method: 'put',
        data:this.form
      }
      awsFetch(request).then(result=>{
        console.log(result);
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
        message: '成功更新!'
      });
    },
    addError(errMsg) {
      let dfMsg = '更新出错';
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
