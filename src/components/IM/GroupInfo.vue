<template>
	<transition name="group-fade">
		<div class="tc-news-group-box" v-if="groupStatus && isGroup">
			<div class="tc-news-group-header">
				<span class="tc-news-group-header-title">
					群成员
				</span>
				<span class="tc-news-group-header-close" @click="closeGroupData">
					收起
				</span>
			</div>
			<div class="tc-news-group-content">
				<div class="tc-news-group-list-box">
					<ul class="tc-news-group-list">
						<li class="tc-news-group-item" v-for="(item, i) in groupUserList" :key="i" @click="openUserDialog(item)">
							<img :src="item.avatar || defaultUser" alt="">
							<div class="tc-news-group-name">
								{{ item.nick }}
							</div>
						</li>
					</ul>
				</div>
				<div class="tc-news-group-exit" v-if="(dialogueData.groupProfile.name.indexOf('_6') > -1) || (dialogueData.groupProfile.name.indexOf('_5') > -1)" @click="exitGroup">
					退出群组
				</div>
			</div>
		</div>
	</transition>
</template>

<script>
/* eslint-disable */

import defaultUser from '@/assets/images/IM/defaultUser.png';
import axios from 'axios';

export default {
	name: 'GroupInfo',
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
		groupStatus: {
			type: Boolean,
			default: false
		},
		isGroup: {
			type: Boolean,
			default: false
		},
		groupUserList: {
			type: Array,
			default() {
				return []
			}
		},
		dialogueData: {
			type: Object,
			default() {
				return {}
			}
		}
	},
	data() {
		return {
			defaultUser: defaultUser
		}
	},
	methods: {
		closeGroupData() {

			this.$emit('update:groupStatus', false);
		},
		openUserDialog(item) {
			this.$emit('openUserDialog', item);
		},
		// 退出群组
		exitGroup() {
			let userId = this.$store.state.user.userData.userID;
			if (userId.indexOf('TC') > -1) {
				userId = userId.split("TC")[1];
			}
			this.$confirm('您确定要退出此群组？', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				axios({
					method: 'post',
					url: this.baseUrl + 'group/exitgroup',
					params: {
						token: this.params.token,
						backend: this.params.backend,
						urid: this.params.urid
					},
					data: {
						userId: userId,
						GID: this.dialogueData.groupProfile.TCGroupID
					}
				}).then((res) => {
					if (res.data.code == 200) {
						this.tim.quitGroup(this.dialogueData.groupProfile.groupID).then((imResponse) => {
							this.$message({
								type: 'success',
								message: '退出成功!'
							});
							this.$emit('exitGroup', true);
							console.log(imResponse);
						}).catch((imError) => {
							console.warn('quitGroup error:', imError); // 退出群组失败的相关信息
						});
					} else {
						this.$message.error('退出群组失败');
					}

				})

			}).catch(() => { })
		}
	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
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
	.tc-news-group-list-box {
		height: 460px;
	}
	.tc-news-group-list {
		display: flex;
		flex-wrap: wrap;
		max-height: 460px;
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
			margin: 10px;
			width: 42px;
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
</style>
