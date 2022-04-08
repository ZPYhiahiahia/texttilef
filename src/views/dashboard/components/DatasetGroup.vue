<template>
  <div>
    <el-checkbox-group
      v-model="datasets_checked"
      :max="1"
      style="text-align: center;">
    >
      <el-checkbox
        v-for="(dataset, index) in datasets"
        :key="index"
        :label="dataset"
        @change="handleChange()"
      >
        {{ dataset }}
      </el-checkbox>
    </el-checkbox-group>
  </div>
</template>

<script>
import { get_dataset_status } from '@/api/server'

export default {
  name: 'ExtractorGroup',
  data() {
    return {
      datasets_checked: [],
      datasets: []
    }
  },
  methods: {
    handleChange() {
      this.$emit('setDatasetsSetting', this.datasets_checked)
    },
    setDatasets() {
      get_dataset_status().then(response => {
        this.datasets = response.data.datasets
      })
    }
  },
  created() {
    this.setDatasets()
  }
}
</script>

<style scoped>

</style>
