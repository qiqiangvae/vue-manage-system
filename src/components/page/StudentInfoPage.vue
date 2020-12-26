<template>
  <div class="dashboard-context">
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card shadow="hover">
          {{ studentInfo.studentName }}
          {{ studentInfo.gender }}
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="hover">
          <schart
            ref="score"
            class="schart"
            canvasId="line"
            :options="studentScoreOptions"
          ></schart>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import Schart from "vue-schart";
import { findStudentScore } from "../../api/studentExamScore";
import bus from "../common/bus";
export default {
  components: {
    Schart,
  },
  data() {
    return {
      studentId: this.$route.query.id,
      studentInfo: {
        studentName: "安琪拉",
        gender: "女",
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
  created() {
    this.handleListener();
    this.getStudentScoreHistogram();
  },
  activated() {
    this.handleListener();
  },
  methods: {
    getStudentScoreHistogram() {
      findStudentScore({ id: this.studentId }).then((res) => {
        console.log(res);
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
      this.$refs.score.renderChart();
    },
  },
};
</script>
<style scoped>
.schart {
  width: 100%;
  height: 300px;
}
</style>
