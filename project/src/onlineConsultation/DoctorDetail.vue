<template>
  <div class="doctor-detail">
    <headers headName=""></headers>
    <div class="contentScollr">
      <div class="head-top">
        <p class="bg-top">
        </p>
        <router-link :to="{ name: 'DoctorData', params: {id:id} }">
          <div class="doctor-info" v-cloak>
            <img :src="headImg" class="head-img" />
            <p class="name">
              {{dataInfo.realname}}
            </p>
            <p class="hospital">
              {{translates.hospital_title}}
            </p>
            <p class="department">
              {{translates.department_title+' '+dataInfo.jobtitle}}
            </p>
          </div>
        </router-link>
      </div>
      <smallHeader @changeView="changeTypeView" :parentType='editType' :smallData='smallHeaderData'></smallHeader>
      <ul class="list" v-show="editType==0">
        <li class="clear" @click="link(1)">
          <img src="../assets/images/c13_icon4.png" class="left icon-img" />
          <div class="info-box left">
            <p class="title">
              图文咨询
            </p>
            <p class="word">
              支持语音、图片、文字形式实时沟通更便捷
            </p>
          </div>
          <p class="right">
            <span>¥{{dataInfo.im_advice_price}}/次</span><img src="../assets/images/c13_liebiao.png" />
          </p>
        </li>
        <li class="clear" @click="link(2)">
          <img src="../assets/images/c13_icon5.png" class="left icon-img" />
          <div class="info-box left">
            <p class="title">
              电话咨询
            </p>
            <p class="word">
              一对一通话，无需透露手机号，保护个人隐私
            </p>
          </div>
          <p class="right">
            <span>¥{{dataInfo.telphone_advice_price}}/分钟</span><img src="../assets/images/c13_liebiao.png" />
          </p>
        </li>
        <li class="clear" @click="link(3)">
          <img src="../assets/images/c13_icon3.png" class="left icon-img" />
          <div class="info-box left">
            <p class="title">
              视频咨询
            </p>
            <p class="word">
              通过视频与医生面对面交流
            </p>
          </div>
          <p class="right">
            <span>¥{{dataInfo.video_advice_price}}/分钟</span><img src="../assets/images/c13_liebiao.png" />
          </p>
        </li>
      </ul>
      <ul class="list" v-show="editType==1">
        <li class="clear" @click="link(4)">
          <img src="../assets/images/c13_icon1.png" class="left icon-img" />
          <div class="info-box left">
            <p class="title">
              咨询类
            </p>
            <p class="word">
              仅提供线上咨询服务
            </p>
          </div>
          <p class="right">
            <span>¥{{dataInfo.advice_doctor_price}}/月</span><img src="../assets/images/c13_liebiao.png" />
          </p>
        </li>
        <li class="clear" @click="link(5)">
          <img src="../assets/images/c13_icon2.png" class="left icon-img" />
          <div class="info-box left">
            <p class="title">
              就近类
            </p>
            <p class="word">
              可线上咨询，也可预约上门服务
            </p>
          </div>
          <p class="right">
            <span>¥{{dataInfo.nearly_doctor_price}}/月</span><img src="../assets/images/c13_liebiao.png" />
          </p>
        </li>
      </ul>
      <div class="evaluate-one">
        <p class="title">
          评价({{commentList.length}})
        </p>
        <div v-if="commentArr.length>0">
          <div class="evaluate-content" v-for="comment in commentArr">
            <p class="clear line1">
              <img :src="comment.translates.avatar_img" class="left" />
              <span class="name left">{{comment.translates.realname}}</span>
              <span class="left score-span">
                <scoreReadOnly :gradeNum="comment.stars" gradeShow="0"></scoreReadOnly>
              </span>
              <span class="right time">{{comment.created_at.split(" ")[0]}}</span>
            </p>
            <p class="content-word">
              {{comment.content}}
            </p>
            <ul class="tag-list clear">
              <li v-for="tag in comment.translates.tags_desc">
                {{tag}}
              </li>
            </ul>
          </div>
          <div class="evaluate-handler">
            <router-link :to="{ name: 'EvaluateList', params: {id:id} }">
              <p class="view-btn">
                查看全部评价
              </p>
            </router-link>
          </div>
        </div>
        <div v-if="commentArr.length==0" class="nocomment">暂无评价</div>
      </div>
    </div>
  </div>
</template>
<script>
import headers from "../components/Header";
import smallHeader from "../components/SmallHeader";
import scoreReadOnly from "../components/ScoreReadOnly";
import avatarImg from "../assets/images/avatar.png";
export default {
  data() {
    return {
      smallHeaderData: ["咨询", "家庭医生"],
      editType: 0,
      id: this.$route.params.id,
      dataInfo: "",
      translates: "",
      headImg: avatarImg,
      commentList: [],
      commentArr: []
    };
  },
  mounted() {
    this.getData();
    this.doctorComment();
  },
  methods: {
    changeTypeView(num) {
      this.editType = num;
    },
    link(type) {
      var _this = this;
      switch (type) {
        case 1:
        case 2:
        case 3: {
          _this.$router.push({
            name: "FillDisease",
            params: { type: type, id: this.id }
          });
          break;
        }
        case 4:{
          _this.$router.push({
            name: "ConsultPay",
            params: {id: this.id }
          });
          break;
        }
        case 5:{
          _this.$router.push({
            name: "ConsultPayNearby",
            params: {id: this.id }
          });
          break;
        }
      }
    },
    getData() {
      var that = this;
      that.$ajax
        .get("/doctor/" + that.id)
        .then(function(res) {
          if (res.data.status == 200) {
            that.dataInfo = res.data.data;
            that.headImg = res.data.data.translates.avatar_img;
            that.translates = res.data.data.translates;
          } else if (res.data.status == 401) {
            that.BaseSet.linkLogin();
          } else {
            that.$toast(res.data.message);
          }
        })
        .catch(function(err) {
          that.$toast(err);
          that.BaseSet.linkLogin();
        });
    },
    doctorComment() {
      var that = this;
      that.$ajax
        .get("comment/doctorcomment/" + that.id)
        .then(function(res) {
          if (res.data.status == 200) {
            console.log(res.data.data);

            if (res.data.data.comment.length > 0) {
              that.commentList = res.data.data.comment;
              that.commentArr.push(res.data.data.comment[0]);
            }
          } else if (res.data.status == 401) {
            that.BaseSet.linkLogin();
          } else {
            that.$toast(res.data.message);
          }
        })
        .catch(function(err) {
          that.$toast(err);
          that.BaseSet.linkLogin();
        });
    }
  },
  components: { headers, smallHeader, scoreReadOnly }
};
</script>
<style lang="scss">
.doctor-detail {
  .left {
    float: left;
  }
  .right {
    float: right;
  }
  display: flex;
  height: 100%;
  flex-direction: column;
  .contentScollr {
    flex: 1;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
  }
  .small-header {
    border-bottom: 1px solid #e5e5e5;
    position: static;
    li {
      width: 3.2rem /* 128/40 */;
      margin: 0 2.7rem /* 52/40 */;
    }
  }
  .head-top {
    .bg-top {
      background: #4cc6d8;
      height: 3.1rem;
    }
    .doctor-info {
      position: relative;
      height: 5.9rem /* 237/40 */;
      background: #fff;
      text-align: center;
      margin-bottom: 0.5rem /* 20/40 */;
      .head-img {
        background-color: #ccc;
        width: 4rem /* 158/40 */;
        height: 4rem /* 158/40 */;
        border-radius: 50%;
        border: 0.1rem /* 6/40 */ solid #fff;
        margin: 0 auto;
        margin-top: -2rem;
        margin-bottom: 0.5rem /* 18/40 */;
      }
      img {
        width: 3.9rem /* 154/40 */;
        height: 3.9rem /* 154/40 */;
        border: 0.1rem /* 6/40 */ solid #fff;
        border-radius: 50%;
      }
      .name {
        font-size: 0.7rem /* 28/40 */;
        color: #333;
        line-height: 0.7rem /* 28/40 */;
        margin-bottom: 0.3rem /* 12/40 */;
      }
      p {
        text-align: center;
        font-size: 0.6rem /* 24/40 */;
        color: #666;
        line-height: 0.6rem;
      }
      .hospital {
        margin-bottom: 0.3rem /* 14/40 */;
      }
    }
  }
  .list {
    margin-bottom: 0.5rem /* 20/40 */;
    li {
      padding: 0.8rem /* 30/40 */;
      background: #fff;
      border-bottom: 1px solid #e5e5e5;
      .icon-img {
        width: 0.8rem /* 30/40 */;
        margin-top: 0.4rem;
      }
      .info-box {
        width: 70%;
        margin-left: 0.2rem /* 16/40 */;
        .title {
          font-size: 0.7rem /* 28/40 */;
          color: #333;
          line-height: 0.7rem;
          margin-bottom: 0.3rem /* 14/40 */;
        }
        .word {
          font-size: 0.6rem /* 24/40 */;
          color: #999;
          // line-height: 0.6rem;
        }
      }
      .right {
        font-size: 0.7rem /* 28/40 */;
        color: #333;
        line-height: 1.6rem;
        img {
          width: 0.3rem /* 13/40 */;
          height: 0.6rem /* 24/40 */;
          vertical-align: middle;
          margin-left: 0.3rem /* 12/40 */;
        }
      }
    }
  }
  .evaluate-one {
    background: #fff;
    padding-bottom: 0.5rem;
    .title {
      line-height: 2rem /* 80/40 */;
      padding: 0 0.8rem /* 30/40 */;
      color: #4cc6d8;
      font-size: 0.7rem /* 28/40 */;
      border-bottom: 1px solid #e5e5e5;
    }

    .nocomment {
      font-size: 0.7rem;
      color: #666;
      text-align: center;
      line-height: 1.4rem;
    }
    .evaluate-content {
      padding: 0.5rem /* 20/40 */ 0.8rem /* 30/40 */;
      border-bottom: 1px solid #e5e5e5;
      .line1 {
        margin-bottom: 0.3rem /* 10/40 */;
        > img.left {
          width: 1.8rem /* 70/40 */;
          height: 1.8rem /* 70/40 */;
          border-radius: 50%;
          margin-right: 0.4rem /* 17/40 */;
        }
        .name {
          font-size: 0.6rem /* 24/40 */;
          color: #333;
          margin-right: 0.6rem /* 25/40 */;
          line-height: 1.8rem;
        }
        .score-span {
          margin-top: 0.5rem;
        }
        .time {
          font-size: 0.6rem /* 24/40 */;
          color: #999;
          line-height: 1.8rem;
        }
      }
      .content-word {
        font-size: 0.7rem /* 28/40 */;
        color: #333;
        line-height: 1.2rem /* 48/40 */;
      }
    }
    .tag-list {
      margin: 0.3rem /* 13/40 */ 0;
      li {
        float: left;
        padding: 0 0.3rem /* 14/40 */;
        line-height: 0.9rem /* 38/40 */;
        border: 1px solid #666;
        color: #666;
        text-align: center;
        margin-right: 0.5rem /* 20/40 */;
        font-size: 0.6rem /* 24/40 */;
        border-radius: 0.3rem /* 10/40 */;
      }
    }
    .evaluate-handler {
      text-align: center;

      margin: 0.5rem /* 18/40 */ auto;
    }
    .view-btn {
      display: inline;
      height: 1.4rem; /* 56/40 */
      line-height: 1.4rem; /* 56/40 */
      padding: 0.2rem 0.4rem;
      text-align: center;
      border: 1px solid #666;
      text-align: center;
      font-size: 0.6rem /* 24/40 */;
      color: #666;
      border-radius: 0.3rem /* 10/40 */;
    }
  }
}
</style>
