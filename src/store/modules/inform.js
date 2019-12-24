/*
 * @Author: huanling
 * @version: 语音管理
 * @Company: 砼车信息技术有限公司
 * @Description:
 * @Date: 2019-12-23 11:12:20
 * @LastEditors  : huanling
 * @LastEditTime : 2019-12-23 16:52:11
 */
import {
  Message
} from 'element-ui'

const informModule = {
  state: {
    voiceStatus: false,
    message: undefined
  },
  actions: {
    showMessage(state, options) {
      if (state.message) {
        state.message.close()
      }
      state.message = Message({
        message: options.message,
        type: options.type || 'success',
        duration: options.duration || 2000,
        offset: 40
      })
    },
    setPlayStatus(context) {
      return new Promise((resolve) => {
        context.state.voiceStatus = !context.state.voiceStatus;
        resolve()
      })
    }
  }
}

export default informModule
