// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import util from "./util"
import {
    DatetimePicker,
    Popup,//弹出框
    Picker,
    Loadmore,
    Spinner,//加载动画
    CellSwipe//可滑动的单元格
} from 'mint-ui'
import chart from './chart.js'
import Toast from 'mint-ui'
import MessageBox from 'mint-ui'
import 'mint-ui/lib/style.css'


//
import axios from 'axios'

Vue.config.productionTip = false
Vue.use(util)
    //引入公共"样式
import './assets/css/common.scss'
Vue.use(Toast)
Vue.use(MessageBox)
Vue.use(chart)
    //引入Mint-UI
Vue.component(DatetimePicker.name, DatetimePicker, Popup.name, Popup, Picker.name, Picker, Loadmore.name, Loadmore, Spinner.name, Spinner, CellSwipe.name, CellSwipe)
    //
Vue.prototype.$ajax = axios;
axios.defaults.baseURL = 'http://api-hygjuser.zpftech.com'; //用户端默认api

//图片查看插件
import wcView from 'wc-view'
import 'wc-view/style.css'
Vue.use(wcView)
import vuePicturePreview from 'vue-picture-preview'
Vue.use(vuePicturePreview)
    /* eslint-disable no-new */

// 微信调试
// import VConsole from 'VConsole';
// let vConsole = new VConsole();


new Vue({
    el: '#app',
    router,
    template: '<App/>',
    components: {
        App
    }
})
Vue.prototype.towLine = '1'
