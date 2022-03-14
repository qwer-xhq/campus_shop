<template>
  <div class="goods-item">
    <img src="" alt="">
    <div>
      <span>商品名称</span>
      <span>商品信息</span>
      <span>价格</span>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'GoodsListItem',
    
  }
</script>

<style lang="less" scoped>
  .goods-item {
    width: 215px;
    height: 320px;
    // border: 1px solid red;
    background-color: white;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 0 20px 20px 0;
    &:nth-child(4n+0) {
      margin-right: 0;
    }
    &:hover {
      transform: scale(1.01);
      box-shadow: 0 2px 10px gray;
    }
    img {
      width: 150px;
      height: 200px;
      margin-top: 10px;
    }
    div {
      margin-top: 10px;
      display: flex;
      flex-direction: column;
      align-items: center;
      span {
        line-height: 30px;
      }
    }
  }
</style>