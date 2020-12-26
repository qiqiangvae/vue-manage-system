<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="qingcha el-icon-qingcha-baoming"></i> 角色列表
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-button type="primary" icon="el-icon-lx-add" @click="handleAdd()"
          >新增</el-button
        >
        <el-button
          type="primary"
          icon="el-icon-delete"
          class="handle-del mr10"
          @click="delAllSelection"
          >批量删除</el-button
        >
        <el-input
          v-model="query.roleCode"
          clearable
          placeholder="角色代码"
          class="handle-input mr10"
        ></el-input>
        <el-input
          v-model="query.roleName"
          clearable
          placeholder="角色名称"
          class="handle-input mr10"
        ></el-input>
        <el-button type="primary" icon="el-icon-search" @click="handleSearch"
          >搜索</el-button
        >
      </div>
      <el-table
        :data="tableData"
        class="table"
        ref="multipleTable"
        header-cell-class-name="table-header"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="selection"
          width="55"
          align="center"
          :selectable="checkSelectable"
        ></el-table-column>
        <el-table-column
          type="index"
          label="序号"
          width="55"
          align="center"
        ></el-table-column>
        <el-table-column prop="id" v-if="false"></el-table-column>
        <el-table-column
          prop="roleName"
          label="角色名称"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="roleCode"
          label="角色代码"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="builtIn"
          :formatter="roleBuiltInFormatter"
          label="是否内置角色"
          align="center"
        ></el-table-column>
        <el-table-column label="操作" width="180" align="center">
          <template slot-scope="scope" v-if="!scope.row.builtIn">
            <el-button
              type="text"
              icon="el-icon-edit"
              @click="handleEdit(scope.$index, scope.row)"
              >编辑</el-button
            >
            <el-button
              type="text"
              icon="el-icon-delete"
              class="red"
              @click="handleDelete(scope.$index, scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          background
          layout="total, prev, pager, next"
          :current-page="pageInfo.pageIndex"
          :page-size="pageInfo.pageSize"
          :total="pageInfo.total"
          :page-count="pageInfo.pageTotal"
          @current-change="handlePageChange"
        ></el-pagination>
      </div>
    </div>

    <!-- 编辑弹出框 -->
    <el-dialog title="编辑角色" :visible.sync="editVisible" width="40%">
      <el-form ref="editForm" :model="editForm" label-width="100px">
        <el-form-item label="角色姓名">
          <el-input v-model="editForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色代码">
          <el-input v-model="editForm.roleCode" disabled></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveEdit">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 新增弹出框 -->
    <el-dialog title="新增角色" :visible.sync="addVisible" width="40%">
      <el-form ref="editForm" :model="addForm" label-width="100px">
        <el-form-item label="角色姓名">
          <el-input v-model="addForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色代码">
          <el-input v-model="addForm.roleCode"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveAdd">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { roleList, updateRole, addRole, deleteRole } from "../../api/role";
export default {
  name: "basetable",
  data() {
    return {
      query: {
        roleCode: "",
        roleName: "",
        pageIndex: 1,
        pageSize: 10,
      },
      tableData: [],
      multipleSelection: [],
      editVisible: false,
      addVisible: false,
      pageInfo: {},
      editForm: {},
      addForm: {},
    };
  },
  created() {
    this.getData();
  },
  methods: {
    // 获取 角色列表数据
    getData() {
      roleList(this.query).then((res) => {
        this.tableData = res.data;
        this.pageInfo.pageIndex = res.pageIndex;
        this.pageInfo.pageSize = res.pageSize;
        this.pageInfo.pageTotal = res.pageTotal;
        this.pageInfo.total = res.total;
      });
    },
    // 触发搜索按钮
    handleSearch() {
      this.$set(this.query, "pageIndex", 1);
      this.getData();
    },
    // 删除操作
    handleDelete(index, row) {
      // 二次确认删除
      this.$confirm("确定要删除吗？", "提示", {
        type: "warning",
      }).then(() => {
        deleteRole({ keys: [row.roleCode] }).then((res) => {
          this.getData();
          this.$message.success(`成功删除${row.roleName}`);
        });
      });
    },
    // 多选操作
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    delAllSelection() {
      this.$confirm("确定要删除吗？", "提示", {
        type: "warning",
      }).then(() => {
        let delIds = this.multipleSelection.map((item) => item.roleCode);
        deleteRole({ keys: delIds }).then((res) => {
          this.getData();
          let str = this.multipleSelection.map((item) => item.roleName).join(",");
          this.$message.success(`成功删除${str}`);
          this.multipleSelection = [];
        });
      });
    },
    // 新增操作
    handleAdd() {
      this.addVisible = true;
    },
    // 保存新增
    saveAdd() {
      addRole(this.addForm).then((res) => {
        this.getData();
        this.addVisible = false;
        this.addForm = {};
      });
    },
    // 编辑操作
    handleEdit(index, row) {
      this.editForm = row;
      this.editVisible = true;
    },
    // 保存编辑
    saveEdit() {
      this.editVisible = false;
      updateRole(this.editForm).then((res) => {
        this.getData();
      });
    },
    // 分页导航
    handlePageChange(val) {
      this.$set(this.query, "pageIndex", val);
      this.getData();
    },
    roleBuiltInFormatter(row, column) {
      let val = row[column.property];
      return val ? "内置角色" : "非内置角色";
    },
    checkSelectable(row) {
      return !row.builtIn;
    },
  },
};
</script>

<style scoped>
.handle-box {
  margin-bottom: 20px;
}

.handle-select {
  width: 120px;
}

.handle-input {
  width: 200px;
  display: inline-block;
}
.table {
  width: 100%;
  font-size: 14px;
}
.red {
  color: #ff0000;
}
.mr10 {
  margin-right: 10px;
}
.table-td-thumb {
  display: block;
  margin: auto;
  width: 40px;
  height: 40px;
}
</style>
<style></style>
