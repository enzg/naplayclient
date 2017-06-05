<template>
<div class="er-frame-container">


  <div class="er-block-container er-frame-title">
    <h1>{{ frameTitle }}</h1>
  </div>
  <div class="er-block-container er-frame-title">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/merchants' }">商户列表</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/reports/' + this.$route.params.msn }">游戏列表</el-breadcrumb-item>
      <el-breadcrumb-item>房间列表</el-breadcrumb-item>
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
              <el-form-item label="房间号">
                <span>{{ props.row.payload.id }}</span>
              </el-form-item>
              <el-form-item label="开房者">
                <span>{{ props.row.payload.CreatorID }}</span>
              </el-form-item>
              <el-form-item label="开房者昵称">
                <span>{{ props.row.payload.CreatorNickname }}</span>
              </el-form-item>
              <el-form-item label="开房者用户名">
                <span>{{ props.row.payload.CreatorUserName }}</span>
              </el-form-item>
              <el-form-item label="开房者所属商户号">
                <span>{{ props.row.payload.msn }}</span>
              </el-form-item>
              <el-form-item label="房间的玩家人数">
                <span>{{ props.row.payload.UserNum }}</span>
              </el-form-item>
              <el-form-item label="庄家赢时抽成比例">
                <span>{{ props.row.payload.WinTaxRate + '%' }}</span>
              </el-form-item>
              <el-form-item label="庄家输时抽成比例">
                <span>{{ props.row.payload.LoseTaxRate + '%' }}</span>
              </el-form-item>
              <el-form-item label="房间开始时间">
                <span>{{ new Date(props.row.payload.StartTime * 1000).toLocaleString()}}</span>
              </el-form-item>
              <el-form-item label="房间结束时间">
                <span>{{ new Date(props.row.payload.EndTime * 1000).toLocaleString() }}</span>
              </el-form-item>
              <el-form-item label="房间使用时间">
                <span>{{ parseInt(props.row.payload.LastedTime / 60 ) + '分钟'}}</span>
              </el-form-item>
              <el-form-item label="房间的收益">
                <span>{{ props.row.payload.Incomes }}</span>
              </el-form-item>
            </el-form>
          </template>
      </el-table-column>

      <!-- <el-table-column type="selection" width="55">
        </el-table-column> -->
      <el-table-column label="游戏类型" prop="payload.kindId" show-overflow-tooltip>
      </el-table-column>
      <el-table-column label="房间号" prop="payload.id" show-overflow-tooltip>
      </el-table-column>
      <el-table-column label="开房者" prop="payload.CreatorID" show-overflow-tooltip>
      </el-table-column>
      <el-table-column label="开房者所属商户号" prop="payload.msn" show-overflow-tooltip>
      </el-table-column>
      <el-table-column label="房间的收益" prop="payload.Incomes" show-overflow-tooltip>
      </el-table-column>
      <el-table-column label="操作" align="left" width="180">
        <template scope="scope">
            <el-button size="small" type="info" @click="roomDetail(scope.row)">详情</el-button>
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
        url: '/room_report/' + this.$route.params.msn + '/' + this.$route.params.gameId,
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
    roomDetail(row) {
      this.$router.push('/reports/' + this.$route.params.msn + '/' + this.$route.params.gameId + '/' + row.payload.id)
    }
  }
}
</script>
