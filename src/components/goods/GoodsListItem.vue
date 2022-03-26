<template>
  <div class="goods-item" @click="itemClick">
    <img :src="goodsItem.image" alt="">
    <div>
      <span>{{goodsItem.goods_name}}</span>
      <span></span>
      <span>￥{{goodsItem.goods_price}}</span>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'GoodsListItem',
    props: {
      goodsItem: {
        type: Object,
        default() {
          return {}
        }
      }
    },
    methods: {
      itemClick(){
        this.$router.push('/detail/'+ this.goodsItem.goods_id).catch(err=>err)
      }
    }
  }
</script>

<style lang="less" scoped>
  .goods-item {
    width: 215px;
    // height: 320px;
    // border: 1px solid red;
    background-color: white;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 0 20px 20px 0;
    cursor: pointer;
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
      width: 100%;
      margin-top: 10px;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      span {
        line-height: 30px;
      }
      span:nth-child(1) {
        width: 100%;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      span:nth-child(3) {
        font-size: 20px;
        color: orange
      }
    }
  }
</style>