<template>
	<div class="tc-news-center-toolbar">
		<div class="tc-news-center-tool-default">
			<el-upload class="upload-demo" action="https://jsonplaceholder.typicode.com/posts/" :show-file-list="false" :on-progress="handleProgress" :on-success="handleSuccess" :before-upload="handleUpload">
				<img src="./../assets/images/picture.png" alt="">
			</el-upload>
		</div>
		<div class="tc-news-center-tool-handle" @click="voiceClick()">
			<span>{{ !voice ? "切换键盘" : "切换语音" }}</span>
			<img v-show="!voice" src="./../assets/images/keyboard.png" alt="">
			<img v-show="voice" src="./../assets/images/voice.png" alt="">
		</div>
	</div>
</template>

<script>
export default {
	name: 'Toolbar',
	props: {
		msg: String
	},
	data() {
		return {
			voice: true
		}
	},
	methods: {
		voiceClick() {
			this.$emit('voice', this.voice);
			this.voice = !this.voice;

		},
		handleUpload(file) {
			console.log(file);
		},
		handleSuccess(response, file) {
			console.log(response, file);
		},
		handleProgress(event, file) {
			console.log(event, file);
		},
	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.tc-news-center-toolbar {
	height: 40px;
	border-bottom: 1px solid #f1f1f1;
	display: flex;
	justify-content: space-between;
	align-items: center;
	img {
		margin: 0 10px;
		cursor: pointer;
	}
	span {
		cursor: pointer;
	}
	.tc-news-center-tool-handle {
		font-size: 14px;
		display: flex;
		align-items: center;
	}
}
</style>
