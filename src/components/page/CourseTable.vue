<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-cascades"></i> 课程列表
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
          v-model="query.courseName"
          clearable
          placeholder="课程名称"
          class="handle-input mr10"
        ></el-input>
        <el-input
          v-model="query.teacher"
          clearable
          placeholder="授课老师"
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
        <el-table-column
          prop="courseName"
          label="课程名称"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="startDate"
          label="开始时间"
          align="center"
        ></el-table-column>
        <el-table-column prop="endDate" label="结束时间" align="center"></el-table-column>
        <el-table-column
          prop="classHour"
          label="课时（单位：节）"
          width="150"
          align="center"
        ></el-table-column>
        <el-table-column prop="teacher" label="授课老师" align="center"></el-table-column>
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
      <el-form ref="editForm" :model="editForm" label-width="100px">
        <el-form-item label="课程名称">
          <el-input v-model="editForm.courseName"></el-input>
        </el-form-item>
        <el-form-item label="选择时间">
          <el-date-picker
            v-model="editForm.dateRange"
            type="daterange"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @input="formDateRangeChange"
          >
          </el-date-picker>
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="老师">
              <el-select
                v-model="editForm.teacherId"
                filterable
                reserve-keyword
                placeholder="老师名字"
              >
                <el-option
                  v-for="item in searchTeacherOptions"
                  :key="item.id"
                  :label="item.teacherName"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="课时">
              <el-input v-model="editForm.classHour"
                ><template slot="append">节</template></el-input
              >
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveEdit">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 新增弹出框 -->
    <el-dialog title="新增" :visible.sync="addVisible" width="40%">
      <el-form :model="addForm" label-width="150px">
        <el-form-item label="课程名称">
          <el-input v-model="addForm.courseName"></el-input>
        </el-form-item>
        <el-form-item label="选择时间">
          <el-date-picker
            v-model="addForm.dateRange"
            type="daterange"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="老师">
              <el-select
                v-model="addForm.teacherId"
                filterable
                reserve-keyword
                placeholder="老师名字"
              >
                <el-option
                  v-for="item in searchTeacherOptions"
                  :key="item.id"
                  :label="item.teacherName"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="课时">
              <el-input v-model="addForm.classHour"
                ><template slot="append">节</template></el-input
              >
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveAdd">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { courseList, updateCourse, addCourse, deleteCourse } from "../../api/course";
import { teacherList } from "../../api/teacher";
export default {
  name: "basetable",
  data() {
    return {
      query: {
        teacher: "",
        courseName: "",
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
      id: -1,
      searchTeacherOptions: [],
      searchTeacherLoading: false,
    };
  },
  created() {
    this.getData();
    this.searchTeacher();
  },
  methods: {
    formDateRangeChange(newValue) {
      this.editForm.startDate = newValue[0];
      this.editForm.endDate = newValue[1];
      this.$forceUpdate();
    },
    // 获取 课程列表数据
    getData() {
      courseList(this.query).then((res) => {
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
      }).then(() => {
        deleteCourse({ ids: [row.id] }).then((res) => {
          this.getData();
          this.$message.success(`成功删除${row.courseName}`);
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
        let delIds = this.multipleSelection.map((item) => item.id);
        deleteCourse({ ids: delIds }).then((res) => {
          this.getData();
          let str = this.multipleSelection.map((item) => item.teacherName).join(",");
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
      this.addForm.startDate = this.addForm.dateRange[0];
      this.addForm.endDate = this.addForm.dateRange[1];
      console.info(this.addForm);
      addCourse(this.addForm).then((res) => {
        this.getData();
        this.addVisible = false;
        this.addForm = {};
      });
    },
    // 编辑操作
    handleEdit(index, row) {
      this.editForm = row;
      if (!this.editForm.dateRange) {
        this.editForm.dateRange = [];
      }
      this.editForm.dateRange[0] = this.editForm.startDate;
      this.editForm.dateRange[1] = this.editForm.endDate;
      this.editVisible = true;
    },
    // 保存编辑
    saveEdit() {
      this.editForm.startDate = this.editForm.dateRange[0];
      this.editForm.endDate = this.editForm.dateRange[1];
      this.editVisible = false;
      updateCourse(this.editForm).then((res) => {
        this.getData();
      });
    },
    // 分页导航
    handlePageChange(val) {
      this.$set(this.query, "pageIndex", val);
      this.getData();
    },
    searchTeacher(val) {
      teacherList({ needPag: false }).then((res) => {
        this.searchTeacherOptions = res.data;
      });
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
