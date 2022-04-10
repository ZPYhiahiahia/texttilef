<template>
  <div style="width: 90%">
    <el-table
      :data="tabledata"
      border
      style="width: 100%"
    >
      <el-table-column
        type="index"
        :index="indexMethod"
        :width="150"
        :show-overflow-tooltip="true"
      ></el-table-column>
      />
      <el-table-column
        v-for="(extractor, index) in extractors"
        :key="index"
        :prop="extractor"
        :label="extractor.split('_')[0]"
        align="center"
        :show-overflow-tooltip="true"
      >
        <template slot-scope="scope">
          <div v-if="scope.row[extractor] === 'true'">
            <span style="color: green;font-weight:bolder;font-size: large">✔</span>
          </div>
          <div v-if="scope.row[extractor] === 'false'">
            <span>❌</span>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { get_dataset_status, get_extractor_status, get_feartures_db_status } from '@/api/server'

export default {
  name: 'FeaturesdbTable',
  data() {
    return {
      featuresdata: {},
      extractors: [],
      datasets: [],
      tabledata: []
    }
  },
  created() {
    this.getTableAll()
  },
  methods: {
    indexMethod(index) {
      return this.datasets[index]
    },
    getTableAll() {
      Promise.all([get_dataset_status(), get_extractor_status(), get_feartures_db_status()]).then(res => {
        this.datasets = res[0].data.datasets
        this.extractors = res[1].data.extractors
        this.featuresdata = res[2].data.features_db
        this.tabledata = []
        for (let i = 0; i < this.datasets.length; i++) {
          var datasetdict = {}
          for (let j = 0; j < this.extractors.length; j++) {
            if (this.datasets[i] in this.featuresdata) {
              if (this.extractors[j] in this.featuresdata[this.datasets[i]]) {
                datasetdict[this.extractors[j]] = 'true'
                continue
              }
            }
            datasetdict[this.extractors[j]] = 'false'
          }
          this.tabledata.push(datasetdict)
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
