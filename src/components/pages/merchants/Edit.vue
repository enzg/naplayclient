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
        <el-form-item label="用户名" prop="child">
          <div> {{form.username}} </div>
        </el-form-item>
        <el-form-item label="商户域名" prop="site">
          <el-input v-model="form.site"></el-input>
        </el-form-item>
        <el-form-item label="成数" prop="ratio">
          <el-input v-model="form.ratio"></el-input>
        </el-form-item>
        <el-form-item label="昵称" prop="nick">
          <el-input v-model="form.nick"></el-input>
        </el-form-item>
        <el-form-item label="商户号" prop="msn">
          <div>{{form.assets.msn}}</div>
        </el-form-item>
        <el-form-item label="点数" prop="points">
          <div> {{points}} </div>
        </el-form-item>
        <el-form-item label="接入游戏" prop="gameList" class="er-long-select">
          <el-select v-model="form.gameList" placeholder="请选择接入的游戏" multiple>
            <el-option v-for="item in gamesData" :key="item.sk" :label="item.name" :value="item.type"></el-option>
          </el-select>
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
  awsFetch,
  zeusFetch
} from '@/libs/awsLib'
import {
  MERCHANT_ROLE
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
      url: '/merchants/'+ this.$route.params.id,
      method: 'get'
    }
    zeusFetch(getItem).then(result=>{
      loading.close();    //关闭loading
      const [err, ret] = result
      this.form = {...ret.data.payload.Item}
      const getPoints = {
        url: '/points/' + this.form.username + '/' + MERCHANT_ROLE,
        method: 'get'
      }
      zeusFetch(getPoints).then(result=>{
        loading.close();    //关闭loading
        const [err, ret] = result
        this.points = ret.data.payload.points// _.reduce(_.map(ret.data.payload.Items,item=>{ return item['assets']['points'] }),(result,n)=>{return result + n})
      }).catch(err=>{
        loading.close();    //关闭loading
      })

    }).catch(err=>{
      loading.close();    //关闭loading
    })

    const gameItem = {
      url: '/games/',
      method: 'get'
    }
    zeusFetch(gameItem).then(result=>{
      loading.close();    //关闭loading
      const [err, ret] = result
      this.gamesData = [...ret.data.payload.Items]
    }).catch(err=>{
      loading.close();    //关闭loading
    })


  },
  data() {
    return {
      frameTitle: '编辑商户',
      gamesData: [],
      points:'',
      form: {
        email: '',
        ratio:'',
        username: '',
        assets:{
          msn:'',
          ratio:''
        },
        gameList: [],
        enabled: '',
        remark: '',
        nick:''
      },
      rules: {
        email: [
          { type: 'email', required: true, message: '请输入正确邮箱', trigger: 'blur' }
        ],
        // username: [
        //   { required: true, message: '请输入名称', trigger: 'blur' }
        // ],
        // msn: [
        //   { required: true, message: '请输入商户号', trigger: 'blur' }
        // ],
        // points: [
        //   { type: 'number', required: true, message: '请输入正确点数', trigger: 'blur' }
        // ],
        gameList: [
          { type: 'array', required: true, message: '请选择接入游戏', trigger: 'change' }
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
        url: '/merchants/'+this.$route.params.id,
        method: 'put',
        data:this.form
      }
      zeusFetch(request).then(result=>{
        loading.close();    //关闭loading
        this.addSuccess();  //成功提示
        this.$router.replace('/merchants')
      }).catch(err=>{
        loading.close();    //关闭loading
        this.addError()
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
