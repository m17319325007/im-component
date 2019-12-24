import tim from '../../tim'
const user = {
  state: {
    userData: {},
    dialogueUserData: {},
    isLogin: false,
    isSDKReady: false,

  },
  mutations: {
    updateCurrentUserProfile(state, userData) {
      state.userData = userData;
      console.log(userData, '个人信息')
    },
    getUserInfo(state, obj) {
      tim.getUserProfile({
        userIDList: [obj.userID]
      }).then(res => {
        state.dialogueUserData = res.data[0];
        state.dialogueUserData.job = obj.job;
        state.dialogueUserData.companyName = obj.companyName;
        state.dialogueUserData.carNumber = obj.carNumber;
        state.dialogueUserData.tel = obj.tel;
      })
    },
    toggleIsLogin(state, isLogin) {
      state.isLogin = typeof isLogin === 'undefined' ? !state.isLogin : isLogin
    },
    toggleIsSDKReady(state, isSDKReady) {
      state.isSDKReady = typeof isSDKReady === 'undefined' ? !state.isSDKReady : isSDKReady
    },
    reset(state) {
      Object.assign(state, {
        isLogin: false,
        isSDKReady: false // TIM SDK 是否 ready
      })
    }
  },
  actions: {
    login(context, obj) {
      return new Promise((resolve) => {
        tim
          .login({
            userID: obj.userID,
            userSig: obj.userSig
          })
          .then((res) => {
            console.log(res);
            context.commit('toggleIsLogin', true)
            // window.$message({
            //   type: 'success',
            //   message: '登录成功'
            // })
            resolve(res)
          })
          .catch(imError => {
            if (imError.code === 2000) {
              window.$message.error(imError.message + ', 请检查是否正确填写了 SDKAPPID')
            } else {
              window.$message.error(imError.message)
            }
          })
      })
    },
    logout(context) {
      // 若有当前会话，在退出登录时已读上报
      if (context.rootState.conversation.currentConversation.conversationID) {
        tim.setMessageRead({
          conversationID: context.rootState.conversation.currentConversation.conversationID
        })
      }
      tim.logout().then(() => {
        context.commit('toggleIsLogin')
        context.commit('reset')
      })
    }
  }
}

export default user
