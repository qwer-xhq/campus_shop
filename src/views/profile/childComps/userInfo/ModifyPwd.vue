<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>修改密码</span>
    </div>
    <el-form :model="passwordForm" :rules="passwordFormRules" ref="passwordFormRef" class="password_form" label-width="100px">
      <el-form-item label="原密码" prop="oldPassword">
        <el-input type="password" placeholder="请输入原密码" v-model="passwordForm.oldPassword"></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="newPassword">
        <el-input type="password" placeholder="请输入新密码" v-model="passwordForm.newPassword"></el-input>
      </el-form-item>
      <el-form-item label="确认新密码" prop="checkNewPassword">
        <el-input type="password" placeholder="请再次输入新密码" v-model="passwordForm.checkNewPassword"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">保存</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
  export default {
    name: 'ModifyPwd',
    data() {
      // 密码验证
      const validateNewPassword = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入新密码'));
        } else{
          if (this.passwordForm.checkNewPassword !== '') {
            this.$refs.passwordFormRef.validateField('checkNewPassword');
          }
          callback();
        }
      }
      // 再次输入密码验证
      const validateCheckNewPassword = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入新密码'));
        } else if (value !== this.passwordForm.newPassword) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      }
      return {
        passwordForm: {
          oldPassword: '',
          newPassword: '',
          checkNewPassword: '',
        },
        passwordFormRules: {
          oldPassword: [
            { required: true, message: '请输入原密码', trigger: 'blur' },
          ],
          newPassword: [
            { validator: validateNewPassword, trigger: 'blur' },
          ],
          checkNewPassword: [
            { validator: validateCheckNewPassword, trigger: 'blur' },
          ]
        }
      }
    },
    methods: {
      // 修改密码
      onSubmit() {
        this.$refs.passwordFormRef.validate(async (valid,obj) => {
          if (!valid) return console.log('error submit!')
          const res = await this.$http.changePassword({"oldPass":this.passwordForm.oldPassword, "newPass":this.passwordForm.newPassword})
          if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
          window.localStorage.removeItem('token')
          window.localStorage.removeItem('userInfo')
          this.$message.success(res.meta.msg)
          setTimeout(() => {
            this.$router.replace('/login')
          }, 2000);
          
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  .el-card {
    width: 800px;
    margin: 0;
  }
  .el-form {
    .el-input {
      width: 200px;
    }
    .el-button {
      width: 100px;
    }
  }
</style>