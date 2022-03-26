<template>
  <el-card class="box-card">
    <div slot="header">
      <span>基本信息</span>
      <el-button style="float: right; padding: 3px 10px" type="text" @click="isEdit = true" v-show="!isEdit">编辑</el-button>
      <el-button style="float: right; padding: 3px 10px" type="text" @click="cancelEdit" v-show="isEdit">取消</el-button>
    </div>
    <el-form label-width="80px" :model="userInfoForm" :rules="userInfoFormRules" ref="userInfoFormRef" :disabled="!isEdit">
      <el-form-item label="头像">
        <el-tooltip :disabled="!isEdit" content="修改头像" placement="right">
          <el-upload
            class="avatar-uploader"
            :action="uploadURL"
            :headers="headerObj"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
            :on-error="uploadFailed">
            <img v-if="avatarUrl" :src="avatarUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-tooltip>
      </el-form-item>
      <el-form-item label="用户名" prop="user_name">
        <el-input v-model="userInfoForm.user_name"></el-input>
      </el-form-item>
      <el-form-item label="手机号" prop="mobile">
        <el-input v-model="userInfoForm.mobile"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="userInfoForm.email"></el-input>
      </el-form-item>
      <el-form-item label="学校" prop="school">
        <el-input v-model="userInfoForm.school"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">保存</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
  export default {
    name: 'UserInfo',
    data() {
      // 验证邮箱的规则
      const validateEmail = (rule, value, cb) => {
        const regEmail = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/

        if(regEmail.test(value)) {
          return cb()
        }

        cb(new Error('请输入合法邮箱'))
      }
      // 验证手机号的规则
      const validateMobile = (rule, value, cb) => {
        const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/

        if(regMobile.test(value)) {
          return cb()
        }

        cb(new Error('请输入正确的手机号'))
      }
      return {
        isEdit: false,
        userInfo: {}, // 用户信息
        userInfoForm: {
          user_name: '',
          avatar: '',
          mobile: '',
          email: '',
          school: '',
        },
        // 用户信息表单验证
        userInfoFormRules: {
          user_name: [
            {required: true, message: '请输入用户名', trigger: 'blur'},
          ],
          mobile: [
            {required: true, message: '请输入手机号', trigger: 'blur'},
            {validator: validateMobile, trigger: 'blur'},
          ],
          email: [
            {required: true, message: '请输入电子邮箱', trigger: 'blur'},
            {validator: validateEmail, trigger: 'blur'}
          ],
          school: [
            {required: true, message: '请输入学校名', trigger: 'blur'},
          ],
        },
        uploadURL: 'http://127.0.0.1:8000/api/upload/usersAvatar',
        // 上传请求的header配置
        headerObj: {
          Authorization:window.localStorage.getItem('token')
        },
      }
    },
    computed: {
      avatarUrl() {
        return this.userInfoForm.avatar
      }
    },
    methods: {
      // 获取用户信息
      async getUserInfo(isReRequest) {
        if (isReRequest) {
          const res = await this.$http.getUserInfo()
          if(res.meta.status !== 200) return this.$message.error('获取用户信息失败')
          this.userInfo = res.data
          // 更新 localStorage 里的数据
          window.localStorage.setItem('userInfo',JSON.stringify(res.data))
        }
        this.userInfo = JSON.parse(window.localStorage.getItem('userInfo'))
        for(let item in this.userInfoForm) {
          if(this.userInfoForm.hasOwnProperty(item)) {
            this.userInfoForm[item] = this.userInfo[item]
          }
        }
      },
      // 修改用户信息
      async modifyUserInfo() {
        this.$refs.userInfoFormRef.validate(async (valid,obj) => {
          if (!valid) return console.log('error submit!')
          const res = await this.$http.modifyUserInfo(this.userInfoForm)
          if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
          // 重新获取用户信息并更新
          await this.getUserInfo(true)

          // 让 Profile 页面更新用户信息
          this.$bus.$emit('updateUserInfo')

          this.$message.success('修改用户信息成功')
        })
      },
      // 取消编辑
      cancelEdit() {
        this.isEdit = false
        for(let item in this.userInfoForm) {
          if(this.userInfoForm.hasOwnProperty(item)) {
            this.userInfoForm[item] = this.userInfo[item]
          }
        }
        // 移除表单验证
        this.$refs.userInfoFormRef.clearValidate()
      },
      // 修改用户信息提交
      onSubmit() {
        this.modifyUserInfo()
        this.isEdit = false
      },
      // 头像上传成功钩子
      handleAvatarSuccess(res, file) {
        this.userInfoForm.avatar = res.data.fullPath?res.data.fullPath:''
      },
      // 头像上传前钩子
      beforeAvatarUpload(file) {
        // const isJPG = file.type === 'image/jpeg';
        // const isLt2M = file.size / 1024 / 1024 < 2;

        // if (!isJPG) {
        //   this.$message.error('上传头像图片只能是 JPG 格式!');
        // }
        // if (!isLt2M) {
        //   this.$message.error('上传头像图片大小不能超过 2MB!');
        // }
        // return isJPG && isLt2M;
      },
      // 上传头像失败
      uploadFailed(err) {
        console.log(err);
      }
    },
    created() {
      this.getUserInfo()
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
    .el-form-item:nth-child(1) {
      & /deep/ .el-form-item__label {
        line-height: 150px;
      }
    }
  }
  .avatar-uploader {
    width: 150px;
    height: 150px;
    border: 1px dashed #d9d9d9;
    border-radius: 50%;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    & /deep/ .el-upload {
      width: 100%;
      height: 100%;
      border-radius: 50%;
    }
    &:hover {
      border-color: #409EFF;
    }
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 150px;
    height: 150px;
    line-height: 150px;
    text-align: center;
  }
  .avatar {
    width: 150px;
    height: 150px;
    border-radius: 50%;
  }
</style>