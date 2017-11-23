import 'babel-polyfill';
import Vue from 'vue';
import myUpload from '../upload-1.vue';

new Vue({
	el: '#app',
	data: {
		show1: false,
		show2: false,
		show3: false,
		avatarUrl1: null,
		avatarUrl2: null,
		avatarUrl3: null,
		otherParams: {
			token: '123456798',
			name: 'img'
		}
	},
	components: {
		'tuy-upload': myUpload
	},
	methods: {
		toggleShow1() {
			let {show1} = this;
			this.show1 = !show1;
		},
		toggleShow2() {
			let {show2} = this;
			this.show2 = !show2;
		},
		toggleShow3() {
			let {show3} = this;
			this.show3 = !show3;
		}
	},
	events: {
		cropSuccess(data, field, key) {
			if (field == 'avatar1') {
				this.avatarUrl1 = data;
			}
			cropSuccess(data)
		}
	}
});
