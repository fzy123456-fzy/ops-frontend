<template>
  <div class="alarm-page">
    <!-- 统计卡片 -->
    <el-row :gutter="20" class="stat-row">
      <el-col :xs="12" :sm="6">
        <div class="stat-card stat-card--red">
          <div class="stat-card__icon"><el-icon :size="28"><Bell /></el-icon></div>
          <div class="stat-card__content">
            <p class="stat-card__value">{{ stats.total }}</p>
            <p class="stat-card__label">告警总数</p>
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="6">
        <div class="stat-card stat-card--orange">
          <div class="stat-card__icon"><el-icon :size="28"><Warning /></el-icon></div>
          <div class="stat-card__content">
            <p class="stat-card__value">{{ stats.pending }}</p>
            <p class="stat-card__label">待处理</p>
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="6">
        <div class="stat-card stat-card--blue">
          <div class="stat-card__icon"><el-icon :size="28"><Tools /></el-icon></div>
          <div class="stat-card__content">
            <p class="stat-card__value">{{ stats.processing }}</p>
            <p class="stat-card__label">处理中</p>
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="6">
        <div class="stat-card stat-card--green">
          <div class="stat-card__icon"><el-icon :size="28"><CircleCheck /></el-icon></div>
          <div class="stat-card__content">
            <p class="stat-card__value">{{ stats.resolved }}</p>
            <p class="stat-card__label">已解决</p>
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
              <span class="card-title">告警级别分布</span>
            </div>
          </template>
          <div ref="pieChartRef" class="chart-wrapper"></div>
        </el-card>
      </el-col>
      <el-col :xs="24" :md="12">
        <el-card shadow="hover" class="chart-card">
          <template #header>
            <div class="card-header">
              <span class="card-title">告警趋势（近7天）</span>
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
          <span class="card-title">告警列表</span>
          <el-badge :value="stats.pending" :max="99" class="alarm-badge">
            <el-button type="danger" plain>
              <el-icon><Bell /></el-icon>
              待处理告警
            </el-button>
          </el-badge>
        </div>
      </template>

      <!-- 快速筛选 -->
      <div class="quick-filter">
        <span class="filter-label">告警级别：</span>
        <el-tag
          v-for="tag in levelTags"
          :key="tag.value"
          :type="activeLevel === tag.value ? tag.type : 'info'"
          :effect="activeLevel === tag.value ? 'dark' : 'plain'"
          class="filter-tag"
          @click="handleLevelFilter(tag.value)"
        >
          {{ tag.label }}
        </el-tag>
        <span class="filter-label" style="margin-left: 16px;">处理状态：</span>
        <el-tag
          v-for="tag in statusTags"
          :key="tag.value"
          :type="activeStatus === tag.value ? tag.type : 'info'"
          :effect="activeStatus === tag.value ? 'dark' : 'plain'"
          class="filter-tag"
          @click="handleStatusFilter(tag.value)"
        >
          {{ tag.label }}
        </el-tag>
      </div>

      <div class="search-bar">
        <el-form :inline="true" :model="searchForm">
          <el-form-item label="设备名称">
            <el-input v-model="searchForm.deviceName" placeholder="请输入设备名称" clearable style="width: 180px" />
          </el-form-item>
          <el-form-item label="告警级别">
            <el-select v-model="searchForm.alarmLevel" placeholder="请选择告警级别" clearable style="width: 140px">
              <el-option label="严重" value="critical" />
              <el-option label="重要" value="major" />
              <el-option label="一般" value="minor" />
              <el-option label="提示" value="info" />
            </el-select>
          </el-form-item>
          <el-form-item label="处理状态">
            <el-select v-model="searchForm.status" placeholder="请选择处理状态" clearable style="width: 140px">
              <el-option label="待处理" value="pending" />
              <el-option label="处理中" value="processing" />
              <el-option label="已解决" value="resolved" />
              <el-option label="已忽略" value="ignored" />
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

      <el-table :data="tableData" v-loading="loading" style="width: 100%" row-key="id" class="thingsboard-table">
        <el-table-column type="selection" width="40" align="center" />
        <el-table-column prop="alarmNo" label="告警编号" width="130" />
        <el-table-column prop="deviceName" label="设备名称" min-width="140" show-overflow-tooltip />
        <el-table-column prop="alarmLevel" label="级别" width="80" align="center">
          <template #default="{ row }">
            <el-tag :type="getLevelType(row.alarmLevel)" size="small">
              {{ getLevelText(row.alarmLevel) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="alarmType" label="类型" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="getTypeColor(row.alarmType)" size="small" effect="plain">
              {{ getTypeText(row.alarmType) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="alarmContent" label="告警内容" min-width="200" show-overflow-tooltip />
        <el-table-column prop="createTime" label="发生时间" width="170" />
        <el-table-column prop="status" label="状态" width="90" align="center">
          <template #default="{ row }">
            <el-tag :type="getStatusColor(row.status)" size="small">
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100" fixed="right" align="center">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="handleView(row)">
              <el-icon><View /></el-icon>
            </el-button>
            <el-button v-if="row.status === 'pending'" type="warning" link size="small" @click="handleProcess(row)">
              <el-icon><Edit /></el-icon>
            </el-button>
          </template>
        </el-table-column>
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

    <el-dialog v-model="detailDialogVisible" title="告警详情" width="600px">
      <el-descriptions :column="1" border>
        <el-descriptions-item label="告警编号">{{ currentItem.alarmNo }}</el-descriptions-item>
        <el-descriptions-item label="设备名称">{{ currentItem.deviceName }}</el-descriptions-item>
        <el-descriptions-item label="告警级别">
          <el-tag :type="getLevelType(currentItem.alarmLevel)" size="small">
            {{ getLevelText(currentItem.alarmLevel) }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="告警类型">{{ getTypeText(currentItem.alarmType) }}</el-descriptions-item>
        <el-descriptions-item label="告警内容">{{ currentItem.alarmContent }}</el-descriptions-item>
        <el-descriptions-item label="处理状态">
          <el-tag :type="getStatusColor(currentItem.status)" size="small">
            {{ getStatusText(currentItem.status) }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="处理人">{{ currentItem.handler || '-' }}</el-descriptions-item>
        <el-descriptions-item label="处理备注">{{ currentItem.handleRemark || '-' }}</el-descriptions-item>
        <el-descriptions-item label="发生时间">{{ currentItem.createTime }}</el-descriptions-item>
        <el-descriptions-item label="处理时间">{{ currentItem.handleTime || '-' }}</el-descriptions-item>
      </el-descriptions>
    </el-dialog>

    <el-dialog v-model="processDialogVisible" title="处理告警" width="520px">
      <el-form ref="processFormRef" :model="processForm" :rules="processFormRules" label-width="90px">
        <el-form-item label="告警名称">
          <el-input :value="currentItem.alarmName" disabled />
        </el-form-item>
        <el-form-item label="处理状态" prop="status">
          <el-select v-model="processForm.status" placeholder="请选择处理状态" style="width: 100%">
            <el-option label="处理中" value="processing" />
            <el-option label="已解决" value="resolved" />
            <el-option label="已忽略" value="ignored" />
          </el-select>
        </el-form-item>
        <el-form-item label="处理人" prop="handler">
          <el-input v-model="processForm.handler" placeholder="请输入处理人" />
        </el-form-item>
        <el-form-item label="处理备注" prop="handleRemark">
          <el-input v-model="processForm.handleRemark" type="textarea" rows="4" placeholder="请输入处理备注" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button class="tech-outline-btn" @click="processDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="processLoading" @click="submitProcess">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { ElMessage } from 'element-plus'
import { View, Edit } from '@element-plus/icons-vue'
import * as echarts from 'echarts'
import { getAlarmPage, handleAlarm } from '../api/alarm'

const loading = ref(false)
const processLoading = ref(false)
const tableData = ref([])
const stats = reactive({ total: 0, pending: 0, processing: 0, resolved: 0 })
const detailDialogVisible = ref(false)
const processDialogVisible = ref(false)
const currentItem = reactive({})
const processFormRef = ref(null)
const pieChartRef = ref(null)
const lineChartRef = ref(null)
let pieChart = null
let lineChart = null

const activeLevel = ref('')
const activeStatus = ref('')

const levelTags = [
  { label: '全部', value: '', type: '' },
  { label: '严重', value: 'critical', type: 'danger' },
  { label: '重要', value: 'major', type: 'warning' },
  { label: '一般', value: 'minor', type: 'info' },
  { label: '提示', value: 'info', type: 'success' }
]

const statusTags = [
  { label: '全部', value: '', type: '' },
  { label: '待处理', value: 'pending', type: 'danger' },
  { label: '处理中', value: 'processing', type: 'primary' },
  { label: '已解决', value: 'resolved', type: 'success' },
  { label: '已忽略', value: 'ignored', type: 'info' }
]

const searchForm = reactive({ deviceName: '', alarmLevel: '', status: '' })
const pagination = reactive({ current: 1, size: 10, total: 0 })

const processForm = reactive({ status: '', handler: '', handleRemark: '' })
const processFormRules = {
  status: [{ required: true, message: '请选择处理状态', trigger: 'change' }],
  handler: [{ required: true, message: '请输入处理人', trigger: 'blur' }]
}

const levelMap = {
  critical: { type: 'danger', text: '严重' },
  major: { type: 'warning', text: '重要' },
  minor: { type: 'info', text: '一般' },
  info: { type: 'success', text: '提示' }
}

const typeMap = {
  threshold: { color: 'danger', text: '阈值告警' },
  fault: { color: 'warning', text: '故障告警' },
  security: { color: '', text: '安全告警' },
  performance: { color: 'primary', text: '性能告警' }
}

const statusMap = {
  pending: { type: 'info', text: '待处理' },
  processing: { type: 'primary', text: '处理中' },
  resolved: { type: 'success', text: '已解决' },
  ignored: { type: 'warning', text: '已忽略' }
}

const getLevelType = (level) => levelMap[level]?.type || 'info'
const getLevelText = (level) => levelMap[level]?.text || level
const getTypeColor = (type) => typeMap[type]?.color || ''
const getTypeText = (type) => typeMap[type]?.text || type
const getStatusColor = (status) => statusMap[status]?.type || 'info'
const getStatusText = (status) => statusMap[status]?.text || status

const normalizeItem = (item) => ({
  id: item.id,
  alarmNo: item.alarmNo || `ALM-${String(item.id).padStart(6, '0')}`,
  alarmName: item.alarmName || '',
  deviceName: item.deviceName || '',
  alarmLevel: item.alarmLevel || 'info',
  alarmType: item.alarmType || 'threshold',
  alarmContent: item.alarmContent || item.alarmName || '',
  status: item.status || 'pending',
  handler: item.handler || '',
  handleRemark: item.handleRemark || '',
  handleTime: item.handleTime || '',
  createTime: item.createTime || ''
})

const loadData = async () => {
  loading.value = true
  try {
    const res = await getAlarmPage({
      current: pagination.current,
      size: pagination.size,
      deviceName: searchForm.deviceName || undefined,
      alarmLevel: searchForm.alarmLevel || undefined,
      status: searchForm.status || undefined
    })
    if (res.code === 200 && res.data) {
      tableData.value = (res.data.records || []).map(normalizeItem)
      pagination.total = res.data.total || 0
      updateStats()
    }
  } catch (e) {
    try {
      const res = await getAlarmPage()
      if (res.code === 200 && res.data) {
        const all = (res.data.records || []).map(normalizeItem)
        let filtered = all
        if (searchForm.deviceName) filtered = filtered.filter((i) => i.deviceName.includes(searchForm.deviceName))
        if (searchForm.alarmLevel) filtered = filtered.filter((i) => i.alarmLevel === searchForm.alarmLevel)
        if (searchForm.status) filtered = filtered.filter((i) => i.status === searchForm.status)
        pagination.total = filtered.length
        const start = (pagination.current - 1) * pagination.size
        tableData.value = filtered.slice(start, start + pagination.size)
        updateStats()
      }
    } catch (e2) {
      tableData.value = getMockData()
      pagination.total = 10
      updateStats()
    }
  } finally {
    loading.value = false
  }
}

const updateStats = () => {
  const data = tableData.value
  stats.total = data.length
  stats.pending = data.filter((i) => i.status === 'pending').length
  stats.processing = data.filter((i) => i.status === 'processing').length
  stats.resolved = data.filter((i) => i.status === 'resolved').length
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
        name: '告警级别',
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['60%', '50%'],
        avoidLabelOverlap: false,
        itemStyle: { borderRadius: 10, borderColor: 'rgba(6, 24, 52, 0.88)', borderWidth: 3 },
        label: { show: false, position: 'center' },
        emphasis: { label: { show: true, fontSize: 16, fontWeight: 'bold', color: '#fff' } },
        labelLine: { show: false },
        data: [
          { value: 2, name: '严重', itemStyle: { color: '#ff4d5a' } },
          { value: 3, name: '重要', itemStyle: { color: '#ffcc33' } },
          { value: 2, name: '一般', itemStyle: { color: '#7aa9c7' } },
          { value: 3, name: '提示', itemStyle: { color: '#00f5a0' } }
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
      data: ['新增告警', '已处理'],
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
      splitLine: { lineStyle: { color: 'rgba(0, 216, 255, 0.12)', type: 'dashed' } },
      axisLabel: { color: '#b8eaff' }
    },
    series: [
      {
        name: '新增告警',
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
        data: [3, 5, 2, 4, 3, 6, 4],
        itemStyle: { color: '#00d8ff' },
        lineStyle: { width: 3, color: '#00d8ff' },
        areaStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: 'rgba(0, 216, 255, 0.25)' }, { offset: 1, color: 'rgba(0, 216, 255, 0.02)' }]) }
      },
      {
        name: '已处理',
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
        data: [2, 3, 4, 2, 5, 3, 5],
        itemStyle: { color: '#00f5a0' },
        lineStyle: { width: 3, color: '#00f5a0' },
        areaStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: 'rgba(0, 245, 160, 0.25)' }, { offset: 1, color: 'rgba(0, 245, 160, 0.02)' }]) }
      }
    ]
  })
}

const handleLevelFilter = (value) => {
  activeLevel.value = value
  searchForm.alarmLevel = value
  pagination.current = 1
  loadData()
}

const handleStatusFilter = (value) => {
  activeStatus.value = value
  searchForm.status = value
  pagination.current = 1
  loadData()
}

const getMockData = () => [
  { id: 1, alarmNo: 'ALM-000001', alarmName: 'CPU使用率过高', deviceName: '数据库服务器-01', alarmLevel: 'critical', alarmType: 'threshold', alarmContent: 'CPU使用率达到72.8%，超过阈值70%', status: 'processing', handler: '张三', handleRemark: '已优化慢查询，CPU使用率降至45%', handleTime: '2024-01-15 15:00:00', createTime: '2024-01-15 14:30:00' },
  { id: 2, alarmNo: 'ALM-000002', alarmName: '内存使用率告警', deviceName: '数据库服务器-01', alarmLevel: 'major', alarmType: 'threshold', alarmContent: '内存使用率达到85.6%，超过阈值80%', status: 'pending', handler: '', handleRemark: '', handleTime: '', createTime: '2024-01-15 13:20:00' },
  { id: 3, alarmNo: 'ALM-000003', alarmName: '磁盘空间不足', deviceName: '存储阵列-01', alarmLevel: 'major', alarmType: 'threshold', alarmContent: '磁盘使用率达到82.6%，建议清理或扩容', status: 'pending', handler: '', handleRemark: '', handleTime: '', createTime: '2024-01-15 12:10:00' },
  { id: 4, alarmNo: 'ALM-000004', alarmName: '服务器离线', deviceName: '备份服务器', alarmLevel: 'critical', alarmType: 'fault', alarmContent: '设备已离线超过30分钟，请检查网络连接', status: 'processing', handler: '李四', handleRemark: '正在排查网络问题', handleTime: '2024-01-15 11:30:00', createTime: '2024-01-15 11:00:00' },
  { id: 5, alarmNo: 'ALM-000005', alarmName: '数据库连接数过多', deviceName: '数据库服务器-01', alarmLevel: 'minor', alarmType: 'performance', alarmContent: '当前连接数达到180，接近最大连接数200', status: 'resolved', handler: '张三', handleRemark: '已调整连接池配置', handleTime: '2024-01-15 10:45:00', createTime: '2024-01-15 10:30:00' },
  { id: 6, alarmNo: 'ALM-000006', alarmName: '网络延迟异常', deviceName: '核心交换机', alarmLevel: 'minor', alarmType: 'performance', alarmContent: '网络延迟达到150ms，超过阈值100ms', status: 'resolved', handler: '王五', handleRemark: '网络恢复正常', handleTime: '2024-01-14 10:50:00', createTime: '2024-01-14 10:20:00' },
  { id: 7, alarmNo: 'ALM-000007', alarmName: 'SSL证书即将过期', deviceName: 'Web服务器-01', alarmLevel: 'info', alarmType: 'security', alarmContent: 'SSL证书将在7天后过期，请及时续期', status: 'pending', handler: '', handleRemark: '', handleTime: '', createTime: '2024-01-14 09:00:00' },
  { id: 8, alarmNo: 'ALM-000008', alarmName: '日志文件过大', deviceName: '应用服务器-01', alarmLevel: 'info', alarmType: 'threshold', alarmContent: '应用日志文件达到5GB，建议清理历史日志', status: 'ignored', handler: '赵六', handleRemark: '已配置日志轮转策略', handleTime: '2024-01-13 10:00:00', createTime: '2024-01-13 09:00:00' },
  { id: 9, alarmNo: 'ALM-000009', alarmName: '防火墙规则变更', deviceName: '防火墙-01', alarmLevel: 'info', alarmType: 'security', alarmContent: '检测到防火墙规则发生变更，请确认是否授权操作', status: 'resolved', handler: '张三', handleRemark: '已确认是正常变更', handleTime: '2024-01-12 17:00:00', createTime: '2024-01-12 16:45:00' },
  { id: 10, alarmNo: 'ALM-000010', alarmName: '存储阵列温度过高', deviceName: '存储阵列-01', alarmLevel: 'major', alarmType: 'fault', alarmContent: '设备温度达到45℃，超过安全阈值40℃', status: 'processing', handler: '李四', handleRemark: '已检查空调系统，温度正在下降', handleTime: '2024-01-12 15:00:00', createTime: '2024-01-12 14:30:00' }
].map(normalizeItem)

const handleSearch = () => {
  pagination.current = 1
  loadData()
}

const handleReset = () => {
  searchForm.deviceName = ''
  searchForm.alarmLevel = ''
  searchForm.status = ''
  pagination.current = 1
  loadData()
}

const handleView = (row) => {
  Object.assign(currentItem, row)
  detailDialogVisible.value = true
}

const handleProcess = (row) => {
  Object.assign(currentItem, row)
  processForm.status = ''
  processForm.handler = 'admin'
  processForm.handleRemark = ''
  processDialogVisible.value = true
}

const submitProcess = async () => {
  const valid = await processFormRef.value.validate().catch(() => false)
  if (!valid) return

  processLoading.value = true
  try {
    await handleAlarm(currentItem.id, { ...processForm })
    ElMessage.success('处理成功')
    processDialogVisible.value = false
    loadData()
  } catch (e) {
    ElMessage.success('处理成功（演示模式）')
    processDialogVisible.value = false
    loadData()
  } finally {
    processLoading.value = false
  }
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
.alarm-page {
  padding: 0;
}

.stat-row {
  margin-bottom: 20px;
}

.stat-card {
  display: flex;
  align-items: center;
  padding: 16px;
  background: rgba(6, 24, 52, 0.88);
  border-radius: 8px;
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
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  flex-shrink: 0;
}

.stat-card--red .stat-card__icon { background: rgba(255, 77, 90, 0.15); color: #ff4d5a; }
.stat-card--orange .stat-card__icon { background: rgba(255, 204, 51, 0.15); color: #ffcc33; }
.stat-card--blue .stat-card__icon { background: rgba(0, 216, 255, 0.15); color: #00d8ff; }
.stat-card--green .stat-card__icon { background: rgba(0, 245, 160, 0.15); color: #00f5a0; }

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

.alarm-badge {
  margin-left: 12px;
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
  align-items: center;
}

/* Table overrides */
.thingsboard-table {
  border: 1px solid rgba(0, 216, 255, 0.15);
  border-radius: 8px;
  overflow: hidden;
}

.thingsboard-table :deep(.el-table__header) {
  background: rgba(8, 35, 75, 0.78);
}

.thingsboard-table :deep(.el-table__header th) {
  background: rgba(8, 35, 75, 0.78) !important;
  color: #00d8ff !important;
  font-weight: 600;
  font-size: 13px;
  border-bottom: 1px solid rgba(0, 216, 255, 0.2);
  padding: 12px 0;
}

.thingsboard-table :deep(.el-table__row) {
  transition: background-color 0.2s;
}

.thingsboard-table :deep(.el-table__row:hover) {
  background-color: rgba(0, 216, 255, 0.08) !important;
}

.thingsboard-table :deep(.el-table__row td) {
  padding: 10px 0;
  border-bottom: 1px solid rgba(0, 216, 255, 0.1);
  font-size: 13px;
  color: #b8eaff;
}

.thingsboard-table :deep(.el-table__body tr:last-child td) {
  border-bottom: none;
}

.thingsboard-table :deep(.el-button.is-link) {
  padding: 4px;
  color: #00d8ff;
}

.thingsboard-table :deep(.el-button.is-link:hover) {
  background-color: rgba(0, 216, 255, 0.1);
  border-radius: 4px;
}

/* Pagination overrides */
.pagination-wrapper :deep(.el-pagination) {
  font-size: 13px;
}

.pagination-wrapper :deep(.el-pagination button) {
  background: rgba(6, 24, 52, 0.6);
  border: 1px solid rgba(0, 216, 255, 0.2);
  color: #b8eaff;
}

.pagination-wrapper :deep(.el-pagination button:hover) {
  color: #00d8ff;
  border-color: rgba(0, 216, 255, 0.5);
}

.pagination-wrapper :deep(.el-pagination .el-pager li) {
  background: rgba(6, 24, 52, 0.6);
  border: 1px solid rgba(0, 216, 255, 0.15);
  color: #b8eaff;
  min-width: 32px;
  height: 32px;
  line-height: 32px;
  margin: 0 2px;
  border-radius: 6px;
}

.pagination-wrapper :deep(.el-pagination .el-pager li:hover) {
  color: #00d8ff;
  border-color: rgba(0, 216, 255, 0.5);
}

.pagination-wrapper :deep(.el-pagination .el-pager li.is-active) {
  background: linear-gradient(135deg, #00d8ff, #0088cc);
  border-color: #00d8ff;
  color: #fff;
}

.pagination-wrapper :deep(.el-pagination .el-select .el-input__wrapper) {
  background: rgba(8, 35, 75, 0.78);
  box-shadow: 0 0 0 1px rgba(0, 216, 255, 0.35) inset;
}
</style>
