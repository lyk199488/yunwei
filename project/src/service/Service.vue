<template>
	<div class="service-box">
		<headers headName='我的服务' NoBack='true'></headers>
		<smallHeader :smallData="smallHeaderData" @changeView="changeTypeView" :parentType='editType'></smallHeader>
		<div class="contentScollr">
			<mt-loadmore :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" :autoFill='false' ref="loadmore">
				<ul class="service-list">
					<li class="clear" v-for="(data,index) in allData" @click="consultDetail(data.type,data.status,data.id,index)">
						<img :src="data.doctor.translates.avatar_img" class="left" />
						<div class="left info-box">
							<p class="line1 clear">
								<span class="left name">{{data.doctor.realname}}
									<span class="c1">({{data.translates.type_desc}})</span>
								</span>
								<span class="right">{{data.created_at}}</span>
							</p>
							<p class="line2">
								<span class="left">{{data.doctor.translates.department_title+' '+data.doctor.jobtitle}}</span>
								<span class="right">{{data.translates.status_desc}}</span>
							</p>
						</div>
					</li>
				</ul>
			</mt-loadmore>
		</div>
		<footers FootOn='service'></footers>
	</div>
</template>

<script>
//导入模板
import headers from "../components/Header.vue";
import footers from "../components/Footer.vue";
import smallHeader from "../components/SmallHeader.vue";
export default {
  data() {
    return {
      smallHeaderData: ["全部", "图文咨询", "电话咨询", "视频咨询"],
      editType: 0,
      allLoaded: false, //是否为最后一页
      page: 1,
      per_page: 6, //每页最大数
      last: false,
      allData: []
    };
  },
  mounted() {
    this.BaseSet.getToken(this);
    this.getDataList(this);
  },
  methods: {
    changeTypeView(num) {
      this.allData = [];
      this.page = 1;
      this.editType = num;
      this.getDataList();
    },
    loadBottom() {
      this.allLoaded = false;
      setTimeout(function() {
        if (!this.last) {
          this.getDataList();
        } else {
          this.allLoaded = true;
        }
        this.$refs.loadmore.onBottomLoaded();
      }, 500);
    },
    consultDetail(type, status, id,i) {
      if (type == 1) {
        this.$router.push({
          name: "TelConsult",
          params: { status: status, id: id }
        });
      } else if (type == 2) {
        this.$router.push({
          name: "VideoConsult",
          params: { status: status, id: id }
        });
      } else if (type == 0) {
		var that = this;
		var otherInfo=that.allData[i];
		var userInfo=JSON.parse(localStorage.userInfo);
        this.native.im({
          vueRouter:that.$router,
          status: 1,
          me: {
            id: userInfo.id,
            nickname: userInfo.realname,
            avatar: userInfo.translates.avatar_img,
            jobtitle: "",
            department: "",
            hospital: "",
            identity: "user"
          },
          other: {
            id: otherInfo.doctor.id,
            nickname: otherInfo.doctor.realname,
            avatar:otherInfo.doctor.translates.avatar_img,
            jobtitle: otherInfo.doctor.jobtitle,
            department: otherInfo.doctor.translates.department_title,
            hospital: otherInfo.doctor.translates.hospital_title,
            identity: "doctor"
          }
        });
      }
    },
    getDataList() {
      var that = this;
      let params = {};
      if (this.editType != 0) {
        if (this.editType == 1) {
          params.type = 0;
        } else if (this.editType == 2) {
          params.type = 1;
        } else if (this.editType == 3) {
          params.type = 2;
        }
      }
      that.$ajax
        .get("/service?per_page=" + this.per_page + "&page=" + this.page, {
          params: params
        })
        .then(function(res) {
          console.log(res.data);
          if (res.data.status == 200) {
            that.page++;
            if (res.data.data.data.length) {
              that.last = false;
              for (let i = 0; i < res.data.data.data.length; i++) {
                that.allData.push(res.data.data.data[i]);
              }
            } else {
              that.last = true;
            }
          }
        })
        .catch(function(err) {});
    }
  },
  components: { headers, footers, smallHeader }
  //请求数据接口
};
</script>

<style lang="scss">

.service-box {
  display: flex;
  height: 100%;
  flex-direction: column;
  .contentScollr {
    flex: 1;
    overflow:auto;
    -webkit-overflow-scrolling: touch;
  }
  .small-header {
    margin-bottom: 0.5rem;
    li {
      width: auto;
      text-align: center;
      margin: 0 0.5rem !important;
      line-height: 1.9rem;
      color: #666;
      font-size: 0.7rem;
      font-family: PingFangSC-Regular;
      float: left;
      &:last-child {
        margin-right: 0;
      }
    }
    .current {
      color: #4cc6d8;
      border-bottom: 0.1rem solid #4cc6d8;
    }
  }
  .service-list {
    li {
      padding: 0.8rem;
      border-bottom: 1px solid #e5e5e5;
      background: #fff;
      > img {
        width: 2.3rem;
        height: 2.3rem;
        margin-right: 0.5rem;
        border-radius: 50%;
      }
      .left {
        float: left;
      }
      .right {
        float: right;
      }
      .info-box {
        width: calc(100% - 2.8rem);
        p {
          font-size: 0.6rem;
          color: #999;
          line-height: 0.6rem;
        }
        .line1 {
          .name {
            font-size: 0.7rem;
            color: #333;
            .c1 {
              font-size: 0.6rem;
              color: #4cc6d8;
              margin-left: 0.3rem;
            }
          }
          line-height: 0.7rem;
          margin-top: 0.2rem;
          margin-bottom: 0.6rem;
        }
      }
    }
  }
}
</style>
