<template>
  <div class="login-wrap">
    <div class="ms-login">
      <div class="ms-title">{{systemName}}</div>
      <el-form
        :model="param"
        :rules="rules"
        ref="login"
        label-width="0px"
        class="ms-content"
      >
        <el-form-item prop="username">
          <el-input v-model="param.username" placeholder="用户名">
            <el-button
              slot="prepend"
              icon="qingcha el-icon-qingcha-yonghuming"
            ></el-button>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password" placeholder="密码" v-model="param.password">
            <el-button slot="prepend" icon="qingcha el-icon-qingcha-mima"></el-button>
          </el-input>
        </el-form-item>
        <el-form-item prop="authCode">
          <el-row>
            <el-input
              v-model="param.authCode"
              placeholder="验证码"
              @keyup.enter.native="submitForm()"
            >
              <el-button
                slot="prepend"
                icon="qingcha el-icon-qingcha-yanzhengma"
                fit="contain"
              ></el-button>
              <el-image
                slot="suffix"
                :src="authCodeImage"
                fit="cover"
                style="height: 100%"
              ></el-image>
            </el-input>
          </el-row>
        </el-form-item>
        <div class="login-btn">
          <el-button type="primary" @click="submitForm()">登录</el-button>
        </div>
        <p class="login-tips">Tips : 你是最帅的仔</p>
      </el-form>
    </div>
  </div>
</template>
<script>
import { login, authCode } from "../../api/index";
export default {
  data: function () {
    return {
      param: {
        username: "qingcha",
        password: "123123",
        authCode: "",
        authCodeId: "",
      },
      systemName: localStorage.getItem("application.title"),
      authCodeImage: "",
      rules: {
        username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
        authCode: [{ required: true, message: "请输入验证码", trigger: "blur" }],
      },
    };
  },
  created() {
    this.createAuthCode();
  },
  methods: {
    submitForm() {
      this.$refs.login.validate((valid) => {
        if (valid) {
          login(this.param).then(
            (res) => {
              this.$message.success("登录成功");
              localStorage.setItem("ms_username", res.username);
              localStorage.setItem("ms_token", res.token);
              this.$router.push("/");
            },
            (err) => {
              this.$message.error("验证码错误");
              this.createAuthCode();
            }
          );
        } else {
          this.$message.error("请输入账号和密码");
          console.log("error submit!!");
          return false;
        }
      });
    },
    createAuthCode() {
      authCode().then((res) => {
        this.param.authCodeId = res.authCodeId;
        this.authCodeImage = "data:image/jpeg;base64," + res.image;
      });
    },
  },
};
</script>

<style scoped>
.login-wrap {
  position: relative;
  width: 100%;
  height: 100%;
  background-image: url(../../assets/img/login-bg.jpg);
  background-size: 100%;
}
.ms-title {
  width: 100%;
  line-height: 50px;
  text-align: center;
  font-size: 20px;
  color: rgb(96, 184, 224);
  border-bottom: 1px solid #ddd;
}
.ms-login {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 350px;
  margin: -190px 0 0 -175px;
  border-radius: 5px;
  background: rgba(255, 255, 255, 0.3);
  overflow: hidden;
}
.ms-content {
  padding: 30px 30px;
}
.login-btn {
  text-align: center;
}
.login-btn button {
  width: 100%;
  height: 36px;
  margin-bottom: 10px;
}
.login-tips {
  font-size: 12px;
  line-height: 30px;
  color: #fff;
}
</style>
