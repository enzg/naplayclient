<template>
  <div class="er-frame-container">
    <div class="er-block-container er-frame-title">
      <h1>{{ frameTitle }}</h1>
    </div>
    <div class="er-block-container">
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="游戏ID" name="sk">
          <div>{{form.sk}}</div>
        </el-form-item>
        <el-form-item label="游戏名称" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="开发商" prop="vendor">
          <el-input v-model="form.vendor"></el-input>
        </el-form-item>
        <el-form-item label="开发商邮箱" prop="contact">
          <el-input v-model="form.contact"></el-input>
        </el-form-item>
        <el-form-item label="游戏地址IP" prop="serverIP">
          <el-input v-model="form.serverIP" placeholder="例：http://www.qq.com/"></el-input>
        </el-form-item>
        <el-form-item label="游戏配置地址" prop="gmIP">
          <el-input v-model="form.gmIP" placeholder="例：http://www.qq.com/"></el-input>
        </el-form-item>
        <el-form-item label="游戏类型" prop="type">
          <el-select v-model="form.type">
            <el-option v-for="item in gameTypes" :key="item.kindId" :label="item.name" :value="item.kindId"></el-option>
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
import { gameTypes } from '@/config/gameTypes'
export default {
  data() {
    return {
      frameTitle: '编辑游戏',
      gameTypes:gameTypes,
      form: { // this are all the editable attries
        contact: '',
        name: '',
        gmIP:'',
        serverIP: '',
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
        url: '/games/'+this.$route.params.id,
        method: 'put',
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
    }
  },
  created() {
    let loading = this.$loading({
      target: "#frameWrapper"
    });
    // load all data from show api
    // but only those in the data can be update
    const getItem = {
      url: '/games/'+ this.$route.params.id,
      method: 'get'
    }
      zeusFetch(getItem).then(result=>{
      loading.close();    //关闭loading
      this.form = {...result['1'].data.payload.Item}
    }).catch(err=>{
      loading.close();    //关闭loading
    })
  }
}
</script>
