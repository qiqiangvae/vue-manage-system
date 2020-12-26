<template>
  <div class="dashboard-context">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="前端权限配置" name="front-authority-setting"></el-tab-pane>
      <el-tab-pane label="后端权限配置" name="back-authority-setting">
        <el-tree
          :data="authorityTree"
          node-key="authorityCode"
          :default-expanded-keys="[2, 3]"
          default-expand-all
          :props="defaultProps"
          :expand-on-click-node="false"
          style="width: 400px"
        >
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <span>{{ node.label }}</span>
            <span>
              <el-button
                type="text"
                icon="el-icon-circle-plus-outline"
                @click="() => addAuthorityHandle(data)"
              >
              </el-button>
              <el-button
                v-if="data.builtIn"
                slot="reference"
                type="text"
                icon="el-icon-warning-outline"
                @click="() => builtInWarningHandle(data)"
              ></el-button>
              <el-button
                v-else
                type="text"
                icon="el-icon-delete"
                @click="() => confirmDeleteAuthorityHandle(data)"
              >
              </el-button>
            </span>
          </span>
        </el-tree>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import { getAuthorityTree, addAuthority, deleteAuthority } from "../../api/authority";
export default {
  data() {
    return {
      activeName: "role-setting",
      authorityTree: [],
      defaultProps: {
        children: "children",
        label: "authorityName",
      },
      authorityToDel: {},
    };
  },
  created() {
    // this.authorityTreeHandle();
  },
  computed: {
    authorityType() {
      if (this.activeName === "front-authority-setting") {
        return "view";
      } else if (this.activeName === "back-authority-setting") {
        return "method";
      }
    },
  },
  methods: {
    authorityTreeHandle() {
      getAuthorityTree({ authorityCode: "", type: this.authorityType }).then((res) => {
        this.authorityTree = res;
      });
    },
    handleClick(val) {
      if (
        this.activeName === "front-authority-setting" ||
        this.activeName === "back-authority-setting"
      ) {
        this.authorityTreeHandle();
      }
    },
    addAuthorityHandle(data) {
      console.log(data);
      this.$prompt("请输入权限名称", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputErrorMessage: "权限名称新增错误",
      }).then(({ value }) => {
        addAuthority({
          authorityName: value,
          type: this.authorityType,
          parentAuthorityCode: data.authorityCode,
        }).then((res) => {
          this.authorityTreeHandle();
        });
      });
    },
    confirmDeleteAuthorityHandle(data) {
      let msg = `是否确定删除${data.authorityName}, 是否继续？`;
      if (data.children != null && data.children.length > 0) {
        msg = `${data.authorityName}权限下有子权限，将会一起被删除，是否继续？`;
      }
      this.$confirm(msg, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        deleteAuthority({
          authorityCodeList: [data.authorityCode],
          type: this.authorityType,
        }).then((res) => {
          this.$message({
            type: "success",
            message: "删除成功!",
          });
          this.authorityTreeHandle();
        });
      });
    },
    builtInWarningHandle(data) {
      this.$message(`${data.authorityName}是内置权限，无法删除`);
    },
  },
};
</script>
<style scoped>
.schart {
  width: 100%;
  height: 300px;
}
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 13px;
  padding-right: 8px;
}
</style>
