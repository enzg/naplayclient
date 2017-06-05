<template>
  <div class="er-frame-container">
    <div class="er-block-container er-frame-title">
      <h1>{{ frameTitle }}</h1>
    </div>
    <div class="er-block-container">
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="游戏名称" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="开发商" prop="vendor">
          <el-input v-model="form.vendor"></el-input>
        </el-form-item>
        <el-form-item label="开发商邮箱" prop="contact">
          <el-input v-model="form.contact" r></el-input>
        </el-form-item>
        <el-form-item label="游戏地址IP" prop="serverIP">
          <el-input v-model="form.serverIP" placeholder="例：http://www.qq.com/"></el-input>
        </el-form-item>
        <el-form-item label="游戏配置地址" prop="gmIP">
          <el-input v-model="form.gmIP" placeholder="例：http://www.qq.com/"></el-input>
        </el-form-item>
        <el-form-item label="游戏类型" prop="type">
          <el-select v-model="form.type" placeholder="请选择游戏类型">
            <el-option v-for="item in gameTypes" :key="item.kindId" :label="item.name" :value="item.kindId"></el-option>
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
  awsFetch,
  zeusFetch
} from '@/libs/awsLib'
import { gameTypes } from '@/config/gameTypes'
export default {
  data() {
    return {
      frameTitle: '创建游戏',
      gamesData: [],
      gameTypes:[...gameTypes],
      form: {
        contact: '',
        name: '',
        vendor:'',
        serverIP: '',
        gmIP:'',
        type: '',
        remark: ''
      },
      rules: {
        contact: [
          { type: 'email', required: true, message: '请输入正确邮箱', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        vendor: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        serverIP: [
          { type:'url', required: true, message: '请输入正确IP地址', trigger: 'blur' }
        ],
        type: [
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
          console.log(this.form);
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
        url: '/games',
        method: 'post',
        data:this.form
      }
      zeusFetch(request).then(result=>{
        loading.close();    //关闭loading
        this.addSuccess();  //成功提示
        this.$router.replace('/games')
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
    }
  }
}
</script>
