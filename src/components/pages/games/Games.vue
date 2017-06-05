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
          <el-input placeholder="游戏名称" icon="search" v-model="searchInput" :on-icon-click="search">
          </el-input>
        </div>
      </div>
      <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="expand">
          <template scope="props">
            <el-form label-position="left" inline class="er-table-expand">
              <el-form-item label="商品名称">
                <span>{{ props.row.name }}</span>
              </el-form-item>
              <el-form-item label="开发商">
                <span>{{ props.row.vendor }}</span>
              </el-form-item>
              <el-form-item label="联系方式">
                <span>{{ props.row.contact }}</span>
              </el-form-item>
              <el-form-item label="游戏类型">
                <span>{{ props.row.type}}</span>
              </el-form-item>
              <el-form-item label="服务地址">
                <span>{{ props.row.serverIP }}</span>
              </el-form-item>
              <el-form-item label="GM地址">
                <span>{{ props.row.gmIP }}</span>
              </el-form-item>
              <el-form-item label="游戏简介">
                <span>{{ props.row.remark }}</span>
              </el-form-item>
              <el-form-item label="游戏ID">
                <span>{{ props.row.sk }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>

        <!-- <el-table-column type="selection" width="55">
        </el-table-column> -->
        <el-table-column label="游戏ID" prop="sk" show-overflow-tooltip>
        </el-table-column>
        <el-table-column label="游戏名称" prop="name" show-overflow-tooltip>
        </el-table-column>
        <el-table-column label="游戏类型" prop="type" show-overflow-tooltip>
        </el-table-column>
        <el-table-column label="游戏开发商" prop="vendor" show-overflow-tooltip>
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
  awsFetch,
  zeusFetch
} from '@/libs/awsLib'
import { gameTypes } from '@/config/gameTypes'
import _ from 'lodash'

export default {
  mounted(){
    this.list()
  },
  data() {
    return {
      frameTitle:'平台游戏列表',
      tableData: [],
      multipleSelection: [],
      currentPage2: 1,
      searchInput: '',
      batchDisabled: true,
      totalPage: 0
    }
  },
  methods: {
    getTypeName(type){
      const found =
      _.filter(gameTypes,(item)=>{
        return item.kindId == type
      })
      return found[0].name
    },
    list(callback) {
      const request = {
        url: '/games',
        method: 'get'
      }
      let loading = this.$loading({
        target: "#frameWrapper"
      })
      zeusFetch(request).then(result => {
        let [err, ret] = result
        this.tableData = ret.data.payload.Items
        this.tableData = _.map(this.tableData,(item)=>{
          return {...item,type:this.getTypeName(item.type)}
        })
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
      console.log(inputVal);
      this.list();
    },
    editOperation(index, row) {
      this.$router.push('/games/edit/'+ row.sk)
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
  }
}
</script>
