<template>
	<div class="my-data">
		<headers headName="完成个人信息"></headers>
		<div class="contentScollr">
			<div class="head-top clear">
				<span class="name">头像</span>
				<img class="head-img" :src="headImg" @click="uploadImg" />
				<img class="btn-img" src="../assets/images/c13_liebiao.png" />
			</div>
			<div class="form_box">
				<div class="form">
					<ul>
						<li>
							<span class="name">姓名</span>
							<input type="text" maxlength="12" v-model="userName" class="text" placeholder="请输入姓名">
						</li>
            <li>
							<span class="name">昵称</span>
							<input type="text" maxlength="12" v-model="nickName" class="text" placeholder="请输入昵称">
						</li>
						<li>
							<span class="name">性别</span>
							<input type="radio" v-model="sex" value="0" name="sex" class="input-radio one_sel" />
							<span class="radio-name">女</span>
							<img class="radio-img" src="../assets/images/b2_icon1_p.png" v-if="sex!=0" />
							<img class="radio-img" src="../assets/images/b2_icon1.png" v-if="sex==0" />
							<input type="radio" v-model="sex" value="1" name="sex" class="input-radio input-radio1 one_sel" />
							<span class="radio-name radio-name1">男</span>
							<img class="radio-img radio-img1" src="../assets/images/b2_icon1_p.png" v-if="sex!=1" />
							<img class="radio-img radio-img1" src="../assets/images/b2_icon1.png" v-if="sex==1" />
						</li>
						<li>
							<span class="name">生日</span>
							<input type="text" class="text time" placeholder="请选择" @click="openDatePicker" v-model="brithday" readonly>
							<img src="../assets/images/c13_liebiao.png" class="arrow">
						</li>
						<li>
							<span class="name">所在城市</span>
							<input type="text" class="text time" placeholder="请选择" @click="openPopup(1)" v-model="city" readonly>
							<img src="../assets/images/c13_liebiao.png" class="arrow">
						</li>
						<li>
							<span class="name">病症</span>
							<input type="text" class="text time" placeholder="请输入病症" v-model="disease">
						</li>
						<li>
							<span class="name">手机号</span>
							<input type="number" v-model="telNum" class="text" placeholder="请输入手机号码">
						</li>
						<li>
							<span class="name">华医ID</span>
							<span class="tag">{{userId}}</span>
						</li>
					</ul>
				</div>
			</div>
			<p class="complete-btn" @click="complete()">
				完成
			</p>
			<mt-popup v-model="popupStatus" position="bottom">
				<div class="popup-box">
					<p class="head clear">
						<span class="cancel" @click="closePopup(1)">取消</span>
						<span class="title">城市</span>
						<span class="sure" @click="sureValue(1)">确认</span>
					</p>
					<mt-picker :slots="cityArr" valueKey="title" @change="onValuesChange1"></mt-picker>
				</div>

			</mt-popup>
			<mt-popup v-model="popupStatus2" position="bottom">
				<div class="popup-box">
					<p class="head clear">
						<span class="cancel" @click="closePopup(2)">取消</span>
						<span class="title">病症</span>
						<span class="sure" @click="sureValue(2)">确认</span>
					</p>
					<mt-picker :slots="diseaseArr" @change="onValuesChange2"></mt-picker>
				</div>

			</mt-popup>
			<mt-datetime-picker ref="picker1" type="date" :startDate="startDate" :endDate="endDate" year-format="{value}" month-format="{value}" date-format="{value}" @confirm="handleConfirm" v-model="pickerValue">
			</mt-datetime-picker>
		</div>
	</div>
</template>

<script>
//导入模板
import headers from "../components/Header.vue";
export default {
  data() {
    return {
      city: "",
      cityId: "",
      areaId: "",
      provinceId: "",
      changeCity: "",
      userName: "",
      nickName:"",
      headImg: "",
      pickerValue: "",
      disease: "",
      brithday: "",
      popupStatus: false,
      popupStatus2: false,
      userData: "",
      startDate: new Date("1900"),
      endDate: new Date(),
      sex: 1,
      telNum: '',
      userId: "",
      pickerStatus: false,
      cityArr: [
        {
          flex: 1,
          values: [],
          className: "slot1",
          textAlign: "center"
        },
        {
          flex: 1,
          values: [],
          className: "slot2",
          textAlign: "center"
        },
        {
          flex: 1,
          values: [],
          className: "slot3",
          textAlign: "center"
        }
      ],
      diseaseArr: [
        {
          flex: 1,
          values: ["高血压", "高血脂", "糖尿病", "心脏病"],
          className: "slot2",
          textAlign: "center"
        }
      ],
      avatarId: 0
    };
  },
  mounted() {
    this.BaseSet.getToken(this);
    this.BaseSet.getAddress(this);
    this.getData();
  },
  methods: {
    getData() {
      var that = this;
      this.$ajax
        .get("/user/me")
        .then(function(res) {
          console.log(res.data);
          if (res.data.status == 200) {
            that.userData = res.data.data;
            that.nickName=that.userData.nickname;
            that.headImg = that.userData.translates.avatar_img;
            that.avatarId = that.avatar_id;
            that.userName = that.userData.realname;
            that.sex = that.userData.sex;
            that.brithday = that.userData.brithday;
            that.city =
              that.userData.translates.province_title +
              " " +
              that.userData.translates.city_title +
              " " +
              that.userData.translates.area_title;
            that.telNum = that.userData.phone_no;
            that.userId = that.userData.id;
            that.provinceId = that.userData.province_id;
            that.cityId = that.userData.city_id;
            that.areaId = that.userData.area_id;
            that.disease = that.userData.illness;
          } else if (res.data.status == 401) {
            that.$toast("请重新登录");
            setTimeout(function() {
              that.$router.push({ name: "Login" });
            }, 1500);
          } else {
            that.$toast(res.data.message);
          }
        })
        .catch(function(err) {
          //that.$toast(err)
          that.BaseSet.linkLogin(that);
        });
    },
    openPopup(num) {
      if (num == 1) {
        this.popupStatus = true;
      } else {
        this.popupStatus2 = true;
      }
    },
    openDatePicker() {
      this.$refs.picker1.open();
    },
    handleConfirm(res) {
      console.log(res);
      let d = new Date(res);
      this.brithday =
        d.getFullYear() +
        "-" +
        (d.getMonth() + 1 > 9 ? d.getMonth() + 1 : "0" + (d.getMonth() + 1)) +
        "-" +
        (d.getDate() > 9 ? d.getDate() : "0" + d.getDate());
    },
    closePopup(num) {
      if (num == 1) {
        this.popupStatus = false;
      } else {
        this.popupStatus2 = false;
      }
    },
    onValuesChange1(picker, values) {
      this.BaseSet.setCity(this, picker, values);
    },
    onValuesChange2(picker, values) {
      this.changeDisease = values;
    },
    sureValue(num) {
      if (num == 1) {
        this.BaseSet.setCityVal(this);
      } else {
        this.popupStatus2 = false;
        this.disease = this.changeDisease;
      }
    },
    uploadImg() {
      var that = this;
      this.native.photo({ num: 1, width: 1, height: 1, size: 80 }, function(data) {
        that.headImg = data.imgs.split(",")[0];
        that.avatarId = data.id.split(",")[0];
      });
    },
    complete() {
      var that=this;
      if (this.userName == "") {
        this.$toast("请输入姓名");
        return false;
      }
      if (this.nickname == "") {
        this.$toast("请输入昵称");
        return false;
      }
      if (this.brithday == "") {
        this.$toast("请选择生日");
        return false;
      }
      if (this.city == "") {
        this.$toast("请选择城市");
        return false;
      }
      if (this.disease == "") {
        this.$toast("请输入病症");
        return false;
      }
      this.$ajax
        .put("/user/" + this.userId, {
          avatar_id: that.avatarId,
          realname: that.userName,
          nickname:that.nickName,
          sex: that.sex,
          brithday: that.brithday,
          illness: that.disease,
          phone_no: that.telNum,
          province_id: that.provinceId,
          city_id: that.cityId,
          area_id: that.areaId
        })
        .then(res => {
          if (res.data.status == 200) {
            this.$toast("信息修改成功！");
            setTimeout(function() {
              that.$router.push({ name: "My" });
            }, 1000);
          }
        })
        .catch(err => {
          this.BaseSet.linkLogin(this);
        });
    }
  },
  components: { headers }
};
</script>

<style lang="scss">
.my-data {
  display: flex;
  height: 100%;
  flex-direction: column;
  .contentScollr {
    flex: 1;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
  }
  .head-top {
    padding: 0.5rem 0.8rem;
    background: #fff;
    margin-bottom: 0.6rem;
    .name {
      line-height: 2.5rem;
      font-size: 0.7rem;
      color: #333;
      float: left;
    }
    .head-img {
      width: 2.5rem;
      height: 2.5rem;
      border-radius: 50%;
      float: left;
      margin-right: 0.2rem;
      margin-left: 12.7rem;
    }
    .btn-img {
      vertical-align: middle;
      float: right;
      width: 0.3rem;
      height: 0.7rem;
      margin-top: 0.9rem;
    }
  }
  .mint-popup-bottom {
    width: 100%;
  }
  .popup-box {
    width: 100%;
    .head {
      line-height: 3rem;
      padding: 0 0.8rem;
      border-bottom: 1px solid #e5e5e5;
      .cancel {
        font-size: 0.8rem;
        color: #999;
        float: left;
      }
      .sure {
        font-size: 0.8rem;
        color: #999;
        float: right;
      }
      .title {
        font-size: 0.9rem;
        color: #4cc6d8;
        float: left;
        width: 13.8rem;
        text-align: center;
      }
    }
    .popup-list {
      padding-top: 5.2rem;
      li {
        line-height: 1.6rem;
        text-align: center;
        font-size: 0.9rem;
        color: #333;
        border-bottom: 1px solid #e5e5e5;
        &:first-child {
          border-top: 1px solid #e5e5e5;
        }
      }
    }
  }
  .form_box {
    width: 100%;
    overflow: hidden;
    background-color: #fff;
    .form {
      width: 100%;
      overflow: hidden;
      li {
        width: 100%;
        box-sizing: border-box;
        padding: 0 0.75rem;
        height: 2.25rem;
        line-height: 2.25rem;
        overflow: hidden;
        position: relative;
        border-bottom: #e5e5ee 1px solid;
        &:last-child {
          border-bottom: none;
        }
        .input-radio,
        .radio-img {
          width: 1.3rem;
          height: 1.3rem;
          position: absolute;
          right: 1.8rem;
          top: 0.4rem;
        }
        .input-radio {
          z-index: 10;
        }
        .input-radio1,
        .radio-img1 {
          right: 6.8rem;
        }
        .radio-name {
          float: right;
          font-size: 0.7rem;
          color: #666;
        }
        .radio-name1 {
          margin-right: 4.2rem;
        }
        .name {
          font-size: 0.7rem;
          color: #333333;
          float: left;
        }
        .tag {
          float: right;
          font-size: 0.7rem;
          color: #333333;
        }
        .text {
          float: right;
          font-size: 0.7rem;
          color: #333333;
          //margin-top: .65rem;
          line-height: 2.25rem;
          text-align: right;
          width: 12.5rem;
        }
        .time {
          margin-right: 0.5rem;
        }
        .text::-webkit-input-placeholder {
          color: #999999;
        }
        .arrow {
          width: 0.3rem;
          height: 0.6rem;
          position: absolute;
          right: 0.75rem;
          top: 50%;
          margin-top: -0.3rem;
        }
      }
    }
    .pic_box {
      width: 100%;
      overflow: hidden;
      box-sizing: border-box;
      padding: 0 0.75rem;
      padding-bottom: 1.25rem;
      .title {
        width: 100%;
        color: #999999;
        font-size: 0.7rem;
        margin-top: 1.35rem;
      }
      li {
        width: 3.95rem;
        height: 3.95rem;
        overflow: hidden;
        float: left;
        margin-right: 0.2rem;
        position: relative;
        margin-top: 0.55rem;
        img {
          width: 3.95rem;
          height: 3.95rem;
          object-fit: cover;
        }
        .close {
          position: absolute;
          width: 1.25rem;
          height: 1.25rem;
          right: 0.125rem;
          top: 0.125rem;
        }
      }
    }
  }
  .complete-btn {
    width: 17.2rem;
    background: #4cc6d8;
    border-radius: 0.3rem;
    color: #fff;
    text-align: center;
    font-size: 0.8rem;
    height: 2rem;
    line-height: 2rem;
    margin: 0 auto;
    margin-top: 1.5rem;
  }
}
</style>
