import Vue from 'vue'
import App from './App.vue'
import router from './router'

console.clear()

Vue.config.productionTip = false

const shared = {
    message: "my global message",
    logged_in: false,
    checked_token: false
}

shared.install = function () {
    Object.defineProperty(Vue.prototype, '$global', {
        get() {
            return shared
        }
    })
}
Vue.use(shared);


new Vue({
    router,
    render: h => h(App),
    data: {
        shared
    },
    mounted() {
        // console.log("My global: ", this.$global.message)
    }
}).$mount('#app')