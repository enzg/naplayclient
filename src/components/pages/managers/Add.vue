<template>
  <div class="er-frame-container">
    <div class="er-block-container er-frame-title">
      <h1>{{ frameTitle }}</h1>
    </div>
    <div class="er-block-container">
      <el-form ref="form" :model="form" :rules="rules" label-width="120px" >
        <el-form-item label="线路商标示" prop="trade">
          <el-input v-model="form.trade" r></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email" r></el-input>
        </el-form-item>
        <el-form-item label="成数" prop="ratio">
          <el-input v-model="form.ratio" @change="points2Num"></el-input>
        </el-form-item>
        <el-form-item label="点数" prop="points">
          <el-input v-model="form.points" @change="points2Num"></el-input>
        </el-form-item>
        <el-form-item label="昵称" prop="nick">
          <el-input v-model="form.nick"></el-input>
        </el-form-item>
        <el-form-item label="商户名额" prop="limit">
          <el-input v-model="form.limit"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="enabled">
          <el-select v-model="form.enabled">
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
  awsFetch,
  zeusFetch
} from '@/libs/awsLib'
export default {
  data() {
    return {
      frameTitle: '创建下级建站商',
      form: {
        trade:'',
        email: '',
        points: '',
        limit:'',
        enabled: '1',
        remark: '',
        ratio:''
      },
      rules: {
        trade: [
          {required: true, message: '请输入标示', trigger: 'blur' }
        ],
        email: [
          { type: 'email', required: true, message: '请输入正确邮箱', trigger: 'blur' }
        ],
        points: [
          { type: 'number', required: true, message: '请输入正确点数', trigger: 'blur' }
        ],
        limit: [
          { required: true, message: '请输入限制', trigger: 'blur' }
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
        url: '/managers',
        method: 'post',
        data:this.form
      }
      zeusFetch(request).then(result=>{
        loading.close();    //关闭loading
        if (result[0]) {
          this.addError()
        }else {
          this.addSuccess();  //成功提示
        }

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
