<template>
	<div class="tc-personal-data">
		<div class="tc-personal-header">
			<div class="tc-personal-header-content">
				<span class="tc-personal-close" @click="handlePersonalClose">
					<img :src="goBack" alt=""> 返回
				</span>
			</div>
		</div>
		<div class="tc-personal-box">
			<div class="tc-personal-img">
				<img :src="userData.avatar" alt="">
			</div>
			<div class="tc-personal-line">
				<span class="tc-personal-label">
					姓名
				</span>
				<span class="tc-personal-value">
					{{ userData.nick }}
				</span>
			</div>
			<div class="tc-personal-line">
				<span class="tc-personal-label">
					手机号
				</span>
				<span class="tc-personal-value">
					{{ userData.tel }}
				</span>
			</div>
			<div class="tc-personal-line">
				<span class="tc-personal-label">
					职位
				</span>
				<span class="tc-personal-value">
					{{ userData.job }}
				</span>
			</div>
			<div class="tc-personal-line">
				<span class="tc-personal-label">
					单位
				</span>
				<span class="tc-personal-value">
					{{ userData.companyName }}
				</span>
			</div>
			<div v-if="userData.userID != isLoginUserId" class="tc-personal-btn" @click="sendBtn">
				发消息
			</div>
		</div>
	</div>
</template>

<script>
import goBack from '@/assets/images/IM/goBack.png';

export default {
	name: 'personalData',
	props: {
		userData: {
			type: Object,
			default() {
				return {}
			}
		},
		isLoginUserId: {
			type: String,
			default: ""
		}
	},
	data() {
		return {
			goBack: goBack
		}
	},
	methods: {
		handlePersonalClose() {
			this.$emit('handlePersonalClose', false);
		},
		sendBtn() {
			this.handlePersonalClose();
			this.$emit('send', this.userData);
		}
	}
}
</script>
<style lang="scss">
.tc-personal-data {
	width: 260px;
	height: 480px;
	.tc-personal-header {
		padding: 0 15px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 50px;
		border-bottom: 1px solid #e8e8e8;
		.tc-personal-close {
			display: flex;
			align-items: center;
			cursor: pointer;
			img {
				margin-right: 8px;
			}
		}
	}
	.tc-personal-box {
		display: flex;
		flex-direction: column;
		.tc-personal-img {
			margin-top: 30px;
			margin-bottom: 14px;
			display: flex;
			width: 100%;
			justify-content: center;
			img {
				width: 100px;
				height: 100px;
				border-radius: 50px;
			}
		}
		.tc-personal-line {
			display: flex;
			padding: 8px 30px;
			font-size: 14px;
			.tc-personal-label {
				width: 48px;
				text-align-last: justify;
				color: #8f8f8f;
				margin-right: 20px;
			}
			.tc-personal-value {
				width: 130px;
				line-height: 16px;
			}
		}
		.tc-personal-btn {
			height: 32px;
			margin: 50px 20px 0;
			line-height: 32px;
			text-align: center;
			font-size: 14px;
			color: #fff;
			background: rgba(31, 87, 179, 1);
			border-radius: 4px;
			cursor: pointer;
		}
	}
}
</style>
