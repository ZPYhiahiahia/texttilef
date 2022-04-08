<template>
  <div class="progress-group" style="width: 90%;text-align: center">
    <ul>
      <li
        v-for="(value,key,index) in progress"
        :key="index"
        style="list-style: none"
      >
        <el-row :gutter="20">
          <el-col :span="8">
            <span>{{ `${key} : ` }}</span>
          </el-col>
          <el-col :span="12">
            <el-progress :text-inside="true" :stroke-width="24" :percentage="parseInt(value)" :format="formatprogress" />
          </el-col>
        </el-row>
        <br>
      </li>
    </ul>
  </div>
</template>

<script>
import { get_progress_status } from '@/api/server'

export default {
  name: 'ProgressGroup',
  data() {
    return {
      progress: {},
      progressinterval: undefined
    }
  },
  methods: {
    setProgress() {
      get_progress_status().then(res => {
        this.progress = res.data.progress
      })
    },
    formatprogress(persentage) {
      return `${persentage}%`
    },
    interval() {
      this.progressinterval = setInterval(() => {
        this.setProgress()
      }, 2000)
    }
  },
  created() {
    this.interval()
  },
  destroyed() {
    clearInterval(this.progressinterval)
  }
}
</script>

<style scoped>

</style>
