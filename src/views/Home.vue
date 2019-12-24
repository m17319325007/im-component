<template>
	<div class="home">
		<button @click="test()">测试</button>
		<button @click="logoutBtn()">测试退出</button>
		<Dialog :isModal="false" :visible.sync="visible" :before-close="handleClose">
			<News ref="news" :visible="visible" @logout="logout" @dialogue="dialogueNew" :userID="userID" :baseUrl="baseUrl" :loginData="loginData" :params="params" @close="close" title="IM" inputPlaceholder="搜索姓名/群组"></News>
		</Dialog>
	</div>
</template>

<script>


// @ is an alias to /src
import Dialog from '@/components/IM/Dialog.vue'
import News from '@/components/IM/News.vue'
export default {
	name: 'home',
	components: {
		Dialog,
		News
	},
	data() {
		return {
			userID: "",
			loginData: {},
			baseUrl: "http://alpha.mytongche.com/",
			visible: false,
			params: {
				token: "e3VuaXRJZDonODQ2NCcsIGxvZ2luTmFtZTonMTM1NzIwMDMzMzMnLCBsYXN0VmFsaWREYXRlOicyMDE5LTEyLTI2IDE2OjIwOjE2JywgaWQ6JzEyNjcnLCBwaG9uZTonMTM1NzIwMDMzMzMnLCB0aXRsZTonbWFuZ2)lj5HotKfljZXkvY0nLCB1c2VyUGljOidkZWZhdWx0L2RlZmF1bHQucG5nJywgdXNlclJvbGU6JzMnLCB1c2VyTmFtZTon6IqS5p6c5a626am(JywgcmVnVGltZTonMjAxOC0wNS0yMiAxNToxOTo1MCcsIHZlcnNpb25UeXBlOidxeWInLCBsYXN0T25saW5lVGltZTonMjAxOS0xMi0xOSAxNjoyMDoxNicsIGFwcElkOid0b25nY2hlJ30@",
				backend: 1,
				urid: 1267
			}
		}
	},
	mounted() {
		// this.userID = 'TC1254';
		this.loginData = {
			userID: 'TC1267',
			userSig: 'eJxNjcFOg0AURf*FbY3OGzpMNemiUKWkKKGlrEwIMEN5oIAwVajx3yWkjW7Pybn3Wwvc-W2cpvWpUpEaGqk9aES7mTAKWSnMULYjDCygBr*YuGlQRLGK9Fb8CzpRRpMaGcwJAYAFXVyk7BtsZRRnatoDxhgl5Jp*yrbDuhoFJcCA6oT8SYXvckq4Yej3nML1D48jfn70LWez2uRhX5g8WQd2552-9Kes8L3C2frB0O9cK2sU5EHqzsIVmi*intcEe7p7vbO9kx3m9aEEB7YfVTKsjyx-M8uk4DMrRH*51H5*Ae7kV6I_'
		}
	},
	methods: {
		close() {
			this.visible = false;
		},
		handleClose() {

		},
		logoutBtn() {
			this.$refs.news.logout();
		},
		logout(val) {
			console.log(val);
		},
		dialogueNew(list) {
			console.log(list)
		},
		test() {
			this.visible = true;
		}
	}
}
</script>
