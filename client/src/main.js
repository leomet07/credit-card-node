import Vue from 'vue'
import App from './App.vue'
import router from './router'

console.clear()

Vue.config.productionTip = false

const base_url = process.env.NODE_ENV == "development" ? 'http://192.168.7.36:3000' : 'https://creditcardbackend.herokuapp.com'
console.log("BASE_URL " + base_url)
const shared = {
	message: "my global message",
	logged_in: null,
	checked_token: false,
	BASE_URL: base_url,
	makeTitleCase: function (starter) {
		const back = starter.split(" ").reduce((prev, current) => {
			let txt =
				current.charAt(0).toUpperCase() +
				current.substr(1).toLowerCase();

			return prev + txt + " ";
		}, "");



		return back
	}

}

window.BASE_URL = base_url


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