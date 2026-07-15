<template>

  <!-- MVC模式
   M指的是model 数据库，数据，数据处理逻辑（封装与应用程序业务逻辑相关数据以及数据处理方法，可直接访问数据库）
   V是View，页面视图
   C是控制器controller，负责转发请求，对请求进行处理  
   流程:用户访问页面(view) → 触发控制器(Controller)→ 控制器调用Model → 数据返回控制器→ 显示到视图
   -->


<!-- 外部大盒子 用于设置背景 -->
<div id="container">   
        <!-- 内容盒子 -->
    <div id="main">
         <!-- 左侧盒子-->
        <div class="left-box">       
            <!-- 左侧头部盒子 -->
            <div class="left-box-header">  
               <!-- 左侧 logo占位 -->
                <span class="logo-wrapper">                     
                    <img src="../assets/logo.png" alt="logo" class="logo">
                </span>
                <span class="logo-text">Nova Admin</span>
            </div>
            <!-- 左侧中部盒子 -->
            <div class="left-box-center">
               <span class="content"> 
                <h2>探索更智能的</h2>
                <h2>后台管理数据空间</h2>
                </span>
                <!-- 内容描述 -->
                <span class="content-description">
                    <p>Nova致力于为您提供极简、高效、安全的数字化工作台解决方案，助您的业务实现跨越式增长。</p>
                </span> 
            </div>
               <!-- 左侧底部盒子 -->
            <div class="left-box-footer">
                <!-- 版权 -->
                <span class="footer-text">© 2026 Nova Admin. All Rights Reserved.</span>
                <!-- 隐私政策 -->
                <span class="privacy-policy">隐私政策</span>
            </div>
        </div>


        <!-- 右侧盒子 -->
        <div class="right-box"> 
             <!-- 右侧头部盒子 -->
            <div class="right-box-header">  
               <span class="content"> 
                <h1 class="content-title">欢迎回来</h1>
                <div class="content-description">请选择您的登录方式并输入相关凭证</div>
                </span>
            </div>
            <!-- 右侧中部盒子 -->
            <div class="right-box-center">
               <!-- 切换登录方式 -->
                <div class="tab-wrap">
                    <span class="tab-account-login">账号登录</span>
                    <span class="tab-login">快捷登录</span>
                </div>
                <!-- 登录表单 -->
            
                <form class="login-wrap" autocomplete="off" @submit.prevent="login">

                    <div class="input-item">
                        <input
                          type="text"
                          name="login_username"
                          autocomplete="off"
                          placeholder="请输入用户名"
                          class="input"
                          v-model="form.username"
                        >
                    </div>
                    <!-- 用户未填写提示 -->
                    <p class="err-tip" v-if="errMsg.username">{{errMsg.username }} </p>


                    <div class="input-item">
                        <input
                          type="password"
                          name="login_password"
                          autocomplete="off"
                          placeholder="请输入登录密码"
                          class="input"
                          v-model="form.password"
                        >
                    </div>
                     <!-- 用户未填写提示 -->
                    <p class="err-tip" v-if="errMsg.password">{{errMsg.password }} </p>



                    <div class="input-item">
                        <input
                          type="text"
                          name="code"
                          autocomplete="off"
                          placeholder="请输入验证码"
                          class="input"
                          v-model="form.code"
                        >
                        <img src="../assets/yzm-code.png" alt="验证码" class="yzm">
                    </div>
                     <!-- 用户未填写提示 -->
                    <p class="err-tip" v-if="errMsg.code">{{errMsg.code }} </p>


                        <!-- 记住我盒子 -->
                     <div class="item-checkbox">
                           <!-- 记住我 -->
                        <div class="row-item">
                            <label>
                                <input type="checkbox" class="checkbox" v-model="isRemember">
                                记住我
                            </label>
                        </div>
                        <!-- 忘记密码 -->
                        <span class="forget-password">忘记密码？</span>
                    </div>
                    <!-- 登录按钮 -->
                    <button class="login-button" type="submit">登录</button>
                </form>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import { loginApi } from '@/api/request'

const REMEMBER_COOKIE = 'saveUserInfo'
const REMEMBER_SECRET = 'nova-admin-system-remember-2026'

// ArrayBuffer / Uint8Array 不能直接安全写进 cookie，这里统一转成 base64url 字符串。
function bufferToBase64Url(buffer) {
  const bytes = new Uint8Array(buffer)
  let binary = ''
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte)
  })
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '')
}

// 读取 cookie 时再把 base64url 转回 ArrayBuffer，供 Web Crypto API 解密使用。
function base64UrlToBuffer(value) {
  const base64 = value.replace(/-/g, '+').replace(/_/g, '/')
  const padded = base64.padEnd(base64.length + (4 - base64.length % 4) % 4, '=')
  const binary = atob(padded)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i)
  }
  return bytes.buffer
}

async function getRememberKey() {
  // 用固定字符串派生 AES-256 密钥。
  // 目的：让 cookie 面板里看不到明文账号密码，只看到加密后的 saveUserInfo。
  const secretBytes = new TextEncoder().encode(REMEMBER_SECRET)
  const keyBytes = await window.crypto.subtle.digest('SHA-256', secretBytes)
  // importKey 把 SHA-256 结果交给 AES-GCM 使用，后面 encrypt/decrypt 都复用这个 key。
  return window.crypto.subtle.importKey(
    'raw',
    keyBytes,
    { name: 'AES-GCM' },
    false,
    ['encrypt', 'decrypt']
  )
}

export default {
  data() {
    return {
      form: { username: '', password: '', code: '' },
      isRemember: false,
      // 每个输入框独立错误
      errMsg: {
        username: '',
        password: '',
        code: ''
      }
    }
  },
  created() {
    // 进入登录页时尝试读取 saveUserInfo；如果没有或解不开，就保持空表单。
    this.fillRememberLogin()
  },
  methods: {
    getCookie(name) {
      // 从 document.cookie 里按名称取 cookie，取不到返回空字符串。
      const target = `${name}=`
      const item = document.cookie
        .split('; ')
        .find((cookieItem) => cookieItem.startsWith(target))
      return item ? decodeURIComponent(item.slice(target.length)) : ''
    },
    setCookie(name, value, expiresDays) {
      // 保存加密后的记住我信息，Max-Age 用秒，path=/ 让登录页能读到。
      document.cookie = `${name}=${encodeURIComponent(value)}; Max-Age=${expiresDays * 24 * 60 * 60}; path=/`
    },
    removeCookie(name) {
      // 删除 cookie 的通用写法：把 Max-Age 设为 0。
      document.cookie = `${name}=; Max-Age=0; path=/`
    },
    async encryptRememberInfo(data) {
      // data 形如 { username, password }，先 JSON.stringify，再交给 AES-GCM。
      // AES-GCM 每次加密都需要新的随机 IV，保证相同账号密码也会生成不同密文。
      const iv = window.crypto.getRandomValues(new Uint8Array(12))
      const key = await getRememberKey()
      // Web Crypto API 返回的是 ArrayBuffer，不是普通字符串。
      const encrypted = await window.crypto.subtle.encrypt(
        { name: 'AES-GCM', iv },
        key,
        new TextEncoder().encode(JSON.stringify(data))
      )
      // cookie 保存格式：iv.encrypted，二者都转成 base64url，避免 cookie 特殊字符问题。
      // 注意：这里只保存密文，不再保存 { username, password } 明文。
      return `${bufferToBase64Url(iv)}.${bufferToBase64Url(encrypted)}`
    },
    async decryptRememberInfo(value) {
      // saveUserInfo 的格式必须是 iv.encrypted；格式不对就视为无效。
      const [ivText, encryptedText] = String(value || '').split('.')
      if (!ivText || !encryptedText) return null

      const key = await getRememberKey()
      // 使用保存时同一个 IV 和同一个 key 解密，才能还原 JSON 字符串。
      const decrypted = await window.crypto.subtle.decrypt(
        { name: 'AES-GCM', iv: new Uint8Array(base64UrlToBuffer(ivText)) },
        key,
        base64UrlToBuffer(encryptedText)
      )
      // 解密后的内容才是 { username, password }，随后用于回填表单。
      return JSON.parse(new TextDecoder().decode(decrypted))
    },
    async fillRememberLogin() {
      // 页面加载回填：只读加密 cookie，不请求后端接口。
      const encryptedUser = this.getCookie(REMEMBER_COOKIE)
      if (!encryptedUser) return

      try {
        const data = await this.decryptRememberInfo(encryptedUser)
        if (!data) return

        this.form.username = data.username || ''
        this.form.password = data.password || ''
        this.isRemember = true
      } catch (err) {
        // 旧明文 cookie、损坏密文或密钥变化都会解密失败，直接清掉避免反复报错。
        this.removeCookie(REMEMBER_COOKIE)
      }
    },
    async syncRememberInfo() {
      // 登录成功后同步记住我状态：没勾选就删除 cookie，勾选才保存加密信息。
      if (!this.isRemember) {
        this.removeCookie(REMEMBER_COOKIE)
        return
      }

      try {
        // 这里才组装账号密码对象；它不会直接写入 cookie，会先进入 encryptRememberInfo 加密。
        const encryptedUser = await this.encryptRememberInfo({
          username: this.form.username,
          password: this.form.password
        })
        this.setCookie(REMEMBER_COOKIE, encryptedUser, 7)
      } catch (err) {
        // 加密失败时不保留半截或异常 cookie，避免下次页面加载解密报错。
        this.removeCookie(REMEMBER_COOKIE)
      }
    },
    async login() {
      // 清空错误提示
      this.errMsg.username = ''
      this.errMsg.password = ''
      this.errMsg.code = ''

      let flag = true
      if (!this.form.username) {
        this.errMsg.username = '请输入用户名'
        flag = false
      }
      if (!this.form.password) {
        this.errMsg.password = '请输入登录密码'
        flag = false
      }
      if (!this.form.code) {
        this.errMsg.code = '请输入图形验证码'
        flag = false
      }
      if (!flag) return

      try {
        // 只保留一次请求，携带isRemember传给后端
        const res = await loginApi({
          username: this.form.username,
          password: this.form.password,
          code: this.form.code,
          isRemember: this.isRemember
        })

        const data = res.data
        if (data.code === 1) {
          alert('登录成功')
          await this.syncRememberInfo()
          this.$router.push('/admin')
        } else {
          alert(data.msg)
        }
      } catch (err) {
        alert('服务器连接失败')
      }
    }
  }
}
</script>

<style scoped>
html,body{
  margin: 0;
  height: 100vh;
}
/* 全局背景 */
#container{
   height: 100vh;
   width: 100vw;
   /* background: radial-gradient(circle at 50% 50%, #192140, #2F235A); */
    background: linear-gradient( to bottom, #1a1438 0%, #2c1e59 100%);
  display: flex;
  justify-content: center; /* 水平居中 */
  align-items: center;     /* 垂直居中 */
}
/* 内容盒子 */
#main{
    width:1000px;
    height: 600px;
    border-radius: 16px;
    /* background: #fff; */
    display: flex;
    overflow: hidden; /* 裁剪圆角溢出 */
  
}
/* 左侧盒子 */
.left-box{
    /* background:red; */
    height: 100%;
    width: 50%;
   background: linear-gradient(to bottom, #242458, #362060);
    /* background: linear-gradient( to top, #2A2B62 0%, #3E256A 100%); */
    
}
.logo{
    margin:30px;
    width: 50px;    
    height: 50px;
    /* background: red; */
    /* border:1px solid #fff; */
}
.left-box-header{
    /* 横向排列 */
    display: flex;
    /* 垂直居中 */
    align-items: center;
    /* gap: 2px; */
}
.logo-text{
    font-size: 20px;
    font-weight: bold;
    color: #fff;
}
.left-box-center {
    margin: 120px 0px 0px 30px;
}
.left-box-center .content h2 {
  color: #fff;
  font-size: 30px;
  font-weight: bold;
  margin: 0;
  /* 缩小两行文字行间距， */
  line-height: 1.4;
}
.left-box-center .content{
    color: #fff;
}
.left-box-footer{
    margin: 180px 50px 20px 20px;
    color:#60637B;
     display: flex;
  justify-content: space-between; /* 左右两端对齐 */
  align-items: center;
}
.content-description{
    color:#8E93A6;
}

/* 右侧盒子 */
    .right-box{
          padding: 60px 48px;
    /* background:blue; */
    height: 100%;
    width: 50%;
    background: linear-gradient(to bottom, #2A2A50, #362B60);

}
/* 欢迎回来 */
.content-title{
    
    color: #fff;
    /* background: red; */
    margin: 0;
    /* position: relative; */
}
/* 欢迎回来下方 描述 */
.right-box-header .content-description{
    color:#74788D ;
    /* margin-top: 20px; */
}
.tab-wrap{
    color: #9CA3AF;
    margin-top:30px;
    padding-bottom: 20px;
    /* 俩分割线 */
    border-bottom: 1px solid rgba(255, 255, 255, 0.12);
      display: flex;
  gap: 48px;
  position: relative;
}

/* 默认账号登录 的颜色 */
.tab-account-login{
    font-size: 16px;
  color: #6366F1;
  font-weight: bold;
  cursor: pointer;
  position: relative;
}
/* 横条 */
.tab-account-login::after {
  content: '';
  width: 100%;
  height: 3px;
  background: #6366F1;
  position: absolute;
  left: 0;
  bottom: -21px;
}
/* 快捷登录的样式 */
.tab-login {
  font-size: 16px;
  color: #9CA3AF;
  cursor: pointer;
}
.input-item{
     display: flex;
  align-items: center; /* 垂直居中对齐 */
  gap: 10px; 
  margin-bottom: 16px; 
}

.input-item .input {
  flex: 1; 
  padding: 8px 12px;
  margin-top: 10px;
  box-sizing: border-box;
    border-radius: 8px;
  /* 透明深色背景， */
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: #fff;
  /* 清除默聚焦蓝色轮廓 */
  outline: none;
  font-size: 16px;
}
.input-item .yzm {

  width: 100px;
  height: 38px;
  object-fit: cover;
}
/* 记住我盒子 */
.item-checkbox{
     display: flex;
     /* 左右两端分开 */
     justify-content: space-between;
     align-items: center;
     /* color: #fff; */
}
.row-item label{
    color: #fff;
}
.forget-password{
    color: #818CF8;
}
.login-button {
    margin-top: 30px;
  width: 100%;
  height: 56px;
  line-height: 56px;
  text-align: center; 
  border-radius: 10px;
  font-size: 18px;
  font-weight: bold;
  color: #fff;
  background: linear-gradient(90deg, #6e46ee, #f03ca6);
  cursor: pointer;
  border: none;
}

/* 报错的样式 */
.err-tip {
  color: #f55;
  font-size: 14px;
  margin: 4px 0 18px 0;
}
</style>


