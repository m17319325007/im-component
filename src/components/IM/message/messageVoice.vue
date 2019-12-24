<template>
	<div class="tc-message-item-voice">
		<audio :ref="'audio' + viewMessage.url " :src="viewMessage.url">
			您的浏览器不支持语音功能，请升级浏览器
		</audio>
		<div class="play" @click="play()">
			<img v-show="playStatus && flow == 'in'" :src="palyLeft" alt="">
			<img v-show="!playStatus && flow == 'in'" :src="pauseLeft" alt="">
			<img v-show="playStatus && flow == 'out'" :src="paly" alt="">
			<img v-show="!playStatus && flow == 'out'" :src="pause" alt="">
		</div>
		<div class="tc-message-item-voice-play" :class="{ on: flow == 'out', pauseOn : !playStatus, playOn: playStatus}">
			<div class="tc-message-item-voice-play-item tc-message-item-voice-play-1"></div>
			<div class="tc-message-item-voice-play-item tc-message-item-voice-play-2"></div>
			<div class="tc-message-item-voice-play-item tc-message-item-voice-play-3"></div>
			<div class="tc-message-item-voice-play-item tc-message-item-voice-play-4"></div>
			<div class="tc-message-item-voice-play-item tc-message-item-voice-play-5"></div>
			<div class="tc-message-item-voice-play-item tc-message-item-voice-play-6"></div>
			<div class="tc-message-item-voice-play-item tc-message-item-voice-play-7"></div>
			<div class="tc-message-item-voice-play-item tc-message-item-voice-play-8"></div>
			<div class="tc-message-item-voice-play-item tc-message-item-voice-play-9"></div>
			<div class="tc-message-item-voice-play-item tc-message-item-voice-play-10"></div>
			<div class="tc-message-item-voice-play-item tc-message-item-voice-play-11"></div>
			<div class="tc-message-item-voice-play-item tc-message-item-voice-play-12"></div>
			<div class="tc-message-item-voice-play-item tc-message-item-voice-play-13"></div>
			<div class="tc-message-item-voice-play-item tc-message-item-voice-play-14"></div>
			<div class="tc-message-item-voice-play-item tc-message-item-voice-play-15"></div>
		</div>
		<span class="tc-message-item-voice-second" :style="{color: flow != 'in' ? '#fff' : '#698be5'}">{{ viewMessage.second }}s</span>
	</div>
</template>

<script>
import palyLeft from '@/assets/images/IM/palyLeft.png';
import pauseLeft from '@/assets/images/IM/pauseLeft.png';
import paly from '@/assets/images/IM/paly.png';
import pause from '@/assets/images/IM/pause.png';
export default {
	name: 'MessageItem',
	props: {
		flow: {
			type: String,
			default: ''
		},
		message: {
			type: Object,
			default() {
				return {}
			}
		}
	},
	data() {
		return {
			palyLeft: palyLeft,
			pauseLeft: pauseLeft,
			paly: paly,
			pause: pause,
			audio: null,
			playStatus: true,
			viewMessage: {}
		}
	},
	mounted() {
		this.viewMessage = { ...this.message };
		if (this.viewMessage.description && this.viewMessage.description == 'voice') {
			this.viewMessage.data = JSON.parse(this.viewMessage.data);
			this.viewMessage.url = this.viewMessage.data.url;
			this.viewMessage.second = this.viewMessage.data.second;
		}
		this.$nextTick(() => {
			this.audio = this.$refs['audio' + this.viewMessage.url];
		})
	},
	methods: {
		play() {
			if (this.audio !== null) {
				//检测播放是否已暂停.audio.paused 在播放器播放时返回false.
				if (this.audio.paused) {
					// 停止其它
					this.$store.dispatch('setPlayStatus').then(() => {
						this.playStatus = !this.playStatus;
						this.audio.play();//audio.play();// 这个就是播放
					});
				} else {
					this.audio.pause();// 这个就是暂停
				}
			} else {
				return
			}
			this.audio.addEventListener('ended', () => {
				this.audio.pause();
				this.playStatus = true;
			}, false)
		}
	},
	watch: {
		'$store.state.inform.voiceStatus': {
			//你需要执行的代码
			handler: function () {
				if (this.audio) {
					this.playStatus = true;
					this.audio.pause();
				}
			},
			deep: true
		}
	}

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.tc-message-item-voice {
	display: flex;
	align-items: center;
	width: 200px;
	img {
		cursor: pointer;
		width: 26px;
		height: 26px;
	}
	.tc-message-item-voice-play {
		display: flex;
		align-items: center;
		margin-left: 16px;
	}
}
@keyframes voice {
	0% {
		height: 0%;
	}
	20% {
		height: 50%;
	}
	50% {
		height: 100%;
	}
	80% {
		height: 50%;
	}
	100% {
		height: 0%;
	}
}
.tc-message-item-voice-second {
	font-size: 12px;
}
.tc-message-item-voice-play {
	height: 18px;
	margin-right: 20px;
	&.on {
		.tc-message-item-voice-play-item {
			background: #fff;
		}
	}
	.tc-message-item-voice-play-item {
		width: 3px;
		height: 100%;
		margin-left: 5px;
		border-radius: 50px;
		background-color: #698be5;
		vertical-align: middle;
		display: inline-block;
	}
	&.playOn {
		.tc-message-item-voice-play-1 {
			height: 8px;
		}
		.tc-message-item-voice-play-2 {
			height: 12px;
		}
		.tc-message-item-voice-play-3 {
			height: 20px;
		}
		.tc-message-item-voice-play-4 {
			height: 8px;
		}
		.tc-message-item-voice-play-5 {
			height: 12px;
		}
		.tc-message-item-voice-play-6 {
			height: 20px;
		}
		.tc-message-item-voice-play-7 {
			height: 22px;
		}
		.tc-message-item-voice-play-8 {
			height: 20px;
		}
		.tc-message-item-voice-play-9 {
			height: 12px;
		}
		.tc-message-item-voice-play-10 {
			height: 8px;
		}
		.tc-message-item-voice-play-11 {
			height: 8px;
		}
		.tc-message-item-voice-play-12 {
			height: 12px;
		}
		.tc-message-item-voice-play-13 {
			height: 18px;
		}
		.tc-message-item-voice-play-14 {
			height: 12px;
		}
		.tc-message-item-voice-play-15 {
			height: 8px;
		}
	}

	&.pauseOn {
		.tc-message-item-voice-play-1,
		.tc-message-item-voice-play-6,
		.tc-message-item-voice-play-11 {
			animation: voice 1s infinite 0.3s;
			-webkit-animation: voice 1s infinite 0.3s;
		}
		.tc-message-item-voice-play-2,
		.tc-message-item-voice-play-7,
		.tc-message-item-voice-play-12 {
			animation: voice 1s infinite 0.4s;
			-webkit-animation: voice 1s infinite 0.4s;
		}
		.tc-message-item-voice-play-3,
		.tc-message-item-voice-play-8,
		.tc-message-item-voice-play-13 {
			animation: voice 1s infinite 0.4s;
			-webkit-animation: voice 1s infinite 0.4s;
		}
		.tc-message-item-voice-play-4,
		.tc-message-item-voice-play-9,
		.tc-message-item-voice-play-14 {
			animation: voice 1s infinite 0.6s;
			-webkit-animation: voice 1s infinite 0.6s;
		}
		.tc-message-item-voice-play-5,
		.tc-message-item-voice-play-10,
		.tc-message-item-voice-play-15 {
			animation: voice 1s infinite 0.7s;
			-webkit-animation: voice 1s infinite 0.7s;
		}
	}
}
</style>
