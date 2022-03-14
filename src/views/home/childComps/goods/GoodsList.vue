<template>
  <div class="goods-list">
    <div class="goodsTitle">
      <h3 class="left">商品类别</h3>
      <router-link to="#" tag="span" class="right">查看更多 ></router-link>
    </div>
    <div class="goods-list-item">
      <GoodsListItem></GoodsListItem>
      <GoodsListItem></GoodsListItem>
      <GoodsListItem></GoodsListItem>
      <GoodsListItem></GoodsListItem>
      <GoodsListItem></GoodsListItem>
      <GoodsListItem></GoodsListItem>
      <GoodsListItem></GoodsListItem>
      <GoodsListItem></GoodsListItem>
    </div>
    
  </div>
</template>

<script>
  import GoodsListItem from './GoodsListItem'
  export default {
    name: 'GoodsList',
    components: {
      GoodsListItem,
    }
  }
</script>

<style lang="less" scoped>
  .goods-list {
    // background-color: white;
  }
  .goodsTitle {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .right {
      margin-right: 20px;
      cursor: pointer;
      &:hover {
        color: orange;
      }
    }
  }
  .goods-list-item {
    width: 100%;
    position: relative;
    display: flex;
    flex-wrap: wrap;
  }
</style>