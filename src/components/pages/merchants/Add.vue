<template>
<div class="er-frame-container">
  <div class="er-block-container er-frame-title">
    <h1>{{ frameTitle }}</h1>
  </div>
  <div class="er-block-container">
    <el-form ref="form" :model="form" :rules="rules" label-width="120px">
      <el-form-item label="商户标示" prop="trade">
        <el-input v-model.trim="form.trade"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model.trim="form.email"></el-input>
      </el-form-item>
      <el-form-item label="商户域名" prop="site">
        <el-input v-model.trim="form.site"></el-input>
      </el-form-item>
      <el-form-item label="成数" prop="ratio">
        <el-input v-model.trim="form.ratio"></el-input>
      </el-form-item>
      <el-form-item label="昵称" prop="nick">
        <el-input v-model.trim="form.nick"></el-input>
      </el-form-item>
      <el-form-item label="点数" prop="points">
        <el-input v-model.trim="form.points" @change="points2Num"></el-input>
      </el-form-item>
      <el-form-item label="接入游戏" prop="gameList" class="er-long-select">
        <el-select v-model="form.gameList" placeholder="请选择接入的游戏" multiple>
          <el-option v-for="item in gamesData" :key="item.sk" :label="item.name" :value="item.type"></el-option>
        </el-select>
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

const axios = require('axios')
const qs = require('qs')
export default {
  created() {
    let loading = this.$loading({
      target: "#frameWrapper"
    });
    // load all data from show api
    // but only those in the data can be update
    const getItem = {
      url: '/games/',
      method: 'get'
    }
    zeusFetch(getItem).then(result => {
      loading.close(); //关闭loading
      const [err, ret] = result
      this.gamesData = [...ret.data.payload.Items]
    }).catch(err => {
      loading.close(); //关闭loading
    })
  },
  data() {
    return {
      frameTitle: '创建商户',
      gamesData: [],
      form: {
        trade: '',
        email: '',
        ratio: '',
        points: '',
        gameList: [],
        enabled: '1',
        remark: '',
        nick: '',
        site: '',
        ratio: ''
      },
      rules: {
        trade: [{
          required: true,
          message: '请输入标示',
          trigger: 'blur'
        }],
        email: [{
          type: 'email',
          required: true,
          message: '请输入正确邮箱',
          trigger: 'blur'
        }],
        points: [{
          type: 'number',
          required: true,
          message: '请输入正确点数',
          trigger: 'blur'
        }],
        gameList: [{
          type: 'array',
          required: true,
          message: '请选择接入游戏',
          trigger: 'change'
        }],
        enabled: [{
          required: true,
          message: '请选择',
          trigger: 'change'
        }]
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
        url: '/merchants',
        method: 'post',
        data: this.form
      }
      zeusFetch(request).then(result => {
        const [err, merchantInfo] = result
        const merchantNumber = merchantInfo.data.payload.msn
        const merchantUsername = merchantInfo.data.payload.username
        const genGMParams = {
          url: '/gm_init_params',
          method: 'post',
          data: {
            username: merchantInfo.data.payload.username,
            password: merchantInfo.data.payload.password,
            msn: merchantInfo.data.payload.msn
          }
        }
        zeusFetch(genGMParams).then(result => {
          const [err, params] = result
          const request = {
            url: 'http://nagame.rottagame.com/admin/api/init_admin_access',
            method: 'post',
            data: qs.stringify(params.data.payload, {
              arrayFormat: 'brackets'
            })
          }
          axios(request).then(r => {
            loading.close(); //关闭loading
            if (r[0]) {
              this.addError()
            } else {
              this.addSuccess(); //成功提示
            }

            this.$router.replace('/merchants')
          })
        })


      }).catch(err => {
        loading.close(); //关闭loading
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
      if (!errMsg) {
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
