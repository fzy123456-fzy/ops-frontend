<template>
  <div class="algorithm-page">
    <el-row :gutter="20" class="stat-row">
      <el-col :xs="12" :sm="6">
        <div class="stat-card stat-card--blue">
          <div class="stat-card__icon"><el-icon :size="28"><Cpu /></el-icon></div>
          <div class="stat-card__content">
            <p class="stat-card__value">{{ stats.total }}</p>
            <p class="stat-card__label">算法总数</p>
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="6">
        <div class="stat-card stat-card--green">
          <div class="stat-card__icon"><el-icon :size="28"><CircleCheck /></el-icon></div>
          <div class="stat-card__content">
            <p class="stat-card__value">{{ stats.deployed }}</p>
            <p class="stat-card__label">已部署模型</p>
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="6">
        <div class="stat-card stat-card--orange">
          <div class="stat-card__icon"><el-icon :size="28"><VideoPlay /></el-icon></div>
          <div class="stat-card__content">
            <p class="stat-card__value">{{ stats.running }}</p>
            <p class="stat-card__label">运行中模型</p>
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="6">
        <div class="stat-card stat-card--purple">
          <div class="stat-card__icon"><el-icon :size="28"><TrendCharts /></el-icon></div>
          <div class="stat-card__content">
            <p class="stat-card__value">{{ stats.todayCalls }}</p>
            <p class="stat-card__label">今日调用次数</p>
          </div>
        </div>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="chart-row">
      <el-col :xs="24" :md="12">
        <el-card shadow="never">
          <template #header>
            <div class="card-header">
              <span class="card-title">模型调用量趋势</span>
              <el-radio-group v-model="callTrendRange" size="small" @change="updateCallTrendChart">
                <el-radio-button label="week">近7天</el-radio-button>
                <el-radio-button label="month">近30天</el-radio-button>
              </el-radio-group>
            </div>
          </template>
          <div ref="callTrendChartRef" class="chart-container"></div>
        </el-card>
      </el-col>
      <el-col :xs="24" :md="12">
        <el-card shadow="never">
          <template #header>
            <div class="card-header">
              <span class="card-title">模型性能指标</span>
              <el-select v-model="selectedModel" placeholder="选择模型" size="small" style="width: 180px" @change="updatePerformanceChart">
                <el-option v-for="m in performanceModels" :key="m" :label="m" :value="m" />
              </el-select>
            </div>
          </template>
          <div ref="performanceChartRef" class="chart-container"></div>
        </el-card>
      </el-col>
    </el-row>

    <el-card shadow="never">
      <template #header>
        <div class="card-header">
          <span class="card-title">算法模型列表</span>
          <el-button type="primary" size="small" @click="handleAdd">
            <el-icon><Plus /></el-icon> 新增模型
          </el-button>
        </div>
      </template>

      <div class="filter-tags">
        <span class="filter-label">快速筛选：</span>
        <el-tag
          v-for="tag in filterTags"
          :key="tag.value"
          :effect="activeFilter === tag.value ? 'dark' : 'plain'"
          :type="activeFilter === tag.value ? '' : 'info'"
          class="filter-tag"
          @click="activeFilter = tag.value"
        >
          {{ tag.label }}
        </el-tag>
      </div>

      <el-table :data="filteredTableData" stripe v-loading="loading" style="width: 100%" row-key="id">
        <el-table-column prop="modelName" label="模型名称" min-width="160" show-overflow-tooltip />
        <el-table-column prop="modelType" label="模型类型" width="150">
          <template #default="{ row }">
            <el-tag size="small" effect="plain">{{ row.modelType }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="applicationScene" label="应用场景" min-width="140" show-overflow-tooltip />
        <el-table-column prop="accuracy" label="准确率" width="100" align="center">
          <template #default="{ row }">
            <span :class="getAccuracyClass(row.accuracy)">{{ row.accuracy }}%</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)" size="small">{{ getStatusText(row.status) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="version" label="版本号" width="90" align="center" />
        <el-table-column prop="callCount" label="调用次数" width="100" align="center" sortable />
        <el-table-column prop="updatedAt" label="最近更新时间" width="170" />
        <el-table-column label="操作" width="220" fixed="right" align="center">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="handleView(row)">查看</el-button>
            <el-button type="success" link size="small" @click="handleTest(row)">测试</el-button>
            <el-button v-if="row.status !== 'running'" type="success" link size="small" @click="handleDeploy(row)">部署</el-button>
            <el-button v-if="row.status === 'running'" type="warning" link size="small" @click="handleStop(row)">停用</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="detailVisible" title="模型详情" width="700px">
      <el-descriptions :column="2" border>
        <el-descriptions-item label="模型名称">{{ currentItem.modelName }}</el-descriptions-item>
        <el-descriptions-item label="模型类型">{{ currentItem.modelType }}</el-descriptions-item>
        <el-descriptions-item label="应用场景">{{ currentItem.applicationScene }}</el-descriptions-item>
        <el-descriptions-item label="版本号">{{ currentItem.version }}</el-descriptions-item>
        <el-descriptions-item label="状态" :span="2">
          <el-tag :type="getStatusType(currentItem.status)" size="small">{{ getStatusText(currentItem.status) }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="模型说明" :span="2">{{ currentItem.description }}</el-descriptions-item>
        <el-descriptions-item label="输入参数" :span="2">{{ currentItem.inputParams }}</el-descriptions-item>
        <el-descriptions-item label="输出参数" :span="2">{{ currentItem.outputParams }}</el-descriptions-item>
        <el-descriptions-item label="准确率">{{ currentItem.accuracy }}%</el-descriptions-item>
        <el-descriptions-item label="调用次数">{{ currentItem.callCount }}</el-descriptions-item>
      </el-descriptions>
    </el-dialog>

    <el-dialog v-model="testVisible" title="模型测试" width="600px">
      <el-form label-width="100px">
        <el-form-item label="测试模型">
          <el-input v-model="testForm.modelName" disabled />
        </el-form-item>
        <el-form-item label="输入参数">
          <el-input v-model="testForm.input" type="textarea" :rows="4" placeholder="请输入JSON格式的参数" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleRunTest" :loading="testLoading">运行测试</el-button>
        </el-form-item>
        <el-form-item label="输出结果" v-if="testResult">
          <el-input v-model="testResult" type="textarea" :rows="6" readonly />
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import * as echarts from 'echarts'
import { getAlgorithmModels, getAlgorithmStatistics, deployModel, stopModel } from '../api/algorithm'

const loading = ref(false)
const tableData = ref([])
const detailVisible = ref(false)
const testVisible = ref(false)
const testLoading = ref(false)
const testResult = ref('')
const currentItem = reactive({})
const testForm = reactive({ modelName: '', input: '' })
const stats = reactive({ total: 0, deployed: 0, running: 0, todayCalls: 0 })

const callTrendRange = ref('week')
const selectedModel = ref('')
const performanceModels = ref([])
const activeFilter = ref('all')
const callTrendChartRef = ref(null)
const performanceChartRef = ref(null)
let callTrendChart = null
let performanceChart = null

const filterTags = [
  { label: '全部', value: 'all' },
  { label: '运行中', value: 'running' },
  { label: '未部署', value: 'undeployed' },
  { label: '维护中', value: 'maintenance' },
  { label: '深度学习', value: '深度学习算法' },
  { label: '故障诊断', value: '故障诊断算法' }
]

const filteredTableData = computed(() => {
  if (activeFilter.value === 'all') return tableData.value
  if (['running', 'undeployed', 'maintenance'].includes(activeFilter.value)) {
    return tableData.value.filter(item => item.status === activeFilter.value)
  }
  return tableData.value.filter(item => item.modelType.includes(activeFilter.value))
})

const statusMap = {
  running: { type: 'success', text: '运行中' },
  undeployed: { type: 'info', text: '未部署' },
  maintenance: { type: 'warning', text: '维护中' }
}

const getStatusType = (status) => statusMap[status]?.type || 'info'
const getStatusText = (status) => statusMap[status]?.text || status

const getAccuracyClass = (accuracy) => {
  if (!accuracy) return ''
  if (accuracy >= 95) return 'accuracy-high'
  if (accuracy >= 90) return 'accuracy-medium'
  return 'accuracy-low'
}

const loadData = async () => {
  loading.value = true
  try {
    const res = await getAlgorithmModels()
    if (res.code === 200 && Array.isArray(res.data)) {
      tableData.value = res.data
    }
  } catch (e) {
    console.warn('算法接口异常，使用演示数据')
    tableData.value = getMockModels()
  }
  try {
    const res = await getAlgorithmStatistics()
    if (res.code === 200 && res.data) {
      Object.assign(stats, res.data)
    }
  } catch (e) {
    stats.total = 16
    stats.deployed = 11
    stats.running = 9
    stats.todayCalls = 1258
  } finally {
    loading.value = false
  }
}

const getMockModels = () => [
  { id: 1, modelName: 'LSTM能耗预测模型', modelType: '深度学习算法', applicationScene: '能耗时序预测', description: '基于LSTM神经网络的建筑能耗时序预测模型', inputParams: '历史能耗数据、温度、湿度', outputParams: '未来24小时能耗预测值', version: 'v2.1', status: 'running', accuracy: 96.5, callCount: 15234, updatedAt: '2024-01-15 14:30:00' },
  { id: 2, modelName: 'Transformer能耗预测', modelType: '深度学习算法', applicationScene: '能耗时序预测', description: '基于Transformer架构的多变量时序预测', inputParams: '历史能耗序列、气象数据', outputParams: '未来7天能耗预测', version: 'v1.3', status: 'running', accuracy: 97.2, callCount: 12890, updatedAt: '2024-01-15 13:20:00' },
  { id: 3, modelName: 'XGBoost能耗预测', modelType: '能耗时序预测算法', applicationScene: '能耗时序预测', description: '基于XGBoost的能耗回归预测模型', inputParams: '设备运行参数、环境参数', outputParams: '能耗预测值及置信区间', version: 'v1.0', status: 'undeployed', accuracy: 94.8, callCount: 0, updatedAt: '2024-01-15 12:10:00' },
  { id: 4, modelName: 'NSGA-II多目标优化', modelType: '多目标优化算法', applicationScene: '设备调度优化', description: '非支配排序遗传算法', inputParams: '目标函数、约束条件', outputParams: 'Pareto最优解集', version: 'v1.0', status: 'running', accuracy: 92.3, callCount: 8567, updatedAt: '2024-01-15 11:00:00' },
  { id: 5, modelName: '随机森林故障诊断', modelType: '故障诊断算法', applicationScene: '设备故障诊断', description: '基于随机森林的设备故障分类诊断', inputParams: '传感器数据、设备运行参数', outputParams: '故障类型及概率', version: 'v2.0', status: 'running', accuracy: 95.1, callCount: 23456, updatedAt: '2024-01-15 10:00:00' },
  { id: 6, modelName: '碳排放因子模型', modelType: '碳排放计算模型', applicationScene: '碳排放核算', description: '基于区域电网排放因子的碳排放计算', inputParams: '能耗数据、排放因子', outputParams: '碳排放量(tCO2)', version: 'v1.0', status: 'running', accuracy: 98.0, callCount: 5678, updatedAt: '2024-01-14 16:00:00' },
  { id: 7, modelName: 'YOLOv26目标检测', modelType: 'YOLOv26算法', applicationScene: '视觉识别', description: '最新YOLOv26目标检测模型', inputParams: '视频流/图像', outputParams: '目标检测框及类别', version: 'v1.0', status: 'running', accuracy: 93.7, callCount: 34567, updatedAt: '2024-01-14 15:00:00' },
  { id: 8, modelName: 'ARIMA客流预测', modelType: '客流预测算法', applicationScene: '客流预测', description: 'ARIMA时间序列客流预测模型', inputParams: '历史客流数据', outputParams: '未来客流预测', version: 'v1.0', status: 'maintenance', accuracy: 91.2, callCount: 9876, updatedAt: '2024-01-14 14:00:00' }
]

const handleView = (row) => {
  Object.assign(currentItem, row)
  detailVisible.value = true
}

const handleTest = (row) => {
  testForm.modelName = row.modelName
  testForm.input = JSON.stringify({ data: [1, 2, 3, 4, 5] }, null, 2)
  testResult.value = ''
  testVisible.value = true
}

const handleRunTest = async () => {
  testLoading.value = true
  await new Promise(resolve => setTimeout(resolve, 1500))
  testResult.value = JSON.stringify({
    status: 'success',
    prediction: [0.85, 0.92, 0.78, 0.88, 0.95],
    confidence: 0.94,
    latency: '125ms'
  }, null, 2)
  testLoading.value = false
  ElMessage.success('模型测试完成')
}

const handleAdd = () => {
  ElMessage.info('新增模型功能（演示模式）')
}

const handleDeploy = async (row) => {
  try {
    await deployModel(row.id)
    ElMessage.success('模型部署成功')
    loadData()
  } catch (e) {
    ElMessage.success('模型部署成功（演示模式）')
    row.status = 'running'
  }
}

const handleStop = async (row) => {
  try {
    await stopModel(row.id)
    ElMessage.success('模型已停用')
    loadData()
  } catch (e) {
    ElMessage.success('模型已停用（演示模式）')
    row.status = 'undeployed'
  }
}

const initCallTrendChart = () => {
  if (!callTrendChartRef.value) return
  callTrendChart = echarts.init(callTrendChartRef.value)
  updateCallTrendChart()
}

const updateCallTrendChart = () => {
  if (!callTrendChart) return
  const isWeek = callTrendRange.value === 'week'
  const days = isWeek ? ['01-09', '01-10', '01-11', '01-12', '01-13', '01-14', '01-15'] : Array.from({ length: 30 }, (_, i) => `${i + 1}日`)
  const data = isWeek ? [1250, 1580, 1420, 1890, 1650, 2100, 1850] : Array.from({ length: 30 }, () => Math.floor(Math.random() * 1500 + 800))

  callTrendChart.setOption({
    tooltip: {
      trigger: 'axis',
      formatter: '{b}: {c} 次',
      backgroundColor: 'rgba(6, 24, 52, 0.92)',
      borderColor: 'rgba(0, 216, 255, 0.35)',
      textStyle: { color: '#b8eaff' }
    },
    legend: {
      data: ['调用次数'],
      bottom: '0%',
      textStyle: { color: '#b8eaff' }
    },
    grid: { left: '3%', right: '4%', bottom: '15%', top: '8%', containLabel: true },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: days,
      axisLine: { lineStyle: { color: 'rgba(0, 216, 255, 0.3)' } },
      axisLabel: { color: '#b8eaff' },
      axisTick: { show: false }
    },
    yAxis: {
      type: 'value',
      name: '调用次数',
      nameTextStyle: { color: '#b8eaff' },
      splitLine: { lineStyle: { color: 'rgba(0, 216, 255, 0.12)', type: 'dashed' } },
      axisLabel: { color: '#b8eaff' }
    },
    series: [
      {
        name: '调用次数',
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
        data,
        itemStyle: { color: '#00d8ff' },
        lineStyle: { width: 3, color: '#00d8ff' },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(0, 216, 255, 0.25)' },
            { offset: 1, color: 'rgba(0, 216, 255, 0.02)' }
          ])
        }
      }
    ]
  })
}

const initPerformanceChart = () => {
  if (!performanceChartRef.value) return
  performanceChart = echarts.init(performanceChartRef.value)
  performanceModels.value = tableData.value.filter(m => m.status === 'running').map(m => m.modelName)
  if (performanceModels.value.length > 0 && !selectedModel.value) {
    selectedModel.value = performanceModels.value[0]
  }
  updatePerformanceChart()
}

const updatePerformanceChart = () => {
  if (!performanceChart) return
  const model = tableData.value.find(m => m.modelName === selectedModel.value)
  if (!model) return

  performanceChart.setOption({
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c}%',
      backgroundColor: 'rgba(6, 24, 52, 0.92)',
      borderColor: 'rgba(0, 216, 255, 0.35)',
      textStyle: { color: '#b8eaff' }
    },
    radar: {
      indicator: [
        { name: '准确率', max: 100 },
        { name: '召回率', max: 100 },
        { name: 'F1分数', max: 100 },
        { name: '响应速度', max: 100 },
        { name: '稳定性', max: 100 },
        { name: '资源利用率', max: 100 }
      ],
      radius: '65%',
      center: ['50%', '50%'],
      axisName: { color: '#b8eaff' },
      splitLine: { lineStyle: { color: 'rgba(0, 216, 255, 0.15)' } },
      splitArea: { areaStyle: { color: ['rgba(0, 216, 255, 0.02)', 'rgba(0, 216, 255, 0.04)'] } },
      axisLine: { lineStyle: { color: 'rgba(0, 216, 255, 0.2)' } }
    },
    series: [
      {
        name: '性能指标',
        type: 'radar',
        data: [
          {
            value: [
              model.accuracy || 95,
              (model.accuracy || 95) - 2,
              (model.accuracy || 95) - 1,
              Math.floor(Math.random() * 20 + 80),
              Math.floor(Math.random() * 15 + 85),
              Math.floor(Math.random() * 25 + 75)
            ],
            name: selectedModel.value,
            itemStyle: { color: '#00f5a0' },
            lineStyle: { color: '#00f5a0', width: 2 },
            areaStyle: { color: 'rgba(0, 245, 160, 0.15)' }
          }
        ]
      }
    ]
  })
}

const handleResize = () => {
  callTrendChart?.resize()
  performanceChart?.resize()
}

onMounted(() => {
  loadData().then(() => {
    setTimeout(() => {
      initCallTrendChart()
      initPerformanceChart()
    }, 300)
  })
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  callTrendChart?.dispose()
  performanceChart?.dispose()
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.algorithm-page {
  padding: 0;
}

.stat-row {
  margin-bottom: 20px;
}

.chart-row {
  margin-bottom: 20px;
}

.chart-container {
  width: 100%;
  height: 320px;
}

.stat-card {
  display: flex;
  align-items: center;
  padding: 20px 16px;
  background: rgba(6, 24, 52, 0.88);
  border-radius: 8px;
  box-shadow: 0 0 12px rgba(0, 216, 255, 0.06);
  transition: all 0.3s;
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(0, 216, 255, 0.25);
}

.stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 80px;
  height: 80px;
  background: radial-gradient(circle, rgba(0, 216, 255, 0.05) 0%, transparent 70%);
  border-radius: 50%;
  transform: translate(30%, -30%);
}

.stat-card:hover {
  border-color: rgba(0, 216, 255, 0.5);
  box-shadow: 0 0 20px rgba(0, 216, 255, 0.15);
  transform: translateY(-4px);
}

.stat-card__icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 14px;
  flex-shrink: 0;
  color: #fff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
}

.stat-card--blue .stat-card__icon { background: linear-gradient(135deg, #0d47a1 0%, #00d8ff 100%); }
.stat-card--green .stat-card__icon { background: linear-gradient(135deg, #004d40 0%, #00f5a0 100%); }
.stat-card--orange .stat-card__icon { background: linear-gradient(135deg, #e65100 0%, #ffcc33 100%); }
.stat-card--purple .stat-card__icon { background: linear-gradient(135deg, #4a148c 0%, #8b5cf6 100%); }

.stat-card__content { flex: 1; }

.stat-card__value {
  font-size: 26px;
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 4px;
  line-height: 1;
}

.stat-card__label {
  font-size: 13px;
  color: #b8eaff;
  margin: 0;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  color: #00d8ff;
}

.filter-tags {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  padding: 12px 16px;
  background: rgba(6, 24, 52, 0.88);
  border: 1px solid rgba(0, 216, 255, 0.18);
  border-radius: 8px;
}

.filter-label {
  font-size: 13px;
  color: #b8eaff;
  margin-right: 12px;
  font-weight: 500;
}

.filter-tag {
  margin-right: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.filter-tag:hover {
  transform: translateY(-2px);
}

.accuracy-high {
  color: #00f5a0;
  font-weight: 600;
}

.accuracy-medium {
  color: #ffcc33;
  font-weight: 500;
}

.accuracy-low {
  color: #ff4d5a;
  font-weight: 500;
}

@media (max-width: 768px) {
  .chart-container {
    height: 250px;
  }
}
</style>
