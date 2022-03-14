<template>
  <div class="goods">
    商品页面
    id: {{id}}
    title: {{title}}
  </div>
</template>

<script>
  export default {
    name: 'Goods',
    props: ['id','title'],
  }
</script>

<style lang="" scoped>
  
</style>