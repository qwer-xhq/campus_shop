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
    <el-table :data="myCollectGoods" border style="width: 100%">
      <el-table-column type="index"></el-table-column>
      <el-table-column prop="goods_name" label="商品名称"></el-table-column>
      <el-table-column prop="goods_number" label="商品数量" width="100px"></el-table-column>
      <el-table-column prop="goods_price" label="商品价格(元)" width="120px"></el-table-column>
      <el-table-column label="状态" width="100px">
        <template #default="scope">
          <el-tag type="primary" v-if="scope.row.goods_state===2">正常</el-tag>
          <el-tag type="success" v-else>已失效</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180">
        <template #default="scope">
          <!-- 详情 -->
          <el-button type="primary" size="mini" @click="toGoodsDetail(scope.row.goods_id)">详情</el-button>
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
    name: 'myCollection',
    data() {
      return {
        query: '', // 查询关键字
        // 商品查询参数
        queryInfo: {
          queryText: '',
          pagenum: 1,
          pagesize: 3,
        },
        myCollectGoods: [], // 收藏的商品
        goodsTotal: 0,
      }
    },
    methods: {
      async getMyCollect() {
        const res = await this.$http.getMyCollect(this.queryInfo)
        if(res.meta.status !== 200) return this.$message.error('获取我的收藏失败')
        this.myCollectGoods = res.data.goods
        this.goodsTotal = res.data.total
      },
      // 搜索获取商品列表
      inputSearchGoods() {
        this.queryInfo.queryText = this.query
        this.queryInfo.pagenum = 1  // 搜索时页数位置重置为 1
        this.getMyCollect()
      },
      // 每页数据条数发生改变是触发函数
      handleSizeChange(val) {
        // console.log(`每页 ${val} 条`);
        this.queryInfo.pagesize = val
        this.getMyCollect()
      },
      // 页数发生改变时触发函数
      handleCurrentChange(val) {
        // console.log(`当前页: ${val}`);
        this.queryInfo.pagenum = val
        this.getMyCollect()
      },
      // 去到商品详情
      toGoodsDetail(id) {
        this.$router.push('/detail/'+id)
      },
      // 删除收藏
      async deleteGoods(id) {
        this.$confirm('此操作将删除该收藏, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.cancelCollect(id).then((res) => {
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
            this.getMyCollect()
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
      },
    },
    created() {
      this.getMyCollect()
    }
  }
</script>

<style lang="" scoped>
  
</style>