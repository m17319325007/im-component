<template>
	<div class="tc-message-item" v-if="messgeItem.type == 'TIMImageElem' || messgeItem.type == 'TIMTextElem' || (messgeItem.type == 'TIMSoundElem' || (messgeItem.type == 'TIMCustomElem' && messgeItem.payload.description == 'voice'))">
		<div class="position" :class="messgeItem.flow == 'in' ? 'position-left' : 'position-right'">
			<div class="tc-col-1">
				<img v-if="isGroup" @click="userImgAction(messgeItem)" :src="messgeItem.flow == 'in' ? (messgeItem && messgeItem.avatar ? messgeItem.avatar : defaultUser) : (user.userData && user.userData.avatar ? user.userData.avatar : defaultUser)">
				<img v-else @click="userImgAction(messgeItem)" :src="messgeItem.flow == 'in' ? (user.dialogueUserData && user.dialogueUserData.avatar ? user.dialogueUserData.avatar : defaultUser) : (user.userData && user.userData.avatar ? user.userData.avatar : defaultUser)">
			</div>
			<div class="tc-col-2">
				<div class="tc-col-2-title">
					<span v-if="messgeItem.flow == 'in'">{{ isGroup ? messgeItem.nick : user.dialogueUserData.nick }}</span>
					<span v-else>{{ user.userData.nick }}</span>
					<template v-if="messgeItem.flow == 'in' && isGroup">
						<span class="tc-col-2-sp tc-col-2-sp-green" v-if="messgeItem.carNumber">{{ messgeItem.carNumber }}</span>
						<span class="tc-col-2-sp tc-col-2-sp-fff" v-if="messgeItem.job">{{ messgeItem.job }}</span>
						<span class="tc-col-2-sp tc-col-2-sp-blue" v-if="messgeItem.companyName">{{ messgeItem.companyName }}</span>
					</template>
					<template v-if="messgeItem.flow == 'in' && !isGroup">
						<span class="tc-col-2-sp tc-col-2-sp-green" v-if="user.dialogueUserData.carNumber">{{ user.dialogueUserData.carNumber }}</span>
						<span class="tc-col-2-sp tc-col-2-sp-fff" v-if="user.dialogueUserData.job">{{ user.dialogueUserData.job }}</span>
						<span class="tc-col-2-sp tc-col-2-sp-blue" v-if="user.dialogueUserData.companyName">{{ user.dialogueUserData.companyName }}</span>
					</template>
				</div>
				<div class="tc-col-2-box">
					<messageImage v-if="messgeItem.type == 'TIMImageElem'" :message="messgeItem.payload">
					</messageImage>
					<messageText v-else-if="messgeItem.type == 'TIMTextElem'" :message="messgeItem.payload">
					</messageText>
					<messageVoice v-else-if="(messgeItem.type == 'TIMSoundElem' || (messgeItem.type == 'TIMCustomElem' && messgeItem.payload.description == 'voice'))" :flow="messgeItem.flow" :message="messgeItem.payload">
					</messageVoice>
					<messageUndefined v-else :message="messgeItem.payload">
					</messageUndefined>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import messageImage from './message/messageImage';
import messageText from './message/messageText';
import messageVoice from './message/messageVoice';
import messageUndefined from './message/messageUndefined';

import defaultUser from '@/assets/images/IM/defaultUser.png';
import { mapState } from 'vuex';

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
	computed: {
		...mapState([
			'user'
		])
	},
	data() {
		return {
			defaultUser: defaultUser
		}
	},
	components: {
		messageImage,
		messageText,
		messageVoice,
		messageUndefined
	},
	created() {
		console.log(this.user.dialogueUserData);
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
