<template>
	<div>
		<div v-if="isModal" class="tc-dialog-modal" v-show="visible">
		</div>
		<transition name="dialog-fade" @after-enter="afterEnter" @after-leave="afterLeave">
			<div class="tc-dialog-wrapper" :class="isModal ? 'on' : ''" v-show="visible" @click.self="handleClose">
				<div class="tc-dialog" :class="isModal ? '' : 'on'" ref="dialog">
					<div class="tc-dialog-box">
						<div class="tc-dialog-header" v-if="isHeader">
							<div class="tc-dialog-title">
								标题
							</div>
							<div class="tc-dialog-close" @click="handleClose">
								test关闭
							</div>
						</div>
						<div class="tc-dialog-body">
							<slot></slot>
						</div>
					</div>
				</div>
			</div>
		</transition>
	</div>
</template>

<script>
export default {
	name: 'Dialog',
	props: {
		isModal: {
			type: Boolean,
			default: false
		},
		isHeader: {
			type: Boolean,
			default: false
		},
		visible: {
			type: Boolean,
			default: true
		}
	},
	data() {
		return {
			closed: false,
		};
	},
	watch: {
		visible(val) {
			if (val) {
				this.$emit('open');
			} else {
				if (!this.closed) this.$emit('close');
			}
		}
	},
	methods: {
		afterEnter() {
			this.$emit('opened');
		},
		afterLeave() {
			this.$emit('closed');
		},
		handleClose() {
			if (typeof this.beforeClose === 'function') {
				this.beforeClose(this.hide);
			} else {
				// this.hide();
			}
		},
		hide(cancel) {
			if (cancel !== false) {
				this.$emit('update:visible', false);
				this.$emit('close');
				this.closed = true;
			}
		}
	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
.tc-dialog-wrapper {
	display: flex;
	justify-content: center;
	align-items: center;
	position: relative;
	&.on {
		position: fixed;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
	}
}
.tc-dialog-modal {
	position: fixed;
	left: 0;
	top: 0;
	right: 0;
	bottom: 0;
	z-index: 1994;
	background: rgba(33, 33, 33, 0.4);
}
.tc-dialog {
	&.on {
		position: fixed;
		top: 150px;
	}
	.tc-dialog-box {
		background: #fff;
		border-radius: 2px;
		box-shadow: 0px 4px 12px 0px rgba(0, 0, 0, 0.2);
		box-sizing: border-box;
		z-index: 1996;
	}
	.tc-dialog-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 10px;
	}
}
.dialog-fade-enter-active {
	transition: all 0.5s ease;
}
.dialog-fade-leave-active {
	transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1);
}

.dialog-fade-enter,
.dialog-fade-leave-to {
	transform: translateY(-20px);
}
</style>
