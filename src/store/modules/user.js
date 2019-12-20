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
    getUserInfo(state, id) {
      tim.getUserProfile({
        userIDList: [id]
      }).then(res => {
        state.dialogueUserData = res.data[0];
        console.log(state, '>>>>>>>');
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
        currentUserProfile: {},
        isLogin: false,
        isSDKReady: false // TIM SDK 是否 ready
      })
    }
  },
  actions: {
    login(context) {
      return new Promise((resolve) => {
        tim
          .login({
            userID: 'TC1267',
            userSig: 'eJxNjcFOg0AURf*FbY3OGzpMNemiUKWkKKGlrEwIMEN5oIAwVajx3yWkjW7Pybn3Wwvc-W2cpvWpUpEaGqk9aES7mTAKWSnMULYjDCygBr*YuGlQRLGK9Fb8CzpRRpMaGcwJAYAFXVyk7BtsZRRnatoDxhgl5Jp*yrbDuhoFJcCA6oT8SYXvckq4Yej3nML1D48jfn70LWez2uRhX5g8WQd2552-9Kes8L3C2frB0O9cK2sU5EHqzsIVmi*intcEe7p7vbO9kx3m9aEEB7YfVTKsjyx-M8uk4DMrRH*51H5*Ae7kV6I_'
          })
          .then((res) => {
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
