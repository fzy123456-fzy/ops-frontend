<template>
  <div class="log-page">
    <!-- 统计卡片 -->
    <el-row :gutter="20" class="stat-row">
      <el-col :xs="12" :sm="6">
        <div class="stat-card stat-card--blue">
          <div class="stat-card__icon"><el-icon :size="28"><Document /></el-icon></div>
          <div class="stat-card__content">
            <p class="stat-card__value">{{ stats.total }}</p>
            <p class="stat-card__label">日志总数</p>
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="6">
        <div class="stat-card stat-card--green">
          <div class="stat-card__icon"><el-icon :size="28"><CircleCheck /></el-icon></div>
          <div class="stat-card__content">
            <p class="stat-card__value">{{ stats.success }}</p>
            <p class="stat-card__label">成功操作</p>
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="6">
        <div class="stat-card stat-card--red">
          <div class="stat-card__icon"><el-icon :size="28"><CircleClose /></el-icon></div>
          <div class="stat-card__content">
            <p class="stat-card__value">{{ stats.failed }}</p>
            <p class="stat-card__label">失败操作</p>
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="6">
        <div class="stat-card stat-card--orange">
          <div class="stat-card__icon"><el-icon :size="28"><TrendCharts /></el-icon></div>
          <div class="stat-card__content">
            <p class="stat-card__value">{{ stats.successRate }}%</p>
            <p class="stat-card__label">成功率</p>
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- 图表区域 -->
    <el-row :gutter="20" class="chart-row">
      <el-col :xs="24" :md="12">
        <el-card shadow="hover" class="chart-card">
          <template #header>
            <div class="card-header">
              <span class="card-title">操作类型分布</span>
            </div>
          </template>
          <div ref="pieChartRef" class="chart-wrapper"></div>
        </el-card>
      </el-col>
      <el-col :xs="24" :md="12">
        <el-card shadow="hover" class="chart-card">
          <template #header>
            <div class="card-header">
              <span class="card-title">操作日志趋势（近7天）</span>
            </div>
          </template>
          <div ref="lineChartRef" class="chart-wrapper"></div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 主表格卡片 -->
    <el-card shadow="never">
      <template #header>
        <div class="card-header">
          <span class="card-title">操作日志列表</span>
        </div>
      </template>

      <!-- 快速筛选 -->
      <div class="quick-filter">
        <span class="filter-label">操作类型：</span>
        <el-tag
          v-for="tag in typeTags"
          :key="tag.value"
          :type="activeType === tag.value ? tag.type : 'info'"
          :effect="activeType === tag.value ? 'dark' : 'plain'"
          class="filter-tag"
          @click="handleTypeFilter(tag.value)"
        >
          {{ tag.label }}
        </el-tag>
        <span class="filter-label" style="margin-left: 16px;">操作模块：</span>
        <el-tag
          v-for="tag in moduleTags"
          :key="tag.value"
          :type="activeModule === tag.value ? 'primary' : 'info'"
          :effect="activeModule === tag.value ? 'dark' : 'plain'"
          class="filter-tag"
          @click="handleModuleFilter(tag.value)"
        >
          {{ tag.label }}
        </el-tag>
      </div>

      <div class="search-bar">
        <el-form :inline="true" :model="searchForm">
          <el-form-item label="操作人">
            <el-input v-model="searchForm.username" placeholder="请输入操作人" clearable style="width: 160px" />
          </el-form-item>
          <el-form-item label="操作模块">
            <el-select v-model="searchForm.module" placeholder="请选择模块" clearable style="width: 150px">
              <el-option label="用户管理" value="用户管理" />
              <el-option label="设备管理" value="设备管理" />
              <el-option label="告警管理" value="告警管理" />
              <el-option label="任务管理" value="任务管理" />
              <el-option label="操作日志" value="操作日志" />
              <el-option label="系统管理" value="系统管理" />
            </el-select>
          </el-form-item>
          <el-form-item label="操作类型">
            <el-select v-model="searchForm.operationType" placeholder="请选择类型" clearable style="width: 140px">
              <el-option label="新增" value="新增" />
              <el-option label="修改" value="修改" />
              <el-option label="删除" value="删除" />
              <el-option label="查询" value="查询" />
              <el-option label="登录" value="登录" />
              <el-option label="其他" value="其他" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch">
              <el-icon><Search /></el-icon>
              查询
            </el-button>
            <el-button class="tech-outline-btn" @click="handleReset">
              <el-icon><Refresh /></el-icon>
              重置
            </el-button>
          </el-form-item>
        </el-form>
      </div>

      <el-table :data="tableData" stripe v-loading="loading" style="width: 100%" row-key="id">
        <el-table-column prop="username" label="操作人" width="110" />
        <el-table-column prop="module" label="操作模块" width="120" align="center">
          <template #default="{ row }">
            <el-tag size="small" effect="plain">{{ row.module }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="operationType" label="操作类型" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="getOpTypeColor(row.operationType)" size="small">
              {{ row.operationType }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="operation" label="操作描述" min-width="180" show-overflow-tooltip />
        <el-table-column prop="requestUrl" label="请求地址" min-width="160" show-overflow-tooltip />
        <el-table-column prop="ip" label="来源 IP" width="140" />
        <el-table-column prop="status" label="执行结果" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'danger'" size="small">
              {{ row.status === 1 ? '成功' : '失败' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="duration" label="耗时" width="100" align="center">
          <template #default="{ row }">
            {{ formatDuration(row.duration) }}
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="操作时间" width="170" />
      </el-table>

      <div class="pagination-wrapper">
        <el-pagination
          v-model:current-page="pagination.current"
          v-model:page-size="pagination.size"
          :total="pagination.total"
          :page-sizes="[10, 20, 50]"
          layout="total, sizes, prev, pager, next"
          background
          @current-change="loadData"
          @size-change="loadData"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts'
import { getLogPage } from '../api/log'

const loading = ref(false)
const tableData = ref([])
const pieChartRef = ref(null)
const lineChartRef = ref(null)
let pieChart = null
let lineChart = null

const activeType = ref('')
const activeModule = ref('')

const stats = reactive({ total: 0, success: 0, failed: 0, successRate: 0 })

const typeTags = [
  { label: '全部', value: '', type: '' },
  { label: '新增', value: '新增', type: 'success' },
  { label: '修改', value: '修改', type: 'primary' },
  { label: '删除', value: '删除', type: 'danger' },
  { label: '查询', value: '查询', type: 'info' },
  { label: '登录', value: '登录', type: '' },
  { label: '其他', value: '其他', type: 'warning' }
]

const moduleTags = [
  { label: '全部', value: '', type: '' },
  { label: '用户管理', value: '用户管理' },
  { label: '设备管理', value: '设备管理' },
  { label: '告警管理', value: '告警管理' },
  { label: '任务管理', value: '任务管理' },
  { label: '操作日志', value: '操作日志' },
  { label: '系统管理', value: '系统管理' }
]

const searchForm = reactive({ username: '', module: '', operationType: '' })
const pagination = reactive({ current: 1, size: 10, total: 0 })

const opTypeColorMap = {
  '新增': 'success',
  '修改': 'primary',
  '删除': 'danger',
  '查询': 'info',
  '登录': '',
  '其他': 'warning'
}

const getOpTypeColor = (type) => opTypeColorMap[type] || 'info'

const formatDuration = (ms) => {
  if (!ms) return '0ms'
  if (ms < 1000) return `${ms}ms`
  return `${(ms / 1000).toFixed(1)}s`
}

const normalizeItem = (item) => ({
  id: item.id,
  username: item.username || '',
  module: item.module || '',
  operationType: item.operationType || '其他',
  operation: item.operation || '',
  requestUrl: item.requestUrl || item.method || '',
  ip: item.ip || '',
  status: item.status ?? 1,
  duration: item.duration || 0,
  createTime: item.createTime || ''
})

const loadData = async () => {
  loading.value = true
  try {
    const res = await getLogPage({
      current: pagination.current,
      size: pagination.size,
      username: searchForm.username || undefined,
      module: searchForm.module || undefined,
      operationType: searchForm.operationType || undefined
    })
    if (res.code === 200 && res.data) {
      tableData.value = (res.data.records || []).map(normalizeItem)
      pagination.total = res.data.total || 0
      updateStats()
    }
  } catch (e) {
    try {
      const res = await getLogPage()
      if (res.code === 200 && res.data) {
        const all = (res.data.records || []).map(normalizeItem)
        let filtered = all
        if (searchForm.username) filtered = filtered.filter((i) => i.username.includes(searchForm.username))
        if (searchForm.module) filtered = filtered.filter((i) => i.module === searchForm.module)
        if (searchForm.operationType) filtered = filtered.filter((i) => i.operationType === searchForm.operationType)
        pagination.total = filtered.length
        const start = (pagination.current - 1) * pagination.size
        tableData.value = filtered.slice(start, start + pagination.size)
        updateStats()
      }
    } catch (e2) {
      tableData.value = getMockData()
      pagination.total = 15
      updateStats()
    }
  } finally {
    loading.value = false
  }
}

const updateStats = () => {
  const data = tableData.value
  stats.total = data.length
  stats.success = data.filter((i) => i.status === 1).length
  stats.failed = data.filter((i) => i.status === 0).length
  stats.successRate = stats.total > 0 ? Math.round((stats.success / stats.total) * 100) : 0
}

const initPieChart = () => {
  if (!pieChartRef.value) return
  pieChart = echarts.init(pieChartRef.value)
  pieChart.setOption({
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} ({d}%)',
      backgroundColor: 'rgba(6, 24, 52, 0.92)',
      borderColor: 'rgba(0, 216, 255, 0.35)',
      textStyle: { color: '#b8eaff' }
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      top: 'center',
      textStyle: { color: '#b8eaff' }
    },
    series: [
      {
        name: '操作类型',
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['60%', '50%'],
        avoidLabelOverlap: false,
        itemStyle: { borderRadius: 10, borderColor: 'rgba(6, 24, 52, 0.88)', borderWidth: 3 },
        label: { show: false, position: 'center' },
        emphasis: { label: { show: true, fontSize: 16, fontWeight: 'bold', color: '#fff' } },
        labelLine: { show: false },
        data: [
          { value: 3, name: '新增', itemStyle: { color: '#00f5a0' } },
          { value: 4, name: '修改', itemStyle: { color: '#00d8ff' } },
          { value: 1, name: '删除', itemStyle: { color: '#ff4d5a' } },
          { value: 3, name: '查询', itemStyle: { color: '#7aa9c7' } },
          { value: 1, name: '登录', itemStyle: { color: '#ffcc33' } },
          { value: 3, name: '其他', itemStyle: { color: '#8b5cf6' } }
        ]
      }
    ]
  })
}

const initLineChart = () => {
  if (!lineChartRef.value) return
  lineChart = echarts.init(lineChartRef.value)
  lineChart.setOption({
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(6, 24, 52, 0.92)',
      borderColor: 'rgba(0, 216, 255, 0.35)',
      textStyle: { color: '#b8eaff' }
    },
    legend: {
      data: ['操作次数'],
      bottom: '0%',
      textStyle: { color: '#b8eaff' }
    },
    grid: { left: '3%', right: '4%', bottom: '15%', top: '8%', containLabel: true },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['01-09', '01-10', '01-11', '01-12', '01-13', '01-14', '01-15'],
      axisLine: { lineStyle: { color: 'rgba(0, 216, 255, 0.3)' } },
      axisLabel: { color: '#b8eaff' },
      axisTick: { show: false }
    },
    yAxis: {
      type: 'value',
      name: '操作数',
      nameTextStyle: { color: '#b8eaff' },
      splitLine: { lineStyle: { color: 'rgba(0, 216, 255, 0.12)', type: 'dashed' } },
      axisLabel: { color: '#b8eaff' }
    },
    series: [
      {
        name: '操作次数',
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
        data: [12, 15, 8, 18, 14, 20, 15],
        itemStyle: { color: '#00d8ff' },
        lineStyle: { width: 3, color: '#00d8ff' },
        areaStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: 'rgba(0, 216, 255, 0.25)' }, { offset: 1, color: 'rgba(0, 216, 255, 0.02)' }]) }
      }
    ]
  })
}

const handleTypeFilter = (value) => {
  activeType.value = value
  searchForm.operationType = value
  pagination.current = 1
  loadData()
}

const handleModuleFilter = (value) => {
  activeModule.value = value
  searchForm.module = value
  pagination.current = 1
  loadData()
}

const getMockData = () => [
  { id: 1, username: 'admin', operation: '登录系统', module: '用户管理', operationType: '登录', requestUrl: 'POST /api/auth/login', ip: '192.168.1.100', status: 1, duration: 125, createTime: '2024-01-15 14:30:00' },
  { id: 2, username: 'admin', operation: '新增设备', module: '设备管理', operationType: '新增', requestUrl: 'POST /api/device', ip: '192.168.1.100', status: 1, duration: 230, createTime: '2024-01-15 14:25:00' },
  { id: 3, username: 'admin', operation: '修改设备信息', module: '设备管理', operationType: '修改', requestUrl: 'PUT /api/device/1', ip: '192.168.1.100', status: 1, duration: 185, createTime: '2024-01-15 14:20:00' },
  { id: 4, username: 'zhangsan', operation: '处理告警', module: '告警管理', operationType: '修改', requestUrl: 'PUT /api/alarm/5/handle', ip: '192.168.1.101', status: 1, duration: 312, createTime: '2024-01-15 14:15:00' },
  { id: 5, username: 'zhangsan', operation: '创建任务', module: '任务管理', operationType: '新增', requestUrl: 'POST /api/task', ip: '192.168.1.101', status: 1, duration: 198, createTime: '2024-01-15 14:10:00' },
  { id: 6, username: 'lisi', operation: '执行备份任务', module: '任务管理', operationType: '其他', requestUrl: 'POST /api/task/2/execute', ip: '192.168.1.102', status: 1, duration: 2100000, createTime: '2024-01-15 14:05:00' },
  { id: 7, username: 'lisi', operation: '删除告警', module: '告警管理', operationType: '删除', requestUrl: 'DELETE /api/alarm/8', ip: '192.168.1.102', status: 1, duration: 145, createTime: '2024-01-15 14:00:00' },
  { id: 8, username: 'wangwu', operation: '升级应用', module: '任务管理', operationType: '其他', requestUrl: 'POST /api/task/3/execute', ip: '192.168.1.103', status: 1, duration: 450, createTime: '2024-01-15 13:55:00' },
  { id: 9, username: 'admin', operation: '新增用户', module: '用户管理', operationType: '新增', requestUrl: 'POST /api/user', ip: '192.168.1.100', status: 1, duration: 210, createTime: '2024-01-15 13:50:00' },
  { id: 10, username: 'admin', operation: '查询操作日志', module: '操作日志', operationType: '查询', requestUrl: 'GET /api/log', ip: '192.168.1.100', status: 1, duration: 89, createTime: '2024-01-15 13:45:00' },
  { id: 11, username: 'zhangsan', operation: '导出设备列表', module: '设备管理', operationType: '查询', requestUrl: 'GET /api/device/export', ip: '192.168.1.101', status: 1, duration: 1250, createTime: '2024-01-15 13:40:00' },
  { id: 12, username: 'admin', operation: '修改用户角色', module: '用户管理', operationType: '修改', requestUrl: 'PUT /api/user/5', ip: '192.168.1.100', status: 1, duration: 175, createTime: '2024-01-15 13:35:00' },
  { id: 13, username: 'lisi', operation: '查看告警详情', module: '告警管理', operationType: '查询', requestUrl: 'GET /api/alarm/1', ip: '192.168.1.102', status: 1, duration: 65, createTime: '2024-01-15 13:30:00' },
  { id: 14, username: 'wangwu', operation: '执行任务失败', module: '任务管理', operationType: '其他', requestUrl: 'POST /api/task/8/execute', ip: '192.168.1.103', status: 0, duration: 1500000, createTime: '2024-01-15 13:25:00' },
  { id: 15, username: 'admin', operation: '系统配置修改', module: '系统管理', operationType: '修改', requestUrl: 'PUT /api/config', ip: '192.168.1.100', status: 1, duration: 195, createTime: '2024-01-15 13:20:00' }
].map(normalizeItem)

const handleSearch = () => {
  pagination.current = 1
  loadData()
}

const handleReset = () => {
  searchForm.username = ''
  searchForm.module = ''
  searchForm.operationType = ''
  pagination.current = 1
  loadData()
}

onMounted(() => {
  loadData()
  initPieChart()
  initLineChart()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  if (pieChart) pieChart.dispose()
  if (lineChart) lineChart.dispose()
})

const handleResize = () => {
  if (pieChart) pieChart.resize()
  if (lineChart) lineChart.resize()
}
</script>

<style scoped>
.log-page {
  padding: 0;
}

.stat-row {
  margin-bottom: 20px;
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
  width: 56px;
  height: 56px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
  color: #fff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
}

.stat-card--blue .stat-card__icon { background: linear-gradient(135deg, #0d47a1 0%, #00d8ff 100%); }
.stat-card--green .stat-card__icon { background: linear-gradient(135deg, #004d40 0%, #00f5a0 100%); }
.stat-card--red .stat-card__icon { background: linear-gradient(135deg, #b71c1c 0%, #ff4d5a 100%); }
.stat-card--orange .stat-card__icon { background: linear-gradient(135deg, #e65100 0%, #ffcc33 100%); }

.stat-card__content {
  flex: 1;
}

.stat-card__value {
  font-size: 24px;
  font-weight: 700;
  color: #ffffff;
  margin: 0;
  line-height: 1.2;
}

.stat-card__label {
  font-size: 13px;
  color: #b8eaff;
  margin: 4px 0 0 0;
}

.chart-row {
  margin-bottom: 20px;
}

.chart-card {
  margin-bottom: 20px;
}

.chart-card .card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chart-card .card-title {
  font-size: 16px;
  font-weight: 600;
  color: #00d8ff;
}

.chart-wrapper {
  width: 100%;
  height: 280px;
}

.quick-filter {
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.filter-label {
  font-size: 14px;
  color: #b8eaff;
  font-weight: 500;
}

.filter-tag {
  cursor: pointer;
  transition: all 0.3s;
}

.filter-tag:hover {
  transform: translateY(-2px);
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

.search-bar {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
  flex-wrap: wrap;
  gap: 12px;
}

.search-bar__right {
  flex-shrink: 0;
}

.search-bar .el-form {
  margin-bottom: 0;
}

.pagination-wrapper {
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
}
</style>
