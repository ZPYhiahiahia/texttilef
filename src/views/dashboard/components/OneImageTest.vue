<template>
  <div style="width: 100%">
    <div class="left_part" style="width: 40%;float: left;margin-left: 5%;margin-top: 10px">
      <el-form
        ref="form"
        :model="form"
        label-width="100px"
        :rules="rules"
        style="width: 80%"
      >
        <el-switch
          v-model="value"
          active-color="#005ad6"
          inactive-color="#005ad6"
          active-text="上传图片"
          inactive-text="输入图名"
          active-value="upload"
          inactive-value="input"
          :width="40"
          disabled
        />
        <br><br>
        <el-form-item
          v-if="value === 'upload'"
          label="上传图片"
          prop="image"
        >
          <el-upload
            class="upload-demo"
            action="https://jsonplaceholder.typicode.com/posts/"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :before-remove="beforeRemove"
            multiple
            :limit="3"
            :on-exceed="handleExceed"
            :file-list="fileList"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>
        <el-form-item
          v-if="value === 'input'"
          label="输入图名"
          prop="imagename"
        >
          <el-input
            v-model="form.imagename"
            placeholder="默认从数据集中随机选取"
            clearable
          />
        </el-form-item>
        <el-form-item label="选择数据集" prop="datasetsname">
          <el-select v-model="form.datasetsname" placeholder="请选择数据集">
            <el-option
              v-for="(datasetname,index) in datasetnames"
              :key="index"
              :label="datasetname"
              :value="datasetname"
            >
              <span style="float: left">{{ datasetname }}</span>
              <!--              <span style="float: right; color: #8492a6; font-size: 13px">{{ datasetsize }}</span>-->
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选择提取器" prop="extractorname">
          <el-select v-model="form.extractorname" placeholder="请选择提取器">
            <el-option
              v-for="(item,index) in extractorsnames"
              :key="index"
              :label="item"
              :value="item"
            >
              <span style="float: left">{{ item }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选择特征库" prop="fearturesdbnames">
          <el-select v-model="form.fearturesdbnames" placeholder="请选择特征库" :disabled="featuresselectdisabled">
            <el-option
              v-for="(item,index) in featuresdbnames"
              :key="index"
              :label="item.name"
              :value="item.name"
            >
              <span>{{ item.name }}</span>
              <span style="float: left">{{ item['feturedbname'] }}</span>
              <span v-if="item.isNowdataset" style="float: right; color: greenyellow; font-size: 10px">👌</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="info" :plain="true" round @click="submit">GO！</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="right_part" style="width: 50%;margin-left: 10px;float: right;padding: 10px">
      <div v-if="showlist.length !== 0" style="width: 83%">
        <div style="text-align: center"><span style="text-align: center;color: #222222">mAP : {{ mAPnum }}</span></div>
        <el-divider v-if="showlist.length !== 0" />
      </div>
      <div v-if="showlist.length !== 0" style="width: 83%">
        <div style="text-align: center">
          <el-image :src="srcimg"/>
        </div>

      </div>

      <br>
      <el-row v-for="(row, index) in showlist" :key="index" :gutter="10" justify="space-evenly">
        <el-col v-for="(imgsrc,index) in row" :key="index" :span="24 / (row.length+1)">
          <el-image :src="imgsrc" />
        </el-col>
      </el-row>
      <el-divider v-if="showlist.length !== 0" />
      <br>
    </div>
  </div>
</template>

<script>
import { get_dataset_status, get_extractor_status, get_feartures_db_status, test_top10 } from '@/api/server'

export default {
  name: 'OneImageTest',
  data() {
    return {
      SHOWCOLNUM: 5,
      value: 'input',
      datasetnames: [],
      extractorsnames: [],
      featuresdata: {},
      mAPnum: undefined,
      srcimg: '',
      showlist: [],
      imglist: [],
      form: {
        imagename: '',
        datasetsname: '',
        extractorname: '',
        fearturesdbnames: ''
      },
      rules: {
        imagename: [
          { required: false, message: '请输入图片名', trigger: 'blur' },
          { min: 0, max: 50, message: '长度在 0 到 50 个字符', trigger: 'blur' }
        ],
        datasetsname: [
          { required: true, message: '请选择数据集', trigger: 'change' }
        ],
        extractorname: [
          { required: true, message: '请选择提取器', trigger: 'change' }
        ],
        fearturesdbnames: [
          { required: true, message: '请选择特征库', trigger: 'change' }
        ]
      }
    }
  },
  computed: {
    featuresselectdisabled() {
      return this.form.extractorname === ''
    },
    featuresdbnames() {
      if (this.form.extractorname === '') {
        return []
      }
      var featuresdbnames = []
      for (let i = 0; i < this.datasetnames.length; i++) {
        if (this.datasetnames[i] in this.featuresdata && this.form.extractorname in this.featuresdata[this.datasetnames[i]]) {
          featuresdbnames.push({
            name: `${this.datasetnames[i]}_${this.form.extractorname}`,
            isNowdataset: this.datasetnames[i] === this.form.datasetsname
          })
        }
      }
      return featuresdbnames
    }
  },
  created() {
    this.setform()
  },
  methods: {
    setform() {
      Promise.all([
        get_dataset_status(),
        get_extractor_status(),
        get_feartures_db_status()
      ]).then(res => {
        this.datasetnames = res[0].data.datasets
        this.extractorsnames = res[1].data.extractors
        this.featuresdata = res[2].data.features_db
        // 同一个提取器不同数据集勉强能用，不同提取器完全不能用
        // 所以这里只看同一个提取器的featuresdb
      })
    },
    submit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          test_top10(JSON.stringify({
            'datasetsname': this.form.datasetsname.toString(),
            'extractorname': this.form.extractorname.toString(),
            'fearturesdbnames': this.form.fearturesdbnames.toString(),
            'imagename': this.form.imagename.toString()
          })).then(res => {
            this.showlist = []
            this.imglist = []
            this.mAPnum = 0
            this.srcimg = ''
            this.$message({
              message: '测试成功',
              type: 'success'
            })
            this.srcimg = 'http://172.21.72.185:8886/api/imagehost/?imgpath=' + res.data.src
            this.mAPnum = res.data.mAP
            for (let i = 0; i < res.data.top10.length; i++) {
              this.imglist.push('http://172.21.72.185:8886/api/imagehost/?imgpath=' + res.data.top10[i])
            }
            for (let i = 0; i < this.imglist.length;) {
              var collist = []
              for (let j = 0; j < this.SHOWCOLNUM; j++, i++) {
                collist.push(this.imglist[i])
                if (i >= this.imglist.length) {
                  this.showlist.push(collist)
                  break
                }
              }
              this.showlist.push(collist)
            }
            console.log(this.showlist)
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
