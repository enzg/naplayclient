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
      <el-breadcrumb-item>局列表</el-breadcrumb-item>
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
            <el-form label-position="left" inline class="er-table-expand" label-width = "40%">
              <el-form-item label="游戏类型">
                <span>{{ props.row.kindId }}</span>
              </el-form-item>
              <el-form-item label="房间id">
                <span>{{ props.row.payload.RoomID }}</span>
              </el-form-item>
              <el-form-item label="局编号">
                <span>{{ props.row.payload.JuID }}</span>
              </el-form-item>
              <el-form-item label="庄家输赢">
                <span>{{ props.row.payload.winorlose == 0 ? '输' : '赢'  }}</span>
              </el-form-item>
              <el-form-item label="庄家id">
                <span>{{ props.row.payload.BankerUserID }}</span>
              </el-form-item>
              <el-form-item label="庄家昵称">
                <span>{{ props.row.payload.BankerNickname }}</span>
              </el-form-item>
              <el-form-item label="庄家用户名">
                <span>{{ props.row.payload.BankerUserName }}</span>
              </el-form-item>
              <el-form-item label="庄家所属商户ID">
                <span>{{ props.row.payload.msn }}</span>
              </el-form-item>
              <el-form-item label="抽水锅底">
                <span>{{ props.row.payload.BottomOfPot }}</span>
              </el-form-item>
              <el-form-item label="是否喝水">
                <span>{{ props.row.payload.PlayWay == 0 ? '否' : '是'}}</span>
              </el-form-item>
              <el-form-item label="房主抽水金额">
                <span>{{ props.row.payload.PumpWater }}</span>
              </el-form-item>
              <el-form-item label="房主抽水比例">
                <span>{{ props.row.payload.PumpWaterPercent + '%' }}</span>
              </el-form-item>
              <el-form-item label="本局结束时间">
                <span>{{  new Date(props.row.payload.LogTime * 1000).toLocaleString()}}</span>
              </el-form-item>
            </el-form>
          </template>
      </el-table-column>

      <!-- <el-table-column type="selection" width="55">
        </el-table-column> -->
      <el-table-column label="游戏类型" prop="kindId" show-overflow-tooltip>
      </el-table-column>
      <el-table-column label="房间id" prop="payload.RoomID" show-overflow-tooltip>
      </el-table-column>
      <el-table-column label="庄家用户名" prop="payload.BankerUserName" show-overflow-tooltip>
      </el-table-column>
      <el-table-column label="房主抽水金额" prop="payload.PumpWater" show-overflow-tooltip>
      </el-table-column>
      <el-table-column label="操作" align="left" width="180">
        <template scope="scope">
            <el-button size="small" type="info" @click="matchDetial(scope.row)">详情</el-button>
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
        url: '/match_report/' + this.$route.params.msn + '/' + this.$route.params.gameId + '/' + this.$route.params.roomId,
        method: 'get'
      }
      let loading = this.$loading({
        target: "#frameWrapper"
      })
      reportFetch(request).then(result => {
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
      console.log(inputVal);
      this.list();
    },
    matchDetial(row) {
      this.$router.push('/reports/' + this.$route.params.msn + '/' + this.$route.params.gameId + '/' + this.$route.params.roomId + '/' + row.payload.JuID)
    }
  }
}
</script>
