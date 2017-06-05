<template>
  <div class="er-frame-container">
    <div class="er-block-container er-frame-title">
      <h1>{{ frameTitle }}</h1>
    </div>
    <div class="er-block-container">
      <el-form ref="form" :model="form" :rules="rules" label-width="120px" >
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email"></el-input>
        </el-form-item>
        <el-form-item label="名称" prop="username">
          <div>{{form.username}}</div>
        </el-form-item>
        <el-form-item label="点数" prop="points">
          <div>{{points}}</div>
        </el-form-item>
        <el-form-item label="成数" prop="points">
          <div>{{form.ratio}}</div>
        </el-form-item>
        <el-form-item label="商户名额" prop="limit">
          <el-input v-model="form.limit"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="enabled">
          <el-select v-model="form.enabled" placeholder="设置启用／停用">
            <el-option label="启用" value="1"></el-option>
            <el-option label="停用" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注">
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
  awsFetch,
  zeusFetch
} from '@/libs/awsLib'
import {
  MANAGER_ROLE
} from '@/config/aws-config'
import _ from 'lodash'
export default {
  created() {
    let loading = this.$loading({
      target: "#frameWrapper"
    });
    // load all data from show api
    // but only those in the data can be update
    const getItem = {
      url: '/managers/'+ this.$route.params.id,
      method: 'get'
    }
    zeusFetch(getItem).then(result=>{
      const [err, ret] = result
      loading.close();    //关闭loading
      this.form = {...ret.data.payload.Item}
      const getPoints = {
        url: '/points/' + this.form.username + '/' + MANAGER_ROLE,
        method: 'get'
      }
      zeusFetch(getPoints).then(result=>{
        loading.close();    //关闭loading
        const [err, ret] = result
        this.points =ret.data.payload.points // _.reduce(_.map(ret.data.payload.Items,item=>{ return item['assets']['points'] }),(result,n)=>{return result + n})
      }).catch(err=>{
        loading.close();    //关闭loading
      })

    }).catch(err=>{
      loading.close();    //关闭loading
    })
  },
  data() {
    return {
      frameTitle: '更新下级建站商',
      points:'loading...',
      form: {
        assets:{
          points:''
        }
      },
      rules: {
        email: [
          { type: 'email', required: true, message: '请输入正确邮箱', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        // points: [
        //   { type: 'number', required: true, message: '请输入正确点数', trigger: 'blur' }
        // ],
        managerLimit: [
          { required: true, message: '请选择', trigger: 'change' }
        ],
        merchantLimit: [
          { required: true, message: '请选择', trigger: 'change' }
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
        url: '/managers/'+this.$route.params.id,
        method: 'put',
        data:this.form
      }
      zeusFetch(request).then(result=>{
        loading.close();    //关闭loading
        this.addSuccess();  //成功提示
        this.$router.replace('/managers')
      }).catch(err=>{
        loading.close();    //关闭loading
        this.addError()
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
