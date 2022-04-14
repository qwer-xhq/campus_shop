<template>
  <el-card class="box-card">
    <div slot="header">
      <span>更新商品</span>
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
          :file-list="mainImageFileList"
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
          :file-list="otherImagesFileList"
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
        <el-button type="primary" @click="onSubmit">修改商品</el-button>
      </el-form-item>
    </el-form>
    <!-- 预览商品图片 -->
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </el-card>
</template>

<script>
  export default {
    name: 'UpdateGoods',
    data() {
      return {
        cateList: [], // 商品分类列表
        // 商品信息表单
        goodsInfoForm: {
          goods_id: null,
          goods_name: '',
          goods_number: 1,
          goods_price: 0,
          cate_id: null,
          image: '',
          images: [],
          goods_desc: '',
        },
        mainImageFileList: [],
        otherImagesFileList: [],
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
        uploadURL: 'http://127.0.0.1:8000/api/upload/goodsPics',
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
    computed: {
      goodsId() {
        return this.$route.params.id
      }
    },
    methods: {
      // 获取商品信息
      async getGoodsInfo() {
        const res = await this.$http.getGoodsDetail(this.goodsId)
        if (res.meta.status !== 200) return this.$message.error('获取商品信息失败')
        const {image,images} = res.data
        for (let item in this.goodsInfoForm) {
          this.goodsInfoForm[item] = res.data[item]
        }
        this.mainImageFileList.push({"url":image})
        this.goodsInfoForm.images = []
        for (let item of images) {
          this.goodsInfoForm.images.push({"path":item.image})
          this.otherImagesFileList.push({"url":item.image})
        }
      },
      // 获取商品分类
      async getGoodsCates() {
        const res = await this.$http.getGoodsCates()
        if (res.meta.status !== 200) return this.$message.error('获取分类失败')
        this.cateList = res.data
      },
      // 修改商品
      async updateGoods() {
        const res =await this.$http.updateGoods(this.goodsInfoForm)
        if (res.meta.status !== 200) return this.$message.error('更新商品失败')
        this.$message.success('修改商品成功')
        this.$router.push('/mygoods')
      },

      // 移除商品主图
      handleRemoveMainPic(file, fileList) {
        this.goodsInfoForm.image = ''
      },
      // 移除商品其他图片
      handleRemoveOtherPics(file, fileList) {
        const picIndex = this.goodsInfoForm.images.findIndex(item=>{
          if (!file.response) {
            return item.path === file.url
          }
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
      handExceedOtherPics (files, fileList) {
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
        this.updateGoods()
      }
    },
    created() {
      this.getGoodsInfo()
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