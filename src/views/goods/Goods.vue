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
        goodsList: [],
        title:'', // 页头
      }
    },
    methods: {
      // 查询商品
      async getGoods() {
        const res = await this.$http.getGoods(this.$route.query.queryText)
        if (res.meta.status !==200)  return this.$message.console.error();('获取商品失败')
        this.goodsList = res.data
      },
      // 根据分类获取商品
      async getCateGoods() {
        const res = await this.$http.getCateGoods(this.$route.query.cateId)
        if (res.meta.status !==200)  return this.$message.error('获取商品失败')
        this.goodsList = res.data
      },
      // 获取标题
      getTitle() {
        this.title = this.$route.query.cateName
      },
      goBack() {
        this.$router.back()
      }
    },
    created() {
      this.$bus.$on('getGoods',this.getGoods)
      this.$bus.$on('getCateGoods',this.getCateGoods)
      this.$bus.$on('getTitle',this.getTitle)
      if(this.$route.query.hasOwnProperty('cateId')) {
        this.getCateGoods()
      }
      if(this.$route.query.hasOwnProperty('cateName')) {
        this.getTitle()
      }
      if(this.$route.query.hasOwnProperty('queryText')) {
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
        this.title = to.query.cateName
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