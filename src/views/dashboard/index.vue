<template>
  <div class="dashboard-container">
    <el-image src="http://172.21.72.185:8886/api/test1">

    </el-image>
    <panel-group />
    <el-divider>
      <i class="el-icon-star-on" />
      <span>extractors</span>
      <i class="el-icon-star-on" />
    </el-divider>
    <extractor-group @setExtractorsSetting="setExtractorsSetting" />
    <br>
    <el-divider>
      <i class="el-icon-star-on" />
      <span>datasets</span>
      <i class="el-icon-star-on" />
    </el-divider>
    <dataset-group @setDatasetsSetting="setDatasetsSetting" />
    <br>
    <el-divider>
      <i class="el-icon-star-on" />
      <span>operate</span>
      <i class="el-icon-star-on" />
    </el-divider>
    <div>
      <el-button type="info" :plain="true" round @click="build_featuredb">build featuresdb</el-button>
    </div>
    <br>
    <el-divider>
      <i class="el-icon-star-on" />
      <span>progress</span>
      <i class="el-icon-star-on" />
    </el-divider>
    <progress-group />
    <br>
    <el-divider>
      <i class="el-icon-star-on" />
      <span>features_db</span>
      <i class="el-icon-star-on" />
    </el-divider>
    <featuresdb-table />
    <br>
    <el-divider>
      <i class="el-icon-star-on" />
      <span style="color: chocolate">test area</span>
      <i class="el-icon-star-on" />
    </el-divider>
    <br>
    <el-divider>
      <i class="el-icon-star-on" />
      <span>one image test</span>
      <i class="el-icon-star-on" />
    </el-divider>
    <br><br>
    <one-image-test />
  </div>
</template>

<script>
import PanelGroup from '@/views/dashboard/components/PanelGroup'
import ExtractorGroup from '@/views/dashboard/components/ExtractorGroup'
import DatasetGroup from '@/views/dashboard/components/DatasetGroup'
import FeaturesdbTable from '@/views/dashboard/components/FeaturesdbTable'
import ProgressGroup from '@/views/dashboard/components/ProgressGroup'
import { build_features_db } from '@/api/server'
import OneImageTest from '@/views/dashboard/components/OneImageTest'
export default {
  name: 'Dashboard',
  components: { PanelGroup, ExtractorGroup, DatasetGroup, FeaturesdbTable, ProgressGroup, OneImageTest },
  data() {
    return {
      currentRole: 'adminDashboard',
      extractors: [],
      datasets: []
    }
  },
  computed: {

  },
  methods: {
    setDatasetsSetting(data) {
      this.datasets = data
    },
    setExtractorsSetting(data) {
      this.extractors = data
    },
    build_featuredb() {
      if (this.extractors.length === 0) {
        this.$message.error('请选择至少一个抽取器')
        return
      }
      if (this.datasets.length === 0) {
        this.$message.error('请选择至少一个数据集')
        return
      }
      build_features_db({
        'datasetname': this.datasets[0],
        'extractorname': this.extractors[0]
      }).then(res => {
        console.log(res)
        this.$message.success('开始构建特征库 ')
      }).catch(err => {
        console.log(err)
        this.$message.error('请求出错')
      })
    }
  }
}
</script>

<style>
.dashboard-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
