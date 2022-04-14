<template>
  <div class="login_container">
    <div class="login_box">
      <div class="avatar_box">
        <img src="~assets/images/logo.png" alt="">
      </div>
      <h1 class="login_title">后台管理系统</h1>
      <el-form ref="loginFormRef" label-width="0px" class="login_form" :model="loginForm" :rules="loginFormRules">
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input prefix-icon="iconfont icon-yonghu" v-model="loginForm.username"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input prefix-icon="iconfont icon-ziyuanxhdpi" v-model="loginForm.password" type="password" show-password></el-input>
        </el-form-item>
        <!-- 按钮 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="login('loginFormRef')">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Admin',
    data() {
      return {
        loginForm: {
          username: 'admin',
          password: '123456',
        },
        loginFormRules: {
          username: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
          ],
        }
      }
    },
    methods: {
      login(formName) {
        this.$refs[formName].validate(async (valid) => {
          if (valid) {
            const result = await this.$http.adminLogin(this.loginForm)
            // console.log(result);
            if (result.meta.status !== 200) return this.$message.error('登录失败')
            this.$message.success('登录成功')
            sessionStorage.setItem('token',result.data.token)
            sessionStorage.setItem('userInfo',JSON.stringify(result.data.userInfo))
            this.$router.push("/admin/home")
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetLoginForm() {
        // this.loginForm = {}
        this.$refs.loginFormRef.resetFields()
      }
    }
  }
</script>

<style lang="less" scoped>
  .login_container {
    height: 100%;
    background-color: #2b4b6b;
  }
  .login_box {
    width: 500px;
    height: 350px;
    background-color: #fff;
    border-radius: 3px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
    
    .avatar_box {
      width: 130px;
      height: 130px;
      border: 1px solid #eee;
      border-radius: 50%;
      padding: 10px;
      box-shadow: 0 0 10px #ddd;
      position: absolute;
      left: 50%;
      transform: translate(-50%,-50%);
      background-color: #fff;
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: #eee;
      }
    }
    .login_title {
      text-align: center;
      margin-top: 80px;
    }
    .login_form {
      position: absolute;
      bottom: 0;
      width: 100%;
      padding: 0 20px;
      box-sizing: border-box;
      .btns {
        display: flex;
        justify-content: flex-end;
      }
    }
  }
</style>