<template>
  <el-container class="home-container">
    <el-header>
      <div class="left">
        <img src="@/assets/images/logo.png" alt="">
        <span>校园二手交易市场</span>
      </div>
      <el-input class="searchBox" placeholder="请输入商品名称" v-model="queryText">
        <el-button slot="append" icon="el-icon-search" @click="searchGoods"></el-button>
      </el-input>
      <div class="right">
        <router-link to="/login" tag="span" v-if="!loginState">登录/注册</router-link>
        <div class="userinfo" v-else>
          <router-link to="/profile" tag="div">
            <el-avatar size="medium" :src="avatar"></el-avatar>
            <span>Hi：{{username}}</span>
          </router-link>
          <span @click="logout">退出</span>
        </div>
        
      </div>
    </el-header>
    <el-main>
      <!-- 导航菜单 -->
      <el-menu
        class="nav_menu"
        router
        :default-active="activePath"
        >
        <el-menu-item index="/home">首页</el-menu-item>
        <el-menu-item :index="routerPath(item.cate_id,item.cate_name)" v-for="(item,index) in goodsCates" :key="item.cate_id" @click="getCateGoodsInfo()">{{item.cate_name}}</el-menu-item>
      </el-menu>
      <!-- 内容 -->
      <div class="main_content">
        <router-view></router-view>
      </div>
      
    </el-main>
  </el-container>
  </div>
</template>

<script>
  import HomeContent from './childComps/homeContent/HomeContent'
  import GoodsList from 'components/goods/GoodsList'
  export default {
    name: 'Home',
    components: {
      HomeContent,
    },
    data() {
      return {
        queryText: '',
        goodsCates: [], // 商品分类
        userInfo: {}, // 用户名称
        loginState: false,
      }
    },
    computed: {
      activePath() {
        return this.$route.path+(this.$route.query.cateId?('?cateId='+this.$route.query.cateId):'')+(this.$route.query.cateName?('&cateName='+this.$route.query.cateName):'')
      },
      routerPath() {
        return function(id,title){
          return `/goods?cateId=${id}&cateName=${title}`
        }
      },
      username() {
        return this.userInfo?.user_name
      },
      avatar() {
        return this.userInfo?.avatar
      }
    },
    methods: {
      // 验证token
      async authValidate() {
        const res = await this.$http.authValidate()
        if (res.meta.status !== 200) {
          window.localStorage.removeItem('token')
          window.localStorage.removeItem('userInfo')
          this.userInfo = {}
          this.isLogin()
        } else {
          this.userInfo = JSON.parse(window.localStorage.getItem('userInfo'))
        }
      },
      // 判断是否登录
      isLogin() {
        if (window.localStorage.getItem('token')) {
          this.loginState = true
        }else {
          this.loginState = false
        }
      },
      // 退出
      logout() {
        window.localStorage.removeItem('token')
        window.localStorage.removeItem('userInfo')
        this.isLogin()
      },
      
      // 获取商品分类
      async getGoodsCates() {
        const res = await this.$http.getGoodsCates()
        this.goodsCates = res.data
      },
      // 获取选择的分类的商品
      getCateGoodsInfo() {
        this.$bus.$emit('getCateGoods')
        this.$bus.$emit('getTitle')
      },

      // 搜索商品
      async searchGoods() {
        await this.$router.push({
          path:'/goods',
          query: {
            queryText: this.queryText
          }
        }).catch(err => err)
        await this.$bus.$emit('getGoods')
      }
    },
    created() {
      // 验证token
      if(localStorage.getItem('token')){
        this.authValidate()
      }
      this.isLogin()
      // 获取商品分类
      this.getGoodsCates()
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
        // width: 260px;
        display: flex;
        .userinfo {
          display: flex;
          align-items: center;
          margin-right: 20px;
          &>div {
            display: flex;
            align-items: center;
            margin-right: 20px;
            .el-avatar {
              margin-right: 10px;
            }
            span:nth-child(2) {
              max-width: 150px;
              overflow: hidden;
              text-overflow: ellipsis;
            }
            
          }
          span{
            white-space: nowrap;
            cursor: pointer;
            &:hover {
              color: orange;
            }
          }
        }
        &>span {
          white-space: nowrap;
          cursor: pointer;
          color: orange;
        }
      }
    }
    // 内容
    .el-main {
      width: 920px;
      margin: 70px auto 0;
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
      .main_content {
        height: 100%;
        // margin-top: 70px;
        
      }
    }
    .el-footer {
      background-color: white;
    }
  }
</style>