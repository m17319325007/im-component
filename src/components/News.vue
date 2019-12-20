<template>
	<div class="tc-news">
		<div class="tc-news-header">
			<span class="tc-news-header-title">
				{{ title }}
			</span>
			<div class="tc-news-header-content">
				<span class="tc-news-header-group" v-show="isGroup" @click="openGroupData()">
					<img src="./../assets/images/group.png" alt="">
					<span>群成员</span>
				</span>
				<span class="tc-news-close" @click="handleClose">
					<img src="../assets/images/close.png" alt="">
				</span>
			</div>
		</div>
		<div class="tc-news-content">
			<div class="tc-news-left">
				<div class="tc-news-search">
					<div class="tc-news-search-box">
						<img class="tc-news-searchicon" src="./../assets/images/search.png" alt="">
						<input class="tc-news-input" v-model="inputVal" :placeholder="inputPlaceholder" type="text" @input="changeInput(inputVal)">
					</div>
				</div>
				<ul class="tc-news-list">
					<li class="tc-news-list-item" @click="itemClick(item.conversationID, userList, item)" :class="item.checked ? 'tc-news-list-item-active' : ''" v-for="(item, index) in userList" :key="index">
						<div class="tc-news-list-box">
							<img class="tc-news-list-user-photo" :src="item.type == 'GROUP' ? (item.groupProfile.avatar || defaultGroup) : (item.userProfile.avatar || defaultUser)" alt="">
							<div class="tc-news-list-user-content">
								<div class="tc-news-list-user-title">
									<span class="tc-news-list-user-name">
										{{ item.type == 'GROUP' ? item.groupProfile.name : item.userProfile.nick }}
									</span>
									<span class="tc-news-list-user-code" v-if="item.positionType == 1">
										{{ item.vehicleCode }}
									</span>
								</div>
								<span class="tc-news-msg" :class="item.lastMessage.payload && item.lastMessage.payload.text ? '' : 'tc-news-msg-voice'">
									{{ item.lastMessage.payload.description == 'voice' ? '[语音]' : item.lastMessage.messageForShow }}
								</span>
							</div>
						</div>
						<!-- {{ item.unreadCount }} -->
						<div class="tc-news-msg-hint" v-if="item.unreadCount != 0">
							{{ item.unreadCount > 99 ? 99 : item.unreadCount }}
						</div>
						<div class="tc-news-list-time" v-else>
							{{ item.lastMessage.endMsgTime }}
						</div>
					</li>
				</ul>
			</div>
			<div class="tc-news-center" v-if="isChatWindow">
				<div class="tc-news-center-im" ref="im-dialogue">
					<message-item v-for="(item, i) in messageList" :isGroup="isGroup" @userImg="handleUserImg" :messgeItem="item" :key="i"></message-item>
				</div>
				<div class="tc-news-center-bottom">
					<toolbar @voice="handleVoice"></toolbar>
					<message-send :baseUrl="baseUrl" :params="params" :dialogueData="dialogueData" :voice="voice" :ouid="ouid" :isGroup="isGroup" @sendSuccess="sendSuccess"></message-send>
				</div>
			</div>
		</div>
		<group-info :groupStatus.sync="groupStatus" :dialogueData="dialogueData" :isGroup="isGroup" :groupUserList="groupUserList" @openUserDialog="openUserDialog"></group-info>
		<Dialog :visible.sync="personalVisible" :before-close="handleClose">
			<personal-data :userData="userData" @handlePersonalClose="handlePersonalClose" @send="sendMsg"></personal-data>
		</Dialog>

	</div>
</template>

<script>

import Dialog from '@/components/Dialog.vue';
import personalData from '@/components/personalData.vue';
import MessageItem from '@/components/MessageItem.vue';
import MessageSend from '@/components/MessageSend.vue';

import GroupInfo from '@/components/GroupInfo.vue';
import Toolbar from '@/components/Toolbar.vue';

import defaultGroup from '@/assets/images/defaultGroup.png';
import defaultUser from '@/assets/images/defaultUser.png';
import axios from 'axios';

// import { translateGroupSystemNotice } from '../utils/common';

export default {
	name: 'NewsList',
	props: {
		params: {
			type: Object,
			default() {
				return {}
			}
		},
		baseUrl: {
			type: String,
			default: ""
		},
		title: {
			type: String,
			default: "标题"
		},
		inputPlaceholder: {
			type: String,
			default: ""
		}
	},
	components: {
		"personal-data": personalData,
		'message-item': MessageItem,
		'message-send': MessageSend,
		'group-info': GroupInfo,
		'toolbar': Toolbar,
		Dialog,
	},
	data() {
		return {
			// 默认群组头像
			defaultGroup: defaultGroup,
			// 默认个人头像
			defaultUser: defaultUser,
			// 打开聊天窗口
			isChatWindow: false,
			personalVisible: false,
			inputVal: "",
			timeout: null,
			val: '',
			isGroup: false,
			groupStatus: false,
			userData: {},
			messageList: [],
			userList: [],
			// 预留群组列表
			groupList: [],
			// 群组成员列表
			groupUserList: [],
			// 当前对话对象
			dialogueData: {},
			// 当前聊天对象
			ouid: '',
			isNewDialogue: false,
			sw_userList: [],
			nextReqMessageID: '',
			isCompleted: '',
			voice: false
		}
	},
	mounted() {
		this.$store.dispatch('login').then(() => {
			// 登录成功初始化-聊天
			this.initListener();
		})
	},
	methods: {
		handleVoice(voice) {
			this.voice = voice;
		},
		initListener() {
			// 登录成功后会触发 SDK_READY 事件，该事件触发后，可正常使用 SDK 接口
			this.tim.on(this.TIM.EVENT.SDK_READY, this.onReadyStateUpdate, this)
			// SDK NOT READT
			// 被踢出
			this.tim.on(this.TIM.EVENT.KICKED_OUT, () => {
				this.$store.commit('showMessage', {
					message: '被踢出，请重新登录。',
					type: 'error'
				})
				this.$store.commit('toggleIsLogin', false)
				this.$store.commit('reset')
			})
			// 收到新消息
			this.tim.on(this.TIM.EVENT.MESSAGE_RECEIVED, event => {
				console.log(event, '收到新消息');
				// 如果消息来自当前聊天方
				this.setMessageList(event.data);
			})
			// 会话列表更新
			this.tim.on(this.TIM.EVENT.CONVERSATION_LIST_UPDATED, event => {
				console.log(event, '会话更新列表');
				this.getUserList(event.data);
			})
			// 群组列表更新
			this.tim.on(this.TIM.EVENT.GROUP_LIST_UPDATED, event => {
				console.log(event, '群组消息');
			})
		},
		onReadyStateUpdate({ name }) {
			const isSDKReady = name === this.TIM.EVENT.SDK_READY ? true : false
			this.$store.commit('toggleIsSDKReady', isSDKReady)
			if (isSDKReady) {
				this.tim
					.getMyProfile()
					.then(({ data }) => {
						this.$store.commit('updateCurrentUserProfile', data)
					})
					.catch(error => {
						this.$message({
							type: 'error',
							message: error.message
						})
					})
				this.$store.dispatch('getBlacklist')
			}
		},
		getUserList(list) {
			this.userList = list;
			// 获取用户信息
			// TODO
			// 存在新会话
			if (this.isNewDialogue) {
				this.userList[0].checked = true;
			}
			// 猪一样的队友
		},
		handleClose() {
			this.$emit('close', false);
		},
		// 关闭个人信息弹框
		handlePersonalClose() {
			this.personalVisible = false;
		},
		changeInput(val) {
			if (this.timeout !== null) clearTimeout(this.timeout)
			this.timeout = setTimeout(() => {
				this.$emit('input', val)
			}, 1000)
		},
		// 点击个人资料发送消息
		sendMsg(obj) {
			let flag = 0;
			let data = {};
			this.userList.forEach(item => {
				if (item.userProfile && item.userProfile.userID == obj.userID) {
					flag = 1;
					data = item;
				}
			})
			if (flag) {
				this.itemClick(data.conversationID, this.userList, data);
			} else {
				// 新对话 初始化
				obj.type = 'C2C';
				obj.userProfile = {};
				obj.userProfile.avatar = obj.avatar;
				obj.userProfile.nick = obj.nick;
				obj.userProfile.userID = obj.userID;
				obj.checked = true;
				obj.unreadCount = 0;
				obj.lastMessage = {};
				this.ouid = obj.userID;
				this.dialogueData = obj;
				this.userList.push(obj);
				this.itemClick(obj.userID, this.userList, obj, 1);
			}
		},
		itemClick(id, list, item, type = 0) {
			let i = 0;
			// 当然列表是否存在此用户
			let flag = false;
			list.forEach((res, index) => {
				if (res.conversationID == id) {
					i = index;
					flag = true;
					this.ouid = id;
					this.$set(res, 'checked', true);
				} else {
					this.$set(res, 'checked', false);
				}
			})
			if (type) {
				item.checked = true;
				this.groupStatus = false;
				this.isGroup = false;
			}

			if (!this.isChatWindow) {
				this.isChatWindow = true;
			}
			if (flag) {
				list[i].checked = true;
				this.groupStatus = false;
				// 点击项为群组消息
				if (list[i].type == 'GROUP') {
					this.isGroup = true;
					// 当前聊天对象为群组
					// 获取群组所有成员
					// 群组-加载群组成员所有详细资料
					this.getGroupUserList(list[i]);
				} else {
					this.isGroup = false;
					// 个人会话，直接获取聊天记录
					this.getMessageList(list[i].conversationID);
				}
				// 当前群消息存在未读消息
				if (list[i].unreadCount) {
					this.setMessageRead(list[i].conversationID);
					// 当前聊天用户有
				}
				this.dialogueData = list[i];
			}
			if (list[i].type == 'C2C') {
				// 获取当前对话人的信息
				this.$store.commit('getUserInfo', list[i].userProfile.userID)
			}
			if (type) {
				this.isNewDialogue = true;
				this.messageList = [];
			} else {
				this.isNewDialogue = false;
				this.messageList = [];
			}
		},
		// 获取当前点击用户的聊天记录
		getMessageList(conversationID) {
			this.tim.getMessageList({ conversationID: conversationID, count: 30 }).then((imResponse) => {
				// 获取成功
				let obj = imResponse.data
				if (this.messageList.length) {
					obj.messageList.forEach(item => {
						this.messageList.unshift(item);
					})
				} else {
					this.messageList = obj.messageList; // 消息列表。
					this.scrollBottom();
				}
				this.nextReqMessageID = obj.nextReqMessageID; // 用于续拉，分页续拉时需传入该字段。
				this.isCompleted = obj.isCompleted; // 表示是否已经拉完所有消息。
				this.setUserInfo(this.messageList, obj.messageList.length);
			}).catch((imError) => {
				console.warn('getConversationProfile error:', imError); // 获取会话资料失败的相关信息
			});
		},
		// 设置消息已读
		setMessageRead(conversationID) {
			this.tim.setMessageRead({ conversationID: conversationID }).then((res) => {
				// 已读上报成功
				console.log(res, '已读成功')
			}).catch((imError) => {
				// 已读上报失败
				console.warn('setMessageRead error:', imError);
			});
		},
		// 获取群组成员
		getGroupUserList(obj) {
			this.tim.getGroupMemberList({ groupID: obj.groupProfile.groupID, count: 100, offset: 0 }).then(imResponse => {
				this.groupUserList = imResponse.data.memberList;
				let str = '';
				this.groupUserList.forEach((item, index) => {
					if (index) {
						str += ',' + item.userID;
					} else {
						str += item.userID;
					}
				})
				this.getUserListInfo(str, obj);
			})
		},
		// 获取用户信息-思伟后台
		getUserListInfo(str, obj) {
			this.params.imUserIds = str;
			axios({
				method: 'get',
				url: this.baseUrl + 'group/getuserinfo',
				params: this.params
			}).then(res => {
				this.sw_userList = res.data.result.list;
				this.setUserInfo(this.groupUserList);
				this.getMessageList(obj.conversationID);
			})
		},
		setUserInfo(list, len = 0) {
			console.log(len)
			let [...userList] = this.sw_userList;
			for (let i = 0; i < list.length; i++) {
				for (let j = 0; j < userList.length; j++) {
					if ((list[i].userID ? list[i].userID : list[i].from) == userList[j].imUserId) {
						list[i].job = userList[j].job;
						list[i].companyName = userList[j].companyName;
						list[i].carNumber = userList[j].carNumber;
						list[i].tel = userList[j].tel;
						if (list[i].userID) {
							userList.splice(j, 1);
						}
						break;
					}
				}
			}
		},
		// 打开群资料
		openGroupData() {
			this.groupStatus = true;
		},
		// 关闭群资料
		closeGroupData() {
			this.groupStatus = false;
		},

		// 打开用户信息
		openUserDialog(item) {
			this.personalVisible = true;
			this.userData = item;
		},
		// 新消息更新
		setMessageList(list) {
			if (this.dialogueData.checked) {
				// 		// 根据当前消息来源添加新消息
				list.forEach(res => {
					if (res.conversationID == this.dialogueData.conversationID) {
						this.messageList.push(res);
					}
				})
				// 当前聊天已读
				this.setMessageRead(this.dialogueData.conversationID);
				this.scrollBottom();
			}
		},
		// 发送消息成功 & 收到新消息
		sendSuccess(obj) {
			this.messageList.push(obj);
			this.scrollBottom();
		},
		// 新消息滚动到底部
		scrollBottom() {
			this.$nextTick(() => {
				let container = this.$el.querySelector(".tc-news-center-im");
				container.scrollTop = container.scrollHeight;
			})
		},
		// 查看用户详细资料
		handleUserImg(item) {
			this.groupUserList.forEach(res => {
				if (res.userID == item.from) {
					this.personalVisible = true;
					this.userData = res;
				}
			})
		}
	},
	watch: {
		userList(val) {
			val.forEach(obj => {
				let item = obj.lastMessage;
				if (item.lastTime && !isNaN(item.lastTime)) {
					let dayTime = new Date().setHours(0, 0, 0, 0);
					if ((item.lastTime * 1000 - dayTime) < 0) {
						item.endMsgTime = new Date(item.lastTime * 1000).format('MM/dd')
					} else {
						item.endMsgTime = new Date(item.lastTime * 1000).format('hh:mm')
					}
				}
			})
		}
	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
* {
	line-height: 1;
}
div,
span {
	user-select: none;
}
.tc-news {
	height: 600px;
	position: relative;
	ul,
	li {
		list-style: none;
	}
	img {
		vertical-align: top;
		border: none;
	}
	.tc-news-header {
		padding: 0 15px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 50px;
		border-bottom: 1px solid #e8e8e8;
		.tc-news-header-title {
			font-size: 26px;
			font-weight: bold;
			line-height: 1;
		}
		.tc-news-header-content {
			display: flex;
			align-items: center;
		}
		.tc-news-close {
			display: flex;
			cursor: pointer;
			img {
				width: 22px;
				height: 22px;
			}
		}
		.tc-news-header-group {
			display: flex;
			align-items: center;
			cursor: pointer;
			span {
				font-size: 14px;
				margin-left: 10px;
				margin-right: 16px;
			}
		}
	}
	.tc-news-content {
		display: flex;
		.tc-news-left {
			width: 280px;
			height: 548px;
			border-right: 1px solid #f1f1f1;
			box-sizing: border-box;
			.tc-news-search {
				display: flex;
				justify-content: center;
				border-bottom: 1px solid #ddd;
				padding: 12px 0;
			}
			.tc-news-searchicon {
				position: absolute;
				width: 18px;
				height: 18px;
				top: 9px;
				left: 10px;
			}
			.tc-news-search-box {
				position: relative;
			}
			.tc-news-input {
				border: none;
				outline: none;
				background: #f0f5fa;
				border-radius: 20px;
				padding: 10px;
				padding-left: 40px;
				width: 200px;
				font-size: 14px;
			}
			.tc-news-list {
				height: 485px;
				overflow-y: auto;
			}
			.tc-news-list-item {
				padding: 8px 12px;
				display: flex;
				justify-content: space-between;
				align-items: center;
				border-bottom: 1px solid #f1f1f1;
				cursor: pointer;
				&.tc-news-list-item-active {
					color: #fff;
					background: #7691c9;
					.tc-news-list-time {
						color: #fff;
					}
					.tc-news-msg {
						color: #fff;
						word-break: break-all;
						&.tc-news-msg-voice {
							color: #fff;
						}
					}
				}
			}
			.tc-news-list-time {
				height: 30px;
				font-size: 12px;
				color: #8f8f8f;
			}
			.tc-news-list-user-photo {
				width: 40px;
				height: 40px;
			}
			.tc-news-list-box {
				display: flex;
				img {
					border-radius: 20px;
				}
				.tc-news-list-user-content {
					margin-left: 12px;
					display: flex;
					justify-content: center;
					flex-direction: column;
				}
				.tc-news-list-user-title {
					font-size: 14px;
					margin-bottom: 5px;
				}
				.tc-news-list-user-code {
					background: #8bc33e;
					color: #fff;
					font-size: 12px;
					padding: 2px 8px;
					border-radius: 4px;
				}
			}
			.tc-news-msg {
				color: #9b9b9b;
				font-size: 12px;
				&.tc-news-msg-voice {
					color: #8bc33e;
				}
			}
			.tc-news-msg-hint {
				padding: 5px 14px;
				line-height: 1;
				background: #ff6100;
				border-radius: 10px;
				color: #fff;
				font-size: 12px;
			}
		}
		.tc-news-center {
			width: 400px;
			height: 550px;
			.tc-news-center-im {
				height: 375px;
				background: #f1f1f1;
				overflow: auto;
			}
		}
	}

	.tc-news-group-box {
		position: absolute;
		top: 0;
		right: -260px;
		background: #fff;
		width: 260px;
		height: 600px;
		box-shadow: 0px 4px 12px 0px rgba(0, 0, 0, 0.2);
		border-radius: 0px 4px 4px 0px;
		.tc-news-group-header {
			height: 50px;
			border-bottom: 1px solid #e8e8e8;
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 0 14px;
		}
		.tc-news-group-header-close {
			color: #007aff;
			cursor: pointer;
			font-size: 14px;
		}
		.tc-news-group-list {
			display: flex;
			flex-wrap: wrap;
			height: 460px;
			overflow: auto;
			&::-webkit-scrollbar {
				width: 8px;
			}
			&::-webkit-scrollbar-track {
				background-color: transparent;
			}
			&::-webkit-scrollbar-thumb {
				background: #ddd;
				border-radius: 5px;
			}
			.tc-news-group-item {
				padding: 10px;
				flex: 1;
				text-align: center;
				cursor: pointer;
				img {
					width: 40px;
					height: 40px;
					border-radius: 20px;
				}
				.tc-news-group-name {
					text-align: center;
					margin-top: 5px;
					font-size: 12px;
					width: 42px;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}
			}
		}
		.tc-news-group-content {
			position: relative;
			height: 549px;
		}
		.tc-news-group-exit {
			margin: 0 14px;
			width: 232px;
			bottom: 14px;
			position: absolute;
			cursor: pointer;
			text-align: center;
			border-radius: 4px;
			color: #1f57b3;
			font-size: 14px;
			height: 28px;
			line-height: 28px;
			border: 1px solid #1f57b3;
		}
	}
	.group-fade-enter-active {
		transition: all 0.5s ease;
	}
	.group-fade-leave-active {
		transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1);
	}
	.group-fade-enter,
	.group-fade-leave-to {
		transform: translateY(-20px);
	}
}
</style>
