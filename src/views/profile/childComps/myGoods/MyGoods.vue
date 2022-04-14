<template>
  <el-card>
    <el-row :gutter="20">
        <el-col :span="12">
          <el-input placeholder="请输入内容" v-model="query" clearable @clear="inputSearchGoods">
            <el-button slot="append" icon="el-icon-search" @click="inputSearchGoods"></el-button>
          </el-input>
        </el-col>
    </el-row>
    <!-- 表格区域 -->
    <el-table :data="goodsList" border style="width: 100%">
      <el-table-column type="index"></el-table-column>
      <el-table-column prop="goods_name" label="商品名称"></el-table-column>
      <el-table-column prop="goods_number" label="商品数量" width="100px"></el-table-column>
      <el-table-column prop="goods_price" label="商品价格(元)" width="120px"></el-table-column>
      <el-table-column prop="create_time" label="创建时间" width="160px">
        <template #default="scope">
          {{create_time(scope.row.create_time)}}
        </template>
      </el-table-column>
      <el-table-column label="状态" width="100px">
        <template #default="scope">
          <el-tag type="primary" v-if="scope.row.goods_state===2">正常</el-tag>
          <el-tag type="warning" v-else-if="scope.row.goods_state===1">审核中</el-tag>
          <el-tag type="success" v-else-if="scope.row.goods_state===3">已售</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="改为出售状态" width="120px">
        <template #default="scope">
          <el-switch
            @change="changeSellState(scope.row.goods_id)"
            v-model="scope.row.goods_state===3"
            :disabled="scope.row.goods_state!==2"
          >
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="130">
        <template #default="scope">
          <!-- 修改按钮 -->
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="editGoodsPage(scope.row.goods_id)" :disabled="scope.row.goods_state!==2"></el-button>
          <!-- 删除按钮 -->
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteGoods(scope.row.goods_id)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[1, 3, 5, 10]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="goodsTotal"
      background>
    </el-pagination>
  </el-card>
</template>

<script>
  export default {
    name: 'MyGoods',
    data() {
      return {
        query: '', // 查询关键字
        // 商品查询参数
        queryInfo: {
          queryText: '',
          pagenum: 1,
          pagesize: 3,
        },
        // 商品列表
        goodsList: [],
        goodsTotal: 0,
      }
    },
    computed: {
      create_time() {
        return function(time) {
          return this.$formatDate(time)
        }
      }
    },
    methods: {
      // 获取我的商品
      async getMyGoods() {
        const res = await this.$http.getMyGoods(this.queryInfo)
        if(res.meta.status !== 200) return this.$message.error('获取我的商品失败')
        this.goodsList = res.data.goods
        this.goodsTotal = res.data.total
      },
      // 搜索获取商品列表
      inputSearchGoods() {
        this.queryInfo.queryText = this.query
        this.queryInfo.pagenum = 1  // 搜索时页数位置重置为 1
        this.getMyGoods()
      },
      // 每页数据条数发生改变是触发函数
      handleSizeChange(val) {
        // console.log(`每页 ${val} 条`);
        this.queryInfo.pagesize = val
        this.getMyGoods()
      },
      // 页数发生改变时触发函数
      handleCurrentChange(val) {
        // console.log(`当前页: ${val}`);
        this.queryInfo.pagenum = val
        this.getMyGoods()
      },
      // 跳转到修改商品页面
      editGoodsPage(id) {
        // console.log(id);
        this.$router.push('/updategoods/'+id)
      },

      // 删除商品
      async deleteGoods(id) {
        this.$confirm('此操作将删除该商品, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.deleteGoods(id).then((res) => {
            if (res.meta.status!==200) {
             return this.$message.error('删除失败') 
            }
            // 如果最后一页只剩一条数据，判断删除的是否为最后一页最后一条数据
            if (this.queryInfo.pagenum>1) {
              if (this.goodsTotal%this.queryInfo.pagesize===1 && Math.ceil(this.goodsTotal/this.queryInfo.pagesize)===this.queryInfo.pagenum) {
                this.queryInfo.pagenum-=1
              }
            }
            this.$message({
              type: 'success',
              message: '删除成功!'
            });        
            this.getMyGoods()
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
      },
      // 改为售卖状态
      changeSellState(id) {
        this.$confirm('是否将商品改为已售状态?更改后不可修改！', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.updateGoodsState(id,{state:3}).then((res) => {
            if (res.meta.status!==200) {
             return this.$message.error('改变失败') 
            }
            // 如果最后一页只剩一条数据，判断删除的是否为最后一页最后一条数据
            if (this.queryInfo.pagenum>1) {
              if (this.goodsTotal%this.queryInfo.pagesize===1 && Math.ceil(this.goodsTotal/this.queryInfo.pagesize)===this.queryInfo.pagenum) {
                this.queryInfo.pagenum-=1
              }
            }
            this.$message({
              type: 'success',
              message: '已改为出售!'
            });        
            this.getMyGoods()
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取修改'
          });          
        });
      }
    },
    created() {
      this.getMyGoods()
    }
  }
</script>

<style lang="less" scoped>
  .el-card {
    width: 1000px;
  }
</style>