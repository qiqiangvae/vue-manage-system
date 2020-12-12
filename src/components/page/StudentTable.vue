<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-cascades"></i> 学生列表
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-button type="primary" icon="el-icon-lx-add" @click="handleAdd()"
          >新增</el-button
        >
        <el-button type="primary" icon="el-icon-lx-add" @click="handleImport()"
          >导入</el-button
        >
        <el-button
          type="primary"
          icon="el-icon-delete"
          class="handle-del mr10"
          @click="delAllSelection"
          >批量删除</el-button
        >
        <el-input
          v-model="query.studentName"
          clearable
          placeholder="学生名字"
          class="handle-input mr10"
        ></el-input>
        <el-input
          v-model="query.parent"
          clearable
          placeholder="家长姓名"
          class="handle-input mr10"
        ></el-input>
        <el-input
          v-model="query.grade"
          clearable
          placeholder="年级"
          class="handle-input mr10"
        ></el-input>
        <el-button type="primary" icon="el-icon-search" @click="handleSearch"
          >搜索</el-button
        >
      </div>
      <el-table
        :data="tableData"
        stripe
        class="table"
        ref="multipleTable"
        header-cell-class-name="table-header"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center"></el-table-column>
        <el-table-column
          type="index"
          label="序号"
          width="55"
          align="center"
        ></el-table-column>
        <el-table-column prop="id" v-if="false"></el-table-column>
        <el-table-column prop="studentName" label="学生" align="center"></el-table-column>
        <el-table-column prop="grade" label="年级" align="center"></el-table-column>
        <el-table-column
          prop="age"
          label="年龄"
          align="center"
          width="60"
        ></el-table-column>
        <el-table-column
          prop="gender"
          label="性别"
          width="60"
          align="center"
          :formatter="genderFormatter"
        ></el-table-column>
        <el-table-column
          prop="address"
          label="住址"
          align="center"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column prop="parent" label="家长" align="center"></el-table-column>
        <el-table-column label="操作" width="180" align="center">
          <template slot-scope="scope">
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
    <el-dialog title="编辑" :visible.sync="editVisible" width="40%">
      <el-form :model="editForm" :rules="rules" ref="editForm" label-width="100px">
        <el-form-item label="学生名字" prop="studentName">
          <el-input v-model="editForm.studentName"></el-input>
        </el-form-item>
        <el-form-item label="年级" prop="grade">
          <el-input v-model="editForm.grade"> </el-input>
        </el-form-item>
        <el-form-item label="年龄">
          <el-slider v-model="editForm.age" show-input :max="60"> </el-slider>
        </el-form-item>
        <el-form-item label="性别">
          <el-radio v-model="editForm.gender" :label="1">男</el-radio>
          <el-radio v-model="editForm.gender" :label="2">女</el-radio>
        </el-form-item>
        <el-form-item label="住址" prop="address">
          <el-input v-model="editForm.address"> </el-input>
        </el-form-item>
        <el-form-item label="家长">
          <el-input v-model="editForm.parent"> </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveEdit">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 新增弹出框 -->
    <el-dialog title="新增学生信息" :visible.sync="addVisible" width="40%">
      <el-form :model="addForm" :rules="rules" ref="addForm" label-width="100px">
        <el-form-item label="学生名字" prop="studentName">
          <el-input v-model="addForm.studentName"></el-input>
        </el-form-item>
        <el-form-item label="年级" prop="grade">
          <el-input v-model="addForm.grade"> </el-input>
        </el-form-item>
        <el-form-item label="年龄">
          <el-slider v-model="addForm.age" show-input :max="60"> </el-slider>
        </el-form-item>
        <el-form-item label="性别">
          <el-radio v-model="addForm.gender" :label="1">男</el-radio>
          <el-radio v-model="addForm.gender" :label="2">女</el-radio>
        </el-form-item>
        <el-form-item label="住址" prop="address">
          <el-input v-model="addForm.address"> </el-input>
        </el-form-item>
        <el-form-item label="家长">
          <el-input v-model="addForm.parent"> </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveAdd">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="导入学生信息" :visible.sync="importVisible" width="40%">
      <el-upload
        ref="upload"
        drag
        action="/api/student/import"
        name="excel"
        :on-error="uploadError"
        :headers="uploadHeaders"
        :on-success="uploadSuccess"
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip" slot="tip">只能上传xlxs文件，且不超过500kb</div>
      </el-upload>
    </el-dialog>
  </div>
</template>

<script>
import { studentList, updateStudent, addStudent, deleteStudent } from "../../api/student";
export default {
  name: "basetable",
  data() {
    return {
      query: {
        studentName: "",
        grade: "",
        parent: "",
        pageIndex: 1,
        pageSize: 10,
      },
      tableData: [],
      multipleSelection: [],
      editVisible: false,
      addVisible: false,
      importVisible: false,
      pageInfo: {},
      editForm: {},
      addForm: {},
      uploadHeaders: {
        "QING-CHA-TOKEN": localStorage.getItem("ms_token"),
        "QING-CHA-OPERATOR": localStorage.getItem("ms_username"),
      },
      id: -1,
      rules: {
        studentName: [{ required: true, message: "请填写老师名字", trigger: "blur" }],
        grade: [{ required: true, message: "请填写年级", trigger: "blur" }],
        address: [{ required: true, message: "请填写住址", trigger: "blur" }],
      },
    };
  },
  created() {
    this.getData();
  },
  methods: {
    genderFormatter(row, column) {
      let val = row[column.property];
      if (val === 1) {
        return "男";
      } else if (val === 2) {
        return "女";
      } else {
        return "-";
      }
    },
    // 获取 课程列表数据
    getData() {
      studentList(this.query).then((res) => {
        console.log(res);
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
      })
        .then(() => {
          deleteStudent({ ids: [row.id] }).then((res) => {
            this.getData();
            this.$message.success(`成功删除${row.studentName}`);
          });
        })
        .catch(() => {});
    },
    // 多选操作
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    delAllSelection() {
      this.$confirm("确定要删除吗？", "提示", {
        type: "warning",
      }).then(() => {
        let delIds = this.multipleSelection.map((item) => item.id);
        deleteStudent({ ids: delIds }).then((res) => {
          this.getData();
          let str = this.multipleSelection.map((item) => item.studentName).join(",");
          this.$message.success(`成功删除${str}`);
          this.multipleSelection = [];
        });
      });
    },
    // 新增操作
    handleAdd() {
      this.addForm = {};
      this.addVisible = true;
      this.addForm.age = 20;
      this.addForm.gender = 1;
    },
    // 保存新增
    saveAdd() {
      this.$refs["addForm"].validate((valid) => {
        debugger;
        if (valid) {
          addStudent(this.addForm).then((res) => {
            this.getData();
            this.addVisible = false;
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 编辑操作
    handleEdit(index, row) {
      this.editForm = JSON.parse(JSON.stringify(row));
      this.editVisible = true;
    },
    // 保存编辑
    saveEdit() {
      this.$refs["editForm"].validate((valid) => {
        if (valid) {
          updateStudent(this.editForm).then((res) => {
            this.getData();
            this.editVisible = false;
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //导入
    handleImport() {
      this.importVisible = true;
    },
    uploadError(err, file, fileList) {
      console.log(err.message);
      this.$message.error(err.message);
    },
    uploadSuccess() {
      this.getData();
    },
    // 分页导航
    handlePageChange(val) {
      this.$set(this.query, "pageIndex", val);
      this.getData();
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
