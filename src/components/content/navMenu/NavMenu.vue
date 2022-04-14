<template>
  <el-menu
    background-color="#333744"
    text-color="#fff"
    active-text-color="#409eff"
    :collapse="isCollapse"
    :collapse-transition="false"
    router
    :default-active="activePath"
  >
    <el-submenu :index="`${item.perm_id}`" v-for="(item,index) in menuList" :key="item.perm_id">
      <template slot="title">
        <i :class="icon[index]"></i>
        <span>{{item.perm_name}}</span>
      </template>
      <el-menu-item :index="`/admin/${item1.perm_path}`" v-for="(item1,index1) in item.children" :key="item1.perm_id">
        <template slot="title">
          <i class="el-icon-menu"></i>
          <span>{{item1.perm_name}}</span>
        </template>
      </el-menu-item>
    </el-submenu>
    
  </el-menu>
</template>

<script>
  export default {
    name: 'NavMenu',
    props: {
      menuList: {
        type: Array,
        default: [],
      },
      isCollapse: {
        type:Boolean,
        default: false
      }
    },
    data() {
      return {
        icon: ['el-icon-s-custom','el-icon-s-goods']
      }
    },
    computed: {
      activePath() {
        return this.$route.path
      }
    },
    created() {
      // console.log(this.$route.path);
    },
  }
</script>

<style scoped>
  
</style>