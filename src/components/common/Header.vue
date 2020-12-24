<template>
  <div class="header">
    <!-- 折叠按钮 -->
    <div class="collapse-btn" @click="collapseChage">
      <i v-if="!collapse" class="el-icon-s-fold"></i>
      <i v-else class="el-icon-s-unfold"></i>
    </div>
    <div class="logo">{{ title }}</div>
    <!-- 工具栏 -->
    <div class="header-left">
      <div class="header-user-con">
        <!-- 收款二维码 -->
        <div v-if="showQrCodeTool" class="btn-showQrCode" @click="handleShowQrCode">
          <el-tooltip
            effect="dark"
            :content="showQrCode ? `隐藏收款码` : `显示收款码`"
            placement="bottom"
          >
            <i class="el-icon-lx-redpacket"></i>
          </el-tooltip>
        </div>
      </div>
    </div>
    <div class="header-right">
      <div class="header-user-con">
        <!-- 全屏显示 -->
        <div class="btn-fullscreen" @click="handleFullScreen">
          <el-tooltip
            effect="dark"
            :content="fullscreen ? `取消全屏` : `全屏`"
            placement="bottom"
          >
            <i class="el-icon-rank"></i>
          </el-tooltip>
        </div>
        <!-- 消息中心 -->
        <div class="btn-bell">
          <el-tooltip
            effect="dark"
            :content="message ? `有${message}条未读消息` : `消息中心`"
            placement="bottom"
          >
            <router-link to="/tabs">
              <i class="el-icon-bell"></i>
            </router-link>
          </el-tooltip>
          <span class="btn-bell-badge" v-if="message"></span>
        </div>
        <!-- 用户头像 -->
        <div class="user-avator">
          <img src="../../assets/img/img.jpg" />
        </div>
        <!-- 用户名下拉菜单 -->
        <el-dropdown class="user-name" trigger="click" @command="handleCommand">
          <span class="el-dropdown-link">
            {{ username }}
            <i class="el-icon-caret-bottom"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="currentManagerInfo">个人信息</el-dropdown-item>
            <el-dropdown-item divided command="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>

    <el-dialog title="提示" :visible.sync="showCurrentManagerInfo" width="30%">
      <span>当前用户</span>{{ name }}
      <span slot="footer" class="dialog-footer">
        <el-button @click="showCurrentManagerInfo = false">取 消</el-button>
        <el-button type="primary" @click="showCurrentManagerInfo = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <el-dialog
      title="收款码"
      :visible.sync="showQrCode"
      :before-close="handleCloseQrCode"
    >
      <el-image
        class="mr20"
        v-for="(url, index) in qrCodeUrls"
        :key="index"
        style="width: 300px; height: 500px"
        :src="url"
        fit="cover"
      ></el-image>
    </el-dialog>
  </div>
</template>
<script>
import bus from "../common/bus";
import { logout } from "../../api/index";

const applicationConf = require("../../assets/config/application.json");

export default {
  data() {
    return {
      collapse: false,
      fullscreen: false,
      name: "清茶",
      message: 2,
      showCurrentManagerInfo: false,
      showQrCode: false,
      qrCodeUrls: ["./img/wxQrCode.jpg", "./img/zfbQrCode.jpg"],
    };
  },
  computed: {
    username() {
      let username = localStorage.getItem("ms_username");
      return username ? username : this.name;
    },
    title() {
      let title = localStorage.getItem("application.title");
      return title ? title : applicationConf.title;
    },
    showQrCodeTool() {
      let showQrCodeTool = localStorage.getItem("application.showQrCodeTool");
      return showQrCodeTool ? JSON.parse(showQrCodeTool) : applicationConf.showQrCodeTool;
    },
  },
  methods: {
    // 用户名下拉菜单选择事件
    handleCommand(command) {
      if (command == "logout") {
        logout();
        localStorage.removeItem("ms_username");
        this.$router.push("/login");
      }
      if (command == "currentManagerInfo") {
        this.showCurrentManagerInfo = true;
      }
    },
    // 侧边栏折叠
    collapseChage() {
      this.collapse = !this.collapse;
      bus.$emit("collapse", this.collapse);
    },
    // 全屏事件
    handleFullScreen() {
      let element = document.documentElement;
      if (this.fullscreen) {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
      } else {
        if (element.requestFullscreen) {
          element.requestFullscreen();
        } else if (element.webkitRequestFullScreen) {
          element.webkitRequestFullScreen();
        } else if (element.mozRequestFullScreen) {
          element.mozRequestFullScreen();
        } else if (element.msRequestFullscreen) {
          // IE11
          element.msRequestFullscreen();
        }
      }
      this.fullscreen = !this.fullscreen;
    },
    handleShowQrCode() {
      this.showQrCode = !this.showQrCode;
    },
    handleCloseQrCode() {
      this.showQrCode = false;
    },
  },
  mounted() {
    if (document.body.clientWidth < 1500) {
      this.collapseChage();
    }
  },
};
</script>
<style scoped>
.header {
  position: relative;
  box-sizing: border-box;
  width: 100%;
  height: 70px;
  font-size: 22px;
  color: #fff;
}
.collapse-btn {
  float: left;
  padding: 0 21px;
  cursor: pointer;
  line-height: 70px;
}
.header .logo {
  float: left;
  width: 250px;
  line-height: 70px;
}
.header-left {
  float: left;
  padding-right: 50px;
}
.header-right {
  float: right;
  padding-right: 50px;
}
.header-user-con {
  display: flex;
  height: 70px;
  align-items: center;
}
.btn-fullscreen {
  transform: rotate(45deg);
  margin-right: 5px;
  font-size: 24px;
}
.btn-bell,
.btn-fullscreen {
  position: relative;
  width: 30px;
  height: 30px;
  text-align: center;
  border-radius: 15px;
  cursor: pointer;
}
.btn-showQrCode {
  margin-right: 5px;
  font-size: 24px;
}
.btn-bell-badge {
  position: absolute;
  right: 0;
  top: -2px;
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background: #f56c6c;
  color: #fff;
}
.btn-bell .el-icon-bell {
  color: #fff;
}
.user-name {
  margin-left: 10px;
}
.user-avator {
  margin-left: 20px;
}
.user-avator img {
  display: block;
  width: 40px;
  height: 40px;
  border-radius: 50%;
}
.el-dropdown-link {
  color: #fff;
  cursor: pointer;
}
.el-dropdown-menu__item {
  text-align: center;
}
.mr20 {
  margin-right: 20px;
}
</style>
