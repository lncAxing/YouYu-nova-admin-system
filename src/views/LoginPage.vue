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
            
                <div class="login-wrap">

                    <div class="input-item">
                        <input type="text" placeholder="请输入用户名" class="input" v-model="form.username">
                    </div>
                    <!-- 用户未填写提示 -->
                    <p class="err-tip" v-if="errMsg.username">{{errMsg.username }} </p>


                    <div class="input-item">
                        <input type="password" placeholder="请输入登录密码" class="input" v-model="form.password">
                    </div>
                     <!-- 用户未填写提示 -->
                    <p class="err-tip" v-if="errMsg.password">{{errMsg.password }} </p>



                    <div class="input-item">
                        <input type="text" placeholder="请输入验证码" class="input" v-model="form.code">
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
                    <div class="login-button" @click="login">登录</div>
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import { loginApi } from '@/api/request'
import Cookies from 'js-cookie'; //引入cookies工具
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
   //  页面加载时读取cookie，回填账号密码
   //启用vue2 生命钩子
   created(){ 
    const saveUser =Cookies.get('saveUserInfo') //cookies 在本地的名称为saveUserInfo
    if(saveUser){
      const userObj = JSON.parse(saveUser)   //将cokies转为json格式
      this.form.username =userObj.username
      this.form.password =userObj.password
      this.isRemember =true
    }
   },
  methods: {
    
    async login() {
        // 初始化 为空
     this.errMsg.username = ''
    this.errMsg.password = ''
    this.errMsg.code = ''

    let flag =true
    if(!this.form.username){
        this.errMsg.username = '请输入用户名'
        flag =false
    }
    if(!this.form.password){
        this.errMsg.password ='请输入登录密码'
        flag =false
    }
    if (!this.form.code) {
    this.errMsg.code = '请输入图形验证码'
    flag = false
  }
  // 有任意一项为空，直接终止请求
  if (!flag) return
      try {
        const res = await loginApi({
          username: this.form.username,
          password: this.form.password,
          code:this.form.code //验证码传后端
        })
        const data = res.data
        if (data.code === 1) {
          alert('登录成功')
          if (this.isRemember) {
           Cookies.set(
            'saveUserInfo',
            JSON.stringify({
              username:this.form.username,
              password:this.form.password
            }),
            // cookie有效期3天，全部路由读取，携带这条cookie
            {expires:3,path:'/'}
           )
          } else {
            Cookies.remove('saveUserInfo',{path:'/'})
          }
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
}

/* 报错的样式 */
.err-tip {
  color: #f55;
  font-size: 14px;
  margin: 4px 0 18px 0;
}
</style>