<template>
  <div class="">
    <!-- 导航 -->
    <Breadcrumb :navTitle="['首页','商品管理','商品列表']"></Breadcrumb>
    <!-- 内容卡片 -->
    <el-card style="min-width:1030px;">
      <el-row :gutter="20">
        <el-col :span="9">
          <span style="font-size:20px">请选择状态：</span>
          <el-select v-model="queryInfo.goods_state" placeholder="请选择" @change="inputSearchGoods">
            <el-option
              v-for="item in stateOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-col>
        
        <el-col :span="10">
          <el-input placeholder="请输入内容" v-model="query" clearable @clear="inputSearchGoods">
            <el-button slot="append" icon="el-icon-search" @click="inputSearchGoods"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- 表格区域 -->
      <el-table :data="goodsList" border style="width: 100%">
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="goods_name" label="商品名称"></el-table-column>
        <el-table-column prop="user_name" label="发布者"></el-table-column>
        <el-table-column prop="goods_number" label="商品数量" width="100px"></el-table-column>
        <el-table-column prop="goods_price" label="商品价格(元)" width="120px"></el-table-column>
        <el-table-column prop="create_time" label="创建时间" width="160px">
          <template #default="scope">
            {{create_time(scope.row.create_time)}}
          </template>
        </el-table-column>
        <el-table-column prop="create_time" label="更新时间" width="160px">
          <template #default="scope">
            {{update_time(scope.row.update_time)}}
          </template>
        </el-table-column>
        <el-table-column label="状态" width="80px">
          <template #default="scope">
            <el-tag type="primary" v-if="scope.row.goods_state===2">正常</el-tag>
            <el-tag type="warning" v-else-if="scope.row.goods_state===1">审核中</el-tag>
            <el-tag type="success" v-else-if="scope.row.goods_state===3">已售</el-tag>
            <el-tag type="danger" v-else-if="scope.row.goods_state===0">违规</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="250">
          <template #default="scope">
            <!-- 通过审核按钮 -->
            <el-button type="primary" size="mini" @click="changeGoodsState(scope.row.goods_id,2)" v-if="scope.row.goods_state===0||scope.row.goods_state===1" >通过审核</el-button>
            <!-- 违规按钮 -->
            <el-button type="warning" size="mini" @click="changeGoodsState(scope.row.goods_id,0)" v-if="scope.row.goods_state===1||scope.row.goods_state===2">违规</el-button>
            <!-- 删除按钮 -->
            <el-button type="danger" size="mini" @click="deleteGoods(scope.row.goods_id)">删除</el-button>
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
  </div>
</template>

<script>
  import Breadcrumb from 'components/content/breadcrumb/Breadcrumb'
  export default {
    name: 'GoodsList',
    components: {
      Breadcrumb
    },
    data() {
      return {
        query: '', // 查询关键字
        // 商品查询参数
        queryInfo: {
          queryText: '',
          pagenum: 1,
          pagesize: 5,
          goods_state: '',
        },
        // 商品列表
        goodsList: [],
        goodsTotal: 0, // 商品总数
        // 商品状态选项
        stateOptions: [
          {value: '',label: "全部商品"},
          {value: 0,label: "违规商品"},
          {value: 1,label: "待审核商品"},
          {value: 2,label: "正常商品"},
          {value: 3,label: "已售商品"},
        ]
      }
    },
    computed: {
      create_time() {
        return function(time) {
          return this.$formatDate(time)
        }
      },
      update_time() {
        return function(time) {
          return this.$formatDate(time)
        }
      },

    },
    methods: {
      // 获取商品列表
      async getGoodsList() {
        const res = await this.$http.mgGetGoodsList(this.queryInfo)
        if (res.meta.status !== 200) {
          return this.$message.error('获取商品列表失败')
        }
        this.goodsTotal = res.data.total
        this.goodsList = res.data.goods
      },
      // 搜索获取商品列表
      inputSearchGoods() {
        this.queryInfo.queryText = this.query
        this.queryInfo.pagenum = 1  // 搜索时页数位置重置为 1
        this.getGoodsList()
      },
      // 每页数据条数发生改变是触发函数
      handleSizeChange(val) {
        // console.log(`每页 ${val} 条`);
        this.queryInfo.pagesize = val
        this.getGoodsList()
      },
      // 页数发生改变时触发函数
      handleCurrentChange(val) {
        // console.log(`当前页: ${val}`);
        this.queryInfo.pagenum = val
        this.getGoodsList()
      },
      // 格式化创建时间
      add_time(date) {
        return formatDate(date,'yyyy-MM-dd hh:mm:ss')
      },
      // 删除商品
      deleteGoods(id) {
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
            this.getGoodsList()
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
      },
      // 跳转到添加商品页面
      addGoodsPage() {
        this.$router.push(this.$route.fullPath+'/add')
      },
      // 跳转到修改商品页面
      editGoodsPage(id) {
        // console.log(id);
        this.$router.push(this.$route.fullPath+'/edit/'+id)
      },
      // 改变商品状态
      changeGoodsState(id,state) {
        this.$confirm(`确认商品${state===0?'违规':'通过审核'}吗?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.updateGoodsState(id,{state:state}).then((res) => {
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
              message: '修改成功'
            });        
            this.getGoodsList()
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取修改'
          });          
        });
      },
    },
    created() {
      this.getGoodsList()
    }
  }
</script>

<style scoped>
  
</style>