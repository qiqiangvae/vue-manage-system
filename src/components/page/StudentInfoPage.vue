<template>
  <div class="dashboard-context">
    <el-row :gutter="20">
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
      <el-col :span="12"></el-col>
    </el-row>
  </div>
</template>
<script>
import Schart from "vue-schart";
import { findStudentScore } from "../../api/studentExamScore";
export default {
  components: {
    Schart,
  },
  data() {
    return {
      studentId: this.$route.query.id,
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
    this.getStudentScoreHistogram();
  },
  methods: {
    getStudentScoreHistogram() {
      findStudentScore().then((res) => {
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
  },
};
</script>
<style scoped>
.schart {
  width: 100%;
  height: 300px;
}
</style>
