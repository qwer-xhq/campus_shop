<template>
  <div>
    <div class="goods_detail">
      <div class="left">
        <!-- 轮播图 -->
        <el-carousel 
        trigger="click" 
        height="500px"
        :autoplay="false"
        indicator-position="none"
        ref="swiper">
          <el-carousel-item :name="item.img_id+''" v-for="item in goodsImages" :key="item.img_id">
            <img :src="item.image" alt="">
          </el-carousel-item>
        </el-carousel>
        <ul class="indicator">
          <li v-for="(item,index) in goodsImages" :key="item.img_id" @mouseenter="indicatorClick(item.img_id)">
            <img :src="item.image" alt="">
          </li>
        </ul>
      </div>
      <div class="right">
        <h1>{{goodsName}}</h1>
        <div class="price">
          <span>价格:</span>
          <span>￥{{price}}</span>
        </div>
        <ul class="goods_info">
          <li>
            <div>
              <el-button size="medium" type="warning" round>卖家</el-button>
            </div>
            <span>{{seller}}</span>
          </li>
          <li>
            <div>
            <el-button size="medium" type="warning" round>发布时间</el-button>
            </div>
            <span>{{createTime}}</span>
          </li>
          <li>
            <div>
            <el-button size="medium" type="warning" round>交易地点</el-button>
            </div>
            <span>{{address}}</span>
          </li>
          <li>
            <div>
            <el-button size="medium" type="warning" round>浏览</el-button>
            </div>
            <span>{{views}}</span>
          </li>
        </ul>
        <div class="right_bottom">
          <el-button class="contactBtn" type="warning" @click="sellerDialogVisible = true">联系卖家</el-button>
          <!-- 收藏 -->
          <el-button class="collect" :type="isMyCollect?'warning':''" icon="el-icon-star-off" circle @click="isMyCollect?cancelCollect():collect()"></el-button>
        </div>
      </div>
    </div>
    <!-- 评论 -->
    <el-card class="comment_box">
      <div slot="header" class="clearfix">
        <span style="font-size:20px">评论</span>
        <el-input placeholder="请输入内容" v-model="commentContent" class="input-with-select" style="width:800px;margin-left:20px">
          <el-button slot="append" type="warning" @click="sendComments">发送</el-button>
        </el-input>
      </div>
      <!-- 评论区 -->
      <ul class="comment_area">
        <li v-for="item in commentsList" :key="item.comm_id">
          <div class="user_info">
            <div class="avatar">
              <img :src="item.avatar" alt="">
            </div>
            <span class="username">{{item.user_name}}</span>
            <span class="send_time">{{sendCommentTime(item.create_time)}}</span>
          </div>
          <div class="comment_content">
            <span>{{item.content}}</span>
          </div>
        </li>
      </ul>
    </el-card>
    <!-- 卖家信息 -->
    <el-dialog
      title="请你用以下方式联系卖家购买"
      :visible.sync="sellerDialogVisible"
      width="30%"
      class="seller_dialog">
      <ul>
        <li>卖家：<span>{{sellerInfo.user_name}}</span></li>
        <li>手机号：<span>{{sellerInfo.mobile}}</span></li>
        <li>邮箱：<span>{{sellerInfo.email}}</span></li>
        <li>学校：<span>{{sellerInfo.school}}></span></li>
      </ul>
    </el-dialog>
  </div>
  
</template>

<script>
  import {Message} from 'element-ui'
  export default {
    name: 'Detail',
    beforeRouteEnter (to, from, next) {
      if(!window.localStorage.getItem('token')) {
        Message.warning('登录后可获取商品详情')
        return next('/login')
      }
      next()
    },
    data() {
      return {
        goodsId: null,
        goodsInfo: {}, // 商品信息
        sellerInfo: {},
        goodsImages: [],
        sellerDialogVisible: false,
        isMyCollect: '', // 是否收藏
        commentsList: [], // 评论列表
        commentContent: '', // 发送评论
      }
    },
    computed: {
      goodsName() {
        return this.goodsInfo.goods_name
      },
      price() {
        return this.goodsInfo.goods_price
      },
      seller() {
        return this.sellerInfo.user_name
      },
      createTime() {
        return this.$formatDate(this.goodsInfo.create_time,'yyyy-MM-dd hh:mm:ss')
      },
      address() {
        return this.sellerInfo.school
      },
      views() {
        return this.goodsInfo.views
      },
      sendCommentTime() {
        return function(time) {
          return this.$formatDate(time)
        }
      }
    },
    methods: {
      // 获取商品详情
      async getGoodsDetail() {
        const res = await this.$http.getGoodsDetail(this.goodsId)
        if (res.meta.status !== 200) return this.$message.error('获取商品详情失败')
        const {userInfo,images,...goodsInfo} = res.data
        this.goodsInfo = goodsInfo
        this.goodsImages = images
        this.sellerInfo = userInfo
      },
      // 查询商品是否收藏
      async isCollect() {
        const res = await this.$http.isCollect(this.goodsId)
        if(res.meta.status !== 200) return this.$message.error('收藏失败')
        this.isMyCollect = res.data.isCollect
      },
      // 获取商品评论
      async getCommentsByGoodsId() {
        const res = await this.$http.getCommentsByGoodsId(this.goodsId)
        if(res.meta.status !== 200) return console.log('获取评论列表失败');
        this.commentsList = res.data
      },
      // 点击指示器事件
      indicatorClick(img_id) {
        const id = String(img_id)
        this.$refs.swiper.setActiveItem(id)
      },

      // 收藏商品
      async collect() {
        const res = await this.$http.collect(this.goodsId)
        if(res.meta.status !== 200) return this.$message.error('收藏失败')
        await this.isCollect()
        this.$message.success('收藏成功')
      },
      // 取消收藏
      async cancelCollect() {
        const res = await this.$http.cancelCollect(this.goodsId)
        if(res.meta.status !== 200) return this.$message.error('取消收藏失败')
        await this.isCollect()
        this.$message.info('已取消收藏')
      },
      // 发送评论
      async sendComments() {
        if (!this.commentContent) {
          return
        }
        const res = await this.$http.sendComments(this.goodsId,this.commentContent)
        if(res.meta.status !== 200) return this.$message.error('发送评论失败')
        this.commentContent = ''
        this.getCommentsByGoodsId()
      }
    },
    created() {
      new Promise((resolve,reject) => {
        this.goodsId = this.$route.params.id
        resolve()
      }).then(async ()=> {
        await this.getGoodsDetail()
        await this.isCollect()
        await this.getCommentsByGoodsId()
      })
    }
  }
</script>

<style lang="less" scoped>
  .goods_detail {
    display: flex;
    background-color: white;
  }
  .left {
    width: 50%;
    flex-shrink: 0; // 禁止缩放
    .el-carousel {
      img {
        width: 100%;
        height: 100%;
      }
    }
    .indicator {
      margin: 10px 0;
      display: flex;
      li {
        width: 80px;
        height: 80px;
        border: 1px solid orange;
        margin-right: 20px;
        cursor: pointer;
        &:nth-child(1) {
          margin-left: 10px;
        }
      }
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
  .right {
    width: 50%;
    // word-wrap: break-word;
    padding-left: 30px;
    .price {
      display: flex;
      align-items: center;
      margin-bottom: 20px;
      span:nth-child(1) {
        font-size: 20px;
      }
      span:nth-child(2) {
        font-size: 26px;
        color: red;
      }
    }
    .goods_info {
      &>li {
        margin-bottom: 10px;
        display: flex;
        align-items: center;
        &>div {
          width: 120px;
        }
      }
    }
    .right_bottom {
      .contactBtn {
        margin-top: 30px;
        width: 200px;
        height: 50px;
        color: white;
        border-radius: 25px
      }
      .collect {
        width: 50px;
        height: 50px;
      }
    }
  }
  .seller_dialog {
    & /deep/ .el-dialog__body {
      padding: 10px 20px;
    }
    ul>li {
      height: 30px;
      line-height: 30px;
    }
  }
  .comment_box {
    /deep/ .el-card__body {
      padding: 10px 20px;
    }
    .comment_area {
      li {
        border: 1px solid orange;
        padding: 10px;
        margin: 10px 0;
        .user_info {
          display: flex;
          align-items: center;
          .avatar {
            width: 50px;
            height: 50px;
            img {
              width: 100%;
              height: 100%;
              border-radius: 50%;
            }
          }
          .username {
            font-size: 22px;
            margin: 0 10px;
          }
          .send_time {
            margin-left: 20px;
            color: rgba(0, 0, 0, 0.5);
          }
        }
        
        .comment_content {
          height: 30px;
          line-height: 30px;
          margin-left: 60px;
          font-size: 18px;
        }
      }
      
    }
  }
</style>