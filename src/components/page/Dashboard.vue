<template>
  <div class="dashboard-context">
    <el-row :gutter="20">
      <el-col :span="16">
        <!-- 日历 -->
        <el-calendar v-model="calendarValue">
          <template slot="dateCell" slot-scope="{ date, data }">
            <p
              :class="data.isSelected ? 'is-selected' : ''"
              @click="selectCalendarDate(date, data)"
            >
              {{ dateCellFormatter(data) }}
            </p>
          </template>
        </el-calendar>
      </el-col>
      <el-col :span="8">
        <!-- 数据总览 -->
        <el-row :gutter="20" class="mgb20">
          <el-col :span="12">
            <el-card shadow="hover" :body-style="{ padding: '0px' }">
              <div class="grid-content grid-con-1">
                <i class="qingcha el-icon-qingcha-xuesheng grid-con-icon"></i>
                <div class="grid-cont-right">
                  <div class="grid-num">1234</div>
                  <div>学生总数</div>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="12">
            <el-card shadow="hover" :body-style="{ padding: '0px' }">
              <div class="grid-content grid-con-2">
                <i class="qingcha el-icon-qingcha-laoshi grid-con-icon"></i>
                <div class="grid-cont-right">
                  <div class="grid-num">34</div>
                  <div>教师人数</div>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
        <el-row :gutter="20" class="mgb20">
          <el-col :span="12">
            <el-card shadow="hover" :body-style="{ padding: '0px' }">
              <div class="grid-content grid-con-1">
                <i class="qingcha el-icon-qingcha-kecheng1 grid-con-icon"></i>
                <div class="grid-cont-right">
                  <div class="grid-num">20</div>
                  <div>开放课程数</div>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="12">
            <el-card shadow="hover" :body-style="{ padding: '0px' }">
              <div class="grid-content grid-con-2">
                <i class="el-icon-lx-notice grid-con-icon"></i>
                <div class="grid-cont-right">
                  <div class="grid-num">321</div>
                  <div>系统消息</div>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
        <!-- 待办事项 -->
        <el-card shadow="hover" style="height: 418px">
          <div slot="header" class="clearfix">
            <span>待办事项</span>
            <el-button style="float: right; padding: 3px 0" type="text">添加</el-button>
          </div>
          <el-table :show-header="false" :data="todoList" style="width: 100%">
            <el-table-column width="40">
              <template slot-scope="scope">
                <el-checkbox v-model="scope.row.status"></el-checkbox>
              </template>
            </el-table-column>
            <el-table-column>
              <template slot-scope="scope">
                <div class="todo-item" :class="{ 'todo-item-del': scope.row.status }">
                  {{ scope.row.title }}
                </div>
              </template>
            </el-table-column>
            <el-table-column width="60">
              <template>
                <i class="el-icon-edit"></i>
                <i class="el-icon-delete"></i>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card shadow="hover">
          <schart
            ref="bar"
            class="schart"
            canvasId="bar"
            :options="gradeDataThroughStudentHistogramOptions"
          ></schart>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="hover">
          <schart
            ref="line"
            class="schart"
            canvasId="line"
            :options="studentScoreOptions"
          ></schart>
        </el-card>
      </el-col>
    </el-row>
    <!-- 回到顶部 -->
    <el-backtop />
  </div>
</template>

<script>
import Schart from "vue-schart";
import bus from "../common/bus";
import { analyseGradeDataThroughStudent } from "../../api/dashboard";
import { findStudentScore } from "../../api/studentExamScore";
export default {
  name: "dashboard",
  data() {
    return {
      name: localStorage.getItem("ms_username"),
      calendarValue: new Date(),
      todoList: [
        {
          title: "参加县教育局关于学生在校安全的座谈会",
          status: false,
        },
        {
          title: "期末电话回访",
          status: false,
        },
        {
          title: "老师内部会议",
          status: false,
        },
      ],
      gradeDataThroughStudentHistogramOptions: {
        type: "bar",
        title: {
          text: "",
        },
        xRorate: 25,
        labels: [],
        datasets: [],
      },
      studentScoreOptions: {
        type: "line",
        title: {
          text: "",
        },
        labels: [],
        datasets: [],
      },
    };
  },
  components: {
    Schart,
  },
  computed: {
    role() {
      return this.name === "admin" ? "超级管理员" : "普通用户";
    },
  },
  created() {
    this.handleListener();
    this.getGradeDataThroughStudentHistogram();
    this.getStudentScoreHistogram();
  },
  activated() {
      this.handleListener();
  },
  deactivated() {
      window.removeEventListener('resize', this.renderChart);
      bus.$off('collapse', this.handleBus);
  },
  methods: {
    selectCalendarDate(date, data) {
      console.log(data);
    },
    dateCellFormatter(data) {
      let result =
        data.day.split("-").slice(1).join("-") + " " + (data.isSelected ? "✔️" : "");
      if (data.day == "2020-12-30") {
        result = result + "\n" + "期末考试";
      }
      return result;
    },
    getGradeDataThroughStudentHistogram() {
      analyseGradeDataThroughStudent().then((res) => {
        console.log(res);
        this.gradeDataThroughStudentHistogramOptions.title.text = res.title;
        this.gradeDataThroughStudentHistogramOptions.labels = res.labels;
        this.gradeDataThroughStudentHistogramOptions.datasets = [];
        Object.keys(res.datasets).forEach((key) => {
          this.gradeDataThroughStudentHistogramOptions.datasets.push({
            label: key,
            data: res.datasets[key],
          });
        });
      });
    },
    getStudentScoreHistogram() {
      findStudentScore({ id: 4 }).then((res) => {
        this.studentScoreOptions.title.text = res.title;
        this.studentScoreOptions.labels = res.labels;
        this.studentScoreOptions.datasets = [];
        Object.keys(res.datasets).forEach((key) => {
          this.studentScoreOptions.datasets.push({
            label: key,
            data: res.datasets[key],
          });
        });
      });
    },
    handleListener() {
      bus.$on("collapse", this.handleBus);
      // 调用renderChart方法对图表进行重新渲染
      window.addEventListener("resize", this.renderChart);
    },
    handleBus(msg) {
      setTimeout(() => {
        this.renderChart();
      }, 200);
    },
    renderChart() {
      this.$refs.bar.renderChart();
      this.$refs.line.renderChart();
    },
  },
};
</script>

<style scoped>
.is-selected {
  color: #1989fa;
}
.el-row {
  margin-bottom: 20px;
}

.grid-content {
  display: flex;
  align-items: center;
  height: 100px;
}

.grid-cont-right {
  flex: 1;
  text-align: center;
  font-size: 14px;
  color: #999;
}

.grid-num {
  font-size: 30px;
  font-weight: bold;
}

.grid-con-icon {
  font-size: 50px;
  width: 100px;
  height: 100px;
  text-align: center;
  line-height: 100px;
  color: #fff;
}

.grid-con-1 .grid-con-icon {
  background: rgb(45, 140, 240);
}

.grid-con-1 .grid-num {
  color: rgb(45, 140, 240);
}

.grid-con-2 .grid-con-icon {
  background: rgb(100, 213, 114);
}

.grid-con-2 .grid-num {
  color: rgb(45, 140, 240);
}

.grid-con-3 .grid-con-icon {
  background: rgb(242, 94, 67);
}

.grid-con-3 .grid-num {
  color: rgb(242, 94, 67);
}

.user-info {
  display: flex;
  align-items: center;
  padding-bottom: 20px;
  border-bottom: 2px solid #ccc;
  margin-bottom: 20px;
}

.user-avator {
  width: 120px;
  height: 120px;
  border-radius: 50%;
}

.user-info-cont {
  padding-left: 50px;
  flex: 1;
  font-size: 14px;
  color: #999;
}

.user-info-cont div:first-child {
  font-size: 30px;
  color: #222;
}

.user-info-list {
  font-size: 14px;
  color: #999;
  line-height: 25px;
}

.user-info-list span {
  margin-left: 70px;
}

.mgb20 {
  margin-bottom: 20px;
}

.todo-item {
  font-size: 14px;
}

.todo-item-del {
  text-decoration: line-through;
  color: #999;
}

.schart {
  width: 100%;
  height: 300px;
}
</style>
