<template>
  <el-container class="home-container">
    <el-header>
      <div class="left">
        <img src="@/assets/images/logo.png" alt="">
        <span>校园二手交易市场</span>
      </div>
      <el-input class="searchBox" placeholder="请输入商品名称" v-model="queryText">
        <el-button slot="append" icon="el-icon-search"></el-button>
      </el-input>
      <div class="right">
        <router-link to="mycart" tag="span">购物车</router-link>
        <router-link to="release" tag="span">发布商品</router-link>
        <router-link to="login" tag="span" v-if="!isLogin">登录/注册</router-link>
        <router-link to="login" tag="span" v-else>个人中心</router-link>
      </div>
    </el-header>
    <el-main>
      <!-- 导航菜单 -->
      <el-menu
        class="nav_menu"
        default-active="0">
        <el-menu-item index="0" @click="showHome">首页</el-menu-item>
        <el-menu-item :index="item.cate_id+''" v-for="(item,index) in goodsCates" :key="item.cate_id" @click="getCateGoods(item.cate_id,item.cate_name)">{{item.cate_name}}</el-menu-item>
      </el-menu>
      <!-- 内容 -->
      <div class="home-main" v-show="isShowHome">
        <el-carousel trigger="click" height="450px">
          <el-carousel-item v-for="item in 4" :key="item">
            <h3 class="small">{{ item }}</h3>
          </el-carousel-item>
        </el-carousel>
        <!-- 商品 -->
        <GoodsList></GoodsList>
      </div>
      <router-view v-show="!isShowHome"></router-view>
    </el-main>
  </el-container>
  </div>
</template>

<script>
  import GoodsList from './childComps/goods/GoodsList'
  export default {
    name: 'Home',
    components: {
      GoodsList,
    },
    computed: {
      isLogin() {
        return localStorage.getItem('token')?true:false
      }
    },
    data() {
      return {
        queryText: '',
        goodsList: [], // 商品列表数据
        goodsCates: [], // 商品分类
        isShowHome: true, // 是否显示首页
        userInfo: {}, // 用户信息
      }
    },
    methods: {
      // 获取商品
      async getGoods() {
        const res = await this.$http.getGoods()
        this.goodsList = res.data
        console.log(res)
      },
      // 获取商品分类
      async getGoodsCates() {
        const res = await this.$http.getGoodsCates()
        this.goodsCates = res.data
      },
      handleOpen(key, keyPath) {
        console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        console.log(key, keyPath);
      },
      // 获取选择的分类的商品
      getCateGoods(id,title) {
        console.log(id,title);
        this.isShowHome = false
        this.$router.push('/goods').catch(err => err)
      },
      // 显示首页
      showHome() {
        this.isShowHome = true
      }
    },
    created() {

      // 获取商品分类
      this.getGoodsCates()
      // 获取商品
      this.getGoods()
    },
  }
</script>

<style lang="less" scoped>
  
  .home-container {
    min-width: 1168px;
    background-color: #eee;
    // 页头
    .el-header {
      position: fixed;
      top: 0;
      width: 100%;
      z-index: 3;
      background-color: white;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .left {
        height: 100%;
        display: flex;
        align-items: center;
        img {
          height: 80%;
        }
        span {
          margin-left: 10px;
          font-size: 20px;
          font-weight: 700;
          color: orange;
          white-space: nowrap; // 强制不换行
        }
      }
      // 搜索框样式
      .searchBox {
        min-width: 400px;
        margin: 0 150px;
        & /deep/ .el-input__inner { // /deep/ 穿透给子元素设置样式
          border: 2px solid orange;
        }
        & /deep/ .el-input-group__append {
          border: 2px solid orange;
          background-color: orange;
        }
      }
      .right {
        width: 260px;
        display: flex;
        color: orange;
        span{
          margin-right: 30px;
          white-space: nowrap;
          cursor: pointer;
        }
      }
    }
    // 内容
    .el-main {
      width: 920px;
      margin: 0 auto;
      padding: 0;
      overflow-y: auto;
      // 导航菜单
      .nav_menu {
        position: fixed;
        left: calc((100% - 920px)/2 - 30px - 96px);
        top: 100px;
        text-align: center;
        @media screen and (max-width: 1200px){
          left: 10px;
        }
      }
      .home-main {
        height: 100%;
        // 
        .el-carousel {
          background-color: aqua;
        }
        .el-carousel__item h3{
          margin: 0;
          text-align: center;
        }
      }
    }
    .el-footer {
      background-color: white;
    }
  }
</style>