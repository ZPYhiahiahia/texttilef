<template>
  <div>
    <div style="text-align: center; margin-top: 10px">
      <el-button style="text-align: center" @click="stop">停止更新</el-button>
    </div>
    <el-row :gutter="40" class="panel-group">
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel">
          <el-card>
            <div style="text-align: center">
              <el-progress type="dashboard" :color="colors" :percentage="m_p" :format="formatm" />
            </div>
          </el-card>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel">
          <el-card>
            <div style="text-align: center">
              <el-progress type="dashboard" :color="colors" :percentage="c_p" :format="formatc" />
            </div>
          </el-card>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel">
          <el-card>
            <div style="text-align: center">
              <el-progress type="dashboard" :color="colors" :percentage="g_p" :format="formatg" />
            </div>
          </el-card>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <el-card>
          <div style="text-align: center">
            <el-progress type="dashboard" :color="colors" :percentage="gm_p" :format="formatgm" />
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>

import { get_status } from '@/api/server'

export default {
  name: 'PanelGroup',
  props: {
    title: {
      type: String,
      default: 'Panel Group'
    }
  },
  data() {
    return {
      st: undefined,
      m_p: 0,
      c_p: 0,
      g_p: 0,
      gm_p: 0,
      customColor: '#409eff',
      colors: [
        { color: '#f56c6c', percentage: 100 },
        { color: '#e6a23c', percentage: 80 },
        { color: '#5cb87a', percentage: 60 },
        { color: '#1989fa', percentage: 40 },
        { color: '#6f7ad3', percentage: 20 }
      ],
      dashinterval: undefined
    }
  },
  created() {
    this.interval()
  },
  destroyed() {
    clearInterval(this.dashinterval)
  },
  methods: {
    get_status() {
      get_status().then(res => {
        this.st = res.data
        this.m_p = parseInt(this.st.memory_percent)
        this.c_p = parseInt(this.st.cpu_percent)
        this.g_p = parseInt(this.st.gpu_utilization)
        this.gm_p = parseInt(this.st.gpu_memory_utilization)
      })
    },
    formatm(percentage) {
      return `内存:${percentage}%`
    },
    formatg(percentage) {
      return `GPU:${percentage}%`
    },
    formatc(percentage) {
      return `CPU:${percentage}%`
    },
    formatgm(percentage) {
      return `GPU内存:${percentage}%`
    },
    interval() {
      this.dashinterval = setInterval(() => {
        this.get_status()
      }, 500)
    },
    stop() {
      clearInterval(this.dashinterval)
    }
  }
}
</script>

<style lang="scss" scoped>
.panel-group {
  margin-top: 20px;
}
</style>
