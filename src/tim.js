import TIM from 'tim-js-sdk'
import COSSDK from 'cos-js-sdk-v5'


let options = {
  SDKAppID: 1400111828 // 接入时需要将0替换为您的即时通信应用的 SDKAppID
};

// 初始化 SDK 实例
const tim = TIM.create(options)

window.setLogLevel = tim.setLogLevel

// 无日志级别
tim.setLogLevel(4)

// 注册 cos
tim.registerPlugin({
  'cos-js-sdk': COSSDK
})
export default tim
