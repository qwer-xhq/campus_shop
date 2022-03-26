<template>
  <el-container class="personal-center">
    <el-aside width="200px" class="personal-aside">
      <h1>个人中心</h1>
      <el-menu 
      :default-active="activePath"  
      @select="handleSelect"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b"
      router>
        <el-submenu index="1">
          <template slot="title">
            <i class="el-icon-user-solid"></i>
            <span>个人信息</span>
          </template>
          <el-menu-item index="/userinfo">基本信息</el-menu-item>
          <el-menu-item index="/modifypwd">修改密码</el-menu-item>
        </el-submenu>
        <el-submenu index="2">
          <template slot="title">
            <i class="el-icon-s-goods"></i>
            <span>商品管理</span>
          </template>
          <el-menu-item index="/release">发布闲置</el-menu-item>
          <el-menu-item index="/mygoods">我发布的商品</el-menu-item>
        </el-submenu>
        <el-menu-item index="/collection">
          <i class="el-icon-user-solid"></i>
          <span>我的收藏</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-container class="personal-content">
      <el-header>
        <router-link class="title-left" to="/home" tag="div">返回首页</router-link>
        <div class="title-right">
          <div @mouseenter="isShow=true" @mouseleave="isShow=false">
            <el-avatar size="small" :src="avatar"></el-avatar>
            <span>{{username}}</span>
          </div>
          <ul :class="isShow?'show':''" @mouseenter="isShow=true" @mouseleave="isShow=false">
            <router-link  to="/userinfo" tag="li"><span>基本信息</span></router-link>
            <router-link to="/modifyPwd" tag="li"><span>修改密码</span></router-link>
            <li @click="logout"><span>退出</span></li>
          </ul>
        </div>
      </el-header>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
  export default {
    name: 'Profile',
    data() { 
      return {
        userInfo: {},
        isShow: false, // 是否显示用户操作框
      }
    },
    computed: {
      activePath() {
        return this.$route.path
      },
      username() {
        return this.userInfo?.user_name
      },
      avatar() {
        return this.userInfo?.avatar
      },
    },
    methods: {
      handleSelect(key, keyPath) {
        // console.log(key, keyPath);
      },
      // 退出
      logout() {
        window.localStorage.removeItem('token')
        window.localStorage.removeItem('userInfo')
        this.userInfo = {}
        this.$router.replace('/home')
      },
      getUserInfo() {
        this.userInfo = JSON.parse(window.localStorage.getItem('userInfo'))
      }
    },
    created() {
      this.getUserInfo()
      this.$bus.$on('updateUserInfo',this.getUserInfo)
    },
    beforeDestroy() {
      this.$bus.$off('updateUserInfo')
    }
  }
</script>

<style lang="less" scoped>
  .personal-center {
    height: 100%;
    .personal-aside {
      background-color: #545c64;
      &>h1 {
        color: white;
        text-align: center;
      }
      .el-menu {
        border: none;
        .el-submenu .el-menu-item{
          padding-left: 50px !important;
        }
      }
    }
    .personal-content {
      &>.el-header {
        z-index: 3;
        background-color: white;
        display: flex;
        align-items: center;
        justify-content: space-between;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
        .title-left {
          cursor: pointer;
          &:hover {
            color: orange;
          }
        }
        .title-right {
          &>div:nth-child(1) {
            min-width: 100px;
            max-width: 150px;
            display: flex;
            align-items: center;
            cursor: pointer;
            height: 40px;
            .el-avatar {
              margin-right: 10px;
              flex-shrink: 0;
            }
            span:nth-child(2){
              overflow: hidden;
              text-overflow: ellipsis;
            }
            span:nth-child(2):hover {
              color: orange;
            }
          }
          &>ul {
            display: none;
            position: absolute;
            width: 80px;
            padding: 10px 10px;
            background-color: #fff;
            border: 1px solid #d2d2d2;
            border-radius: 10px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            li {
              color: rgba(0, 0, 0, 0.5);
              line-height: 30px;
              border-radius: 4px;
              cursor: pointer;
              &:hover {
                color: orange;
                background-color: rgba(0, 0, 0, 0.1);
              }
            }
            
          }
          &>.show {
            display: block;
          }
        }
      }
      &>.el-main {
        background-color: white;
      }
    }
  }
</style>