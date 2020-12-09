<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item> <i class="el-icon-lx-cascades"></i> 教师列表 </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button type="primary" icon="el-icon-lx-add" @click="handleAdd()">新增</el-button>
                <el-button type="primary" icon="el-icon-delete" class="handle-del mr10" @click="delAllSelection">批量删除</el-button>
                <el-input v-model="query.mobileNumber" clearable placeholder="手机号" class="handle-input mr10"></el-input>
                <el-input v-model="query.teacherName" clearable placeholder="老师名字" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
            </div>
            <el-table
                :data="tableData"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
                @selection-change="handleSelectionChange"
            >
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column type="index" label="序号" width="55" align="center"></el-table-column>
                <el-table-column prop="id" v-if="false"></el-table-column>
                <el-table-column prop="teacherName" label="老师"></el-table-column>
                <el-table-column prop="mobileNumber" label="手机号"></el-table-column>
                <el-table-column prop="age" label="年龄"></el-table-column>
                <el-table-column prop="gender" label="性别" :formatter="genderFormatter"></el-table-column>
                <el-table-column prop="workAge" label="工龄"></el-table-column>
                <el-table-column prop="introduction" label="介绍" show-overflow-tooltip></el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.$index, scope.row)"
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
                <el-form-item label="老师名字" prop="teacherName">
                    <el-input v-model="editForm.teacherName"></el-input>
                </el-form-item>
                <el-form-item label="手机号" prop="mobileNumber">
                    <el-input v-model="editForm.mobileNumber"></el-input>
                </el-form-item>
                <el-form-item label="年龄">
                    <el-slider v-model="editForm.age" show-input :max="70"> </el-slider>
                </el-form-item>
                <el-form-item label="性别">
                    <el-radio v-model="editForm.gender" :label="1">男</el-radio>
                    <el-radio v-model="editForm.gender" :label="2">女</el-radio>
                </el-form-item>
                <el-form-item label="工龄">
                    <el-slider v-model="editForm.workAge" :max="50" show-input> </el-slider>
                </el-form-item>
                <el-form-item label="介绍" prop="introduction">
                    <el-input v-model="editForm.introduction" type="textarea"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 新增弹出框 -->
        <el-dialog title="新增老师信息" :visible.sync="addVisible" width="40%">
            <el-form :model="addForm" :rules="rules" ref="addForm" label-width="100px">
                <el-form-item label="老师名字" prop="teacherName">
                    <el-input v-model="addForm.teacherName"></el-input>
                </el-form-item>
                <el-form-item label="手机号" prop="mobileNumber">
                    <el-input v-model="addForm.mobileNumber"></el-input>
                </el-form-item>
                <el-form-item label="年龄">
                    <el-slider v-model="addForm.age" show-input :max="70"> </el-slider>
                </el-form-item>
                <el-form-item label="性别">
                    <el-radio v-model="addForm.gender" :label="1">男</el-radio>
                    <el-radio v-model="addForm.gender" :label="2">女</el-radio>
                </el-form-item>
                <el-form-item label="工龄">
                    <el-slider v-model="addForm.workAge" :max="50" show-input> </el-slider>
                </el-form-item>
                <el-form-item label="介绍" prop="introduction">
                    <el-input v-model="addForm.introduction" type="textarea"></el-input>
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
import { teacherList, updateTeacher, addTeacher } from '../../api/teacher';
export default {
  name: 'basetable',
  data() {
    return {
      query: {
        teacherName: '',
        mobileNumber: '',
        pageIndex: 1,
        pageSize: 10
      },
      tableData: [],
      multipleSelection: [],
      delList: [],
      editVisible: false,
      addVisible: false,
      pageInfo: {},
      editForm: {},
      addForm: {},
      id: -1,
      rules: {
        teacherName: [
          { required: true, message: '请填写老师名字', trigger: 'blur' }
        ],
        mobileNumber: [
          { required: true, message: '请填写老师手机号', trigger: 'blur' }
        ],
        introduction: [
          { required: true, message: '请填写老师的介绍', trigger: 'blur' }
        ]
      }
    };
  },
  created() {
    this.getData();
  },
  methods: {
    genderFormatter(row, column) {
      let val = row[column.property]
      if (val === 1) {
        return '男'
      } else if (val === 2) {
        return '女'
      } else {
        return '-'
      }
    },
    // 获取 课程列表数据
    getData() {
      teacherList(this.query).then(res => {
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
      this.$set(this.query, 'pageIndex', 1);
      this.getData();
    },
    // 删除操作
    handleDelete(index, row) {
      // 二次确认删除
      this.$confirm('确定要删除吗？', '提示', {
        type: 'warning'
      })
        .then(() => {
          this.$message.success('删除成功');
          this.tableData.splice(index, 1);
        })
        .catch(() => { });
    },
    // 多选操作
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    delAllSelection() {
      const length = this.multipleSelection.length;
      let str = '';
      this.delList = this.delList.concat(this.multipleSelection);
      for (let i = 0; i < length; i++) {
        str += this.multipleSelection[i].name + ' ';
      }
      this.$message.error(`删除了${str}`);
      this.multipleSelection = [];
    },
    // 新增操作
    handleAdd() {
      this.addForm = {}
      this.addVisible = true
      this.addForm.age = 20
      this.addForm.gender = 1
    },
    // 保存新增
    saveAdd() {
      this.$refs['addForm'].validate((valid) => {
        debugger
        if (valid) {
          addTeacher(this.addForm).then(res => {
            this.getData()
            this.addVisible = false
          })
        } else {
          console.log('error submit!!');
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
      this.$refs['editForm'].validate((valid) => {
        if (valid) {
          updateTeacher(this.editForm).then(res => {
            this.getData()
            this.editVisible = false;
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    // 分页导航
    handlePageChange(val) {
      this.$set(this.query, 'pageIndex', val);
      this.getData();
    }
  }
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
    width: 300px;
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
