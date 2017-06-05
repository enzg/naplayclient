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
        <el-input placeholder="商户号" icon="search" v-model="searchInput" :on-icon-click="search">
        </el-input>
      </div>
    </div>
    <el-table ref="multipleTable" :data="tableData" border tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
      <!-- <el-table-column type="selection" width="55" align="center">
      </el-table-column> -->
      <el-table-column prop="sk" label="商户号" align="center" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="current_state" label="状态" align="center" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="merchant_name" label="所属" align="center" show-overflow-tooltip>
      </el-table-column>
      <!-- <el-table-column label="操作" align="center">
        <template scope="scope">
            <el-button size="small" type="info" @click="editOperation(scope.$index, scope.row)">编辑</el-button>
            <el-button size="small" type="danger" @click="stopOperation">停用</el-button>
          </template>
      </el-table-column> -->
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
export default {
  data() {
    return {
      frameTitle: '商户号',
      tableData: [],
      multipleSelection: [],
      currentPage2: 1,
      searchInput: '',
      batchDisabled: true,
      totalPage: 0
    }
  },
  methods: {
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
      console.log(inputVal);
      this.list();
    },
    editOperation(index, row) {
      console.log(index);
      console.log(row);
    },
    stopOperation() {
      this.$confirm('是否停用所选商家?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.list(() => {
          this.$message({
            type: 'success',
            message: '操作成功!'
          });
        });

      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        });
      });
    },
    list(callback) {
      const request = {
        url: '/numbers',
        method: 'get'
      }
      let loading = this.$loading({
        target: "#frameWrapper"
      })
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
    }
  },
  mounted(){
    this.list()
  }
}
</script>
