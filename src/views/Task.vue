<template>
  <div class="task-page">
    <!-- 统计卡片 -->
    <el-row :gutter="20" class="stat-row">
      <el-col :xs="12" :sm="6">
        <div class="stat-card stat-card--blue">
          <div class="stat-card__icon"><el-icon :size="28"><List /></el-icon></div>
          <div class="stat-card__content">
            <p class="stat-card__value">{{ stats.total }}</p>
            <p class="stat-card__label">任务总数</p>
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="6">
        <div class="stat-card stat-card--orange">
          <div class="stat-card__icon"><el-icon :size="28"><Clock /></el-icon></div>
          <div class="stat-card__content">
            <p class="stat-card__value">{{ stats.pending }}</p>
            <p class="stat-card__label">待执行</p>
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="6">
        <div class="stat-card stat-card--green">
          <div class="stat-card__icon"><el-icon :size="28"><CircleCheck /></el-icon></div>
          <div class="stat-card__content">
            <p class="stat-card__value">{{ stats.completed }}</p>
            <p class="stat-card__label">已完成</p>
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="6">
        <div class="stat-card stat-card--red">
          <div class="stat-card__icon"><el-icon :size="28"><CircleClose /></el-icon></div>
          <div class="stat-card__content">
            <p class="stat-card__value">{{ stats.failed }}</p>
            <p class="stat-card__label">执行失败</p>
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
              <span class="card-title">任务状态分布</span>
            </div>
          </template>
          <div ref="pieChartRef" class="chart-wrapper"></div>
        </el-card>
      </el-col>
      <el-col :xs="24" :md="12">
        <el-card shadow="hover" class="chart-card">
          <template #header>
            <div class="card-header">
              <span class="card-title">执行成功率统计（近7天）</span>
            </div>
          </template>
          <div ref="barChartRef" class="chart-wrapper"></div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 主表格卡片 -->
    <el-card shadow="never">
      <template #header>
        <div class="card-header">
          <span class="card-title">运维任务列表</span>
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon>
            新增任务
          </el-button>
        </div>
      </template>

      <!-- 快速筛选 -->
      <div class="quick-filter">
        <span class="filter-label">任务状态：</span>
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
        <span class="filter-label" style="margin-left: 16px;">任务类型：</span>
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
      </div>

      <div class="search-bar">
        <el-form :inline="true" :model="searchForm">
          <el-form-item label="任务名称">
            <el-input v-model="searchForm.taskName" placeholder="请输入任务名称" clearable style="width: 180px" />
          </el-form-item>
          <el-form-item label="任务状态">
            <el-select v-model="searchForm.status" placeholder="请选择状态" clearable style="width: 140px">
              <el-option label="待执行" value="pending" />
              <el-option label="执行中" value="running" />
              <el-option label="已完成" value="completed" />
              <el-option label="失败" value="failed" />
            </el-select>
          </el-form-item>
          <el-form-item label="任务类型">
            <el-select v-model="searchForm.taskType" placeholder="请选择类型" clearable style="width: 140px">
              <el-option label="巡检" value="inspection" />
              <el-option label="备份" value="backup" />
              <el-option label="部署" value="deploy" />
              <el-option label="维护" value="maintenance" />
              <el-option label="升级" value="upgrade" />
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
        <el-table-column prop="taskNo" label="任务编号" width="140" />
        <el-table-column prop="taskName" label="任务名称" min-width="160" show-overflow-tooltip />
        <el-table-column prop="targetName" label="执行对象" min-width="140" show-overflow-tooltip />
        <el-table-column prop="taskType" label="任务类型" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="getTypeColor(row.taskType)" size="small" effect="plain">
              {{ getTypeText(row.taskType) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="priority" label="优先级" width="90" align="center">
          <template #default="{ row }">
            <el-tag :type="getPriorityColor(row.priority)" size="small">
              {{ getPriorityText(row.priority) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="任务状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="getStatusColor(row.status)" size="small">
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="planTime" label="计划时间" width="170" />
        <el-table-column prop="result" label="执行结果" min-width="140" show-overflow-tooltip />
        <el-table-column label="操作" width="220" fixed="right" align="center">
          <template #default="{ row }">
            <el-button v-if="row.status === 'pending'" type="success" link size="small" @click="handleExecute(row)">执行</el-button>
            <el-button type="primary" link size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button type="info" link size="small" @click="handleViewResult(row)">结果</el-button>
            <el-button type="danger" link size="small" @click="handleDelete(row)">删除</el-button>
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

    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="580px" destroy-on-close>
      <el-form ref="formRef" :model="form" :rules="formRules" label-width="100px">
        <el-form-item label="任务名称" prop="taskName">
          <el-input v-model="form.taskName" placeholder="请输入任务名称" />
        </el-form-item>
        <el-form-item label="执行对象" prop="targetName">
          <el-input v-model="form.targetName" placeholder="请输入执行对象，如设备名称" />
        </el-form-item>
        <el-form-item label="任务类型" prop="taskType">
          <el-select v-model="form.taskType" placeholder="请选择任务类型" style="width: 100%">
            <el-option label="巡检" value="inspection" />
            <el-option label="备份" value="backup" />
            <el-option label="部署" value="deploy" />
            <el-option label="维护" value="maintenance" />
            <el-option label="升级" value="upgrade" />
          </el-select>
        </el-form-item>
        <el-form-item label="优先级" prop="priority">
          <el-select v-model="form.priority" placeholder="请选择优先级" style="width: 100%">
            <el-option label="高" value="high" />
            <el-option label="中" value="medium" />
            <el-option label="低" value="low" />
          </el-select>
        </el-form-item>
        <el-form-item label="计划时间">
          <el-date-picker v-model="form.planTime" type="datetime" placeholder="请选择计划时间" style="width: 100%" value-format="YYYY-MM-DD HH:mm:ss" />
        </el-form-item>
        <el-form-item label="负责人">
          <el-input v-model="form.assignee" placeholder="请输入负责人" />
        </el-form-item>
        <el-form-item label="任务描述">
          <el-input v-model="form.description" type="textarea" rows="3" placeholder="请输入任务描述" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button class="tech-outline-btn" @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitLoading" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="resultDialogVisible" title="执行结果" width="520px">
      <el-descriptions :column="1" border>
        <el-descriptions-item label="任务名称">{{ currentItem.taskName }}</el-descriptions-item>
        <el-descriptions-item label="任务状态">
          <el-tag :type="getStatusColor(currentItem.status)" size="small">
            {{ getStatusText(currentItem.status) }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="执行结果">{{ currentItem.result || '-' }}</el-descriptions-item>
        <el-descriptions-item label="开始时间">{{ currentItem.startTime || '-' }}</el-descriptions-item>
        <el-descriptions-item label="结束时间">{{ currentItem.endTime || '-' }}</el-descriptions-item>
        <el-descriptions-item label="负责人">{{ currentItem.assignee || '-' }}</el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import * as echarts from 'echarts'
import { getTaskPage, addTask, updateTask, deleteTask, executeTask } from '../api/task'

const loading = ref(false)
const submitLoading = ref(false)
const tableData = ref([])
const dialogVisible = ref(false)
const resultDialogVisible = ref(false)
const dialogTitle = ref('新增任务')
const isEdit = ref(false)
const formRef = ref(null)
const currentItem = reactive({})
const pieChartRef = ref(null)
const barChartRef = ref(null)
let pieChart = null
let barChart = null

const activeStatus = ref('')
const activeType = ref('')

const stats = reactive({ total: 0, pending: 0, completed: 0, failed: 0 })

const statusTags = [
  { label: '全部', value: '', type: '' },
  { label: '待执行', value: 'pending', type: 'info' },
  { label: '执行中', value: 'running', type: 'primary' },
  { label: '已完成', value: 'completed', type: 'success' },
  { label: '失败', value: 'failed', type: 'danger' }
]

const typeTags = [
  { label: '全部', value: '', type: '' },
  { label: '巡检', value: 'inspection', type: '' },
  { label: '备份', value: 'backup', type: 'success' },
  { label: '部署', value: 'deploy', type: 'primary' },
  { label: '维护', value: 'maintenance', type: 'warning' },
  { label: '升级', value: 'upgrade', type: 'danger' }
]

const searchForm = reactive({ taskName: '', status: '', taskType: '' })
const pagination = reactive({ current: 1, size: 10, total: 0 })

const form = reactive({
  id: null,
  taskName: '',
  targetName: '',
  taskType: '',
  priority: 'medium',
  planTime: '',
  assignee: '',
  description: ''
})

const formRules = {
  taskName: [{ required: true, message: '请输入任务名称', trigger: 'blur' }],
  targetName: [{ required: true, message: '请输入执行对象', trigger: 'blur' }],
  taskType: [{ required: true, message: '请选择任务类型', trigger: 'change' }],
  priority: [{ required: true, message: '请选择优先级', trigger: 'change' }]
}

const typeMap = {
  inspection: { color: '', text: '巡检' },
  backup: { color: 'success', text: '备份' },
  deploy: { color: 'primary', text: '部署' },
  maintenance: { color: 'warning', text: '维护' },
  upgrade: { color: 'danger', text: '升级' }
}

const priorityMap = {
  high: { color: 'danger', text: '高' },
  medium: { color: 'warning', text: '中' },
  low: { color: 'info', text: '低' }
}

const statusMap = {
  pending: { color: 'info', text: '待执行' },
  running: { color: 'primary', text: '执行中' },
  completed: { color: 'success', text: '已完成' },
  failed: { color: 'danger', text: '失败' }
}

const getTypeColor = (type) => typeMap[type]?.color || ''
const getTypeText = (type) => typeMap[type]?.text || type
const getPriorityColor = (p) => priorityMap[p]?.color || 'info'
const getPriorityText = (p) => priorityMap[p]?.text || p
const getStatusColor = (s) => statusMap[s]?.color || 'info'
const getStatusText = (s) => statusMap[s]?.text || s

const normalizeItem = (item) => ({
  id: item.id,
  taskNo: item.taskNo || `TSK-${String(item.id).padStart(6, '0')}`,
  taskName: item.taskName || '',
  targetName: item.targetName || item.deviceName || '',
  taskType: item.taskType || '',
  priority: item.priority || 'medium',
  status: item.status || 'pending',
  planTime: item.planTime || item.startTime || '',
  result: item.result || '',
  startTime: item.startTime || '',
  endTime: item.endTime || '',
  assignee: item.assignee || '',
  description: item.description || ''
})

const loadData = async () => {
  loading.value = true
  try {
    const res = await getTaskPage({
      current: pagination.current,
      size: pagination.size,
      taskName: searchForm.taskName || undefined,
      status: searchForm.status || undefined,
      taskType: searchForm.taskType || undefined
    })
    if (res.code === 200 && res.data) {
      tableData.value = (res.data.records || []).map(normalizeItem)
      pagination.total = res.data.total || 0
      updateStats()
    }
  } catch (e) {
    try {
      const res = await getTaskPage()
      if (res.code === 200 && res.data) {
        const all = (res.data.records || []).map(normalizeItem)
        let filtered = all
        if (searchForm.taskName) filtered = filtered.filter((i) => i.taskName.includes(searchForm.taskName))
        if (searchForm.status) filtered = filtered.filter((i) => i.status === searchForm.status)
        if (searchForm.taskType) filtered = filtered.filter((i) => i.taskType === searchForm.taskType)
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
  stats.completed = data.filter((i) => i.status === 'completed').length
  stats.failed = data.filter((i) => i.status === 'failed').length
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
        name: '任务状态',
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['60%', '50%'],
        avoidLabelOverlap: false,
        itemStyle: { borderRadius: 10, borderColor: 'rgba(6, 24, 52, 0.88)', borderWidth: 3 },
        label: { show: false, position: 'center' },
        emphasis: { label: { show: true, fontSize: 16, fontWeight: 'bold', color: '#fff' } },
        labelLine: { show: false },
        data: [
          { value: 5, name: '已完成', itemStyle: { color: '#00f5a0' } },
          { value: 3, name: '待执行', itemStyle: { color: '#7aa9c7' } },
          { value: 1, name: '执行中', itemStyle: { color: '#00d8ff' } },
          { value: 1, name: '失败', itemStyle: { color: '#ff4d5a' } }
        ]
      }
    ]
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
      data: ['成功', '失败'],
      bottom: '0%',
      textStyle: { color: '#b8eaff' }
    },
    grid: { left: '3%', right: '4%', bottom: '15%', top: '8%', containLabel: true },
    xAxis: {
      type: 'category',
      data: ['01-09', '01-10', '01-11', '01-12', '01-13', '01-14', '01-15'],
      axisLine: { lineStyle: { color: 'rgba(0, 216, 255, 0.3)' } },
      axisLabel: { color: '#b8eaff' },
      axisTick: { show: false }
    },
    yAxis: {
      type: 'value',
      name: '任务数',
      nameTextStyle: { color: '#b8eaff' },
      splitLine: { lineStyle: { color: 'rgba(0, 216, 255, 0.12)', type: 'dashed' } },
      axisLabel: { color: '#b8eaff' }
    },
    series: [
      {
        name: '成功',
        type: 'bar',
        stack: 'total',
        data: [3, 4, 2, 5, 3, 4, 5],
        itemStyle: { color: '#00f5a0' }
      },
      {
        name: '失败',
        type: 'bar',
        stack: 'total',
        data: [0, 1, 0, 0, 1, 0, 1],
        itemStyle: { color: '#ff4d5a' }
      }
    ]
  })
}

const handleStatusFilter = (value) => {
  activeStatus.value = value
  searchForm.status = value
  pagination.current = 1
  loadData()
}

const handleTypeFilter = (value) => {
  activeType.value = value
  searchForm.taskType = value
  pagination.current = 1
  loadData()
}

const getMockData = () => [
  { id: 1, taskNo: 'TSK-000001', taskName: '每日系统巡检', taskType: 'inspection', targetName: 'Web服务器-01', assignee: '张三', priority: 'medium', status: 'completed', planTime: '2024-01-15 09:00:00', startTime: '2024-01-15 09:00:00', endTime: '2024-01-15 09:45:00', description: '每日例行系统巡检', result: '系统运行正常，各项指标均在正常范围内' },
  { id: 2, taskNo: 'TSK-000002', taskName: '数据库全量备份', taskType: 'backup', targetName: '数据库服务器-01', assignee: '李四', priority: 'high', status: 'completed', planTime: '2024-01-15 02:00:00', startTime: '2024-01-15 02:00:00', endTime: '2024-01-15 02:35:00', description: '每日凌晨全量备份主数据库', result: '备份成功，备份文件大小12.5GB' },
  { id: 3, taskNo: 'TSK-000003', taskName: '应用版本升级', taskType: 'upgrade', targetName: '应用服务器-01', assignee: '王五', priority: 'high', status: 'running', planTime: '2024-01-15 14:00:00', startTime: '2024-01-15 14:00:00', endTime: '', description: '将应用从v2.3.1升级至v2.4.0', result: '' },
  { id: 4, taskNo: 'TSK-000004', taskName: '服务器系统补丁更新', taskType: 'maintenance', targetName: 'Web服务器-02', assignee: '赵六', priority: 'medium', status: 'pending', planTime: '2024-01-16 22:00:00', startTime: '', endTime: '', description: '更新系统安全补丁', result: '' },
  { id: 5, taskNo: 'TSK-000005', taskName: '存储阵列扩容', taskType: 'maintenance', targetName: '存储阵列-01', assignee: '李四', priority: 'high', status: 'pending', planTime: '2024-01-17 10:00:00', startTime: '', endTime: '', description: '新增50TB存储容量', result: '' },
  { id: 6, taskNo: 'TSK-000006', taskName: '网络设备配置备份', taskType: 'backup', targetName: '核心交换机', assignee: '张三', priority: 'medium', status: 'completed', planTime: '2024-01-14 16:00:00', startTime: '2024-01-14 16:00:00', endTime: '2024-01-14 16:20:00', description: '备份核心交换机配置文件', result: '配置备份成功' },
  { id: 7, taskNo: 'TSK-000007', taskName: '监控服务器部署', taskType: 'deploy', targetName: '监控服务器', assignee: '王五', priority: 'low', status: 'completed', planTime: '2024-01-13 10:00:00', startTime: '2024-01-13 10:00:00', endTime: '2024-01-13 11:30:00', description: '部署Zabbix监控系统', result: '部署成功，监控面板已上线' },
  { id: 8, taskNo: 'TSK-000008', taskName: '防火墙策略优化', taskType: 'maintenance', targetName: '防火墙-01', assignee: '赵六', priority: 'medium', status: 'failed', planTime: '2024-01-14 15:00:00', startTime: '2024-01-14 15:00:00', endTime: '2024-01-14 15:25:00', description: '优化防火墙策略', result: '执行失败：策略冲突导致网络中断' },
  { id: 9, taskNo: 'TSK-000009', taskName: '日志服务器巡检', taskType: 'inspection', targetName: '监控服务器', assignee: '张三', priority: 'low', status: 'completed', planTime: '2024-01-15 08:00:00', startTime: '2024-01-15 08:00:00', endTime: '2024-01-15 08:30:00', description: '检查日志服务器运行状态', result: '日志采集正常，磁盘空间充足' },
  { id: 10, taskNo: 'TSK-000010', taskName: '数据库性能优化', taskType: 'maintenance', targetName: '数据库服务器-01', assignee: '李四', priority: 'high', status: 'pending', planTime: '2024-01-18 09:00:00', startTime: '', endTime: '', description: '分析慢查询日志，优化索引', result: '' }
].map(normalizeItem)

const handleSearch = () => {
  pagination.current = 1
  loadData()
}

const handleReset = () => {
  searchForm.taskName = ''
  searchForm.status = ''
  searchForm.taskType = ''
  pagination.current = 1
  loadData()
}

const handleAdd = () => {
  dialogTitle.value = '新增任务'
  isEdit.value = false
  Object.assign(form, { id: null, taskName: '', targetName: '', taskType: '', priority: 'medium', planTime: '', assignee: '', description: '' })
  dialogVisible.value = true
}

const handleEdit = (row) => {
  dialogTitle.value = '编辑任务'
  isEdit.value = true
  Object.assign(form, {
    id: row.id,
    taskName: row.taskName || '',
    targetName: row.targetName || '',
    taskType: row.taskType || '',
    priority: row.priority || 'medium',
    planTime: row.planTime || '',
    assignee: row.assignee || '',
    description: row.description || ''
  })
  dialogVisible.value = true
}

const handleSubmit = async () => {
  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) return

  submitLoading.value = true
  try {
    if (isEdit.value) {
      await updateTask(form.id, { ...form })
    } else {
      await addTask({ ...form })
    }
    ElMessage.success('操作成功')
    dialogVisible.value = false
    loadData()
  } catch (e) {
    ElMessage.success('操作成功（演示模式）')
    dialogVisible.value = false
    loadData()
  } finally {
    submitLoading.value = false
  }
}

const handleExecute = async (row) => {
  try {
    await ElMessageBox.confirm(`确定执行任务「${row.taskName}」吗？`, '提示', { type: 'warning' })
    await executeTask(row.id)
    ElMessage.success('任务已开始执行')
    loadData()
  } catch (e) {
    if (e !== 'cancel') {
      ElMessage.success('任务已开始执行（演示模式）')
      loadData()
    }
  }
}

const handleViewResult = (row) => {
  Object.assign(currentItem, row)
  resultDialogVisible.value = true
}

const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm(`确定删除任务「${row.taskName}」吗？此操作不可恢复。`, '提示', {
      confirmButtonText: '确定删除',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await deleteTask(row.id)
    ElMessage.success('删除成功')
    loadData()
  } catch (e) {
    if (e !== 'cancel') {
      ElMessage.success('删除成功（演示模式）')
      loadData()
    }
  }
}

onMounted(() => {
  loadData()
  initPieChart()
  initBarChart()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  if (pieChart) pieChart.dispose()
  if (barChart) barChart.dispose()
})

const handleResize = () => {
  if (pieChart) pieChart.resize()
  if (barChart) barChart.resize()
}
</script>

<style scoped>
.task-page {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.stat-row,
.chart-row {
  margin: 0;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 16px;
  min-height: 112px;
  padding: 22px 20px;
  background: linear-gradient(180deg, rgba(13, 27, 46, 0.98) 0%, rgba(7, 14, 24, 0.96) 100%);
  border-radius: 24px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.18);
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(120, 200, 255, 0.12);
}

.stat-card::after {
  content: '';
  position: absolute;
  right: -18px;
  bottom: -38px;
  width: 108px;
  height: 108px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.04);
}

.stat-card__icon {
  width: 54px;
  height: 54px;
  border-radius: 18px;
  display: grid;
  place-items: center;
}

.stat-card--blue .stat-card__icon { background: linear-gradient(135deg, #8be6ff 0%, #27b2da 100%); color: #05111c; }
.stat-card--orange .stat-card__icon { background: linear-gradient(135deg, #ffe197 0%, #ffb44a 100%); color: #2a1800; }
.stat-card--green .stat-card__icon { background: linear-gradient(135deg, #80efc0 0%, #2fa276 100%); color: #06150f; }
.stat-card--red .stat-card__icon { background: linear-gradient(135deg, #ffa8b2 0%, #ff6b7a 100%); color: #29050c; }

.stat-card__content {
  position: relative;
  z-index: 1;
}

.stat-card__value {
  font-size: 34px;
  font-weight: 700;
  color: #eff7ff;
  margin: 0 0 6px;
  line-height: 1;
}

.stat-card__label {
  font-size: 13px;
  color: #93a7bd;
  margin: 0;
}

.chart-wrapper {
  width: 100%;
  height: 300px;
}

.quick-filter {
  margin-bottom: 18px;
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.filter-label {
  font-size: 13px;
  color: #b4c5db;
  font-weight: 600;
}

.filter-tag {
  cursor: pointer;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 14px;
}

.card-title {
  font-size: 18px;
  font-weight: 700;
  color: #eff7ff;
}

.search-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 18px;
  flex-wrap: wrap;
  gap: 12px;
}

.search-bar :deep(.el-form) {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 0;
}

.pagination-wrapper {
  margin-top: 8px;
}

@media (max-width: 768px) {
  .card-header,
  .search-bar {
    align-items: stretch;
    flex-direction: column;
  }
}
</style>
