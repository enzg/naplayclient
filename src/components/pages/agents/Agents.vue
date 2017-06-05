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
          <el-input placeholder="请输入代理帐号" icon="search" v-model="searchInput" :on-icon-click="search">
          </el-input>
        </div>
      </div>
      <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="expand">
          <template scope="props">
            <el-form label-position="left" inline class="er-table-expand">
              <el-form-item label="代理用户名">
                <span>{{ props.row.child }}</span>
              </el-form-item>
              <el-form-item label="代理ID">
                <span>{{ props.row.sk }}</span>
              </el-form-item>
              <el-form-item label="创建者ID">
                <span>{{ props.row.pk }}</span>
              </el-form-item>
              <el-form-item label="初始密码">
                <span>{{ props.row.originPass }}</span>
              </el-form-item>
              <el-form-item label="代理昵称">
                <span>{{ props.row.nick }}</span>
              </el-form-item>
              <el-form-item label="当前状态">
                <span>{{ props.row.enabled == '1'?'激活':'禁用' }}</span>
              </el-form-item>
              <el-form-item label="代理备注">
                <span>{{ props.row.remark }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>

        <!-- <el-table-column type="selection" width="55">
        </el-table-column> -->
        <el-table-column label="代理用户名" prop="child" show-overflow-tooltip>
        </el-table-column>
        <el-table-column label="初始密码" prop="originPass" show-overflow-tooltip>
        </el-table-column>
        <el-table-column label="代理备注" prop="remark" show-overflow-tooltip>
        </el-table-column>
        <el-table-column label="操作" align="left" width="180">
          <template scope="scope">
              <el-button size="small" type="info" @click="editOperation(scope.$index, scope.row)">编辑</el-button>

            <el-button size="small" type="danger" @click="stopOperation">停用</el-button>
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
  awsFetch
} from '@/libs/awsLib'
export default {
  data() {
    return {
      frameTitle:'代理列表',
      tableData: [],
      multipleSelection: [],
      currentPage2: 1,
      searchInput: '',
      batchDisabled: true,
      totalPage: 0
    }
  },
  methods: {
    list(callback) {
      let loading = this.$loading({
        target: "#frameWrapper"
      })
      const request = {
        url: '/agents',
        method: 'get'
      }
      awsFetch(request).then(result => {
        let [err, ret] = result
        this.tableData = ret.data.payload.Items
        this.message = ret
        this.totalPage = 40
        loading && loading.close()
        callback && callback()
      }).catch(err => {
        loading && loading.close()
        console.log(err);
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
      console.log(inputVal);
      this.list();
    },
    editOperation(index, row) {
      this.$router.push('/agents/edit/'+ row.sk)
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
    }
  },
  mounted(){
    this.list()
  }
}
</script>
