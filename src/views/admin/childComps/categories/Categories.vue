<template>
  <div class="">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 添加分类按钮区域 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
        </el-col>
      </el-row>

      <!-- 分类列表区域 -->
      <el-table :data="catesList" border style="width: 400px">
        <el-table-column label="分类名称" width="180" prop="cate_name"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="showEditCateDialog(scope.row)">编辑</el-button>
            <el-button
              size="mini"
              type="danger"
              @click="deleteCate(scope.row.cate_id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加分类 -->
    <el-dialog 
      title="添加分类" 
      :visible.sync="addCateDialogVisible" 
      :close-on-click-modal="false"
      width="50%" 
      @close="addCateDialogClosed('addCateFormRef')">
      <el-form :model="addCateForm" ref="addCateFormRef" label-width="100px" :rules="addCateFormRules">
        <el-form-item label="分类名称：" prop="cate_name">
          <el-input v-model="addCateForm.cate_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改分类 -->
    <el-dialog title="修改分类" :visible.sync="editCateDialogVisible" width="50%" @close="editCateDialogClosed('editCateFormRef')">
      <el-form :model="editCateForm" ref="editCateFormRef" label-width="100px" :rules="addCateFormRules">
        <el-form-item label="分类名称：" prop="cat_name">
          <el-input v-model="editCateForm.cate_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: 'Categories',
    data() {
      return {
        catesList: [], // 分类数据列表
        addCateDialogVisible: false, // 控制添加对话框显示与隐藏
        // 添加分类表单数据
        addCateForm: {
          cate_name: '',
        }, 
        addCateFormRules: {
          cate_name: [
            {required: true, message: '请输入分类名称', trigger: 'blur'},
          ]
        },
        editCateDialogVisible: false, // 控制修改分类对话框展示
        // 修改分类表单数据
        editCateForm: {},
      }
    },
    created() {
      this.getCatesList()
    },
    methods: {
      // 获取分类数据列表
      getCatesList() { 
        this.$http.getGoodsCates(this.queryInfo).then(res => {
          // console.log(res.data)
          if (res.meta.status !== 200) {
            return this.$message.error(res.meta.msg)
          }
          this.catesList = res.data
        })
      },
      // 展示添加分类对话框
      showAddCateDialog() {
        this.addCateDialogVisible = true
      },
      // 添加分类对话框关闭时重置表单
      addCateDialogClosed(formRef) {
        this.$refs[formRef].resetFields()
      },
      // 修改分类对话框关闭时重置表单
      editCateDialogClosed(formRef) {
        this.editCateForm = {}
      },
      
      // 添加分类
      addCate() {
        this.$refs.addCateFormRef.validate(valid => { //对整个表单进行校验
          if (!valid) return
          this.$http.addCate(this.addCateForm).then(res => {
            if (res.meta.status!==200) return this.$message.error(res.meta.msg)
            this.$message.success('添加分类成功')
            this.addCateDialogVisible = false // 隐藏添加分类对话框
            this.getCatesList() // 重新获取分类列表
          })
        })
      },
      // 显示修改分类对话框
      showEditCateDialog({cate_id,cate_name}) {
        this.editCateDialogVisible = true
        // console.log(params);
        this.editCateForm = Object.assign({},{cate_id,cate_name}) // 浅拷贝
      },
      // 修改分类
      editCate() {
        this.$refs.editCateFormRef.validate(valid => {
          if (!valid) return
          this.$http.updateCate(this.editCateForm).then(res => {
            if (res.meta.status!==200) return this.$message.error(res.meta.msg)
            this.$message.success('修改分类成功')
            this.editCateDialogVisible = false 
            this.getCatesList() 
          })
        })
      },
      // 删除分类
      deleteCate(id) {
        this.$confirm('此操作将删除该分类, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.deleteCate(id).then((res) => {
            if (res.meta.status!==200) {
             return this.$message.error('删除失败') 
            }
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.getCatesList()
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
      },
    }
  }
</script>

<style scoped>
  .el-cascader {
    width: 100%;
  }
</style>