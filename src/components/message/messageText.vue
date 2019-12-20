<template>
	<div class="tc-message-item-text">
		{{ message.text }}
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
	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.tc-message-item-text {
	line-height: 18px;
	word-break: break-all;
}
</style>
