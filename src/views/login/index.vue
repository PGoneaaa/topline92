<template>
  <div class="login-container">
    <div class="login-box">
      <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules">
        <img src="./logo_index.png" alt />

        <!-- prop使得校验规则可以找到当前目录进行匹配校验，值 就是当前项目的名称 -->
        <el-form-item  prop="mobile">
          <el-input v-model="loginForm.mobile" placeholder="请输入手机号码"></el-input>
        </el-form-item>
        <el-form-item  prop="code">
          <el-input v-model="loginForm.code" placeholder="请输入验证码" ></el-input>
        </el-form-item>
        <el-form-item style="text-align:left;" prop="xieyi">
          <el-checkbox v-model="loginForm.xieyi" placeholder></el-checkbox>
          <span>
            我已阅读并同意
            <a href="#">用户协议</a>
            <a href="#">用户隐私</a>
          </span>
        </el-form-item>
        <el-form-item>
          <el-button style="width:100%;" type="primary" @click="login()">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
// import { log } from 'util'
export default {

  data () {
    var xieyiTest = function (rule, value, callback) {
      value ? callback() : callback(new Error('请遵守协议'))
    }
    return {
      loginForm: {
        mobile: '', // 手机号码
        code: '', // 验证码
        xieyi: false // 协议复选框
      },
      //   表单校验
      loginFormRules: {
        //  required 必填
        //  message 错误提示
        mobile: [
          //   必填
          { required: true, message: '手机号码必填' },
          { pattern: /^1[35789]\d{9}$/, message: '手机号码格式不对' }
        ],
        //   验证码
        code: [{ required: true, message: '验证码必填' }],
        xieyi: [
          { validator: xieyiTest }
        ]
      }
    }
  },
  methods: {
    login () {
      // 表单校验
    // el-from .
    // 固定语法，el-from的组件对象
      this.$refs.loginFormRef.validate(valid => {
        //   valid : true 校验通过
        // valid : false 校验失败
        if (!valid) { return false }
        // 路由编程式导航

        // 服务器端账号真实校验
        var p = this.$http({
          url: '/mp/v1_0/authorizations',
          method: 'POST',
          data: this.loginForm
        })
        p.then(rst => {
          // 客户端浏览器把服务器端返回的秘钥等相关信息通过sessionStorage做记录，表明是登陆状态
        //   上传时转换JSON格式
          window.sessionStorage.setItem('userinfo', JSON.stringify(rst.data.data))

          // 进入后台系统

          this.$router.push({ name: 'home' })
        }).catch(err => {
          this.$message.error('手机号码或验证码错误:' + err)
        })
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login-container {
  background-color: gray;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: url("./login_bg.jpg");
  background-size: cover;
}
.login-box {
  width: 410px;
  height: 345px;
  background-color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center
}
img {
    width: 55%;
    margin: 20px auto;
  }
  .el-form {
  width: 75%;
}

</style>
