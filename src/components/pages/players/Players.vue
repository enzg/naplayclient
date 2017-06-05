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
              <el-form-item label="玩家用户名">
                <span>{{ props.row.username }}</span>
              </el-form-item>
              <el-form-item label="玩家昵称">
                <span>{{ props.row.nick || '未设置' }}</span>
              </el-form-item>
              <el-form-item label="创建时间">
                <span>{{new Date(props.row.createdAt).toLocaleString()}}</span>
              </el-form-item>
              <el-form-item label="创建者">
                <span>{{ props.row.pk.split(':')[0]}}</span>
              </el-form-item>
              <el-form-item label="密码">
                <span>{{ props.row.password }}</span>
              </el-form-item>
              <el-form-item label="玩家性别">
                <span>{{ props.row.gender == '0'? '男':'女  ' }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>

        <el-table-column label="玩家用户名" prop="username" show-overflow-tooltip>
        </el-table-column>
        <el-table-column label="玩家初始密码" prop="password" show-overflow-tooltip>
        </el-table-column>
        <el-table-column label="操作" align="left" width="350">
          <template scope="scope">
            <!-- <el-button size="small" type="info" @click="editOperation(scope.$index, scope.row)">编辑</el-button> -->
            <el-button size="small" type="danger" @click="addPoints(scope.row)">充值金币</el-button>
            <el-button size="small" type="info" @click="toTransfers(scope.row)">充值记录</el-button>
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
  PLAYER_ROLE
} from '@/config/aws-config'
export default {
  data() {
    return {
      frameTitle:'玩家列表',
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
        url: '/childplayers/'+this.$route.params.username + '/' + this.$route.params.msn,
        method: 'get',
        params:params
      }
      zeusFetch(request).then(result => {
        let [err, ret] = result
        this.tableData = ret.data.payload.Items
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
        this.$router.push('/merchants/addcoins/'+ row.username)
    },
    toTransfers(row){
      this.$router.push('/transfers/'+row.username+'/'+PLAYER_ROLE)
    }
  },
  mounted(){
    this.list()
  },
  created() {
  },
}
</script>
