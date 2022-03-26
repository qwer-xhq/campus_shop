<template>
  <div class="">
    <!-- 轮播图 -->
    <el-carousel trigger="click" :interval="3500" height="450px">
      <el-carousel-item v-for="item in recommend" :key="item.goods_id">
        <img :src="item.image" alt="" @click="recommedClick(item.goods_id)">
      </el-carousel-item>
    </el-carousel>
    <!-- 商品 -->
    <GoodsList :goodsList="newGoodsList">
      <template #title>
        <div class="goodsTitle">
          <h3 class="">最新发布</h3>
        </div>
      </template>
    </GoodsList>
  </div>
</template>

<script>
  import GoodsList from 'components/goods/GoodsList'
  export default {
    name: 'HomeContent',
    components: {
      GoodsList,
    },
    data() {
      return {
        recommend: [], // 推荐商品
        newGoodsList: [], // 商品列表数据
      }
    },
    methods: {
      // 获取推荐商品
      async getRecommend() {
        const res = await this.$http.getRecommend()
        // console.log(res);
        this.recommend = res.data
      },
      // 获取最新发布商品
      async getNewGoods() {
        const res = await this.$http.getNewGoods()
        this.newGoodsList = res.data
        // console.log(res)
      },
      recommedClick(id){
        this.$router.push('/detail/'+ id)
      }
    },
    created() {
      // 获取推荐商品
      this.getRecommend()
      // 获取商品
      this.getNewGoods()
    }
    
  }
</script>

<style lang="less" scoped>
  .el-carousel {
    background-color: white;
    /deep/ .el-carousel__indicators {
      height: 30px;
      background-color: rgba(0, 0, 0, 0.3);
      border-radius: 15px;
      bottom: 10px;
      display: flex;
      align-items: center;
      .el-carousel__indicator{
        padding: 0px 12px;
        button {
          width: 20px;
          height: 20px;
          border-radius: 50px;
        }
      }
    }
  }
  .el-carousel__item img{
    height:100%;
    position: relative;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
  }
  .goodsTitle {
    display: flex;
    justify-content: space-between;
    align-items: center;
    h3 {
      color: orange;
    }
  }
</style>