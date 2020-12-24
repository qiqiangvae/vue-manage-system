<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>
<script>
import { findPublicSystemConfig } from "./api/index";
export default {
  created() {
    findPublicSystemConfig().then((res) => {
      console.log(res);
      let config = {};
      res.forEach((cfg) => {
        config[cfg.configKey] = cfg.configValue;
      });
      localStorage.setItem("application.title", config["system.name"]);
      localStorage.setItem("application.showQrCodeTool", config["showQrCodeTool"]);
    });
  },
};
</script>
<style>
@import "./assets/css/main.css";
/* 深色主题 */
@import "./assets/css/color-dark.css";
/*浅绿色主题*/
/* @import "./assets/css/theme-green/color-green.css";    */
</style>
