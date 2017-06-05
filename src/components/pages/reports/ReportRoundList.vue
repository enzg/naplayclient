<template>
<div class="er-frame-container">


  <div class="er-block-container er-frame-title">
    <h1>{{ frameTitle }}</h1>
  </div>
  <div class="er-block-container er-frame-title">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/merchants' }">商户列表</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/reports/' + this.$route.params.msn }">游戏列表</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/reports/' + this.$route.params.msn + '/' + this.$route.params.gameId }">房间列表</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/reports/' + this.$route.params.msn + '/' + this.$route.params.gameId + '/' + this.$route.params.roomId}">局列表</el-breadcrumb-item>
      <el-breadcrumb-item>回合列表</el-breadcrumb-item>
    </el-breadcrumb>
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
              <el-form-item label="游戏类型">
                <span>{{ props.row.payload.kindId }}</span>
              </el-form-item>
              <el-form-item label="局编号">
                <span>{{ props.row.payload.JuID }}</span>
              </el-form-item>
              <el-form-item label="时间">
                <span>{{ props.row.payload.LogTime }}</span>
              </el-form-item>
              <el-form-item label="房间编号">
                <span>{{ props.row.payload.RoomID }}</span>
              </el-form-item>
              <el-form-item label="回合编号">
                <span>{{ props.row.payload.RoundID }}</span>
              </el-form-item>
              <el-form-item label="锅底值">
                <span>{{ props.row.payload.BottomOfPot }}</span>
              </el-form-item>
              <el-form-item label="用户列表">
                <el-tag type="primary" v-for="item in props.row.payload.Users" key={ item.sk} style="margin-right:10px;">{{ item.UserName }}</el-tag>
              </el-form-item>
            </el-form>
          </template>
      </el-table-column>

      <!-- <el-table-column type="selection" width="55">
        </el-table-column> -->
      <el-table-column label="游戏类型" prop="payload.kindId" show-overflow-tooltip>
      </el-table-column>
      <el-table-column label="时间" prop="payload.LogTime" show-overflow-tooltip>
      </el-table-column>
      <el-table-column label="回合编号" prop="payload.RoundID" show-overflow-tooltip>
      </el-table-column>
      <el-table-column label="锅底值" prop="payload.BottomOfPot" show-overflow-tooltip>
      </el-table-column>
      <!-- <el-table-column label="操作" align="left" width="180">
        <template scope="scope">
            <el-button size="small" type="info" @click="roomDetail(scope.row)">详情</el-button>
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
  reportFetch
} from '@/libs/awsLib'
export default {
  mounted() {
    this.list()
  },
  data() {
    return {
      frameTitle: '房间列表',
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
      const request = {
        url: '/round_report/' + this.$route.params.msn + '/' + this.$route.params.gameId + '/' + this.$route.params.roomId + '/' + this.$route.params.matchId,
        method: 'get'
      }
      let loading = this.$loading({
        target: "#frameWrapper"
      })
      reportFetch(request).then(result => {
        let [err, ret] = result
        this.totalPage = 40
        this.tableDataHanlde(ret.data.payload.Items);
        loading.close()
        callback && callback()
      }).catch(err => {
        loading.close()
        let [fetchError, ret] = err
      })
    },
    tableDataHanlde(data){
      data.forEach(v=>{
        v.payload.LogTime = new Date(v.payload.LogTime * 1000).toLocaleString()
      })
      this.tableData = data;
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
    roomDetail(row) {
      this.$router.push('/reports/' + this.$route.params.msn + '/' + this.$route.params.gameId + '/' + row.sk)
    }
  }
}
</script>
