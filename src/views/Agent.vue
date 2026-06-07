<template>
  <div class="agent-page">
    <el-row :gutter="20" class="stat-row">
      <el-col :xs="12" :sm="6">
        <div class="stat-card stat-card--blue">
          <div class="stat-card__icon"><el-icon :size="28"><Robot /></el-icon></div>
          <div class="stat-card__content">
            <p class="stat-card__value">{{ agentStats.total }}</p>
            <p class="stat-card__label">Agent总数</p>
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="6">
        <div class="stat-card stat-card--green">
          <div class="stat-card__icon"><el-icon :size="28"><CircleCheck /></el-icon></div>
          <div class="stat-card__content">
            <p class="stat-card__value">{{ agentStats.online }}</p>
            <p class="stat-card__label">在线Agent</p>
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="6">
        <div class="stat-card stat-card--orange">
          <div class="stat-card__icon"><el-icon :size="28"><List /></el-icon></div>
          <div class="stat-card__content">
            <p class="stat-card__value">{{ agentStats.todayTasks }}</p>
            <p class="stat-card__label">今日执行任务</p>
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="6">
        <div class="stat-card stat-card--red">
          <div class="stat-card__icon"><el-icon :size="28"><Warning /></el-icon></div>
          <div class="stat-card__content">
            <p class="stat-card__value">{{ agentStats.error }}</p>
            <p class="stat-card__label">异常Agent</p>
          </div>
        </div>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="chart-row">
      <el-col :xs="24" :md="12">
        <el-card shadow="never">
          <template #header>
            <div class="card-header">
              <span class="card-title">Agent工作流可视化</span>
              <el-select v-model="selectedWorkflow" placeholder="选择工作流" size="small" style="width: 180px" @change="updateWorkflowChart">
                <el-option v-for="wf in workflows" :key="wf" :label="wf" :value="wf" />
              </el-select>
            </div>
          </template>
          <div ref="workflowChartRef" class="chart-container"></div>
        </el-card>
      </el-col>
      <el-col :xs="24" :md="12">
        <el-card shadow="never">
          <template #header>
            <div class="card-header">
              <span class="card-title">任务执行趋势</span>
              <el-radio-group v-model="taskTrendRange" size="small" @change="updateTaskTrendChart">
                <el-radio-button label="week">近7天</el-radio-button>
                <el-radio-button label="month">近30天</el-radio-button>
              </el-radio-group>
            </div>
          </template>
          <div ref="taskTrendChartRef" class="chart-container"></div>
        </el-card>
      </el-col>
    </el-row>

    <el-card shadow="never" style="margin-bottom: 20px">
      <template #header>
        <div class="card-header">
          <span class="card-title">智能体列表</span>
          <el-button type="primary" size="small" @click="handleAddAgent">
            <el-icon><Plus /></el-icon> 新增Agent
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

      <el-table :data="filteredAgentList" stripe v-loading="loading" style="width: 100%">
        <el-table-column prop="agentName" label="Agent名称" min-width="150" show-overflow-tooltip />
        <el-table-column prop="agentType" label="Agent类型" width="150">
          <template #default="{ row }">
            <el-tag size="small" effect="plain">{{ row.agentType }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="capability" label="负责能力" min-width="160" show-overflow-tooltip />
        <el-table-column prop="tools" label="调用工具" min-width="180" show-overflow-tooltip />
        <el-table-column prop="successRate" label="成功率" width="100" align="center">
          <template #default="{ row }">
            <span :class="getSuccessRateClass(row.successRate)">{{ row.successRate }}%</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="运行状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)" size="small">{{ getStatusText(row.status) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="lastRunTime" label="最近执行时间" width="170" />
        <el-table-column label="操作" width="220" fixed="right" align="center">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="handleView(row)">查看</el-button>
            <el-button type="success" link size="small" @click="handleTestRun(row)">测试</el-button>
            <el-button v-if="row.status === 'online'" type="warning" link size="small" @click="handleStop(row)">停用</el-button>
            <el-button v-if="row.status !== 'online'" type="success" link size="small" @click="handleStart(row)">启动</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-card shadow="never">
      <template #header>
        <div class="card-header">
          <span class="card-title">智能体架构</span>
        </div>
      </template>
      <el-row :gutter="16">
        <el-col :xs="12" :sm="8" :md="6" v-for="item in architecture" :key="item.id">
          <div class="arch-card">
            <div class="arch-header">
              <el-icon :size="20" class="arch-icon"><Monitor /></el-icon>
              <span class="arch-name">{{ item.layerName }}</span>
            </div>
            <p class="arch-framework">{{ item.frameworkName }}</p>
            <p class="arch-desc">{{ item.description }}</p>
            <el-tag :type="item.status === 'active' ? 'success' : 'info'" size="small">
              {{ item.status === 'active' ? '已接入' : '待接入' }}
            </el-tag>
          </div>
        </el-col>
      </el-row>
    </el-card>

    <el-card shadow="never" style="margin-top: 20px">
      <template #header>
        <div class="card-header">
          <span class="card-title">执行日志</span>
          <el-button size="small" class="tech-outline-btn" @click="handleRefreshLogs">
            <el-icon><Refresh /></el-icon> 刷新
          </el-button>
        </div>
      </template>
      <el-table :data="executionLogs" stripe style="width: 100%" max-height="400">
        <el-table-column prop="agentName" label="Agent名称" width="150" show-overflow-tooltip />
        <el-table-column prop="taskName" label="任务名称" min-width="160" show-overflow-tooltip />
        <el-table-column prop="status" label="执行状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="row.status === 'success' ? 'success' : row.status === 'running' ? 'warning' : 'danger'" size="small">
              {{ row.status === 'success' ? '成功' : row.status === 'running' ? '执行中' : '失败' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="duration" label="耗时" width="80" align="center" />
        <el-table-column prop="startTime" label="开始时间" width="170" />
        <el-table-column prop="endTime" label="结束时间" width="170" />
        <el-table-column label="操作" width="80" fixed="right" align="center">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="handleViewLog(row)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="detailVisible" title="Agent详情" width="700px">
      <el-descriptions :column="2" border>
        <el-descriptions-item label="Agent名称">{{ currentItem.agentName }}</el-descriptions-item>
        <el-descriptions-item label="Agent类型">{{ currentItem.agentType }}</el-descriptions-item>
        <el-descriptions-item label="负责能力" :span="2">{{ currentItem.capability }}</el-descriptions-item>
        <el-descriptions-item label="调用工具" :span="2">{{ currentItem.tools }}</el-descriptions-item>
        <el-descriptions-item label="描述" :span="2">{{ currentItem.description }}</el-descriptions-item>
        <el-descriptions-item label="运行状态">
          <el-tag :type="getStatusType(currentItem.status)" size="small">{{ getStatusText(currentItem.status) }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="成功率">{{ currentItem.successRate }}%</el-descriptions-item>
        <el-descriptions-item label="最近执行时间">{{ currentItem.lastRunTime }}</el-descriptions-item>
        <el-descriptions-item label="累计执行次数">{{ currentItem.totalRuns }}</el-descriptions-item>
      </el-descriptions>
    </el-dialog>

    <el-dialog v-model="logDetailVisible" title="执行日志详情" width="600px">
      <el-descriptions :column="1" border>
        <el-descriptions-item label="Agent名称">{{ currentLog.agentName }}</el-descriptions-item>
        <el-descriptions-item label="任务名称">{{ currentLog.taskName }}</el-descriptions-item>
        <el-descriptions-item label="执行状态">
          <el-tag :type="currentLog.status === 'success' ? 'success' : currentLog.status === 'running' ? 'warning' : 'danger'" size="small">
            {{ currentLog.status === 'success' ? '成功' : currentLog.status === 'running' ? '执行中' : '失败' }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="耗时">{{ currentLog.duration }}</el-descriptions-item>
        <el-descriptions-item label="开始时间">{{ currentLog.startTime }}</el-descriptions-item>
        <el-descriptions-item label="结束时间">{{ currentLog.endTime }}</el-descriptions-item>
        <el-descriptions-item label="执行详情" :span="2">
          <el-input v-model="currentLog.detail" type="textarea" :rows="6" readonly />
        </el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted, computed } from 'vue'
import { ElMessage } from 'element-plus'
import * as echarts from 'echarts'
import { getAgentList, getAgentStatistics, getAgentArchitecture, startAgent, stopAgent, testRunAgent } from '../api/agent'

const loading = ref(false)
const agentList = ref([])
const architecture = ref([])
const detailVisible = ref(false)
const logDetailVisible = ref(false)
const currentItem = reactive({})
const currentLog = reactive({})
const agentStats = reactive({ total: 0, online: 0, offline: 0, error: 0, todayTasks: 0 })

const activeFilter = ref('all')
const selectedWorkflow = ref('')
const workflows = ref([])
const taskTrendRange = ref('week')
const executionLogs = ref([])
const workflowChartRef = ref(null)
const taskTrendChartRef = ref(null)
let workflowChart = null
let taskTrendChart = null

const filterTags = [
  { label: '全部', value: 'all' },
  { label: '在线', value: 'online' },
  { label: '离线', value: 'offline' },
  { label: '异常', value: 'error' },
  { label: '预测类', value: '预测' },
  { label: '问答类', value: '问答' }
]

const filteredAgentList = computed(() => {
  if (activeFilter.value === 'all') return agentList.value
  if (['online', 'offline', 'error'].includes(activeFilter.value)) {
    return agentList.value.filter(item => item.status === activeFilter.value)
  }
  return agentList.value.filter(item => item.agentType.includes(activeFilter.value))
})

const statusMap = {
  online: { type: 'success', text: '在线' },
  offline: { type: 'info', text: '离线' },
  error: { type: 'danger', text: '异常' }
}

const getStatusType = (status) => statusMap[status]?.type || 'info'
const getStatusText = (status) => statusMap[status]?.text || status

const getSuccessRateClass = (rate) => {
  if (!rate) return ''
  if (rate >= 95) return 'success-rate-high'
  if (rate >= 90) return 'success-rate-medium'
  return 'success-rate-low'
}

const loadData = async () => {
  loading.value = true
  try {
    const res = await getAgentList()
    if (res.code === 200 && Array.isArray(res.data)) agentList.value = res.data
  } catch (e) {
    console.warn('Agent接口异常，使用演示数据')
    agentList.value = getMockAgents()
  }
  try {
    const res = await getAgentStatistics()
    if (res.code === 200 && res.data) Object.assign(agentStats, res.data)
  } catch (e) {
    agentStats.total = 10
    agentStats.online = 7
    agentStats.offline = 2
    agentStats.error = 1
    agentStats.todayTasks = 356
  }
  try {
    const res = await getAgentArchitecture()
    if (res.code === 200 && Array.isArray(res.data)) architecture.value = res.data
  } catch (e) {
    architecture.value = getMockArchitecture()
  } finally {
    loading.value = false
  }
}

const getMockAgents = () => [
  { id: 1, agentName: '能耗预测Agent', agentType: '预测/推断类Agent', capability: '建筑能耗时序预测', tools: '能耗预测模型,气象数据API,日历服务', status: 'online', successRate: 96.5, totalRuns: 15234, lastRunTime: '2024-01-15 14:30:00', description: '基于深度学习模型进行能耗预测' },
  { id: 2, agentName: '故障诊断Agent', agentType: '预测/推断类Agent', capability: '设备故障诊断与预测', tools: '故障诊断模型,传感器数据服务,设备台账', status: 'online', successRate: 95.2, totalRuns: 12890, lastRunTime: '2024-01-15 14:25:00', description: '实时分析设备传感器数据' },
  { id: 3, agentName: '知识问答Agent', agentType: '知识问答Agent', capability: '运维知识智能问答', tools: 'RAGFlow知识库,大模型服务', status: 'online', successRate: 98.0, totalRuns: 23456, lastRunTime: '2024-01-15 14:20:00', description: '基于知识库的智能问答服务' },
  { id: 4, agentName: '报表生成Agent', agentType: '报表/告警生成Agent', capability: '自动生成运维报表', tools: '数据查询服务,报表模板引擎', status: 'online', successRate: 99.1, totalRuns: 8567, lastRunTime: '2024-01-15 14:15:00', description: '自动生成日报、周报、月报' },
  { id: 5, agentName: '告警分析Agent', agentType: '报表/告警生成Agent', capability: '告警分析与通知', tools: '告警服务,通知服务,大模型', status: 'online', successRate: 94.8, totalRuns: 5678, lastRunTime: '2024-01-15 14:10:00', description: '分析告警趋势并生成通知' },
  { id: 6, agentName: '总指挥Agent', agentType: '总指挥Agent', capability: '任务调度与协调', tools: '所有Agent接口,任务调度服务', status: 'online', successRate: 97.3, totalRuns: 34567, lastRunTime: '2024-01-15 14:30:00', description: '协调各Agent协同工作' },
  { id: 7, agentName: '数据查询Agent', agentType: '数据查询类Agent', capability: '自然语言数据查询', tools: '数据库服务,NL2SQL引擎', status: 'online', successRate: 93.5, totalRuns: 9876, lastRunTime: '2024-01-15 14:05:00', description: '支持自然语言查询数据库' },
  { id: 8, agentName: '策略优化Agent', agentType: '控制/优化类Agent', capability: '设备控制策略优化', tools: '强化学习服务,设备控制接口', status: 'offline', successRate: 91.2, totalRuns: 4567, lastRunTime: '2024-01-15 10:00:00', description: '基于强化学习优化控制策略' },
  { id: 9, agentName: '碳排放分析Agent', agentType: '预测/推断类Agent', capability: '碳排放核算与分析', tools: '碳排放模型,能耗数据服务', status: 'offline', successRate: 92.8, totalRuns: 3456, lastRunTime: '2024-01-14 16:00:00', description: '核算建筑碳排放并分析趋势' },
  { id: 10, agentName: '客流预测Agent', agentType: '预测/推断类Agent', capability: '建筑客流预测分析', tools: '客流预测模型,历史数据服务', status: 'error', successRate: 87.5, totalRuns: 2345, lastRunTime: '2024-01-15 12:00:00', description: '预测建筑客流变化趋势' }
]

const getMockArchitecture = () => [
  { id: 1, layerName: '感知层', frameworkName: 'LangChain', description: '负责感知外部信息，包括工具调用、数据获取、API集成', status: 'active' },
  { id: 2, layerName: '大脑层', frameworkName: 'LangGraph', description: 'Agent核心推理与决策层，支持多Agent协作与状态管理', status: 'active' },
  { id: 3, layerName: '监控层', frameworkName: 'LangSmith', description: 'Agent运行监控、调试、评估与可观测性管理', status: 'active' },
  { id: 4, layerName: 'MCP框架', frameworkName: 'Server + Client', description: 'Model Context Protocol，标准化模型上下文交互协议', status: 'pending' },
  { id: 5, layerName: 'Harness Engineering', frameworkName: 'Agent编排', description: 'Agent工程化编排与部署管理框架', status: 'pending' }
]

const getMockLogs = () => [
  { id: 1, agentName: '能耗预测Agent', taskName: '生成今日能耗预测', status: 'success', duration: '2.3s', startTime: '2024-01-15 14:30:00', endTime: '2024-01-15 14:30:02', detail: '成功调用LSTM模型，输入历史7天能耗数据，输出未来24小时预测值。预测准确率：96.5%，置信区间：[0.92, 0.98]。' },
  { id: 2, agentName: '故障诊断Agent', taskName: '分析空调传感器数据', status: 'success', duration: '1.8s', startTime: '2024-01-15 14:25:00', endTime: '2024-01-15 14:25:01', detail: '检测到3号压缩机振动频率异常，故障概率：85.2%，建议安排维护检查。' },
  { id: 3, agentName: '知识问答Agent', taskName: '回答用户查询', status: 'success', duration: '3.5s', startTime: '2024-01-15 14:20:00', endTime: '2024-01-15 14:20:03', detail: '从运维知识库检索到相关文档5篇，生成综合回答，用户满意度：4.8/5.0。' },
  { id: 4, agentName: '报表生成Agent', taskName: '生成月度能耗报告', status: 'success', duration: '5.2s', startTime: '2024-01-15 14:15:00', endTime: '2024-01-15 14:15:05', detail: '成功汇总本月能耗数据，生成PDF报告并发送至管理员邮箱。总用电量：45,230kWh，环比下降8.5%。' },
  { id: 5, agentName: '告警分析Agent', taskName: '分析告警趋势', status: 'success', duration: '2.1s', startTime: '2024-01-15 14:10:00', endTime: '2024-01-15 14:10:02', detail: '今日告警总数：23条，较昨日下降15%。主要告警类型：温度异常(40%)、通信中断(30%)。' },
  { id: 6, agentName: '总指挥Agent', taskName: '协调今日任务调度', status: 'running', duration: '-', startTime: '2024-01-15 14:30:00', endTime: '-', detail: '正在协调各Agent执行今日任务，当前进度：65%。已分配任务：23个，完成：15个，执行中：8个。' },
  { id: 7, agentName: '数据查询Agent', taskName: '查询A栋能耗数据', status: 'success', duration: '0.8s', startTime: '2024-01-15 14:05:00', endTime: '2024-01-15 14:05:00', detail: '执行SQL查询：SELECT * FROM energy_data WHERE building_id = "A" AND date = "2024-01-14"。返回记录：144条。' },
  { id: 8, agentName: '客流预测Agent', taskName: '预测下周客流', status: 'error', duration: '0.5s', startTime: '2024-01-15 12:00:00', endTime: '2024-01-15 12:00:00', detail: '错误：模型加载失败。原因：内存不足。建议：释放系统资源或降低模型复杂度。' }
]

const handleAddAgent = () => {
  ElMessage.info('新增Agent功能（演示模式）')
}

const handleView = (row) => {
  Object.assign(currentItem, row)
  detailVisible.value = true
}

const handleStart = async (row) => {
  try {
    await startAgent(row.id)
    ElMessage.success('Agent已启动')
    loadData()
  } catch (e) {
    ElMessage.success('Agent已启动（演示模式）')
    row.status = 'online'
  }
}

const handleStop = async (row) => {
  try {
    await stopAgent(row.id)
    ElMessage.success('Agent已停用')
    loadData()
  } catch (e) {
    ElMessage.success('Agent已停用（演示模式）')
    row.status = 'offline'
  }
}

const handleTestRun = async (row) => {
  try {
    const res = await testRunAgent(row.id)
    if (res.code === 200) {
      ElMessage.success(`测试执行成功，耗时 ${res.data.duration}`)
    }
  } catch (e) {
    ElMessage.success('测试执行成功（演示模式）')
  }
}

const handleRefreshLogs = () => {
  executionLogs.value = getMockLogs()
  ElMessage.success('日志已刷新')
}

const handleViewLog = (row) => {
  Object.assign(currentLog, row)
  logDetailVisible.value = true
}

const initWorkflowChart = () => {
  if (!workflowChartRef.value) return
  workflowChart = echarts.init(workflowChartRef.value)
  workflows.value = ['能耗预测工作流', '故障诊断工作流', '报表生成工作流', '知识问答工作流']
  selectedWorkflow.value = workflows.value[0]
  updateWorkflowChart()
}

const updateWorkflowChart = () => {
  if (!workflowChart) return
  const nodes = [
    { name: '开始', x: 50, y: 50, category: 0 },
    { name: '数据获取', x: 200, y: 50, category: 1 },
    { name: '数据预处理', x: 350, y: 50, category: 1 },
    { name: '模型推理', x: 500, y: 50, category: 2 },
    { name: '结果验证', x: 650, y: 50, category: 3 },
    { name: '输出结果', x: 800, y: 50, category: 4 },
    { name: '结束', x: 950, y: 50, category: 0 }
  ]
  const links = [
    { source: '开始', target: '数据获取' },
    { source: '数据获取', target: '数据预处理' },
    { source: '数据预处理', target: '模型推理' },
    { source: '模型推理', target: '结果验证' },
    { source: '结果验证', target: '输出结果' },
    { source: '输出结果', target: '结束' }
  ]

  workflowChart.setOption({
    tooltip: {
      backgroundColor: 'rgba(6, 24, 52, 0.92)',
      borderColor: 'rgba(0, 216, 255, 0.35)',
      textStyle: { color: '#b8eaff' }
    },
    animationDurationUpdate: 1500,
    animationEasingUpdate: 'quinticInOut',
    series: [
      {
        type: 'graph',
        layout: 'none',
        symbolSize: 50,
        roam: true,
        label: { show: true, fontSize: 12, color: '#b8eaff' },
        edgeSymbol: ['circle', 'arrow'],
        edgeSymbolSize: [4, 10],
        data: nodes.map(n => ({
          ...n,
          itemStyle: { color: ['#00d8ff', '#00f5a0', '#ffcc33', '#ff4d5a', '#7aa9c7'][n.category] }
        })),
        links: links.map(l => ({
          ...l,
          lineStyle: { color: '#00d8ff', curveness: 0.1, width: 2, opacity: 0.6 }
        })),
        lineStyle: { opacity: 0.6, width: 2, curveness: 0 }
      }
    ]
  })
}

const initTaskTrendChart = () => {
  if (!taskTrendChartRef.value) return
  taskTrendChart = echarts.init(taskTrendChartRef.value)
  updateTaskTrendChart()
}

const updateTaskTrendChart = () => {
  if (!taskTrendChart) return
  const isWeek = taskTrendRange.value === 'week'
  const days = isWeek ? ['01-09', '01-10', '01-11', '01-12', '01-13', '01-14', '01-15'] : Array.from({ length: 30 }, (_, i) => `${i + 1}日`)
  const successData = isWeek ? [45, 52, 48, 60, 55, 68, 62] : Array.from({ length: 30 }, () => Math.floor(Math.random() * 30 + 40))
  const failData = isWeek ? [2, 1, 3, 1, 2, 1, 2] : Array.from({ length: 30 }, () => Math.floor(Math.random() * 3 + 1))

  taskTrendChart.setOption({
    tooltip: {
      trigger: 'axis',
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
      boundaryGap: false,
      data: days,
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
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
        data: successData,
        itemStyle: { color: '#00f5a0' },
        lineStyle: { width: 2, color: '#00f5a0' },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(0, 245, 160, 0.2)' },
            { offset: 1, color: 'rgba(0, 245, 160, 0.02)' }
          ])
        }
      },
      {
        name: '失败',
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
        data: failData,
        itemStyle: { color: '#ff4d5a' },
        lineStyle: { width: 2, color: '#ff4d5a' },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(255, 77, 90, 0.2)' },
            { offset: 1, color: 'rgba(255, 77, 90, 0.02)' }
          ])
        }
      }
    ]
  })
}

const handleResize = () => {
  workflowChart?.resize()
  taskTrendChart?.resize()
}

onMounted(() => {
  loadData().then(() => {
    executionLogs.value = getMockLogs()
    setTimeout(() => {
      initWorkflowChart()
      initTaskTrendChart()
    }, 300)
  })
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  workflowChart?.dispose()
  taskTrendChart?.dispose()
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.agent-page {
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
  flex-shrink: 0;
}

.stat-card--blue .stat-card__icon { background: linear-gradient(135deg, #8be6ff 0%, #27b2da 100%); color: #05111c; }
.stat-card--green .stat-card__icon { background: linear-gradient(135deg, #80efc0 0%, #2fa276 100%); color: #06150f; }
.stat-card--orange .stat-card__icon { background: linear-gradient(135deg, #ffe197 0%, #ffb44a 100%); color: #2a1800; }
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

.chart-container {
  width: 100%;
  height: 320px;
}

.filter-tags {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 18px;
  padding: 14px 16px;
  background: rgba(9, 19, 34, 0.72);
  border: 1px solid rgba(120, 200, 255, 0.1);
  border-radius: 18px;
}

.filter-label {
  font-size: 13px;
  color: #b4c5db;
  margin-right: 6px;
  font-weight: 600;
}

.filter-tag {
  cursor: pointer;
}

.success-rate-high {
  color: #41d39d;
  font-weight: 600;
}

.success-rate-medium {
  color: #ffd166;
  font-weight: 600;
}

.success-rate-low {
  color: #ff6b7a;
  font-weight: 600;
}

.arch-card {
  background: rgba(9, 19, 34, 0.72);
  border-radius: 20px;
  padding: 18px;
  margin-bottom: 16px;
  border: 1px solid rgba(120, 200, 255, 0.1);
}

.arch-header {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.arch-icon {
  color: #66d9ff;
  margin-right: 8px;
}

.arch-name {
  font-size: 14px;
  font-weight: 600;
  color: #eff7ff;
}

.arch-framework {
  font-size: 12px;
  color: #66d9ff;
  margin: 0 0 8px;
  font-weight: 500;
}

.arch-desc {
  font-size: 12px;
  color: #93a7bd;
  margin: 0 0 10px;
  line-height: 1.5;
  min-height: 36px;
}

@media (max-width: 768px) {
  .card-header {
    align-items: stretch;
    flex-direction: column;
  }
}
</style>
