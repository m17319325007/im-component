<template>
	<div class="home">
		<img alt="Vue logo" src="../assets/images/logo.png">
		<button @click="test()">测试</button>
		<Dialog :visible.sync="visible" :before-close="handleClose">
			<News baseUrl="http://alpha.mytongche.com/" :params="params" @close="close" @input="changeSearch" title="IM" inputPlaceholder="搜索姓名/群组"></News>
		</Dialog>
	</div>
</template>

<script>


// @ is an alias to /src
import Dialog from '@/components/Dialog.vue'
import News from '@/components/News.vue'

export default {
	name: 'home',
	components: {
		Dialog,
		News
	},
	data() {
		return {
			visible: false,
			params: {
				token: "e3VuaXRJZDonODQ2NCcsIGxvZ2luTmFtZTonMTM1NzIwMDMzMzMnLCBsYXN0VmFsaWREYXRlOicyMDE5LTEyLTI2IDE2OjIwOjE2JywgaWQ6JzEyNjcnLCBwaG9uZTonMTM1NzIwMDMzMzMnLCB0aXRsZTonbWFuZ2)lj5HotKfljZXkvY0nLCB1c2VyUGljOidkZWZhdWx0L2RlZmF1bHQucG5nJywgdXNlclJvbGU6JzMnLCB1c2VyTmFtZTon6IqS5p6c5a626am(JywgcmVnVGltZTonMjAxOC0wNS0yMiAxNToxOTo1MCcsIHZlcnNpb25UeXBlOidxeWInLCBsYXN0T25saW5lVGltZTonMjAxOS0xMi0xOSAxNjoyMDoxNicsIGFwcElkOid0b25nY2hlJ30@",
				backend: 1,
				urid: 1267
			}
		}
	},
	methods: {
		close() {
			this.visible = false;
		},
		handleClose() {

		},
		changeSearch(val) {
			console.log(val);
		},
		test() {
			this.visible = true;
		}
	}
}
</script>
