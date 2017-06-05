<template>
  <div class="er-frame-container">
    <div class="er-block-container er-frame-title">
      <h1>{{ frameTitle }}</h1>
    </div>
    <div class="er-block-container">
      <div class="er-table-bar">
        <div class="er-table-operation">
        </div>
        <div class="er-table-search">
          <el-input placeholder="商户用户名" icon="search" v-model="searchInput" :on-icon-click="search">
          </el-input>
        </div>
      </div>
      <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="expand">
          <template scope="props">
            <el-form label-position="left" inline class="er-table-expand">
              <el-form-item label="商户用户名">
                <span>{{ props.row.username }}</span>
              </el-form-item>
              <el-form-item label="商户昵称">
                <span>{{ props.row.nick }}</span>
              </el-form-item>
              <!-- <el-form-item label="商户ID">
                <span>{{ props.row.sk }}</span>
              </el-form-item> -->
              <el-form-item label="创建者">
                <span>{{ props.row.pk.split(':')[0] || 'error' }}</span>
              </el-form-item>
              <el-form-item label="密码">
                <span>{{ props.row.password }}</span>
              </el-form-item>
              <el-form-item label="创建时间">
                <span>{{ new Date(props.row.createdAt).toLocaleString() }}</span>
              </el-form-item>
              <el-form-item label="商户备注">
                <span>{{ props.row.remark }}</span>
              </el-form-item>
              <el-form-item label="商户号">
                <span>{{ props.row.assets.msn }}</span>
              </el-form-item>
              <el-form-item label="成数">
                <span>{{ props.row.ratio }}</span>
              </el-form-item>
              <el-form-item label="点数">
                <span>{{props.row.points}} </span>
              </el-form-item>
              <el-form-item label="当前状态">
                <span>{{ props.row.enabled == '1'?'启用':'禁用' }}</span>
              </el-form-item>
              <el-form-item label="密保邮箱">
                <span>{{ props.row.email }}</span>
              </el-form-item>
              <el-form-item label="接入游戏">
                <template v-for="data in props.row.gameList">
                  <a :href="data.serverIP" style="margin: 0 6px">
                    <el-tag>{{data}}</el-tag>
                  </a>
                </template>
              </el-form-item>
              <el-form-item label="商户域名">
                <span>{{ props.row.site }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>

        <el-table-column label="商户用户名" prop="username" show-overflow-tooltip>
        </el-table-column>
        <el-table-column label="商户初始密码" prop="password" show-overflow-tooltip>
        </el-table-column>
        <el-table-column label="商户号" prop="assets.msn" show-overflow-tooltip>
        </el-table-column>
        <el-table-column label="昵称" prop="nick" show-overflow-tooltip>
        </el-table-column>
        <el-table-column label="操作" align="left" width="500">
          <template scope="scope">
            <el-button size="small" type="info" @click="editOperation(scope.$index, scope.row)">编辑</el-button>
            <el-button size="small" type="info" @click="toReportDetail(scope.row)">详细报表</el-button>
            <el-button size="small" type="danger" @click="addPoints(scope.row)">充值点数</el-button>
            <el-button size="small" type="info" @click="toTransfers(scope.row)">充值记录</el-button>
            <el-button size="small" type="info" @click="childList(scope.row)">下级列表</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="er-table-paging">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-sizes="[100]" :page-size="100" layout="sizes, prev, pager, next" :total="totalPage">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import {
  zeusFetch
} from '@/libs/awsLib'
import {
  MERCHANT_ROLE
} from '@/config/aws-config'
const qs = require('qs')
export default {
  data() {
    return {
      frameTitle:'商户列表',
      tableData: [],
      multipleSelection: [],
      currentPage: 1,
      searchInput: '',
      batchDisabled: true,
      totalPage: 0,
      message: []
    }
  },
  methods: {

    list(callback,params = {}) {
      let loading = this.$loading({
        target: "#frameWrapper"
      })
      const request = {
        url: '/merchants',
        method: 'get',
        params:params
      }
      zeusFetch(request).then(result => {
        let [err, ret] = result
        this.tableData = ret.data.payload.Items
        _.each(this.tableData,(item,index)=>{
          zeusFetch({
            url:'/points/' + item.username + '/' + MERCHANT_ROLE,
            method:'get'
          }).then(result =>{
            let [err, ret] = result
            this.tableData[index].points = ret.data.payload.points
          })
        })


        this.message = ret
        this.totalPage = 100
        loading.close()
        callback && callback()

      }).catch(err => {
        loading.close()
        let [fetchError, ret] = err
      })
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.list()
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.list()
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      if (val.length > 0) {
        this.batchDisabled = false;
      } else {
        this.batchDisabled = true;
      }
    },
    search(ev) {
      var inputVal = this.searchInput;
      this.list();
    },
    editOperation(index, row) {
      this.$router.push('/merchants/edit/'+ row.sk)
    },
    toReportDetail(row) {
      let gameIds = ''
      if (row.gameList.length > 0) {
        gameIds = [...row.gameList].join(',')
      }
      this.$router.push('/reports/'+ row.assets.msn+ '?gameIds='+ gameIds)
    },
    addPoints(row){
        this.$router.push('/merchants/addpoints/'+ row.username)
    },
    toTransfers(row){
      this.$router.push('/transfers/'+row.username+'/'+MERCHANT_ROLE)
    },
    childList(row){
      this.$router.push('/players/'+ row.username + '/' + row.assets.msn)
    },
    registerGM(row){

    }

  },
  mounted(){
    this.list()
  },
  created() {
  },
}
</script>
