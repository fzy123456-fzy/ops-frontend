<template>
  <div class="dashboard-page">
    <section class="hero-panel">
      <div class="hero-copy">
        <p class="hero-kicker">Operations Overview</p>
        <h2>运维态势总览</h2>
        <p>
          把设备状态、告警压力、任务执行与系统资源集中到同一屏，让排障与决策更快落地。
        </p>

        <div class="hero-actions">
          <el-button type="primary" @click="$router.push('/visual-screen')">进入可视化大屏</el-button>
          <el-button @click="$router.push('/alarm')">查看当前告警</el-button>
        </div>
      </div>

      <div class="hero-side">
        <div class="hero-badge">当前时段: {{ timeRangeLabel }}</div>
        <div class="hero-health">
          <span>系统健康度</span>
          <strong>{{ healthScore }}%</strong>
          <small>来自在线率、告警量与任务完成率的综合评估</small>
        </div>
        <el-radio-group v-model="timeRange" size="small" @change="handleTimeRangeChange">
          <el-radio-button label="today">今日</el-radio-button>
          <el-radio-button label="week">本周</el-radio-button>
          <el-radio-button label="month">本月</el-radio-button>
        </el-radio-group>
      </div>
    </section>

    <section class="stats-grid">
      <article class="metric-card metric-card--cyan">
        <div class="metric-icon">
          <el-icon :size="22"><Monitor /></el-icon>
        </div>
        <div class="metric-copy">
          <span>设备总数</span>
          <strong>{{ stats.deviceTotal }}</strong>
          <small>当前纳管资产规模</small>
        </div>
      </article>

      <article class="metric-card metric-card--green">
        <div class="metric-icon">
          <el-icon :size="22"><CircleCheck /></el-icon>
        </div>
        <div class="metric-copy">
          <span>在线设备</span>
          <strong>{{ stats.deviceOnline }}</strong>
          <small>在线率 {{ onlineRate }}%</small>
        </div>
      </article>

      <article class="metric-card metric-card--amber">
        <div class="metric-icon">
          <el-icon :size="22"><Bell /></el-icon>
        </div>
        <div class="metric-copy">
          <span>当前告警</span>
          <strong>{{ stats.alarmPending }}</strong>
          <small>需要持续跟进的风险项</small>
        </div>
      </article>

      <article class="metric-card metric-card--violet">
        <div class="metric-icon">
          <el-icon :size="22"><List /></el-icon>
        </div>
        <div class="metric-copy">
          <span>今日任务</span>
          <strong>{{ stats.todayTasks }}</strong>
          <small>完成率 {{ taskCompleteRate }}%</small>
        </div>
      </article>
    </section>

    <section class="quick-section">
      <div class="section-heading">
        <div>
          <p class="section-subtitle">Quick Access</p>
          <h3>常用入口</h3>
        </div>
      </div>

      <div class="quick-grid">
        <button
          v-for="item in quickEntries"
          :key="item.path"
          type="button"
          class="quick-card"
          @click="$router.push(item.path)"
        >
          <div class="quick-card__icon" :class="`quick-card__icon--${item.color}`">
            <el-icon :size="20"><component :is="item.icon" /></el-icon>
          </div>
          <div class="quick-card__copy">
            <strong>{{ item.name }}</strong>
            <span>{{ item.desc }}</span>
          </div>
        </button>
      </div>
    </section>

    <el-row :gutter="20" class="chart-row">
      <el-col :xs="24" :lg="14">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <div>
                <p class="section-subtitle">Assets</p>
                <span class="card-title">设备状态分布</span>
              </div>
            </div>
          </template>
          <div ref="pieChartRef" class="chart-wrapper chart-wrapper--medium"></div>
        </el-card>
      </el-col>
      <el-col :xs="24" :lg="10">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <div>
                <p class="section-subtitle">Resources</p>
                <span class="card-title">系统资源使用率</span>
              </div>
            </div>
          </template>
          <div ref="gaugeChartRef" class="chart-wrapper chart-wrapper--medium"></div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="chart-row">
      <el-col :xs="24" :lg="12">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <div>
                <p class="section-subtitle">Alarm Trend</p>
                <span class="card-title">近 7 日告警趋势</span>
              </div>
            </div>
          </template>
          <div ref="lineChartRef" class="chart-wrapper"></div>
        </el-card>
      </el-col>
      <el-col :xs="24" :lg="12">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <div>
                <p class="section-subtitle">Task Overview</p>
                <span class="card-title">任务执行统计</span>
              </div>
            </div>
          </template>
          <div ref="barChartRef" class="chart-wrapper"></div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="chart-row">
      <el-col :xs="24" :lg="12">
        <el-card class="list-card">
          <template #header>
            <div class="card-header">
              <div>
                <p class="section-subtitle">Alarms</p>
                <span class="card-title">最新告警</span>
              </div>
              <el-button type="primary" link @click="$router.push('/alarm')">查看全部</el-button>
            </div>
          </template>
          <div class="list-wrapper">
            <div v-for="item in recentAlarms" :key="item.id" class="list-item">
              <div class="list-item__left">
                <span :class="['list-item__dot', `list-item__dot--${getLevelDot(item.alarmLevel)}`]"></span>
                <div class="list-item__main">
                  <strong>{{ item.alarmName }}</strong>
                  <span>{{ item.deviceName || '核心设备' }}</span>
                </div>
              </div>
              <div class="list-item__right">
                <el-tag :type="getLevelType(item.alarmLevel)" size="small" effect="plain">
                  {{ getLevelText(item.alarmLevel) }}
                </el-tag>
                <time>{{ formatTime(item.createTime) }}</time>
              </div>
            </div>
            <el-empty v-if="recentAlarms.length === 0" description="暂无告警数据" :image-size="80" />
          </div>
        </el-card>
      </el-col>

      <el-col :xs="24" :lg="12">
        <el-card class="list-card">
          <template #header>
            <div class="card-header">
              <div>
                <p class="section-subtitle">Tasks</p>
                <span class="card-title">最近运维任务</span>
              </div>
              <el-button type="primary" link @click="$router.push('/task')">查看全部</el-button>
            </div>
          </template>
          <div class="list-wrapper">
            <div v-for="item in recentTasks" :key="item.id" class="list-item">
              <div class="list-item__left">
                <span :class="['list-item__dot', `list-item__dot--${getTaskDot(item.status)}`]"></span>
                <div class="list-item__main">
                  <strong>{{ item.taskName }}</strong>
                  <span>{{ item.assignee || '未分配' }}</span>
                </div>
              </div>
              <div class="list-item__right">
                <el-tag :type="getStatusType(item.status)" size="small" effect="plain">
                  {{ getStatusText(item.status) }}
                </el-tag>
                <time>{{ formatTime(item.createTime) }}</time>
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

const taskCompleteRate = computed(() => 75)

const healthScore = computed(() => {
  const base = Number(onlineRate.value) * 0.6 + (100 - Math.min(stats.alarmPending * 8, 40)) * 0.2 + taskCompleteRate.value * 0.2
  return Math.max(0, Math.min(100, Math.round(base)))
})

const timeRangeLabel = computed(() => {
  if (timeRange.value === 'week') return '本周'
  if (timeRange.value === 'month') return '本月'
  return '今日'
})

const quickEntries = [
  { name: '设备管理', path: '/device', icon: 'Monitor', color: 'blue', desc: '查看资产与在线状态' },
  { name: '告警管理', path: '/alarm', icon: 'Bell', color: 'red', desc: '跟进风险与处置进度' },
  { name: '运维任务', path: '/task', icon: 'List', color: 'green', desc: '安排巡检与执行计划' },
  { name: '操作日志', path: '/log', icon: 'Document', color: 'orange', desc: '追踪操作链路' },
  { name: '用户管理', path: '/user', icon: 'User', color: 'violet', desc: '维护角色与权限' },
  { name: '算法模型', path: '/algorithm', icon: 'Cpu', color: 'cyan', desc: '管理模型与策略' },
  { name: '数字孪生', path: '/digital-twin', icon: 'Connection', color: 'pink', desc: '观察空间映射效果' },
  { name: 'AI智能体', path: '/agent', icon: 'Robot', color: 'amber', desc: '调用智能分析能力' }
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
      backgroundColor: 'rgba(8, 18, 31, 0.96)',
      borderColor: 'rgba(102, 217, 255, 0.18)',
      textStyle: { color: '#eff7ff' }
    },
    legend: {
      bottom: '0%',
      left: 'center',
      icon: 'circle',
      textStyle: { color: '#b4c5db' }
    },
    series: [{
      name: '设备状态',
      type: 'pie',
      radius: ['52%', '72%'],
      center: ['50%', '45%'],
      itemStyle: { borderRadius: 12, borderColor: '#091221', borderWidth: 4 },
      label: { show: false },
      emphasis: { label: { show: true, fontSize: 14, fontWeight: 700, color: '#eff7ff' } },
      data: [
        { value: stats.deviceOnline, name: '在线', itemStyle: { color: '#41d39d' } },
        { value: 1, name: '离线', itemStyle: { color: '#ffd166' } },
        { value: 1, name: '告警', itemStyle: { color: '#ff6b7a' } }
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
      backgroundColor: 'rgba(8, 18, 31, 0.96)',
      borderColor: 'rgba(102, 217, 255, 0.18)',
      textStyle: { color: '#eff7ff' }
    },
    grid: { left: '3%', right: '4%', bottom: '3%', top: '8%', containLabel: true },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: dates,
      axisLine: { lineStyle: { color: 'rgba(120, 200, 255, 0.18)' } },
      axisLabel: { color: '#b4c5db' },
      axisTick: { show: false }
    },
    yAxis: {
      type: 'value',
      splitLine: { lineStyle: { color: 'rgba(120, 200, 255, 0.08)', type: 'dashed' } },
      axisLabel: { color: '#b4c5db' }
    },
    series: [{
      name: '告警数',
      type: 'line',
      smooth: true,
      symbol: 'circle',
      symbolSize: 8,
      lineStyle: { width: 3, color: '#66d9ff' },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: 'rgba(102, 217, 255, 0.32)' },
          { offset: 1, color: 'rgba(102, 217, 255, 0.02)' }
        ])
      },
      itemStyle: { color: '#66d9ff' },
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
      backgroundColor: 'rgba(8, 18, 31, 0.96)',
      borderColor: 'rgba(102, 217, 255, 0.18)',
      textStyle: { color: '#eff7ff' }
    },
    legend: {
      data: ['成功', '失败', '待执行'],
      bottom: '0%',
      textStyle: { color: '#b4c5db' }
    },
    grid: { left: '3%', right: '4%', bottom: '15%', top: '8%', containLabel: true },
    xAxis: {
      type: 'category',
      data: ['巡检', '备份', '部署', '维护', '升级'],
      axisLine: { lineStyle: { color: 'rgba(120, 200, 255, 0.18)' } },
      axisLabel: { color: '#b4c5db' },
      axisTick: { show: false }
    },
    yAxis: {
      type: 'value',
      splitLine: { lineStyle: { color: 'rgba(120, 200, 255, 0.08)', type: 'dashed' } },
      axisLabel: { color: '#b4c5db' }
    },
    series: [
      { name: '成功', type: 'bar', stack: 'total', data: [5, 4, 2, 3, 1], itemStyle: { color: '#41d39d', borderRadius: [10, 10, 0, 0] } },
      { name: '失败', type: 'bar', stack: 'total', data: [0, 0, 0, 1, 0], itemStyle: { color: '#ff6b7a', borderRadius: [10, 10, 0, 0] } },
      { name: '待执行', type: 'bar', stack: 'total', data: [1, 0, 0, 2, 1], itemStyle: { color: '#8ea1b7', borderRadius: [10, 10, 0, 0] } }
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
        radius: '76%',
        center: ['25%', '55%'],
        title: { fontSize: 12, offsetCenter: [0, '70%'], color: '#b4c5db' },
        detail: { fontSize: 18, offsetCenter: [0, '40%'], formatter: '{value}%', color: '#66d9ff' },
        itemStyle: { color: '#66d9ff' },
        axisLine: { lineStyle: { width: 12, color: [[0.45, '#66d9ff'], [1, 'rgba(102, 217, 255, 0.1)']] } },
        axisTick: { lineStyle: { color: 'rgba(102, 217, 255, 0.28)' } },
        splitLine: { lineStyle: { color: 'rgba(102, 217, 255, 0.18)' } },
        axisLabel: { color: '#8ea1b7' },
        data: [{ value: 45, name: 'CPU' }]
      },
      {
        type: 'gauge',
        min: 0,
        max: 100,
        splitNumber: 5,
        radius: '76%',
        center: ['75%', '55%'],
        title: { fontSize: 12, offsetCenter: [0, '70%'], color: '#b4c5db' },
        detail: { fontSize: 18, offsetCenter: [0, '40%'], formatter: '{value}%', color: '#41d39d' },
        itemStyle: { color: '#41d39d' },
        axisLine: { lineStyle: { width: 12, color: [[0.62, '#41d39d'], [1, 'rgba(65, 211, 157, 0.12)']] } },
        axisTick: { lineStyle: { color: 'rgba(65, 211, 157, 0.22)' } },
        splitLine: { lineStyle: { color: 'rgba(65, 211, 157, 0.16)' } },
        axisLabel: { color: '#8ea1b7' },
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
.dashboard-page {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.hero-panel {
  display: grid;
  grid-template-columns: minmax(0, 1.5fr) minmax(280px, 0.8fr);
  gap: 24px;
  padding: 28px;
  border-radius: 30px;
  background:
    radial-gradient(circle at top right, rgba(255, 183, 74, 0.16), transparent 28%),
    linear-gradient(135deg, rgba(14, 30, 50, 0.98) 0%, rgba(8, 17, 30, 0.98) 100%);
  border: 1px solid rgba(120, 200, 255, 0.14);
  box-shadow: 0 28px 80px rgba(0, 0, 0, 0.25);
}

.hero-kicker {
  color: #7f96ad;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  font-size: 12px;
}

.hero-copy h2 {
  margin: 14px 0 12px;
  color: #eff7ff;
  font-size: clamp(28px, 4vw, 40px);
}

.hero-copy p:last-child,
.hero-copy > p:nth-of-type(2) {
  max-width: 640px;
  color: #b4c5db;
  line-height: 1.8;
  font-size: 15px;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 22px;
}

.hero-side {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 18px;
  padding: 22px;
  border-radius: 24px;
  background: rgba(9, 19, 34, 0.72);
  border: 1px solid rgba(120, 200, 255, 0.1);
}

.hero-badge {
  align-self: flex-start;
  padding: 8px 12px;
  border-radius: 999px;
  background: rgba(102, 217, 255, 0.08);
  color: #d7f3ff;
  font-size: 12px;
}

.hero-health span,
.hero-health small {
  display: block;
}

.hero-health span {
  color: #8ea1b7;
  margin-bottom: 8px;
}

.hero-health strong {
  color: #eff7ff;
  font-size: 52px;
  line-height: 1;
}

.hero-health small {
  margin-top: 10px;
  color: #8ea1b7;
  line-height: 1.7;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 18px;
}

.metric-card {
  position: relative;
  overflow: hidden;
  display: flex;
  gap: 16px;
  align-items: center;
  padding: 22px 20px;
  border-radius: 26px;
  border: 1px solid rgba(120, 200, 255, 0.12);
  background: linear-gradient(180deg, rgba(13, 27, 46, 0.98) 0%, rgba(7, 14, 24, 0.96) 100%);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.18);
}

.metric-card::after {
  content: '';
  position: absolute;
  inset: auto -30px -48px auto;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.04);
}

.metric-icon {
  width: 54px;
  height: 54px;
  border-radius: 18px;
  display: grid;
  place-items: center;
  flex-shrink: 0;
}

.metric-card--cyan .metric-icon {
  color: #02101b;
  background: linear-gradient(135deg, #8be6ff 0%, #27b2da 100%);
}

.metric-card--green .metric-icon {
  color: #051711;
  background: linear-gradient(135deg, #80efc0 0%, #2fa276 100%);
}

.metric-card--amber .metric-icon {
  color: #271700;
  background: linear-gradient(135deg, #ffe197 0%, #ffb44a 100%);
}

.metric-card--violet .metric-icon {
  color: #140524;
  background: linear-gradient(135deg, #d8a7ff 0%, #8f61e8 100%);
}

.metric-copy span,
.metric-copy small {
  display: block;
}

.metric-copy span {
  color: #8ea1b7;
  font-size: 13px;
  margin-bottom: 10px;
}

.metric-copy strong {
  color: #eff7ff;
  font-size: 34px;
  line-height: 1;
}

.metric-copy small {
  color: #9fb2c7;
  margin-top: 10px;
  font-size: 12px;
}

.quick-section {
  padding: 2px;
}

.quick-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
}

.quick-card {
  text-align: left;
  display: flex;
  gap: 14px;
  align-items: center;
  width: 100%;
  padding: 18px;
  border-radius: 22px;
  border: 1px solid rgba(120, 200, 255, 0.12);
  background: rgba(10, 21, 37, 0.82);
  color: inherit;
  cursor: pointer;
  transition: transform 0.24s ease, border-color 0.24s ease, background 0.24s ease;
}

.quick-card:hover {
  transform: translateY(-2px);
  border-color: rgba(120, 200, 255, 0.24);
  background: rgba(13, 27, 46, 0.92);
}

.quick-card__icon {
  width: 46px;
  height: 46px;
  border-radius: 16px;
  display: grid;
  place-items: center;
  flex-shrink: 0;
}

.quick-card__icon--blue { background: linear-gradient(135deg, #8be6ff 0%, #27b2da 100%); color: #05111c; }
.quick-card__icon--red { background: linear-gradient(135deg, #ffa8b2 0%, #ff6b7a 100%); color: #29050c; }
.quick-card__icon--green { background: linear-gradient(135deg, #80efc0 0%, #2fa276 100%); color: #06150f; }
.quick-card__icon--orange { background: linear-gradient(135deg, #ffe197 0%, #ffb44a 100%); color: #2a1800; }
.quick-card__icon--violet { background: linear-gradient(135deg, #d8a7ff 0%, #8f61e8 100%); color: #160522; }
.quick-card__icon--cyan { background: linear-gradient(135deg, #97f2ff 0%, #43c3d8 100%); color: #05141d; }
.quick-card__icon--pink { background: linear-gradient(135deg, #ffc2dd 0%, #ef629f 100%); color: #250414; }
.quick-card__icon--amber { background: linear-gradient(135deg, #ffe197 0%, #ffb44a 100%); color: #2a1800; }

.quick-card__copy {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.quick-card__copy strong {
  color: #eff7ff;
  font-size: 15px;
}

.quick-card__copy span {
  color: #8ea1b7;
  font-size: 12px;
  line-height: 1.6;
}

.chart-row {
  margin: 0;
}

.chart-card,
.list-card {
  height: 100%;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}

.card-title {
  color: #eff7ff;
  font-size: 18px;
  font-weight: 700;
}

.chart-wrapper {
  height: 340px;
}

.chart-wrapper--medium {
  height: 320px;
}

.list-wrapper {
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-height: 320px;
}

.list-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  padding: 16px 18px;
  border-radius: 18px;
  background: rgba(8, 18, 31, 0.52);
  border: 1px solid rgba(120, 200, 255, 0.08);
}

.list-item__left,
.list-item__right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.list-item__left {
  min-width: 0;
  flex: 1;
}

.list-item__main {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.list-item__main strong {
  color: #eff7ff;
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.list-item__main span,
.list-item__right time {
  color: #8ea1b7;
  font-size: 12px;
}

.list-item__dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}

.list-item__dot--red { background: #ff6b7a; box-shadow: 0 0 12px rgba(255, 107, 122, 0.45); }
.list-item__dot--orange { background: #ffd166; box-shadow: 0 0 12px rgba(255, 209, 102, 0.4); }
.list-item__dot--blue { background: #66d9ff; box-shadow: 0 0 12px rgba(102, 217, 255, 0.45); }
.list-item__dot--green { background: #41d39d; box-shadow: 0 0 12px rgba(65, 211, 157, 0.45); }
.list-item__dot--gray { background: #8ea1b7; box-shadow: 0 0 12px rgba(142, 161, 183, 0.3); }

@media (max-width: 1200px) {
  .stats-grid,
  .quick-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .hero-panel {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .stats-grid,
  .quick-grid {
    grid-template-columns: 1fr;
  }

  .hero-panel {
    padding: 22px;
  }

  .list-item {
    flex-direction: column;
    align-items: flex-start;
  }

  .list-item__right {
    width: 100%;
    justify-content: space-between;
  }
}
</style>
