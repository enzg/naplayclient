<template>
  <div class="er-frame-container">
    <div class="er-block-container er-frame-title">
      <h1>{{ frameTitle }}</h1>
    </div>
    <div class="er-block-container">
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="商户名" prop="username">
          <div>{{this.$route.params.username}}</div>
        </el-form-item>
        <el-form-item label="当前金币数" prop="username">
          <div>{{this.currentCoins}}</div>
        </el-form-item>
        <el-form-item label="金币数" prop="coins">
          <el-input v-model="form.coins" @change="points2Num"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit('form')">立即添加</el-button>
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
  MERCHANT_ROLE,
  PLAYER_ROLE
} from '@/config/aws-config'
export default {
  created() {
    let loading = this.$loading({
      target: "#frameWrapper"
    })
    const getCoins = {
      url: '/coins/' + this.form.to + '/' + this.form.toRole,
      method: 'get'
    }
    zeusFetch(getCoins).then(result=>{
      loading.close();    //关闭loading
      const [err, ret] = result
      this.currentCoins = ret.data.payload.coins// _.reduce(_.map(ret.data.payload.Items,item=>{ return item['assets']['points'] }),(result,n)=>{return result + n})
    }).catch(err=>{
      loading.close();    //关闭loading
    })
  },
  data() {
    return {
      frameTitle: '添加金币',
      currentCoins:0,
      form: {
        coins:0,
        to:this.$route.params.username,
        toRole:PLAYER_ROLE
      },
      rules: {
        coins: [
          { type: 'number', required: true, message: '请输入正确点数', trigger: 'blur' }
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
        url: '/coins',
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

        this.$router.replace('/merchants')
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
      let num = Number(this.form.coins);
      if (this.form.coins == num) {
        this.form.coins = num;
      } else {
        return
      }
    }
  }
}
</script>
