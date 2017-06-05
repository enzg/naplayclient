<template>
  <div class="er-frame-container">
    <div class="er-block-container er-frame-title">
      <h1>{{ frameTitle }}</h1>
    </div>
    <div class="er-block-container">
      <div class="er-table-bar">
        <div class="er-table-operation">
          <!-- <el-button type="danger" icon="circle-cross" size="small" :disabled="batchDisabled" @click="stopOperation">停用</el-button> -->
        </div>
        <div class="er-table-search">
          <el-input placeholder="建站商用户名" icon="search" v-model="searchInput" :on-icon-click="search">
          </el-input>
        </div>
      </div>
      <el-table ref="multipleTable" :data="tableData" border tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">

        <el-table-column type="expand">
          <template scope="props">
            <el-form label-position="left" inline class="er-table-expand" label-width="110px">
              <el-form-item label="用户名">
                <span>{{ props.row.username }}</span>
              </el-form-item>
              <el-form-item label="昵称">
                <span>{{ props.row.nick }}</span>
              </el-form-item>
              <el-form-item label="ID">
                <span>{{ props.row.sk }}</span>
              </el-form-item>
              <el-form-item label="初始点数">
                <span>{{ props.row.assets.points }}</span>
              </el-form-item>
              <el-form-item label="成数">
                <span>{{ props.row.ratio }}</span>
              </el-form-item>
              <el-form-item label="创建者ID">
                <span>{{ props.row.pk }}</span>
              </el-form-item>
              <el-form-item label="初始密码">
                <span>{{ props.row.password }}</span>
              </el-form-item>
              <el-form-item label="备注">
                <span>{{ props.row.remark }}</span>
              </el-form-item>
              <el-form-item label="当前状态">
                <span>{{ props.row.enabled == '1'?'激活':'禁用' }}</span>
              </el-form-item>
              <el-form-item label="密保邮箱">
                <span>{{ props.row.email }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
<!--
        <el-table-column type="selection" width="55" align="center">
        </el-table-column> -->
        <el-table-column prop="username" label="建站商用户名" align="center" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="password" label="初始密码" align="center" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="limit" label="下属商户上限" align="center" show-overflow-tooltip>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template scope="scope">
            <el-button size="small" type="info" @click="editOperation(scope.$index, scope.row)">编辑</el-button>
            <el-button size="small" type="danger" @click="addPoints(scope.row)">充值点数</el-button>
            <el-button size="small" type="info" @click="toTransfers(scope.row)">充值记录</el-button>
            <!-- <el-button size="small" type="info" @click="childList(scope.row)">下级列表</el-button> -->
          </template>
        </el-table-column>
      </el-table>

      <div class="er-table-paging">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="currentPage2" :page-sizes="[5, 10, 20, 50,100]" :page-size="10" layout="sizes, prev, pager, next" :total="totalPage">
        </el-pagination>
      </div>
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
export default {
  data() {
    return {
      frameTitle:'建站商列表',
      tableData: [],
      multipleSelection: [],
      currentPage2: 1,
      searchInput: '',
      batchDisabled: true,
      totalPage: 0
    }
  },
  mounted(){
    this.list()
  },
  methods: {
    list(callback) {
      let loading = this.$loading({
        target: "#frameWrapper"
      })
      const request = {
        url: `/child_managers/${this.$route.params.username}/${this.$route.params.role}`,
        method: 'get'
      }

      zeusFetch(request).then(result => {
        let [err, ret] = result
        this.tableData = ret.data.payload.Items
        this.totalPage = 40
        loading.close()
        callback && callback()
      }).catch(err => {
        loading.close()
        let [fetchError, ret] = err
      })
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.list();
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.list();
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
      console.log(val);
    },
    search(ev) {
      var inputVal = this.searchInput;
      this.list();
    },
    editOperation(index, row) {
      this.$router.push('/managers/edit/'+ row.sk)
    },
    addPoints(row){
        this.$router.push('/managers/addpoints/'+ row.username)
    },
    toTransfers(row){
      this.$router.push('/transfers/'+row.username+'/'+MANAGER_ROLE)
    },
    childList(row){
      this.$router.replace('/submanagers/'+ row.username + '/' + MANAGER_ROLE + '?t=' + new Date().getTime())
    }
  }
}
</script>
