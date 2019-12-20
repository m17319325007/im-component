<template>
	<div class="tc-message-item">
		<div class="position" :class="messgeItem.flow == 'in' ? 'position-left' : 'position-right'">
			<div class="tc-col-1">
				<img @click="userImgAction(messgeItem)" :src="messgeItem.flow == 'in' ? (dialogueUserData.avatar ? dialogueUserData.avatar : defaultUser) : (userData.avatar ? userData.avatar : defaultUser)">
			</div>
			<div class="tc-col-2">
				<div class="tc-col-2-title">
					<span v-if="messgeItem.flow == 'in'">{{ isGroup ? messgeItem.nick : dialogueUserData.nick }}</span>
					<span v-else>{{ userData.nick }}</span>
					<template v-if="messgeItem.flow == 'in'">
						<span class="tc-col-2-sp tc-col-2-sp-green" v-if="messgeItem.carNumber">{{ messgeItem.carNumber }}</span>
						<span class="tc-col-2-sp tc-col-2-sp-fff" v-if="messgeItem.job">{{ messgeItem.job }}</span>
						<span class="tc-col-2-sp tc-col-2-sp-blue" v-if="messgeItem.companyName">{{ messgeItem.companyName }}</span>
					</template>
				</div>
				<div class="tc-col-2-box">
					<messageImage v-if="messgeItem.type == 'TIMImageElem'" :message="messgeItem.payload">
					</messageImage>
					<messageText v-else-if="messgeItem.type == 'TIMTextElem'" :message="messgeItem.payload">
					</messageText>
					<messageVoice v-else-if="messgeItem.type == 'TIMSoundElem'" :message="messgeItem.payload">
					</messageVoice>
					<messageUndefined v-else :message="messgeItem.payload">
					</messageUndefined>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import messageImage from '@/components/message/messageImage';
import messageText from '@/components/message/messageText';
import messageVoice from '@/components/message/messageVoice';
import messageUndefined from '@/components/message/messageUndefined';
import defaultUser from '@/assets/images/defaultUser.png';

export default {
	name: 'MessageItem',
	props: {
		// 是否是群消息
		isGroup: {
			type: Boolean,
			default: false
		},
		messgeItem: {
			type: Object,
			default() {
				return {}
			}
		}
	},
	data() {
		return {
			defaultUser: defaultUser,
			userData: this.$store.state.user.userData,
			dialogueUserData: this.$store.state.user.dialogueUserData,
		}
	},
	components: {
		messageImage,
		messageText,
		messageVoice,
		messageUndefined
	},
	created() {
		this.userData = this.$store.state.user.userData;
		setTimeout(() => {
			this.dialogueUserData = this.$store.state.user.dialogueUserData;
		}, 1000)
	},
	methods: {
		userImgAction(item) {
			this.$emit('userImg', item)
		}
	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.tc-message-item {
	margin: 20px 0;
	margin-left: 15px;
	border-radius: 0 4px 4px 4px;
	.position {
		display: flex;
	}

	.tc-col-2-title {
		font-size: 12px;
		margin-top: 4px;
		margin-bottom: 10px;
	}
	.tc-col-2 {
	}
	.tc-col-2-box {
		display: inline-block;
		max-width: 290px;
		padding: 10px;
		border-radius: 5px;
		box-shadow: 0px 2px 4px 0px rgba(110, 125, 190, 0.2);
	}
	.position-left {
		.tc-col-2-title {
			margin-left: 8px;
		}
		.tc-col-2-box {
			margin-left: 8px;
			background: #fff;
		}
	}
	.position-right {
		flex-direction: row-reverse;
		.tc-col-2-title {
			margin-right: 8px;
		}
		.tc-col-2 {
			text-align: right;
		}
		.tc-col-2-box {
			margin-right: 8px;
			color: #fff;
			background: #8bc33e;
			text-align: left;
		}
	}

	.tc-col-1 {
		img {
			cursor: pointer;
			width: 40px;
			height: 40px;
			border-radius: 20px;
		}
	}
	.tc-col-2-sp {
		color: #fff;
		padding: 1px 8px;
		background: #8bc33e;
		border-radius: 4px;
		margin-left: 8px;
	}
	.tc-col-2-sp-fff {
		background: #ffffff;
		color: #4a4a4a;
	}
	.tc-col-2-sp-blue {
		background: #698be5;
	}
}
</style>
