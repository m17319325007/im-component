<template>
	<!-- eslint-disable -->
	<div class="tc-news-center-input">
		<template v-if="voice">
			<div class="voice-box">
				<div class="voice-border"  @mousedown.prevent="mouseStart"  @mouseup.prevent="mouseEnd">
					<canvas id="myCanvas">当前浏览器不支持canvas组件请升级！</canvas>
					<img src="@/assets/images/IM/voiceBig.png" alt="">
					<span class="voice-hint" v-if="isVoiceHint != 0">
						长按录音
					</span>
				</div>
				<div class="tc-news-center-send tc-news-center-send-voice">
					<span class="tc-news-center-send-btn" @click="cancelVoice(val)">
						取消
					</span>
					<span class="tc-news-center-send-btn" @click="sendVoice(val)">
						发送
					</span>
				</div>
			</div>
		</template>
		<template v-else>
			<textarea ref="content" maxlength="1000" v-model="val" @keyup.enter="keyupSend" class="tc-news-center-input-textarea" resize="none" cols="30" rows="10"></textarea>
			<div class="tc-news-center-send">
				<span class="tc-news-center-send-btn" @click="send(val)">
					发送
				</span>
			</div>
		</template>

	</div>
</template>

<script>
/* eslint-disable */
import { MP3Recorder } from '@/utils/recordermp3.js';
import axios from 'axios';
export default {
	name: 'MessageSend',
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
		ouid: {
			type: String,
			default: ''
		},
		voice: {
			type: Boolean,
			default: false
		},
		baseUrl: {
			type: String,
			default: ""
		},
		params: {
			type: Object,
			default() {
				return {}
			}
		}
	},
	data() {
		return {
			src: '',
			val: '',
			isVoiceHint: 1,
			isVoice: false,
			form: {
				audioUrl: ''
			},
			num: 60,
			// 按住说话时间
			recorder: null,
			interval: '',
			audioFileList: [],
			// 上传语音列表
			startTime: '',
			// 语音开始时间
			endTime: '',
			// 语音结束
			circleLoading: null,
			Interval: null,
			fd: null,
			ctx: null,
			canvas: null,
			voiceNum: 0,
			recorder: null,
			stream: ""
		}
	},
	created() {
		if (localStorage.getItem('tc-im-isVoiceHint')) {
			this.isVoiceHint = localStorage.getItem('tc-im-isVoiceHint');
		}
	},
	mounted() {
		// 初始化开启录音权限
		this.$nextTick(() => {
			try {
				window.AudioContext = window.AudioContext || window.webkitAudioContext;
				navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;
				window.URL = window.URL || window.webkitURL;

				var audio_context = new AudioContext;
				console.log('navigator.getUserMedia ' + (navigator.getUserMedia ? 'available.' : 'not present!'));
			} catch (e) {
				alert('No web audio support in this browser!');
			}

			navigator.getUserMedia({ audio: true }, (stream) => {
				this.stream = stream;
				this.recorder = new MP3Recorder(stream);
				console.log('初始化完成');
			}, function (e) {
				console.log('No live audio input: ' + e);
			});
		})
	},
	watch: {
		ouid() {
			this.val = '';
			if (this.$refs.content) {
				this.$refs.content.focus();
				this.fd = null;
			}
		}
	},
	methods: {

		clearTimer() {
			if (this.interval) {
				this.num = 60
				clearInterval(this.interval);
			}
			if (this.circleLoading) {
				clearInterval(this.circleLoading);
			}
			if (this.Interval) {
				clearInterval(this.Interval);
			}
		},
		// 长按说话
		mouseStart() {
			if (!this.recorder) {
				this.$message.error('未找到请求设备');
				return;
			}
			// 首次提示 长按录音
			if (this.isVoiceHint) {
				this.isVoiceHint = 0;
				localStorage.setItem('tc-im-isVoiceHint', 0);
			}

			this.clearTimer()
			this.startTime = new Date().getTime()
			this.toCanvas('myCanvas', 120)
			this.interval = setInterval(() => {
				if (this.num <= 0) {
					this.recorder.stop()
					this.num = 60
					this.clearTimer()
				} else {
					this.num--
					this.voiceNum = 60 - this.num;
					this.recorder.start()
				}
			}, 1000)
		},
		// 松开时上传语音
		mouseEnd() {
			if (!this.recorder) {
				return;
			}
			this.clearTimer();
			if (this.voiceNum < 1) {
				this.$message.warning("说话时间太短");
				this.voiceNum = 0;
				this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
				return;
			}
			this.endTime = new Date().getTime();
			//清除canvas内容
			this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
			// 记录本次录音的秒数
			if (this.recorder) {
				var mp3Blob = this.recorder.upload();
				// 重置说话时间
				this.num = 60;
				// 将获取的二进制对象转为二进制文件流
				let fd = new FormData();
				fd.append('myFile', mp3Blob, "recorder" + new Date().getTime() + ".mp3");
				// 额外参数，可根据选择填写
				// 这里是通过上传语音文件的接口，获取接口返回的路径作为语音路径
				this.fd = fd;
				this.recorder = new MP3Recorder(this.stream);
			}
		},
		uploadFile(fd, callback) {
			console.log(fd)
			axios({
				method: 'post',
				url: this.baseUrl + 'upload/voice',
				headers: {
					'Content-Type': 'multipart/form-data'
				},
				params: this.params,
				data: fd
			}).then(res => {
				this.fd = null;
				callback(res.data.result);
			})
		},
		keyupSend(ev) {
			if (ev && ev.keyCode === 13) {
				this.send(this.val)
			}
		},
		cancelVoice() {
			this.fd = null;
		},
		sendVoice() {
			if (this.fd) {
				this.uploadFile(this.fd, (res) => {
					let message = this.tim.createCustomMessage({
						to: this.isGroup ? this.dialogueData.groupProfile.groupID : this.dialogueData.userProfile.userID,
						conversationType: this.isGroup ? 'GROUP' : 'C2C',
						payload: {
							data: JSON.stringify({
								type: "tcvoice",
								url: res.url,
								second: this.voiceNum
							}),
							description: "voice"
						}
					});
					this.tim.sendMessage(message).then(res => {
						this.$emit('sendSuccess', res.data.message)
					})
					this.val = '';
				})
			} else {
				this.$message.warning('请先录音');
			}
		},
		send(val) {
			// 是个人/群组发送
			let message = this.tim.createTextMessage({
				to: this.isGroup ? this.dialogueData.groupProfile.groupID : this.dialogueData.userProfile.userID,
				conversationType: this.isGroup ? 'GROUP' : 'C2C',
				payload: {
					text: val
				}
			});
			this.tim.sendMessage(message).then(res => {
				console.log(res);
				this.$emit('sendSuccess', res.data.message)
			})
			this.val = '';
		},
		toCanvas(id, progress) {
			// canvas进度条
			this.canvas = document.getElementById(id),
				this.ctx = this.canvas.getContext("2d");
			var ctx = this.ctx;
			var percent = progress, //最终百分比
				circleX = this.canvas.width / 2, //中心x坐标
				circleY = this.canvas.height / 2, //中心y坐标
				radius = 29, //圆环半径
				lineWidth = 3; //圆形线条的宽度
			//画弧线
			function sector(cx, cy, r, startAngle, endAngle, anti) {
				ctx.beginPath();
				ctx.lineWidth = lineWidth;
				// 渐变色 - 可自定义
				var linGrad = ctx.createLinearGradient(
					circleX - radius - lineWidth, circleY, circleX + radius + lineWidth, circleY
				);
				linGrad.addColorStop(0.0, '#8bc33e');
				ctx.strokeStyle = linGrad;

				//圆弧两端的样式
				ctx.lineCap = 'round';

				//圆弧
				ctx.arc(
					cx, cy, r,
					(Math.PI * 2 / 3),
					(Math.PI * 2 / 3) + endAngle / 100 * (Math.PI * 5 / 3),
					false
				);
				ctx.stroke();
			}

			//刷新
			function loading() {

				//圆弧
				sector(circleX, circleY, radius, Math.PI * 2 / 3, process);
				//控制结束时动画的速度
				if (process / percent > 0.90) {
					process += 0.30;
				} else if (process / percent > 0.80) {
					process += 0.55;
				} else if (process / percent > 0.70) {
					process += 0.75;
				} else {
					process += 1.0;
				}
			}

			var process = 0.0; //进度
			this.circleLoading = window.setInterval(function () {
				loading();
			}, 380);
		},
	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.tc-news-center-input {
	height: 115px;
	padding: 10px;
}
.tc-news-center-input-textarea {
	font-size: 14px;
	line-height: 18px;
	width: 100%;
	height: 80px;
	border: none;
	outline: none;
	resize: none;
	caret-color: #007aff;
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
}
.tc-news-center-send {
	display: flex;
	justify-content: flex-end;
	margin-top: 5px;
	.tc-news-center-send-btn {
		cursor: pointer;
		color: #fff;
		text-align: center;
		font-size: 14px;
		width: 58px;
		height: 24px;
		line-height: 24px;
		background: #1c4daa;
		border-radius: 4px;
	}
}
.voice-box {
	display: flex;
	align-items: center;
	justify-content: center;
	height: 100%;
	.voice-border {
		width: 60px;
		height: 60px;
		border: 3px solid #dadeed;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 60px;
		position: relative;
		cursor: pointer;
		.voice-hint {
			position: absolute;
			left: -124px;
			width: 112px;
			height: 24px;
			line-height: 24px;
			text-align: center;
			color: #fff;
			background: #698be5;
			border-radius: 14px;
			font-size: 12px;
		}
	}
	#myCanvas {
		position: absolute;
	}
	.tc-news-center-send-voice {
		position: absolute;
		right: 20px;
		bottom: 10px;
		span {
			margin-left: 10px;
			&:first-child {
				background: #fff;
				color: #1f57b3;
				border: 1px solid #1f57b3;
				box-sizing: border-box;
			}
		}
	}
}
</style>
