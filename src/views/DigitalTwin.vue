<template>
  <div class="digital-twin-page">
    <el-row :gutter="20" class="stat-row">
      <el-col :xs="12" :sm="6">
        <div class="stat-card stat-card--blue">
          <div class="stat-card__icon"><el-icon :size="28"><Connection /></el-icon></div>
          <div class="stat-card__content">
            <p class="stat-card__value">{{ stats.totalModules }}</p>
            <p class="stat-card__label">孪生模块数</p>
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="6">
        <div class="stat-card stat-card--green">
          <div class="stat-card__icon"><el-icon :size="28"><CircleCheck /></el-icon></div>
          <div class="stat-card__content">
            <p class="stat-card__value">{{ stats.activeModules }}</p>
            <p class="stat-card__label">活跃模块</p>
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="6">
        <div class="stat-card stat-card--orange">
          <div class="stat-card__icon"><el-icon :size="28"><Monitor /></el-icon></div>
          <div class="stat-card__content">
            <p class="stat-card__value">{{ stats.totalObjects }}</p>
            <p class="stat-card__label">孪生对象</p>
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="6">
        <div class="stat-card stat-card--purple">
          <div class="stat-card__icon"><el-icon :size="28"><Cpu /></el-icon></div>
          <div class="stat-card__content">
            <p class="stat-card__value">{{ stats.totalBoundDevices }}</p>
            <p class="stat-card__label">绑定设备</p>
          </div>
        </div>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="chart-row">
      <el-col :xs="24" :md="16">
        <el-card shadow="never">
          <template #header>
            <div class="card-header">
              <span class="card-title">3D场景预览</span>
              <el-radio-group v-model="sceneView" size="small" @change="updateSceneView">
                <el-radio-button label="overview">全景</el-radio-button>
                <el-radio-button label="building">建筑</el-radio-button>
                <el-radio-button label="equipment">设备</el-radio-button>
              </el-radio-group>
            </div>
          </template>
          <div ref="scene3DRef" class="scene-3d-container"></div>
        </el-card>
      </el-col>
      <el-col :xs="24" :md="8">
        <el-card shadow="never">
          <template #header>
            <div class="card-header">
              <span class="card-title">数据流监控</span>
              <el-tag size="small" type="success">实时</el-tag>
            </div>
          </template>
          <div ref="dataFlowRef" class="data-flow-container"></div>
          <div class="data-flow-stats">
            <el-row :gutter="10">
              <el-col :span="12">
                <div class="flow-stat">
                  <p class="flow-stat__value">{{ dataFlowRate }}</p>
                  <p class="flow-stat__label">数据速率 (条/秒)</p>
                </div>
              </el-col>
              <el-col :span="12">
                <div class="flow-stat">
                  <p class="flow-stat__value">{{ activeConnections }}</p>
                  <p class="flow-stat__label">活跃连接</p>
                </div>
              </el-col>
            </el-row>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-card shadow="never" style="margin-bottom: 20px">
      <template #header>
        <div class="card-header">
          <span class="card-title">孪生能力模块</span>
          <div class="filter-tags">
            <el-tag
              v-for="tag in moduleFilterTags"
              :key="tag.value"
              :effect="activeModuleFilter === tag.value ? 'dark' : 'plain'"
              :type="activeModuleFilter === tag.value ? '' : 'info'"
              class="filter-tag"
              @click="activeModuleFilter = tag.value"
            >
              {{ tag.label }}
            </el-tag>
          </div>
        </div>
      </template>
      <el-row :gutter="16">
        <el-col :xs="12" :sm="8" :md="6" v-for="item in filteredModules" :key="item.id">
          <div class="twin-module-card">
            <div class="module-header">
              <el-icon :size="20" class="module-icon"><Connection /></el-icon>
              <span class="module-name">{{ item.moduleName }}</span>
            </div>
            <p class="module-desc">{{ item.description }}</p>
            <p class="module-source">数据来源：{{ item.dataSource }}</p>
            <div class="module-footer">
              <el-tag :type="item.status === 'active' ? 'success' : 'info'" size="small">
                {{ item.status === 'active' ? '运行中' : '待接入' }}
              </el-tag>
              <el-tag size="small" effect="plain" class="module-type-tag">{{ item.twinType }}</el-tag>
            </div>
          </div>
        </el-col>
      </el-row>
    </el-card>

    <el-card shadow="never">
      <template #header>
        <div class="card-header">
          <span class="card-title">孪生对象列表</span>
          <el-button type="primary" size="small" @click="handleAddObject">
            <el-icon><Plus /></el-icon> 新增对象
          </el-button>
        </div>
      </template>

      <div class="filter-tags">
        <span class="filter-label">快速筛选：</span>
        <el-tag
          v-for="tag in objectFilterTags"
          :key="tag.value"
          :effect="activeObjectFilter === tag.value ? 'dark' : 'plain'"
          :type="activeObjectFilter === tag.value ? '' : 'info'"
          class="filter-tag"
          @click="activeObjectFilter = tag.value"
        >
          {{ tag.label }}
        </el-tag>
      </div>

      <el-table :data="filteredObjects" stripe v-loading="loading" style="width: 100%">
        <el-table-column prop="objectName" label="对象名称" min-width="150" show-overflow-tooltip />
        <el-table-column prop="objectType" label="对象类型" width="120">
          <template #default="{ row }">
            <el-tag size="small" effect="plain">{{ row.objectType }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="area" label="所属区域" width="120" />
        <el-table-column prop="boundDeviceCount" label="绑定设备数" width="110" align="center" sortable />
        <el-table-column prop="dataPoints" label="数据点数" width="100" align="center" />
        <el-table-column prop="twinStatus" label="孪生状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="row.twinStatus === 'active' ? 'success' : 'info'" size="small">
              {{ row.twinStatus === 'active' ? '已激活' : '未激活' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="updatedAt" label="更新时间" width="170" />
        <el-table-column label="操作" width="150" fixed="right" align="center">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="handleViewObject(row)">查看</el-button>
            <el-button type="success" link size="small" @click="handlePreview3D(row)">3D预览</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="preview3DVisible" title="3D预览" width="800px">
      <div ref="preview3DRef" class="preview-3d-container"></div>
      <div class="preview-info">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="对象名称">{{ previewObject.objectName }}</el-descriptions-item>
          <el-descriptions-item label="对象类型">{{ previewObject.objectType }}</el-descriptions-item>
          <el-descriptions-item label="所属区域">{{ previewObject.area }}</el-descriptions-item>
          <el-descriptions-item label="绑定设备数">{{ previewObject.boundDeviceCount }}</el-descriptions-item>
        </el-descriptions>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted, computed } from 'vue'
import { ElMessage } from 'element-plus'
import * as echarts from 'echarts'
import { getTwinModules, getTwinObjects, getTwinStatistics } from '../api/digitalTwin'

const loading = ref(false)
const modules = ref([])
const objects = ref([])
const stats = reactive({ totalModules: 0, activeModules: 0, totalObjects: 0, totalBoundDevices: 0 })

const sceneView = ref('overview')
const activeModuleFilter = ref('all')
const activeObjectFilter = ref('all')
const preview3DVisible = ref(false)
const previewObject = reactive({})
const dataFlowRate = ref(1250)
const activeConnections = ref(45)

const scene3DRef = ref(null)
const dataFlowRef = ref(null)
const preview3DRef = ref(null)
let scene3DChart = null
let dataFlowChart = null
let preview3DChart = null

const moduleFilterTags = [
  { label: '全部', value: 'all' },
  { label: '运行中', value: 'active' },
  { label: '待接入', value: 'pending' },
  { label: '几何孪生', value: '几何孪生' },
  { label: '语义孪生', value: '语义孪生' }
]

const objectFilterTags = [
  { label: '全部', value: 'all' },
  { label: '已激活', value: 'active' },
  { label: '未激活', value: 'inactive' },
  { label: '建筑', value: '建筑' },
  { label: '系统', value: '系统' }
]

const filteredModules = computed(() => {
  if (activeModuleFilter.value === 'all') return modules.value
  if (['active', 'pending'].includes(activeModuleFilter.value)) {
    return modules.value.filter(item => item.status === activeModuleFilter.value)
  }
  return modules.value.filter(item => item.twinType.includes(activeModuleFilter.value))
})

const filteredObjects = computed(() => {
  if (activeObjectFilter.value === 'all') return objects.value
  if (['active', 'inactive'].includes(activeObjectFilter.value)) {
    return objects.value.filter(item => item.twinStatus === activeObjectFilter.value)
  }
  return objects.value.filter(item => item.objectType.includes(activeObjectFilter.value))
})

const loadData = async () => {
  loading.value = true
  try {
    const res = await getTwinModules()
    if (res.code === 200 && Array.isArray(res.data)) modules.value = res.data
  } catch (e) {
    console.warn('数字孪生接口异常，使用演示数据')
    modules.value = getMockModules()
  }
  try {
    const res = await getTwinObjects()
    if (res.code === 200 && Array.isArray(res.data)) objects.value = res.data
  } catch (e) {
    objects.value = getMockObjects()
  }
  try {
    const res = await getTwinStatistics()
    if (res.code === 200 && res.data) Object.assign(stats, res.data)
  } catch (e) {
    stats.totalModules = 9
    stats.activeModules = 7
    stats.totalObjects = 12
    stats.totalBoundDevices = 45
  } finally {
    loading.value = false
  }
}

const getMockModules = () => [
  { id: 1, moduleName: '在线强化学习', twinType: '策略孪生', description: '基于强化学习的在线策略优化与训练', dataSource: '设备传感器、能耗数据', status: 'active' },
  { id: 2, moduleName: 'EnergyPlus/OpenStudio', twinType: '能碳孪生', description: '建筑能耗模拟与碳排放计算引擎', dataSource: '建筑模型、气象数据', status: 'active' },
  { id: 3, moduleName: '信息模型标准', twinType: '语义孪生', description: 'BIM/IFC标准建筑信息模型管理', dataSource: 'BIM模型库', status: 'active' },
  { id: 4, moduleName: '几何孪生', twinType: '几何孪生', description: '建筑三维几何模型与空间拓扑关系', dataSource: 'CAD/BIM模型', status: 'active' },
  { id: 5, moduleName: '语义孪生', twinType: '语义孪生', description: '设备语义关系与知识图谱构建', dataSource: '设备台账、运维知识库', status: 'active' },
  { id: 6, moduleName: '状态孪生', twinType: '状态孪生', description: '设备实时运行状态映射与监控', dataSource: 'IoT传感器数据', status: 'active' },
  { id: 7, moduleName: '行为孪生', twinType: '行为孪生', description: '设备行为模式识别与预测', dataSource: '历史运行数据', status: 'active' },
  { id: 8, moduleName: '策略孪生', twinType: '策略孪生', description: '运维策略仿真与优化评估', dataSource: '策略库、历史工单', status: 'pending' },
  { id: 9, moduleName: '能碳孪生', twinType: '能碳孪生', description: '能耗与碳排放数字孪生建模', dataSource: '能耗计量、碳排因子', status: 'pending' }
]

const getMockObjects = () => [
  { id: 1, objectName: 'A栋办公楼', objectType: '建筑', area: '园区A区', boundDeviceCount: 15, dataPoints: 1250, twinStatus: 'active', updatedAt: '2024-01-15 14:30:00' },
  { id: 2, objectName: 'B栋实验楼', objectType: '建筑', area: '园区B区', boundDeviceCount: 12, dataPoints: 980, twinStatus: 'active', updatedAt: '2024-01-15 14:25:00' },
  { id: 3, objectName: '中央空调系统', objectType: '系统', area: 'A栋', boundDeviceCount: 8, dataPoints: 650, twinStatus: 'active', updatedAt: '2024-01-15 14:20:00' },
  { id: 4, objectName: '配电系统', objectType: '系统', area: '全园区', boundDeviceCount: 6, dataPoints: 520, twinStatus: 'active', updatedAt: '2024-01-15 14:15:00' },
  { id: 5, objectName: '照明系统', objectType: '系统', area: 'A栋', boundDeviceCount: 4, dataPoints: 320, twinStatus: 'active', updatedAt: '2024-01-15 14:10:00' },
  { id: 6, objectName: '电梯系统', objectType: '设备组', area: 'B栋', boundDeviceCount: 3, dataPoints: 240, twinStatus: 'active', updatedAt: '2024-01-15 14:05:00' },
  { id: 7, objectName: '消防系统', objectType: '系统', area: '全园区', boundDeviceCount: 5, dataPoints: 410, twinStatus: 'inactive', updatedAt: '2024-01-15 14:00:00' },
  { id: 8, objectName: '给排水系统', objectType: '系统', area: 'A栋', boundDeviceCount: 4, dataPoints: 350, twinStatus: 'active', updatedAt: '2024-01-15 13:55:00' }
]

const handleAddObject = () => {
  ElMessage.info('新增孪生对象功能（演示模式）')
}

const handleViewObject = (row) => {
  Object.assign(previewObject, row)
  preview3DVisible.value = true
}

const handlePreview3D = (row) => {
  Object.assign(previewObject, row)
  preview3DVisible.value = true
  setTimeout(() => {
    if (preview3DRef.value && !preview3DChart) {
      preview3DChart = echarts.init(preview3DRef.value)
      preview3DChart.setOption({
        tooltip: { trigger: 'item' },
        xAxis: { show: false },
        yAxis: { show: false },
        grid: { top: 10, bottom: 10, left: 10, right: 10 },
        series: [
          {
            type: 'scatter',
            symbolSize: 20,
            data: Array.from({ length: 50 }, () => [Math.random() * 100, Math.random() * 100, Math.random() * 10]),
            itemStyle: { color: '#409EFF', opacity: 0.6 },
            emphasis: { itemStyle: { borderColor: '#fff', borderWidth: 2 } }
          },
          {
            type: 'effectScatter',
            symbolSize: 15,
            data: [[50, 50, 8]],
            itemStyle: { color: '#67C23A' },
            rippleEffect: { brushType: 'stroke', scale: 3 }
          }
        ]
      })
    }
  }, 300)
}

const initScene3D = () => {
  if (!scene3DRef.value) return
  scene3DChart = echarts.init(scene3DRef.value)
  updateSceneView()
}

const updateSceneView = () => {
  if (!scene3DChart) return
  const config = {
    overview: { color: '#409EFF', count: 80, title: '园区全景' },
    building: { color: '#67C23A', count: 50, title: '建筑视图' },
    equipment: { color: '#E6A23C', count: 120, title: '设备视图' }
  }
  const c = config[sceneView.value]
  scene3DChart.setOption({
    tooltip: { trigger: 'item', formatter: '{b}' },
    xAxis: { show: false, min: 0, max: 100 },
    yAxis: { show: false, min: 0, max: 100 },
    grid: { top: 10, bottom: 10, left: 10, right: 10 },
    series: [
      {
        name: c.title,
        type: 'scatter',
        symbolSize: (data) => Math.sqrt(data[2]) * 3,
        data: Array.from({ length: c.count }, () => [Math.random() * 90 + 5, Math.random() * 90 + 5, Math.random() * 20 + 5]),
        itemStyle: { color: c.color, opacity: 0.7 },
        emphasis: { itemStyle: { borderColor: '#fff', borderWidth: 2, opacity: 1 } }
      },
      {
        type: 'effectScatter',
        symbolSize: 12,
        data: Array.from({ length: 5 }, () => [Math.random() * 80 + 10, Math.random() * 80 + 10]),
        itemStyle: { color: '#F56C6C' },
        rippleEffect: { brushType: 'stroke', scale: 4 }
      }
    ],
    graphic: [
      {
        type: 'text',
        left: 'center',
        top: 'middle',
        style: { text: c.title, fill: 'rgba(0,0,0,0.15)', font: 'bold 48px sans-serif' }
      }
    ]
  })
}

const initDataFlow = () => {
  if (!dataFlowRef.value) return
  dataFlowChart = echarts.init(dataFlowRef.value)
  const hours = Array.from({ length: 24 }, (_, i) => `${i}:00`)
  dataFlowChart.setOption({
    tooltip: { trigger: 'axis', formatter: '{b}: {c} 条/秒' },
    grid: { top: 10, bottom: 30, left: 50, right: 10 },
    xAxis: { type: 'category', data: hours, axisLabel: { rotate: 45, fontSize: 10 } },
    yAxis: { type: 'value', name: '速率', nameTextStyle: { fontSize: 10 } },
    series: [
      {
        name: '数据速率',
        type: 'line',
        smooth: true,
        data: Array.from({ length: 24 }, () => Math.floor(Math.random() * 800 + 800)),
        itemStyle: { color: '#409EFF' },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(64,158,255,0.3)' },
            { offset: 1, color: 'rgba(64,158,255,0.05)' }
          ])
        }
      }
    ]
  })
}

const updateDataFlowStats = () => {
  setInterval(() => {
    dataFlowRate.value = Math.floor(Math.random() * 500 + 1000)
    activeConnections.value = Math.floor(Math.random() * 10 + 40)
  }, 3000)
}

const handleResize = () => {
  scene3DChart?.resize()
  dataFlowChart?.resize()
  preview3DChart?.resize()
}

onMounted(() => {
  loadData().then(() => {
    setTimeout(() => {
      initScene3D()
      initDataFlow()
      updateDataFlowStats()
    }, 300)
  })
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  scene3DChart?.dispose()
  dataFlowChart?.dispose()
  preview3DChart?.dispose()
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.digital-twin-page {
  padding: 0;
}

.stat-row {
  margin-bottom: 20px;
}

.chart-row {
  margin-bottom: 20px;
}

.scene-3d-container {
  width: 100%;
  height: 450px;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e8eb 100%);
  border-radius: 8px;
}

.data-flow-container {
  width: 100%;
  height: 250px;
}

.data-flow-stats {
  margin-top: 16px;
  padding: 12px;
  background: #f5f7fa;
  border-radius: 6px;
}

.flow-stat {
  text-align: center;
  padding: 8px;
}

.flow-stat__value {
  font-size: 24px;
  font-weight: 700;
  color: #409EFF;
  margin: 0 0 4px;
  line-height: 1;
}

.flow-stat__label {
  font-size: 12px;
  color: #909399;
  margin: 0;
}

.preview-3d-container {
  width: 100%;
  height: 400px;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e8eb 100%);
  border-radius: 8px;
  margin-bottom: 16px;
}

.preview-info {
  margin-top: 16px;
}

.stat-card {
  display: flex;
  align-items: center;
  padding: 20px 16px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 80px;
  height: 80px;
  background: radial-gradient(circle, rgba(102,126,234,0.05) 0%, transparent 70%);
  border-radius: 50%;
  transform: translate(30%, -30%);
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
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
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.stat-card--blue .stat-card__icon { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
.stat-card--green .stat-card__icon { background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); }
.stat-card--orange .stat-card__icon { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); }
.stat-card--purple .stat-card__icon { background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); }

.stat-card__content { flex: 1; }

.stat-card__value {
  font-size: 26px;
  font-weight: 700;
  color: #1a2332;
  margin: 0 0 4px;
  line-height: 1;
}

.stat-card__label {
  font-size: 13px;
  color: #8c98a8;
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
  color: #1a2332;
}

.filter-tags {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}

.filter-label {
  font-size: 13px;
  color: #606266;
  font-weight: 500;
}

.filter-tag {
  cursor: pointer;
  transition: all 0.3s;
}

.filter-tag:hover {
  transform: translateY(-2px);
}

.twin-module-card {
  background: linear-gradient(90deg, #f8f9fa 0%, #f5f7fa 100%);
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
  border: 1px solid #ebeef5;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.twin-module-card:hover {
  border-color: #409eff;
  box-shadow: 0 4px 16px rgba(64, 158, 255, 0.15);
  transform: translateY(-2px);
}

.module-header {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.module-icon {
  color: #409eff;
  margin-right: 8px;
}

.module-name {
  font-size: 14px;
  font-weight: 600;
  color: #1a2332;
}

.module-desc {
  font-size: 12px;
  color: #606266;
  margin: 0 0 8px;
  line-height: 1.5;
  min-height: 36px;
}

.module-source {
  font-size: 12px;
  color: #8c98a8;
  margin: 0 0 10px;
}

.module-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.module-type-tag {
  font-size: 11px;
}

@media (max-width: 1200px) {
  .scene-3d-container {
    height: 350px;
  }
}

@media (max-width: 768px) {
  .scene-3d-container {
    height: 280px;
  }
  .data-flow-container {
    height: 200px;
  }
  .preview-3d-container {
    height: 300px;
  }
}
</style>
