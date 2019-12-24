<template>
	<div class="tc-message-item-img">
		<img @click="openView" class="tc-message-item-img-view" :src="message.imageInfoArray[0].imageUrl" alt="">
		<el-dialog v-if="message.imageInfoArray" :visible.sync="dialogVisible" :width="width + 'px'">
			<img :src="message.imageInfoArray[0].imageUrl" :style="{width: width - 40 + 'px'}">
		</el-dialog>
	</div>
</template>

<script>
export default {
	name: 'MessageItem',
	props: {
		message: {
			type: Object,
			default() {
				return {}
			}
		}
	},
	data() {
		return {
			dialogVisible: false,
			width: 0
		}
	},
	methods: {
		openView() {
			this.dialogVisible = true;
			for (let i = 0; i < this.message.imageInfoArray.length; i++) {
				if (this.message.imageInfoArray[i].width > 0) {
					this.width = this.message.imageInfoArray[i].width + 40;
					break;
				}
			}
		}
	},
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.tc-message-item-img {
	cursor: pointer;
	.tc-message-item-img-view {
		max-width: 160px;
	}
}
</style>
<style lang="scss">
.v-modal {
	z-index: 1992 !important;
}
</style>
