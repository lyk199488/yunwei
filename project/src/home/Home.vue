<template>
  <div class="home_box">
    <headers headName='华医国际' NoBack='true'></headers>
    <div class="contentScollr">
      <div class="box">
        <div class="headimg">
          <a href="javascript:;" @click="goHealthManage">
            <img src="../assets/images/c1_icon1.png" alt="">
          </a>
        </div>
        <div class="nav">
          <ul>
            <router-link :to="{path: '/huimeilist'}">
              <li><img src="../assets/images/c1_icon2.png" alt="">
                <span>智能问诊</span>
              </li>
            </router-link>
            <router-link :to="{path: '/ChooseDoctor'}">
              <li><img src="../assets/images/c1_icon3.png" alt="">
                <span>在线咨询</span>
              </li>
            </router-link>
            <router-link :to="{path: '/Plant'}">
              <li><img src="../assets/images/c1_icon4.png" alt="">
                <span>就医策划</span>
              </li>
            </router-link>
            <router-link :to="{path: '/records'}">
              <li><img src="../assets/images/c1_icon5.png" alt="">
                <span>健康档案</span>
              </li>
            </router-link>
          </ul>
        </div>
      </div>
      <div class="index_news">
        <div class="head">最新资讯</div>
        <div class="content">
          <ul>
            <li v-for="data in newsList">
              <div class="pic"><img :src="data.translates.cover_img" alt=""></div>
              <div class="txt">
                <div class="name">{{data.title}}</div>
                <div class="time">{{data.created_at.substring(0,10)}}</div>
                <div class="bottom">
                  <div class="star"><img src="../assets/images/c1_icon6.png" alt="">{{data.likes}}</div>
                  <div class="msg"><img src="../assets/images/c1_icon7.png" alt="">{{data.views}}</div>
                </div>
              </div>
            </li>
            <!-- <li>
						<div class="pic"><img src="../assets/images/2.jpg" alt=""></div>
						<div class="txt">
							<div class="name">北京紧急配送抗流感药 昨又有4000盒“达菲”抵京</div>
							<div class="time">06-16</div>
							<div class="bottom">
								<div class="star"><img src="../assets/images/c1_icon6.png" alt="">56</div>
								<div class="msg"><img src="../assets/images/c1_icon7.png" alt="">70</div>
							</div>
						</div>
					</li>
					<li>
						<div class="pic"><img src="../assets/images/3.jpg" alt=""></div>
						<div class="txt">
							<div class="name">外媒称全球药业迎中国制造：人才回流 癌症新药审批加速</div>
							<div class="time">06-16</div>
							<div class="bottom">
								<div class="star"><img src="../assets/images/c1_icon6.png" alt="">50</div>
								<div class="msg"><img src="../assets/images/c1_icon7.png" alt="">97</div>
							</div>
						</div>
					</li> -->
          </ul>
        </div>
      </div>
    </div>
    <footers FootOn='home'></footers>
  </div>
</template>

<script>
//导入模板
import headers from "../components/Header.vue";
import footers from "../components/Footer.vue";
export default {
  data() {
    return {
      newsList: []
    };
  },
  mounted() {
    this.getNews();
  },
  methods: {
    goHealthManage() {
      this.$router.push({ path: "/HealthManage" });
      // var userInfo = JSON.parse(localStorage.userInfo);
      // if (userInfo.vips && userInfo.vips.user_vip) {
      //   this.$router.push({ path: "/HealthManage" });
      // }
      // else{
      //   this.$router.push({ path: "/Plant" });
      // }
    },
    getNews() {
      var that = this;
      this.$ajax
        .get("/news")
        .then(function(res) {
          if (res.data.status == 200) {
            that.newsList = res.data.data;
          } else if (res.data.status == 401) {
            that.BaseSet.linkLogin(that);
          } else {
            that.$toast(res);
          }
        })
        .catch(function(err) {});
    }
  },
  components: { headers, footers }
  //请求数据接口
};
</script>

<style lang="scss" scoped>
.home_box {
  width: 100%;
  display: flex;
  display: -webkit-flex;
  height: 100%;
  -webkit-flex-direction: column;
  flex-direction: column;
  .contentScollr {
    flex: 1;
    -webkit-flex: 1;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
  }
  .box {
    width: 100%;
    overflow: hidden;
    background-color: #fff;
    .headimg {
      width: 17.55rem;
      height: 3.75rem;
      margin: 0.7rem auto;
      img {
        width: 17.55rem;
        height: 3.75rem;
      }
    }
    .nav {
      width: 100%;
      overflow: hidden;
      margin-top: 1.3rem;
      margin-bottom: 1.725rem;
      ul {
        display: flex;
        display: -webkit-flex;
        justify-content: center;
        li {
          margin: 0 0.725rem;
          width: 3rem;
          overflow: hidden;
          text-align: center;
          img {
            width: 3rem;
            height: 3rem;
            overflow: hidden;
          }
          span {
            width: 100%;
            margin-top: 0.45rem;
            font-size: 0.6rem;
            color: #333333;
          }
        }
      }
    }
  }
  .index_news {
    width: 100%;
    overflow: hidden;
    background-color: #fff;
    margin-top: 0.5rem;
    .head {
      width: 100%;
      height: 2rem;
      border-bottom: #e5e5e5 1px solid;
      line-height: 2rem;
      box-sizing: border-box;
      padding: 0 0.75rem;
      color: #4cc6d8;
      font-size: 0.7rem;
    }
    .content {
      width: 100%;
      overflow: hidden;
      ul {
        width: 100%;
        overflow: hidden;
        li {
          width: 100%;
          border-bottom: #e5e5e5 1px solid;
          overflow: hidden;
          box-sizing: border-box;
          padding: 0.75rem;
          font-size: 0;
          .pic {
            width: 4.65rem;
            height: 3.75rem;
            overflow: hidden;
            display: inline-block;
            vertical-align: top;
            img {
              width: 4.65rem;
              height: 3.75rem;
              object-fit: cover;
            }
          }
          .txt {
            width: 11.875rem;
            display: inline-block;
            margin-left: 0.375rem;
            overflow: hidden;
            vertical-align: top;
            .name {
              color: #333333;
              font-size: 0.7rem;
              display: -webkit-box;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 2;
              overflow: hidden;
              height: 3rem;
            }
            .time {
              color: #999999;
              font-size: 0.6rem;
              float: left;
            }
            .bottom {
              float: right;
              .star {
                display: inline-block;
                color: #999999;
                font-size: 0.6rem;
                margin-right: 0.75rem;
                img {
                  width: 0.6rem;
                  height: 0.525rem;
                  vertical-align: middle;
                  margin-right: 0.2rem;
                }
              }
              .msg {
                display: inline-block;
                color: #999999;
                font-size: 0.6rem;
                img {
                  width: 0.575rem;
                  height: 0.55rem;
                  vertical-align: middle;
                  margin-right: 0.2rem;
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>
