<template>
  <div class="login">
    <headers headName="登录" NoBack='true'></headers>
    <div class="main">
      <div class="contentScollr">
        <div class="logo-box">
          <img src="../assets/images/b1_logo.png" />
        </div>
        <div class="form-box">
          <ul class="form-list">
            <li>
              <input type="number" class="input-p" placeholder="请输入手机号" v-model="telNum" />
            </li>
            <li>
              <input type="password" class="input-p" v-model="password" placeholder="请输入密码" />
            </li>
          </ul>
          <p class="sure-btn" @click="sureEdit()">
            登录
          </p>
        </div>
        <router-link :to="{ name: 'FindPassword', params: {} }">
          <p class="tip">
            忘记登录密码？
          </p>
        </router-link>
      </div>
    </div>
    <p class="bottom-p">
      还没有账户了？
      <router-link :to="{ name: 'Register', params: {} }">
        <span class="c1">去注册</span>
      </router-link>
    </p>
  </div>

</template>
<script type="text/ecmascript-6">
import headers from "../components/Header";

export default {
  data() {
    return {
      telNum: "",
      password: ""
    };
  },
  beforeMount() {
    var userInfo = localStorage.userInfo;
    if (userInfo) {
      this.register();
      this.$router.replace({ name: "Home" });
    }
  },
  mounted() {
    //获取openid
    console.log("code数据：", this.getUrlParam("code"));
    // localStorage.code = this.native.getUrlParam("code");
    let code = this.getUrlParam("code");
    if (code) {
      this.$ajax
        .post("/getaccesstoken", {
          code: code,
          openid: ""
        })
        .then(res => {
          console.log(res);
          if (res.data.status == 200) {
            localStorage.weChartPayInfo = JSON.stringify(res.data.data);
          }
        })
        .catch(err => {
          this.$toast("微信授权失败！");
        });
    }
  },
  methods: {
    //获取url参数
    getUrlParam: function(name) {
      let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
      let r = window.location.search.substr(1).match(reg);
      if (r != null) return unescape(r[2]);
      return null;
    },
    sureEdit() {
      var that = this;
      if (this.telNum == "") {
        this.$toast("请输入手机号码");
        return false;
      }
      if (this.telNum.length != 11) {
        this.$toast("手机号码格式不正确");
        return false;
      }
      if (this.password == "") {
        this.$toast("请输入密码");
        return false;
      }
      const regExp = /^[a-zA-Z\d]{6,16}$/;
      if (!regExp.test(this.password)) {
        this.$toast("密码格式不正确");
        return false;
      }
      this.$ajax
        .post("/auth/login", {
          username: that.telNum,
          password: that.password,
          login_type: "phone"
        })
        .then(function(res) {
          var data = res.data;
          if (data.status == 422) {
            that.$toast(data.message);
          } else if (data.status == 200) {
            that.BaseSet.setInfo("userInfo", JSON.stringify(data.data));
            that.register();
            that.BaseSet.getToken(that); //用户端token
            //console.log(that.$ajax.defaults.headers.common["Authorization"])
            that.$toast(data.message);
            setTimeout(function() {
              that.$router.replace({ name: "Home" });
            }, 1500);
          } else {
            that.$toast(data.message);
          }
        })
        .catch(function(err) {
          that.$toast(err);
        });
    },
    register() {
      var userInfo = JSON.parse(localStorage.userInfo);
      this.native.register({
        token: userInfo.api_token,
        id: userInfo.id,
        realname: userInfo.realname,
        imsign: userInfo.im_sig,
        livesign: userInfo.im_sig,
        avatar: userInfo.translates.avatar_img
      });
    }
  },
  components: {
    headers
  }
};
</script>
<style lang="scss" scoped>
input:-ms-input-placeholder {
  color: #999;
  font-size: 0.75rem;
}

input::-moz-placeholder {
  color: #999;
  font-size: 0.75rem;
}

input:-moz-placeholder {
  /* Mozilla Firefox 4 to 18 */
  color: #999;
  font-size: 0.75rem;
}

input::-webkit-input-placeholder {
  color: #999;
  font-size: 0.75rem;
}

.login {
  display: flex;
  height: 100%;
  flex-direction: column;
  .main {
    width: 100%;
    left: 0px;
    right: 0px;
    -webkit-overflow-scrolling: touch;
  }
  .contentScollr {
    // flex: 1;
    // overflow: auto;
    // -webkit-overflow-scrolling: touch;
    height: auto;
  }
  .tip {
    text-align: center;
    color: #999;
    font-size: 0.7rem;
    line-height: 0.7rem;
    margin-top: 1.5rem;
  }
  .logo-box {
    text-align: center;
    margin-top: 6.4rem;
    margin-bottom: 1.6rem;
    img {
      width: 3.5rem;
      height: 2.6rem;
    }
  }
  .form-box {
    .form-list {
      li {
        width: 14.5rem;
        height: 2rem;
        margin: 0 auto;
        margin-bottom: 1.1rem;
        .input-p {
          width: 13rem;
          height: 2rem;
          background: #fff;
          border-radius: 0.3rem;
          line-height: 2rem;
          padding: 0 0.8rem;
        }
      }
    }
  }
  .c1 {
    color: #4cc6d8;
  }
  .sure-btn {
    width: 14.5rem;
    height: 2rem;
    background: #4cc6d8;
    border-radius: 0.3rem;
    text-align: center;
    line-height: 2rem;
    color: #fff;
    font-size: 0.8rem;
    margin: 0 auto;
    margin-top: 1.5rem;
  }
  .bottom-p {
    position: absolute;
    text-align: center;
    font-size: 0.7rem;
    color: #999;
    bottom: 0.9rem;
    left: 6.3rem;
  }
}
</style>
