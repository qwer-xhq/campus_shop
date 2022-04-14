<template>
  <div class="goods">
    <el-page-header @back="goBack" :content="title"></el-page-header>
    <GoodsList :goodsList="goodsList" v-if="goodsList.length !== 0"></GoodsList>
    <el-empty description="没有找到此商品" v-else></el-empty>
  </div>
</template>

<script>
  import GoodsList from 'components/goods/GoodsList'
  export default {
    name: 'Goods',
    components: {
      GoodsList,
    },
    data() {
      return {
        title:'', // 页头
        // 商品查询参数
        queryInfo: {
          queryText: '',
          pagenum: 1,
          pagesize: 20,
        },
        cateId: '',
        goodsList: [],
        goodsTotal: 0,
      }
    },
    methods: {
      // 查询商品
      async getGoods() {
        this.getQueryParams()
        const res = await this.$http.getGoods(this.queryInfo)
        if (res.meta.status !==200)  return this.$message.console.error();('获取商品失败')
        this.goodsList = res.data.goods
        this.goodsTotal = res.data.total
      },
      // 根据分类获取商品
      async getCateGoods() {
        console.log('获取分类商品');
        const res = await this.$http.getCateGoods(this.cateId)
        if (res.meta.status !==200)  return this.$message.error('获取商品失败')
        this.goodsList = res.data
      },
      // 获取标题
      getTitle() {
        console.log('获取标题');
        this.title = this.$route.query.cateName
      },
      // 获取查询信息
      getQueryParams() {
        this.queryInfo.queryText = this.$route.query.queryText
      },
      // 获取查询商品分类id
      getCateId() {
        this.cateId = this.$route.query.cateId
      },
      // 返回上一级
      goBack() {
        this.$router.back()
      }
    },
    created() {
      this.$bus.$on('getGoods',this.getGoods)
      this.$bus.$on('getCateGoods',this.getCateGoods)
      this.$bus.$on('getTitle',this.getTitle)
      // 获取分类名称
      if(this.$route.query.hasOwnProperty('cateName')) {
        this.getTitle()
      }
      // 获取查询商品分类
      if(this.$route.query.hasOwnProperty('cateId')) {
        this.getCateId()
        this.getCateGoods()
      }
      // 获取查询商品
      if(this.$route.query.hasOwnProperty('queryText')) {
        this.getQueryParams()
        this.getGoods()
      }
      
    },
    beforeDestroy() {
      this.$bus.$off('getGoods')
      this.$bus.$off('getCateGoods')
      this.$bus.$off('getTitle')
    },
    watch: {
      // 监听路由
      $route(to,from) {
        if(to.query.hasOwnProperty('queryText')) return
        this.getTitle()
        this.getCateId()
        // 从新获取商品
        this.getCateGoods()
      }
    }
    
  }
</script>

<style lang="less" scoped>
  .el-page-header {
    margin: 20px 0;
  }
  .el-empty {
    // background-color: white;
    height: calc(100vh - 70px);
  }
</style>