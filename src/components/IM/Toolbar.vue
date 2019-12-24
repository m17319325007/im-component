<template>
	<div class="tc-news-center-toolbar">
		<div class="tc-news-center-tool-default">
			<img @click="handleSendImageClick" src="@/assets/images/IM/picture.png" alt="">
		</div>
		<input type="file" id="imagePicker" ref="imagePicker" accept=".jpg, .jpeg, .png, .gif" @change="sendImage" style="display:none" />
		<div class="tc-news-center-tool-handle" @click="voiceClick()">
			<span>{{ !voice ? "切换键盘" : "切换语音" }}</span>
			<img v-show="!voice" src="@/assets/images/IM/keyboard.png" alt="">
			<img v-show="voice" src="@/assets/images/IM/voice.png" alt="">
		</div>
	</div>
</template>

<script>
export default {
	name: 'Toolbar',
	props: {
		dialogueData: {
			type: Object,
			default() {
				return {}
			}
		},
		isGroup: {
			type: Boolean,
			default: false
		},
	},
	data() {
		return {
			voice: true
		}
	},
	methods: {
		handleSendImageClick() {
			this.$refs.imagePicker.click()
		},
		sendImage() {
			const message = this.tim.createImageMessage({
				to: this.isGroup ? this.dialogueData.groupProfile.groupID : this.dialogueData.userProfile.userID,
				conversationType: this.isGroup ? 'GROUP' : 'C2C',
				payload: {
					file: document.getElementById('imagePicker') // 或者用event.target
				},
				onProgress: percent => {
					this.$set(message, 'progress', percent) // 手动给message 实例加个响应式属性: progress
				}
			})
			this.tim
				.sendMessage(message)
				.then((res) => {
					this.$refs.imagePicker.value = null;
					this.$emit('sendSuccess', res.data.message)
				})
				.catch(imError => {
					this.$message.error(imError.message)
				})
		},
		voiceClick() {
			this.$emit('voice', this.voice);
			this.voice = !this.voice;
		}
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
