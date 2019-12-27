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
    getUserInfo(context, obj) {
      return new Promise((resolve) => {
        tim.getUserProfile({
          userIDList: [obj.userID]
        }).then(res => {
          context.state.dialogueUserData = res.data[0];
          context.state.dialogueUserData.job = obj.job;
          context.state.dialogueUserData.avatar = obj.avatar;
          context.state.dialogueUserData.companyName = obj.companyName;
          context.state.dialogueUserData.carNumber = obj.carNumber;
          context.state.dialogueUserData.tel = obj.tel;
          resolve(context.state.dialogueUserData);
        })
      })
    },
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
