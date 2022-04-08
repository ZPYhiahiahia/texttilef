<template>
  <div>
    <el-checkbox-group
      v-model="extractors_checked"
      :max="1"
      style="text-align: center;"
    >
      <el-checkbox
        v-for="(extractor, index) in extractors"
        :key="index"
        :label="extractor"
        @change="handleChange()"
      >
        {{ extractor.split('_')[0] }}
      </el-checkbox>
    </el-checkbox-group>
  </div>
</template>

<script>
import { get_extractor_status } from '@/api/server'

export default {
  name: 'ExtractorGroup',
  data() {
    return {
      extractors_checked: [],
      extractors: []
    }
  },
  methods: {
    handleChange() {
      this.$emit('setExtractorsSetting', this.extractors_checked)
    },
    setExtractors() {
      get_extractor_status().then(response => {
        this.extractors = response.data.extractors
      })
    }
  },
  created() {
    this.setExtractors()
  }
}
</script>

<style scoped>

</style>
