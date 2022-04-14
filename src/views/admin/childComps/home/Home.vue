<template>
  <el-container class="home-container">
    <el-header>
      <div class="header-log">
        <img src="~assets/images/logo.png" alt="">
        <span>校园二手交易后台管理系统</span>
      </div>
      <div class="header-right">
        <el-avatar size="medium" :src="avatar"></el-avatar>
        <span>Hi：{{username}}</span>
        <el-button type="info" @click="logout">退出</el-button>
      </div>
    </el-header>
    <el-container>
      <el-aside :width="isCollapse ? '64px':'200px'">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <NavMenu class="home-menu" :menuList="menuList" :isCollapse="isCollapse"></NavMenu>
      </el-aside>
      <el-main>
        <RouterView></RouterView>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
  import NavMenu from 'components/content/navMenu/NavMenu'

  export default {
    name: 'Home',
    components: {
      NavMenu
    },
    data() {
      return {
        menuList: [],
        isCollapse: false,
        userInfo: {}, // 用户信息
      }
    },
    computed: {
      avatar() {
        return this.userInfo?.avatar
      },
      username() {
        return this.userInfo?.user_name
      }
    },
    methods: {
      // 验证token
      async adminAuthValidate() {
        const res = await this.$http.adminAuthValidate()
        if (res.meta.status !== 200) {
          window.sessionStorage.clear()
          this.userInfo = {}
          this.$router.replace('/admin')
        } else {
          this.userInfo = JSON.parse(window.sessionStorage.getItem('userInfo'))
        }
      },
      // 退出
      logout(){
        window.sessionStorage.clear()
        this.$router.push('/admin')
      },
      toggleCollapse() { // 展开折叠侧边栏
        this.isCollapse = !this.isCollapse
      }
    },
    created() {
      // 验证token
      if(window.sessionStorage.getItem('token')){
        this.adminAuthValidate()
      }else{
        this.$router.replace('/admin')
      }
      this.$http.getMenuList().then(res => {
        if (res.meta.status !== 200) return this.$message.error('获取菜单失败')
        this.menuList = res.data
      })
    }
  }
</script>

<style lang="less" scoped>
  .home-container{
    height: 100%;
    
  }
  .el-header {
    background-color: #373d41;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-left: 0;

    .header-log {
      height: 100%;
      display: flex;
      align-items: center;
      color: #fff;
      font-size: 20px;

      img {
        height: 80%;
        border: 2px solid #fff;
        border-radius: 50%;
        margin-right: 10px;
      }
    }
    .header-right {
      display: flex;
      align-items: center;
      color: white;

      .el-avatar {
        margin-right: 2px;
      }

      .el-button {
        margin-left: 20px;
      }
    }
  }
  .el-aside {
    background-color: #333744;

    .toggle-button {
      text-align: center;
      color: #fff;
      letter-spacing: 4px;
      cursor: pointer;
    }
  }
  .el-main {
    background-color: #eaedf1;
    overflow: hidden;
  }
  .home-menu {
    border: 0;
  }
</style>