<template>
  <div class="dashboard-container">
    <el-card shadow="never" class="intro-card">
      <div class="intro-content">
        <div class="intro-icon">
          <el-icon :size="32" color="#00d8ff"><Monitor /></el-icon>
        </div>
        <div class="intro-text">
          <h3>欢迎使用智慧运维管理平台</h3>
          <p>本平台提供设备管理、告警监控、任务调度、操作审计等一站式运维能力，帮助您高效掌控系统运行状态，提升运维效率。</p>
        </div>
      </div>
    </el-card>

    <div class="page-title">
      <div class="title-left">
        <h2>运维管理总览</h2>
        <p class="page-subtitle">Operations Management Overview</p>
      </div>
      <div class="title-right">
        <el-radio-group v-model="timeRange" size="small" @change="handleTimeRangeChange">
          <el-radio-button label="today">今日</el-radio-button>
          <el-radio-button label="week">本周</el-radio-button>
          <el-radio-button label="month">本月</el-radio-button>
        </el-radio-group>
      </div>
    </div>

    <el-row :gutter="20" class="stat-row">
      <el-col :xs="24" :sm="12" :md="6">
        <div class="stat-card stat-card--blue">
          <div class="stat-card__icon">
            <el-icon :size="36"><Monitor /></el-icon>
          </div>
          <div class="stat-card__content">
            <p class="stat-card__value">{{ stats.deviceTotal }}</p>
            <p class="stat-card__label">设备总数</p>
            <p class="stat-card__trend trend-up">
              <el-icon><Top /></el-icon>
              <span>+2 较昨日</span>
            </p>
          </div>
        </div>
      </el-col>
      <el-col :xs="24" :sm="12" :md="6">
        <div class="stat-card stat-card--green">
          <div class="stat-card__icon">
            <el-icon :size="36"><CircleCheck /></el-icon>
          </div>
          <div class="stat-card__content">
            <p class="stat-card__value">{{ stats.deviceOnline }}</p>
            <p class="stat-card__label">在线设备</p>
            <p class="stat-card__trend trend-up">
              <el-icon><Top /></el-icon>
              <span>在线率 {{ onlineRate }}%</span>
            </p>
          </div>
        </div>
      </el-col>
      <el-col :xs="24" :sm="12" :md="6">
        <div class="stat-card stat-card--orange">
          <div class="stat-card__icon">
            <el-icon :size="36"><Bell /></el-icon>
          </div>
          <div class="stat-card__content">
            <p class="stat-card__value">{{ stats.alarmPending }}</p>
            <p class="stat-card__label">当前告警</p>
            <p class="stat-card__trend trend-down">
              <el-icon><Bottom /></el-icon>
              <span>-3 较昨日</span>
            </p>
          </div>
        </div>
      </el-col>
      <el-col :xs="24" :sm="12" :md="6">
        <div class="stat-card stat-card--purple">
          <div class="stat-card__icon">
            <el-icon :size="36"><List /></el-icon>
          </div>
          <div class="stat-card__content">
            <p class="stat-card__value">{{ stats.todayTasks }}</p>
            <p class="stat-card__label">今日任务</p>
            <p class="stat-card__trend trend-up">
              <el-icon><Top /></el-icon>
              <span>完成率 {{ taskCompleteRate }}%</span>
            </p>
          </div>
        </div>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="quick-entry-row">
      <el-col :xs="12" :sm="6" :md="3" v-for="item in quickEntries" :key="item.path">
        <div class="quick-entry-card" @click="$router.push(item.path)">
          <div class="entry-icon" :class="`entry-icon--${item.color}`">
            <el-icon :size="24"><component :is="item.icon" /></el-icon>
          </div>
          <p class="entry-name">{{ item.name }}</p>
        </div>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="chart-row">
      <el-col :xs="24" :md="12">
        <el-card shadow="hover" class="chart-card">
          <template #header>
            <div class="card-header">
              <span class="card-title">设备状态分布</span>
            </div>
          </template>
          <div ref="pieChartRef" class="chart-wrapper"></div>
        </el-card>
      </el-col>
      <el-col :xs="24" :md="12">
        <el-card shadow="hover" class="chart-card">
          <template #header>
            <div class="card-header">
              <span class="card-title">近7日告警趋势</span>
            </div>
          </template>
          <div ref="lineChartRef" class="chart-wrapper"></div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="chart-row">
      <el-col :xs="24" :md="12">
        <el-card shadow="hover" class="chart-card">
          <template #header>
            <div class="card-header">
              <span class="card-title">任务执行统计</span>
            </div>
          </template>
          <div ref="barChartRef" class="chart-wrapper"></div>
        </el-card>
      </el-col>
      <el-col :xs="24" :md="12">
        <el-card shadow="hover" class="chart-card">
          <template #header>
            <div class="card-header">
              <span class="card-title">系统资源使用率</span>
            </div>
          </template>
          <div ref="gaugeChartRef" class="chart-wrapper"></div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="table-row">
      <el-col :xs="24" :md="12">
        <el-card shadow="hover" class="list-card">
          <template #header>
            <div class="card-header">
              <span class="card-title">最新告警</span>
              <el-button type="primary" link @click="$router.push('/alarm')">查看全部</el-button>
            </div>
          </template>
          <div class="list-wrapper">
            <div v-for="item in recentAlarms" :key="item.id" class="list-item">
              <div class="list-item__left">
                <span :class="['list-item__dot', `list-item__dot--${getLevelDot(item.alarmLevel)}`]"></span>
                <span class="list-item__title">{{ item.alarmName }}</span>
              </div>
              <div class="list-item__right">
                <el-tag :type="getLevelType(item.alarmLevel)" size="small" effect="plain">
                  {{ getLevelText(item.alarmLevel) }}
                </el-tag>
                <span class="list-item__time">{{ formatTime(item.createTime) }}</span>
              </div>
            </div>
            <el-empty v-if="recentAlarms.length === 0" description="暂无告警数据" :image-size="80" />
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :md="12">
        <el-card shadow="hover" class="list-card">
          <template #header>
            <div class="card-header">
              <span class="card-title">最近运维任务</span>
              <el-button type="primary" link @click="$router.push('/task')">查看全部</el-button>
            </div>
          </template>
          <div class="list-wrapper">
            <div v-for="item in recentTasks" :key="item.id" class="list-item">
              <div class="list-item__left">
                <span :class="['list-item__dot', `list-item__dot--${getTaskDot(item.status)}`]"></span>
                <span class="list-item__title">{{ item.taskName }}</span>
              </div>
              <div class="list-item__right">
                <el-tag :type="getStatusType(item.status)" size="small" effect="plain">
                  {{ getStatusText(item.status) }}
                </el-tag>
                <span class="list-item__time">{{ formatTime(item.createTime) }}</span>
              </div>
            </div>
            <el-empty v-if="recentTasks.length === 0" description="暂无任务数据" :image-size="80" />
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts'
import { getDashboardStats, getAlarmList, getTaskList } from '../api/device'

const stats = reactive({
  deviceTotal: 0,
  deviceOnline: 0,
  alarmPending: 0,
  todayTasks: 0
})

const timeRange = ref('today')
const recentAlarms = ref([])
const recentTasks = ref([])
const pieChartRef = ref(null)
const lineChartRef = ref(null)
const barChartRef = ref(null)
const gaugeChartRef = ref(null)
let pieChart = null
let lineChart = null
let barChart = null
let gaugeChart = null

const onlineRate = computed(() => {
  if (!stats.deviceTotal) return 0
  return ((stats.deviceOnline / stats.deviceTotal) * 100).toFixed(1)
})

const taskCompleteRate = computed(() => {
  return 75
})

const quickEntries = [
  { name: '设备管理', path: '/device', icon: 'Monitor', color: 'blue' },
  { name: '告警管理', path: '/alarm', icon: 'Bell', color: 'red' },
  { name: '运维任务', path: '/task', icon: 'List', color: 'green' },
  { name: '操作日志', path: '/log', icon: 'Document', color: 'orange' },
  { name: '用户管理', path: '/user', icon: 'User', color: 'purple' },
  { name: '算法模型', path: '/algorithm', icon: 'Cpu', color: 'cyan' },
  { name: '数字孪生', path: '/digital-twin', icon: 'Connection', color: 'pink' },
  { name: 'AI智能体', path: '/agent', icon: 'Robot', color: 'yellow' }
]

const levelMap = {
  critical: { type: 'danger', text: '严重', dot: 'red' },
  major: { type: 'warning', text: '重要', dot: 'orange' },
  minor: { type: 'info', text: '一般', dot: 'blue' },
  info: { type: 'success', text: '提示', dot: 'green' }
}

const statusMap = {
  pending: { type: 'info', text: '待执行', dot: 'gray' },
  running: { type: 'primary', text: '执行中', dot: 'blue' },
  completed: { type: 'success', text: '已完成', dot: 'green' },
  failed: { type: 'danger', text: '失败', dot: 'red' }
}

const getLevelType = (level) => levelMap[level]?.type || 'info'
const getLevelText = (level) => levelMap[level]?.text || level
const getLevelDot = (level) => levelMap[level]?.dot || 'gray'
const getStatusType = (status) => statusMap[status]?.type || 'info'
const getStatusText = (status) => statusMap[status]?.text || status
const getTaskDot = (status) => statusMap[status]?.dot || 'gray'

const formatTime = (time) => {
  if (!time) return ''
  return time.replace(/(\d{4}-\d{2}-\d{2})\s(\d{2}:\d{2}):\d{2}/, '$1 $2')
}

const handleTimeRangeChange = () => {
  loadStats()
  initLineChart()
  initBarChart()
}

const loadStats = async () => {
  try {
    const res = await getDashboardStats()
    if (res.code === 200 && res.data) {
      const d = res.data
      stats.deviceTotal = d.deviceTotal || 0
      stats.deviceOnline = d.deviceOnline || 0
      stats.alarmPending = d.alarmPending || 0
      stats.todayTasks = d.todayTasks || d.taskPending || 0
    }
  } catch (e) {
    console.warn('统计接口异常，使用演示数据')
  }
  if (!stats.deviceTotal) {
    stats.deviceTotal = 10
    stats.deviceOnline = 8
    stats.alarmPending = 4
    stats.todayTasks = 3
  }
}

const loadAlarms = async () => {
  try {
    const res = await getAlarmList()
    if (res.code === 200 && Array.isArray(res.data)) {
      recentAlarms.value = res.data.slice(0, 5)
    }
  } catch (e) {
    console.warn('告警接口异常')
  }
  if (!recentAlarms.value.length) {
    recentAlarms.value = [
      { id: 1, alarmName: 'CPU使用率过高', alarmLevel: 'critical', deviceName: '数据库服务器-01', status: 'processing', createTime: '2024-01-15 14:30:00' },
      { id: 2, alarmName: '内存使用率告警', alarmLevel: 'major', deviceName: '数据库服务器-01', status: 'pending', createTime: '2024-01-15 13:20:00' },
      { id: 3, alarmName: '磁盘空间不足', alarmLevel: 'major', deviceName: '存储阵列-01', status: 'pending', createTime: '2024-01-15 12:10:00' },
      { id: 4, alarmName: '服务器离线', alarmLevel: 'critical', deviceName: '备份服务器', status: 'processing', createTime: '2024-01-15 11:00:00' },
      { id: 5, alarmName: 'SSL证书即将过期', alarmLevel: 'info', deviceName: 'Web服务器-01', status: 'pending', createTime: '2024-01-15 10:00:00' }
    ]
  }
}

const loadTasks = async () => {
  try {
    const res = await getTaskList()
    if (res.code === 200 && Array.isArray(res.data)) {
      recentTasks.value = res.data.slice(0, 5)
    }
  } catch (e) {
    console.warn('任务接口异常')
  }
  if (!recentTasks.value.length) {
    recentTasks.value = [
      { id: 1, taskName: '每日系统巡检', status: 'completed', assignee: '张三', createTime: '2024-01-15 09:00:00' },
      { id: 2, taskName: '数据库备份', status: 'completed', assignee: '李四', createTime: '2024-01-15 02:00:00' },
      { id: 3, taskName: '应用版本升级', status: 'running', assignee: '王五', createTime: '2024-01-15 14:00:00' },
      { id: 4, taskName: '服务器系统补丁更新', status: 'pending', assignee: '赵六', createTime: '2024-01-15 08:00:00' },
      { id: 5, taskName: '存储阵列扩容', status: 'pending', assignee: '李四', createTime: '2024-01-14 16:00:00' }
    ]
  }
}

const initPieChart = () => {
  if (!pieChartRef.value) return
  pieChart = echarts.init(pieChartRef.value)
  pieChart.setOption({
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c}台 ({d}%)',
      backgroundColor: 'rgba(6, 24, 52, 0.92)',
      borderColor: 'rgba(0, 216, 255, 0.35)',
      textStyle: { color: '#b8eaff' }
    },
    legend: {
      bottom: '0%',
      left: 'center',
      itemWidth: 14,
      itemHeight: 14,
      textStyle: { fontSize: 12, color: '#b8eaff' }
    },
    series: [{
      name: '设备状态',
      type: 'pie',
      radius: ['42%', '68%'],
      center: ['50%', '45%'],
      avoidLabelOverlap: false,
      itemStyle: { borderRadius: 6, borderColor: 'rgba(6, 24, 52, 0.88)', borderWidth: 3 },
      label: { show: false },
      emphasis: { label: { show: true, fontSize: 14, fontWeight: 'bold', color: '#fff' } },
      data: [
        { value: stats.deviceOnline, name: '在线', itemStyle: { color: '#00f5a0' } },
        { value: 1, name: '离线', itemStyle: { color: '#ffcc33' } },
        { value: 1, name: '告警', itemStyle: { color: '#ff4d5a' } }
      ]
    }]
  })
}

const initLineChart = () => {
  if (!lineChartRef.value) return
  lineChart = echarts.init(lineChartRef.value)
  const dates = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    dates.push(`${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`)
  }
  lineChart.setOption({
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(6, 24, 52, 0.92)',
      borderColor: 'rgba(0, 216, 255, 0.35)',
      textStyle: { color: '#b8eaff' }
    },
    grid: { left: '3%', right: '4%', bottom: '3%', top: '8%', containLabel: true },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: dates,
      axisLine: { lineStyle: { color: 'rgba(0, 216, 255, 0.3)' } },
      axisLabel: { color: '#b8eaff' },
      axisTick: { show: false }
    },
    yAxis: {
      type: 'value',
      splitLine: { lineStyle: { color: 'rgba(0, 216, 255, 0.12)', type: 'dashed' } },
      axisLabel: { color: '#b8eaff' }
    },
    series: [{
      name: '告警数',
      type: 'line',
      smooth: true,
      symbol: 'circle',
      symbolSize: 6,
      lineStyle: { width: 3, color: '#00d8ff' },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: 'rgba(0, 216, 255, 0.25)' },
          { offset: 1, color: 'rgba(0, 216, 255, 0.02)' }
        ])
      },
      itemStyle: { color: '#00d8ff' },
      data: [3, 5, 2, 8, 4, 6, 4]
    }]
  })
}

const initBarChart = () => {
  if (!barChartRef.value) return
  barChart = echarts.init(barChartRef.value)
  barChart.setOption({
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      backgroundColor: 'rgba(6, 24, 52, 0.92)',
      borderColor: 'rgba(0, 216, 255, 0.35)',
      textStyle: { color: '#b8eaff' }
    },
    legend: {
      data: ['成功', '失败', '待执行'],
      bottom: '0%',
      textStyle: { color: '#b8eaff' }
    },
    grid: { left: '3%', right: '4%', bottom: '15%', top: '8%', containLabel: true },
    xAxis: {
      type: 'category',
      data: ['巡检', '备份', '部署', '维护', '升级'],
      axisLine: { lineStyle: { color: 'rgba(0, 216, 255, 0.3)' } },
      axisLabel: { color: '#b8eaff' },
      axisTick: { show: false }
    },
    yAxis: {
      type: 'value',
      splitLine: { lineStyle: { color: 'rgba(0, 216, 255, 0.12)', type: 'dashed' } },
      axisLabel: { color: '#b8eaff' }
    },
    series: [
      { name: '成功', type: 'bar', stack: 'total', data: [5, 4, 2, 3, 1], itemStyle: { color: '#00f5a0' } },
      { name: '失败', type: 'bar', stack: 'total', data: [0, 0, 0, 1, 0], itemStyle: { color: '#ff4d5a' } },
      { name: '待执行', type: 'bar', stack: 'total', data: [1, 0, 0, 2, 1], itemStyle: { color: '#7aa9c7' } }
    ]
  })
}

const initGaugeChart = () => {
  if (!gaugeChartRef.value) return
  gaugeChart = echarts.init(gaugeChartRef.value)
  gaugeChart.setOption({
    series: [
      {
        type: 'gauge',
        min: 0,
        max: 100,
        splitNumber: 5,
        radius: '70%',
        center: ['25%', '55%'],
        title: { fontSize: 12, offsetCenter: [0, '70%'], color: '#b8eaff' },
        detail: { fontSize: 16, offsetCenter: [0, '40%'], formatter: '{value}%', color: '#00d8ff' },
        itemStyle: { color: '#00d8ff' },
        axisLine: { lineStyle: { color: [[0.45, '#00d8ff'], [1, 'rgba(0, 216, 255, 0.15)']] } },
        axisTick: { lineStyle: { color: 'rgba(0, 216, 255, 0.3)' } },
        splitLine: { lineStyle: { color: 'rgba(0, 216, 255, 0.2)' } },
        axisLabel: { color: '#b8eaff' },
        data: [{ value: 45, name: 'CPU' }]
      },
      {
        type: 'gauge',
        min: 0,
        max: 100,
        splitNumber: 5,
        radius: '70%',
        center: ['75%', '55%'],
        title: { fontSize: 12, offsetCenter: [0, '70%'], color: '#b8eaff' },
        detail: { fontSize: 16, offsetCenter: [0, '40%'], formatter: '{value}%', color: '#00f5a0' },
        itemStyle: { color: '#00f5a0' },
        axisLine: { lineStyle: { color: [[0.62, '#00f5a0'], [1, 'rgba(0, 245, 160, 0.15)']] } },
        axisTick: { lineStyle: { color: 'rgba(0, 245, 160, 0.3)' } },
        splitLine: { lineStyle: { color: 'rgba(0, 245, 160, 0.2)' } },
        axisLabel: { color: '#b8eaff' },
        data: [{ value: 62, name: '内存' }]
      }
    ]
  })
}

const handleResize = () => {
  pieChart?.resize()
  lineChart?.resize()
  barChart?.resize()
  gaugeChart?.resize()
}

onMounted(async () => {
  await Promise.all([loadStats(), loadAlarms(), loadTasks()])
  setTimeout(() => {
    initPieChart()
    initLineChart()
    initBarChart()
    initGaugeChart()
  }, 200)
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  pieChart?.dispose()
  lineChart?.dispose()
  barChart?.dispose()
  gaugeChart?.dispose()
})
</script>

<style scoped>
.dashboard-container {
  padding: 0;
}

/* ===== 欢迎卡片 ===== */
.intro-card {
  margin-bottom: 16px;
  background: rgba(6, 24, 52, 0.88);
  border: 1px solid rgba(0, 216, 255, 0.35) !important;
  border-radius: 4px;
  box-shadow: 0 0 16px rgba(0, 216, 255, 0.08);
  position: relative;
  overflow: hidden;
}

.intro-card::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -10%;
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, rgba(0, 216, 255, 0.06) 0%, transparent 70%);
  border-radius: 50%;
}

.intro-card::after {
  content: '';
  position: absolute;
  bottom: -30%;
  left: -5%;
  width: 200px;
  height: 200px;
  background: radial-gradient(circle, rgba(0, 216, 255, 0.04) 0%, transparent 70%);
  border-radius: 50%;
}

.intro-card :deep(.el-card__body) {
  padding: 20px;
  position: relative;
  z-index: 1;
}

.intro-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.intro-icon {
  flex-shrink: 0;
}

.intro-text h3 {
  font-size: 18px;
  font-weight: 600;
  color: #00d8ff;
  margin: 0 0 6px;
}

.intro-text p {
  font-size: 14px;
  color: #b8eaff;
  margin: 0;
  line-height: 1.6;
}

/* ===== 页面标题 ===== */
.page-title {
  margin-bottom: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.title-left h2 {
  font-size: 20px;
  font-weight: 600;
  color: #00d8ff;
  margin: 0 0 4px;
}

.page-subtitle {
  font-size: 12px;
  color: #7aa9c7;
  margin: 0;
}

/* ===== 统计卡片行 ===== */
.stat-row {
  margin-bottom: 20px;
}

.stat-card {
  display: flex;
  align-items: center;
  padding: 16px;
  background: rgba(6, 24, 52, 0.88);
  border-radius: 4px;
  box-shadow: 0 0 12px rgba(0, 216, 255, 0.06);
  transition: all 0.3s;
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(0, 216, 255, 0.25);
}

.stat-card:hover {
  border-color: rgba(0, 216, 255, 0.5);
  box-shadow: 0 0 20px rgba(0, 216, 255, 0.15);
  transform: translateY(-2px);
}

.stat-card__icon {
  width: 48px;
  height: 48px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  flex-shrink: 0;
}

.stat-card--blue .stat-card__icon {
  background: rgba(0, 216, 255, 0.15);
  color: #00d8ff;
}

.stat-card--green .stat-card__icon {
  background: rgba(0, 245, 160, 0.15);
  color: #00f5a0;
}

.stat-card--orange .stat-card__icon {
  background: rgba(255, 204, 51, 0.15);
  color: #ffcc33;
}

.stat-card--purple .stat-card__icon {
  background: rgba(139, 92, 246, 0.15);
  color: #8b5cf6;
}

.stat-card__content {
  flex: 1;
}

.stat-card__value {
  font-size: 28px;
  font-weight: 600;
  color: #ffffff;
  margin: 0 0 4px;
  line-height: 1;
}

.stat-card__label {
  font-size: 13px;
  color: #b8eaff;
  margin: 0;
}

.stat-card__trend {
  font-size: 12px;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 4px;
}

.trend-up {
  color: #00f5a0;
}

.trend-down {
  color: #ff4d5a;
}

/* ===== 快捷入口 ===== */
.quick-entry-row {
  margin-bottom: 20px;
}

.quick-entry-card {
  background: rgba(6, 24, 52, 0.88);
  border-radius: 4px;
  padding: 16px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 0 12px rgba(0, 216, 255, 0.06);
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(0, 216, 255, 0.25);
}

.quick-entry-card:hover {
  border-color: rgba(0, 216, 255, 0.5);
  box-shadow: 0 0 20px rgba(0, 216, 255, 0.15);
  transform: translateY(-2px);
}

.entry-icon {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 12px;
  color: #fff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
  transition: transform 0.3s;
}

.quick-entry-card:hover .entry-icon {
  transform: scale(1.1);
}

.entry-icon--blue { background: linear-gradient(135deg, #0d47a1 0%, #00d8ff 100%); }
.entry-icon--red { background: linear-gradient(135deg, #b71c1c 0%, #ff4d5a 100%); }
.entry-icon--green { background: linear-gradient(135deg, #004d40 0%, #00f5a0 100%); }
.entry-icon--orange { background: linear-gradient(135deg, #e65100 0%, #ffcc33 100%); }
.entry-icon--purple { background: linear-gradient(135deg, #311b92 0%, #8b5cf6 100%); }
.entry-icon--cyan { background: linear-gradient(135deg, #006064 0%, #00d8ff 100%); }
.entry-icon--pink { background: linear-gradient(135deg, #880e4f 0%, #ff4081 100%); }
.entry-icon--yellow { background: linear-gradient(135deg, #e65100 0%, #ffcc33 100%); }

.entry-name {
  font-size: 14px;
  color: #b8eaff;
  margin: 0;
  font-weight: 500;
}

/* ===== 图表行 ===== */
.chart-row {
  margin-bottom: 20px;
}

.chart-card,
.list-card {
  border-radius: 4px;
  border: 1px solid rgba(0, 216, 255, 0.25) !important;
  box-shadow: 0 0 12px rgba(0, 216, 255, 0.06);
  background: rgba(6, 24, 52, 0.88) !important;
}

.chart-card :deep(.el-card__header),
.list-card :deep(.el-card__header) {
  border-bottom: 1px solid rgba(0, 216, 255, 0.15);
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

.chart-wrapper {
  height: 320px;
}

/* ===== 列表行 ===== */
.table-row {
  margin-bottom: 20px;
}

.list-wrapper {
  max-height: 320px;
  overflow-y: auto;
}

.list-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  border-bottom: 1px solid rgba(0, 216, 255, 0.12);
  border-radius: 0;
  transition: all 0.2s;
}

.list-item:hover {
  background: rgba(0, 216, 255, 0.06);
}

.list-item:last-child {
  border-bottom: none;
}

.list-item__left {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
  min-width: 0;
}

.list-item__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.list-item__dot--red { background: #ff4d5a; box-shadow: 0 0 8px rgba(255, 77, 90, 0.5); }
.list-item__dot--orange { background: #ffcc33; box-shadow: 0 0 8px rgba(255, 204, 51, 0.5); }
.list-item__dot--blue { background: #00d8ff; box-shadow: 0 0 8px rgba(0, 216, 255, 0.5); }
.list-item__dot--green { background: #00f5a0; box-shadow: 0 0 8px rgba(0, 245, 160, 0.5); }
.list-item__dot--gray { background: #7aa9c7; box-shadow: 0 0 8px rgba(122, 169, 199, 0.5); }

.list-item__title {
  font-size: 14px;
  color: #b8eaff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.list-item__right {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}

.list-item__time {
  font-size: 12px;
  color: #7aa9c7;
  white-space: nowrap;
}

/* ===== 滚动条美化 ===== */
.list-wrapper::-webkit-scrollbar {
  width: 4px;
}

.list-wrapper::-webkit-scrollbar-track {
  background: rgba(0, 216, 255, 0.05);
  border-radius: 2px;
}

.list-wrapper::-webkit-scrollbar-thumb {
  background: rgba(0, 216, 255, 0.25);
  border-radius: 2px;
}

.list-wrapper::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 216, 255, 0.4);
}
</style>
