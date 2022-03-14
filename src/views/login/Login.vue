<template>
  <div class="login_page">
    <div class="login_box">
      <div class="login_or_register">
        <span :class="{'active_span':isLogin}" @click="isLogin = true">登录</span>
        <div></div>
        <span :class="{'active_span':!isLogin}" @click="isLogin = false">注册</span>
      </div>
      <!-- 登录 -->
      <div v-show="isLogin">
        <el-form :model="loginForm" :rules="loginFormRules" ref="loginFormRef" class="login_form">
          <el-form-item prop="username">
            <el-input placeholder="请输入用户名" prefix-icon="el-icon-user-solid" v-model="loginForm.username"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input type="password" placeholder="请输入密码" prefix-icon="el-icon-lock" v-model="loginForm.password"></el-input>
          </el-form-item>
        </el-form>
        <div class="remeber_pwd">
          <el-checkbox v-model="isRemember">记住密码</el-checkbox>
          <span class="forgot">忘记密码</span>
        </div>
        <div class="loginBtn" @click="login">登录</div>
      </div>
      <!-- 注册 -->
      <div v-show="!isLogin">
        <el-form :model="registerForm" :rules="registerFormRules" ref="registerFormRef" class="register_form" label-width="100px">
          <el-form-item label="用户名" prop="username">
            <el-input placeholder="请输入用户名" prefix-icon="el-icon-user-solid" v-model="registerForm.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input type="password" placeholder="请输入密码" prefix-icon="el-icon-lock" v-model="registerForm.password"></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="checkPassword">
            <el-input type="password" placeholder="请输入密码" prefix-icon="el-icon-lock" v-model="registerForm.checkPassword"></el-input>
          </el-form-item>
        </el-form>
        <div class="loginBtn" @click="register">注册</div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Login',
    data() {
      // 密码验证
      const validatePassword = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else{
          if (this.registerForm.checkPassword !== '') {
            this.$refs.registerFormRef.validateField('checkPassword');
          }
          callback();
        }
      }
      // 再次输入密码验证
      const validateCheckPassword = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.registerForm.password) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      }
      return {
        // 登录表单数据
        loginForm: {
          username: '',
          password: '',
        },
        isLogin: true, // 是否为登录
        // 登录表单验证规则
        loginFormRules: {
          username: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
          ],
        },
        isRemember: false, // 是否记住密码
        // 注册表单数据
        registerForm: {
          username: '',
          password: '',
          checkPassword: '',
        },
        registerFormRules: {
          username: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
          ],
          password: [
            { validator: validatePassword, trigger: 'blur' },
          ],
          checkPassword: [
            { validator: validateCheckPassword, trigger: 'blur' },
          ]
        }
      }
    },
    methods: {
      // 登录
      login() {
        this.$refs.loginFormRef.validate(async (valid,obj) => {
          if (!valid) return console.log('error submit!')

          const res = await this.$http.login(this.loginForm)
          console.log(res);
          if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
          this.$store.dispatch('saveUser',res.data)
          this.$message.success('登录成功')
          localStorage.setItem('token',res.data.token)
          this.$router.push('/')
        })
      },
      // 注册
      register() {
        this.$refs.registerFormRef.validate(async (valid,obj) => {
          if (!valid) return console.log('error submit!')

          const res = await this.$http.register({username:this.registerForm.username, password:this.registerForm.password})
          console.log(res);
          if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
          this.$message.success('注册成功')
          // this.$router.push('/')
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  .login_page {
    height: 100vh;
    background-color: #2b4b6b;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .login_box {
    width: 500px;
    // height: 300px;
    background-color: white;
    flex-shrink: 0;
    .login_or_register {
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 30px 0;
      
      span {
        font-size: 20px;
        color: rgb(92, 92, 92);
        cursor: pointer;
      }
      .active_span {
        color: orange;
      }
      div {
        width: 2px;
        height: 20px;
        background-color: black;
        margin: 0 30px;
      }
    }
    .remeber_pwd {
      padding: 0 30px;
      display: flex;
      justify-content: space-between;
      .forgot {
        cursor: pointer;
        font-size: 14px;
        color: rgb(92, 92, 92);
        &:hover {
          color: orange;
        }
      }
    }
    .loginBtn {
      width: 300px;
      height: 40px;
      background-color: orange;
      margin: 20px auto 10px;
      border-radius: 20px;
      text-align: center;
      line-height: 40px;
      font-size: 20px;
      color: white;
    }
  }
  .login_form {
    padding: 0 30px;
  }
</style>