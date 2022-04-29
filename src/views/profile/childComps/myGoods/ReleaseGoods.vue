<template>
  <el-card class="box-card">
    <div slot="header">
      <span>发布商品</span>
    </div>
    <el-form :model="goodsInfoForm" :rules="goodsInfoFormRules" ref="goodsInfoFormRef" class="goodsInfo_form" label-width="100px">
      <el-form-item label="商品名称" prop="goods_name">
        <el-input placeholder="请输入商品名称" v-model="goodsInfoForm.goods_name"></el-input>
      </el-form-item>
      <el-form-item label="商品数量" prop="goods_number">
        <el-input placeholder="请输入商品数量" v-model.lazy.number="goodsInfoForm.goods_number"></el-input>
      </el-form-item>
      <el-form-item label="商品价格" prop="goods_price">
        <el-input placeholder="请输入商品价格" v-model.lazy="goodsInfoForm.goods_price"></el-input>
      </el-form-item>
      <el-form-item label="商品分类" prop="cate_id" class="goods_cate">
        <el-select v-model="goodsInfoForm.cate_id" placeholder="请选择">
          <el-option
            v-for="item in cateList"
            :key="item.cate_id"
            :label="item.cate_name"
            :value="item.cate_id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="商品主图" class="main_goodspic">
        <el-upload
          trigger="hello"
          :action="uploadURL"
          :headers="headerObj"
          list-type="picture-card"
          :limit="1"
          :on-exceed="handExceedMainPic"
          :on-success="handleMainPicSuccess"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemoveMainPic">
          <i class="el-icon-plus"></i>
          <div slot="tip" class="el-upload__tip">最多只能上传 1 张商品主图</div>
        </el-upload>
      </el-form-item>
      <el-form-item label="商品更多图片" class="other_goodspics">
        <el-upload
          :action="uploadURL"
          :headers="headerObj"
          list-type="picture-card"
          :limit="3"
          :on-exceed="handExceedOtherPics"
          :on-success="handleOtherPicsSuccess"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemoveOtherPics">
          <i class="el-icon-plus"></i>
          <div slot="tip" class="el-upload__tip">最多只能上传 3 张其他商品图片</div>
        </el-upload>
      </el-form-item>
      <el-form-item label="商品描述" class="goods_desc">
        <el-input 
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 4}" 
          placeholder="请输入商品描述" 
          v-model.lazy.number="goodsInfoForm.goods_desc">
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">发布商品</el-button>
      </el-form-item>
    </el-form>
    <!-- 预览商品图片 -->
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </el-card>
</template>

<script>
  import {baseURL} from 'common/utils.js'
  export default {
    name: 'ReleaseGoods',
    data() {
      return {
        cateList: [], // 商品分类列表
        // 商品信息表单
        goodsInfoForm: {
          goods_name: '',
          goods_number: 1,
          goods_price: 0,
          cate_id: null,
          image: '',
          images: [],
          goods_desc: '',
        },
        // 商品信息验证规则
        goodsInfoFormRules: {
          goods_name: [
            {required: true, message: '请输入商品名称', trigger: 'blur'},
          ],
          goods_number: [
            {required: true, message: '请输入商品数量', trigger: 'blur'},
          ],
          goods_price: [
            {required: true, message: '请输入商品价格', trigger: 'blur'},
          ],
          cate_id: [
            {required: true, message: '请选择分类', trigger: 'blur'},
          ],
        },
        // 图片上传地址
        uploadURL: baseURL + '/upload/goodsPics',
        // 上传请求的header配置
        headerObj: {
          Authorization:window.localStorage.getItem('token')
        },
        // 预览图片地址
        dialogImageUrl: '',
        // 预览图片展示
        dialogVisible: false
      }
    },
    methods: {
      // 获取商品分类
      async getGoodsCates() {
        const res = await this.$http.getGoodsCates()
        if (res.meta.status !== 200) return this.$message.error('获取分类失败')
        this.cateList = res.data
      },
      // 发布商品
      async addGoods() {
        this.$refs.goodsInfoFormRef.validate(async (valid,obj) => {
          if (!valid) return console.log('error submit!')
          if (!this.goodsInfoForm.image) return this.$message.error('请上传商品主图')
          if (this.goodsInfoForm.images.length === 0) return this.$message.error('请上传商品其他图片')
          const res =await this.$http.addGoods(this.goodsInfoForm)
          if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
          this.$message.success('发布商品成功,正在审核中')
        })
      },

      // 移除商品主图
      handleRemoveMainPic(file, fileList) {
        this.goodsInfoForm.image = ''
      },
      // 移除商品其他图片
      handleRemoveOtherPics(file, fileList) {
        const picIndex = this.goodsInfoForm.images.findIndex(item=>{
          return item.path === file.response.data.fullPath
        })
        console.log(picIndex);
        this.goodsInfoForm.images.splice(picIndex,1)
      },
      // 预览图片
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
      // 上传商品主图超出个数
      handExceedMainPic (files,fileList) {
        this.$message.warning('商品主图只能上传 1 张')
      },
      // 上传商品其他图片超出个数
      handExceedOtherPics () {
        this.$message.warning('商品其他图片最多上传 3 张')
      },
      // 上传商品主图成功时
      handleMainPicSuccess(res, file) {
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg)
        }
        this.goodsInfoForm.image = res.data.fullPath
      },
      // 上传商品其他图片成功时
      handleOtherPicsSuccess(res, file, fileList) {
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg)
        }
        this.goodsInfoForm.images.push({path:res.data.fullPath})
      },
      onSubmit() {
        this.addGoods()
      }
    },
    created() {
      this.getGoodsCates()
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
    .goods_cate {
      .el-select {
        width: 200px;
      }
    }
    .main_goodspic,
    .other_goodspics {
      display: flex;
      align-items: center;
      & /deep/ .el-form-item__content {
        margin-left: 0 !important;
      }
    }
  }
</style>