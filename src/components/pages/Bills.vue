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
              <el-form-item label="转出账号">
                <span>{{ props.row.from }}</span>
              </el-form-item>
              <el-form-item label="转入账号">
                <span>{{ props.row.to }}</span>
              </el-form-item>
              <el-form-item label="金额">
                <span>{{ props.row.amount }}</span>
              </el-form-item>
              <el-form-item label="类型">
                <span>{{ props.row.type }}</span>
              </el-form-item>
              <el-form-item label="时间">
                <span>{{ new Date(props.row.createdAt).toLocaleString()  }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>

        <el-table-column label="转出账号" prop="from" show-overflow-tooltip>
        </el-table-column>
        <el-table-column label="转入账号" prop="to" show-overflow-tooltip>
        </el-table-column>
        <el-table-column label="金额" prop="amount" show-overflow-tooltip>
        </el-table-column>
        <el-table-column label="类型" prop="type" show-overflow-tooltip>
        </el-table-column>
        <!-- <el-table-column label="操作" align="left" width="100">
          <template scope="scope">
            <el-button size="small" type="info" @click="editOperation(scope.$index, scope.row)">编辑</el-button>
            <el-button size="small" type="danger" @click="addPoints(scope.row)">充值点数</el-button>
            <el-button size="small" type="info" @click="toReportDetail(scope.row)">详细报表</el-button>
          </template>
        </el-table-column> -->
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
export default {
  data() {
    return {
      frameTitle:'充值记录',
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
        url: '/bills/'+ this.$route.params.username + '/' + this.$route.params.role,
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
    }
    // editOperation(index, row) {
    //   this.$router.push('/merchants/edit/'+ row.sk)
    // },
    // toReportDetail(row) {
    //   let gameIds = ''
    //   if (row.gameList.length > 0) {
    //     gameIds = [...row.gameList].join(',')
    //   }
    //   this.$router.push('/reports/'+ row.assets.msn+ '?gameIds='+ gameIds)
    // },
    // addPoints(row){
    //     this.$router.push('/merchants/addpoints/'+ row.username)
    // }
  },
  mounted(){
    this.list()
  },
  created() {
  },
}
</script>
