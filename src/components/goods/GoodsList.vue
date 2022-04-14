<template>
  <div class="goods-list">
    <slot name="title">
      
    </slot>
    <div class="goods-list-item">
      <GoodsListItem v-for="item in goodsList" :goodsItem="item"></GoodsListItem>
    </div>
    
  </div>
</template>

<script>
  import GoodsListItem from './GoodsListItem'
  export default {
    name: 'GoodsList',
    props: {
      goodsList: {
        type: Array,
        default() {
          return []
        }
      }
    },
    components: {
      GoodsListItem,
    }
  }
</script>

<style lang="less" scoped>
  .goods-list {
    padding: 10px;
  }
  
  .goods-list-item {
    width: 100%;
    position: relative;
    display: flex;
    flex-wrap: wrap;
  }
</style>