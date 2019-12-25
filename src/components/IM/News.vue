<template>
	<div class="tc-news">
		<div class="tc-news-header">
			<span class="tc-news-header-title">
				{{ title }}
			</span>
			<div class="tc-news-header-content">
				<span class="tc-news-header-group" v-show="isGroup" @click="openGroupData()">
					<img src="@/assets/images/IM/group.png" alt="">
					<span>群成员</span>
				</span>
				<span class="tc-news-close" @click="handleClose">
					<img src="@/assets/images/IM/close.png" alt="">
				</span>
			</div>
		</div>
		<div class="tc-news-content">
			<div class="tc-news-left">
				<div class="tc-news-search">
					<div class="tc-news-search-box">
						<img class="tc-news-searchicon" src="@/assets/images/IM/search.png" alt="">
						<input class="tc-news-input" v-model="inputVal" :placeholder="inputPlaceholder" type="text">
					</div>
				</div>
				<ul class="tc-news-list">
					<!-- TODO -->
					<!-- 当前只显示群聊通知和个人通知 -->
					<li @click="itemClick(item.conversationID, userList, item)" v-for="(item, index) in userList" :key="index">
						<div class="tc-news-list-item" :class="item.checked ? 'tc-news-list-item-active' : ''" v-if="(item.type == 'GROUP') ? (item.groupProfile.groupName && item.groupProfile.groupName.indexOf(inputVal) != -1) : (item.type == 'C2C') ? (item.userProfile.nick.indexOf(inputVal) != -1) : false">
							<div class="tc-news-list-box">
								<img class="tc-news-list-user-photo" :src="item.type == 'GROUP' ? (item.groupProfile.avatar || defaultGroup) : (item.userProfile.avatar || defaultUser)" alt="">
								<div class="tc-news-list-user-content">
									<div class="tc-news-list-user-title">
										<span class="tc-news-list-user-name">
											{{ item.type == 'GROUP' ? item.groupProfile.groupName : item.userProfile.nick }}
										</span>
										<span v-if="item.type == 'C2C' && item.userProfile.carNumber" class="tc-news-list-user-car">
											{{ item.userProfile.carNumber }}
										</span>
										<span class="tc-news-list-user-code" v-if="item.positionType == 1">
											{{ item.vehicleCode }}
										</span>
									</div>
									<span class="tc-news-msg" :class="item.lastMessage.payload && item.lastMessage.payload.text ? '' : 'tc-news-msg-voice'">
										{{ item.lastMessage.payload && item.lastMessage.payload.description == 'voice' ? '[语音]' : item.lastMessage.messageForShow }}
									</span>
								</div>
							</div>
							<div class="tc-news-msg-hint" v-if="item.unreadCount != 0">
								{{ item.unreadCount > 99 ? 99 : item.unreadCount }}
							</div>
							<div class="tc-news-list-time" v-else>
								{{ item.lastMessage.endMsgTime }}
							</div>
						</div>
					</li>
				</ul>
			</div>
			<div class="tc-news-center" v-if="isChatWindow">
				<div class="tc-news-center-im" ref="im-dialogue">
					<div class="more" v-if="!isCompleted" v-loading="moreLoading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.6)">
						<el-button type="text" @click="getMessageList(conversationID)">查看更多</el-button>
					</div>
					<div class="no-more" v-else>没有更多了</div>
					<message-item v-for="(item, i) in messageList" :isGroup="isGroup" @userImg="handleUserImg" :messgeItem="item" :key="i"></message-item>
				</div>
				<div class="tc-news-center-bottom">
					<toolbar :dialogueData="dialogueData" :isGroup="isGroup" @voice="handleVoice" @sendSuccess="sendSuccess"></toolbar>
					<message-send :baseUrl="baseUrl" :params="params" :dialogueData="dialogueData" :voice="voice" :ouid="ouid" :isGroup="isGroup" @sendSuccess="sendSuccess"></message-send>
				</div>
			</div>
		</div>
		<group-info :groupStatus.sync="groupStatus" :dialogueData="dialogueData" :isGroup="isGroup" :groupUserList="groupUserList" @exitGroup="exitGroup" @openUserDialog="openUserDialog"></group-info>
		<Dialog :visible.sync="personalVisible">
			<personal-data :userData="userData" :isLoginUserId="loginData.userID" @handlePersonalClose="handlePersonalClose" @send="sendMsg"></personal-data>
		</Dialog>
	</div>
</template>

<script>

import Dialog from './Dialog.vue';
import personalData from './personalData.vue';
import MessageItem from './MessageItem.vue';
import MessageSend from './MessageSend.vue';

import GroupInfo from './GroupInfo.vue';
import Toolbar from './Toolbar.vue';

import defaultGroup from '@/assets/images/IM/defaultGroup.png';
import defaultUser from '@/assets/images/IM/defaultUser.png';
import axios from 'axios';

Date.prototype.format = function (format) {
	let date = {
		"M+": this.getMonth() + 1,
		"d+": this.getDate(),
		"h+": this.getHours(),
		"m+": this.getMinutes(),
		"s+": this.getSeconds(),
		"q+": Math.floor((this.getMonth() + 3) / 3),
		"S+": this.getMilliseconds()
	};
	if (/(y+)/i.test(format)) {
		format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
	}
	for (let k in date) {
		if (new RegExp("(" + k + ")").test(format)) {
			format = format.replace(RegExp.$1, RegExp.$1.length == 1 ?
				date[k] : ("00" + date[k]).substr(("" + date[k]).length));
		}
	}
	return format;
}

export default {
	name: 'NewsList',
	props: {
		params: {
			type: Object,
			default() {
				return {}
			}
		},
		loginData: {
			type: Object,
			default() {
				return {
					userID: "",
					userSig: ""
				}
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
		// 快捷通话需要
		userID: {
			type: String,
			default: ""
		},
		inputPlaceholder: {
			type: String,
			default: ""
		},
		visible: {
			type: Boolean,
			default: false
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
			moreLoading: false,
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
			// 群聊快捷发送消息-确认是否为新会话
			isNewDialogue: false,
			sw_userList: [],
			nextReqMessageID: '',
			isCompleted: '',
			// 切换发送语音
			voice: false,
			// 当前会话ID
			conversationID: ''
		}
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
				if (event.data.length) {
					this.dialogue(event.data);
				}
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
		dialogue(list) {
			let num = 0;
			list.forEach(item => {
				if (item.type == "C2C" || item.type == "GROUP") {
					num += item.unreadCount;
				}
			})
			this.$emit('dialogue', num);
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
			if (this.userList.length) {
				this.userList.forEach(item => {
					item.checked = false;
				})
			}
			this.isChatWindow = false;
			this.$emit('close', false);
		},
		// 关闭个人信息弹框
		handlePersonalClose() {
			this.personalVisible = false;
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
				this.isCompleted = 1;
				this.userList.push(obj);
				this.itemClick(obj.userID, this.userList, obj, 1);
			}
		},
		itemClick(id, list, item, type = 0) {
			let i = 0;
			// 当然列表是否存在此用户
			let flag = false;
			list.forEach((res, index) => {
				if (res.conversationID && res.conversationID == id) {
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
			// 切换会话清空聊天记录
			this.messageList = [];
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
					this.conversationID = list[i].conversationID;
					this.getMessageList(this.conversationID);
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
				this.$store.commit('getUserInfo', list[i].userProfile)
			}
			if (type) {
				this.isNewDialogue = true;
			} else {
				this.isNewDialogue = false;
			}
		},
		// 获取当前点击用户的聊天记录
		getMessageList(conversationID) {
			let obj = {
				conversationID: conversationID,
				count: 15
			}
			if (this.messageList.length) {
				this.moreLoading = true;
				obj.nextReqMessageID = this.nextReqMessageID;
			}
			this.tim.getMessageList(obj).then((imResponse) => {
				// 获取成功
				let objData = imResponse.data;
				if (this.messageList.length) {
					objData.messageList.reverse();
					objData.messageList.forEach(item => {
						this.messageList.unshift(item);
					})
					this.moreLoading = false;
				} else {
					this.messageList = objData.messageList; // 消息列表。
					this.scrollBottom();
				}
				this.nextReqMessageID = objData.nextReqMessageID; // 用于续拉，分页续拉时需传入该字段。
				this.isCompleted = objData.isCompleted; // 表示是否已经拉完所有消息。
				// 是否首次加载 this.messageList.length == objData.messageList.length ? 0 : objData.messageList.length
				this.setUserInfo(this.messageList, this.sw_userList, (this.messageList.length == objData.messageList.length ? 0 : objData.messageList.length));
			}).catch((imError) => {
				console.warn('getConversationProfile error:', imError); // 获取会话资料失败的相关信息
			});
		},
		// 设置消息已读
		setMessageRead(conversationID) {
			this.tim.setMessageRead({ conversationID: conversationID }).then((res) => {
				// 已读上报成功
				console.log(res, '已读成功')
				if (this.userList.length) {
					this.dialogue(this.userList);
				}
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
				// 设置成员信息及获取聊天记录设置用户资料
				this.getUserListInfo(str, (res) => {
					this.sw_userList = res.list;
					this.setUserInfo(this.groupUserList, this.sw_userList);
					this.conversationID = obj.conversationID;
					this.getMessageList(this.conversationID);
				});
			})
		},
		// 获取用户信息-思伟后台
		getUserListInfo(str, callback) {
			this.params.imUserIds = str;
			axios({
				method: 'get',
				url: this.baseUrl + 'group/getuserinfo',
				params: this.params
			}).then(res => {
				callback(res.data.result);
			})
		},
		setUserInfo(list, olist, len = 0) {
			let [...userList] = olist;
			for (let i = 0; i < (list.length - len); i++) {
				for (let j = 0; j < userList.length; j++) {
					if ((list[i].userID ? list[i].userID : list[i].from) == userList[j].imUserId) {
						this.setUserData(list[i], userList[j]);
						if (list[i].userID) {
							userList.splice(j, 1);
						}
						break;
					}
				}
			}
		},
		setUserData(obj, userObj) {
			this.$set(obj, 'job', userObj.job);
			this.$set(obj, 'companyName', userObj.companyName);
			this.$set(obj, 'carNumber', userObj.carNumber);
			this.$set(obj, 'tel', userObj.tel);
			this.$set(obj, 'avatar', userObj.userPhoto);
		},
		// 获取群组名称
		getGroupListInfo(id, callback) {
			this.params.userId = id;
			axios({
				method: 'get',
				url: this.baseUrl + '/group/list',
				params: this.params
			}).then(res => {
				callback(res.data.result);
			})
		},
		setGroupListInfo(groupList, val) {
			let [...list] = groupList;
			for (let i = 0; i < val.length; i++) {
				if (val[i].type == 'GROUP') {
					for (let j = 0; j < list.length; j++) {
						if (val[i].groupProfile.groupID == list[j].imGroupId) {
							this.$set(val[i].groupProfile, 'groupName', list[j].name);
							// val[i].groupProfile.groupPhoto = item.groupPhoto;
							list.splice(j, 1);
							break;
						}
					}
				}
			}
		},
		// 打开群资料
		openGroupData() {
			this.groupStatus = true;
		},
		// 退出群聊更新聊天
		exitGroup() {
			console.log('退出群聊成功');
			for (let i = 0; i < this.userList.length; i++) {
				let item = this.userList[i];
				if (item.type == 'C2C' || item.type == 'GROUP') {
					this.itemClick(item.conversationID, this.userList, item);
					break;
				}
			}
		},
		// 打开用户信息
		openUserDialog(item) {
			this.personalVisible = true;
			this.userData = item;
		},
		// 新消息更新
		setMessageList(list) {
			let obj = this.dialogueData;
			if (obj.checked) {
				// 根据当前消息来源添加新消息
				list.forEach(res => {
					if (obj.conversationID) {
						if (res.conversationID == obj.conversationID) {
							this.messageList.push(res);
						}
					} else if (res.from == obj.userProfile.userID) {
						// 首次会话新来回复问题
						obj = res;
						this.messageList.push(res);
					}
				})
				// 当前聊天已读
				this.setMessageRead(obj.conversationID);
				this.scrollBottom();
			}
		},
		// 发送消息成功 & 收到新消息
		sendSuccess(obj) {
			this.messageList.push(obj);
			this.scrollTop();
			this.scrollBottom();
		},
		// 新消息滚动到底部
		scrollBottom() {
			this.$nextTick(() => {
				let container = this.$el.querySelector(".tc-news-center-im");
				if (container) {
					container.scrollTop = container.scrollHeight;
				}
			})
		},
		// 会话滚动到顶部
		scrollTop() {
			this.$nextTick(() => {
				let container = this.$el.querySelector(".tc-news-list");
				if (container) {
					container.scrollTop = 0;
				}
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
		},
		logout() {
			this.tim.logout().then(imResponse => {
				console.log(imResponse); // 登出成功
				this.$emit('logout', true);
			});
		}
	},
	watch: {
		visible(val) {
			if (val) {
				this.isGroup = false;
				this.scrollBottom();
			}
		},
		userID(val) {
			let time = setInterval(() => {
				if (this.$store.state.user.isSDKReady) {
					this.tim.getUserProfile({
						userIDList: [val]
					}).then((res) => {
						// 外部快捷发送消息
						this.isCompleted = 1;
						this.sendMsg(res.data[0]);
					}).catch((imError) => {
						console.warn('getUserProfile error:', imError); // 获取其他用户资料失败的相关信息
					});
					clearTimeout(time);
				}
			}, 300)
		},
		'loginData.userSig': {
			handler: function () {
				this.$store.dispatch('login', this.loginData).then(() => {
					// 登录成功初始化-聊天
					this.initListener();
				})
			},
			deep: true
		},
		userList(val) {
			let str = '';
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
				if (obj.type == 'C2C') {
					if (!obj.userProfile.tel) {
						str += obj.userProfile.userID + ',';
					}
				}
			})
			if (str) {
				str = str.substring(0, str.length - 1);
				this.getUserListInfo(str, (res) => {
					let userList = res.list;
					for (let i = 0; i < val.length; i++) {
						if (val[i].type == 'C2C') {
							for (let j = 0; j < userList.length; j++) {
								if (val[i].userProfile.userID == userList[j].imUserId) {
									this.setUserData(val[i].userProfile, userList[j]);
									userList.splice(j, 1);
									break;
								}
							}
						}
					}
				});
			}
			if (this.groupList.length) {
				this.setGroupListInfo(this.groupList, val);
			} else {
				this.getGroupListInfo(this.loginData.userID, (res) => {
					this.groupList = res.groups;
					this.setGroupListInfo(this.groupList, val);
				});
			}
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
			.tc-news-list-user-name {
				width: 165px;
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
			.tc-news-list-user-car {
				color: #fff;
				padding: 0 8px;
				background: #8bc33e;
				border-radius: 4px;
				margin-left: 8px;
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
	.more {
		display: flex;
		justify-content: center;
		font-size: 12px;
	}
	.no-more {
		display: flex;
		justify-content: center;
		font-size: 12px;
		color: #999;
		padding: 12px 20px;
	}
}
</style>
