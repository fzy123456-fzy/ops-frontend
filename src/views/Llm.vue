<template>
  <div class="llm-page">
    <el-row :gutter="20" class="stat-row">
      <el-col :xs="12" :sm="6">
        <div class="stat-card stat-card--blue">
          <div class="stat-card__icon"><el-icon :size="28"><Cpu /></el-icon></div>
          <div class="stat-card__content">
            <p class="stat-card__value">{{ statusData.modelStatus === 'online' ? '在线' : '离线' }}</p>
            <p class="stat-card__label">本地模型状态</p>
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="6">
        <div class="stat-card stat-card--green">
          <div class="stat-card__icon"><el-icon :size="28"><Files /></el-icon></div>
          <div class="stat-card__content">
            <p class="stat-card__value">{{ statusData.kbCount }}</p>
            <p class="stat-card__label">知识库数量</p>
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="6">
        <div class="stat-card stat-card--orange">
          <div class="stat-card__icon"><el-icon :size="28"><Clock /></el-icon></div>
          <div class="stat-card__content">
            <p class="stat-card__value">{{ statusData.shortMemoryCount }}</p>
            <p class="stat-card__label">短期记忆条数</p>
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="6">
        <div class="stat-card stat-card--purple">
          <div class="stat-card__icon"><el-icon :size="28"><Folder /></el-icon></div>
          <div class="stat-card__content">
            <p class="stat-card__value">{{ statusData.longMemoryCount }}</p>
            <p class="stat-card__label">长期记忆条数</p>
          </div>
        </div>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="chart-row">
      <el-col :xs="24" :md="16">
        <el-card shadow="never">
          <template #header>
            <div class="card-header">
              <span class="card-title">对话测试</span>
              <el-button size="small" class="danger-outline-btn" @click="clearChat">
                <el-icon><Delete /></el-icon> 清空对话
              </el-button>
            </div>
          </template>
          <div ref="chatContainer" class="chat-box">
            <div v-for="(msg, index) in chatMessages" :key="index" :class="['chat-message', msg.role === 'user' ? 'user-message' : 'ai-message']">
              <div class="message-avatar">
                <el-icon :size="20"><component :is="msg.role === 'user' ? 'User' : 'Cpu'" /></el-icon>
              </div>
              <div class="message-content">
                <p class="message-text">{{ msg.content }}</p>
                <p class="message-time">{{ msg.time }}</p>
              </div>
            </div>
            <div v-if="chatLoading" class="chat-message ai-message">
              <div class="message-avatar"><el-icon :size="20"><Cpu /></el-icon></div>
              <div class="message-content">
                <div class="typing-indicator">
                  <span></span><span></span><span></span>
                </div>
              </div>
            </div>
          </div>
          <div class="chat-input-area">
            <el-input
              v-model="chatInput"
              type="textarea"
              :rows="2"
              placeholder="输入问题测试大模型回答..."
              @keydown.enter.exact.prevent="sendMessage"
              :disabled="chatLoading"
            />
            <el-button type="primary" @click="sendMessage" :loading="chatLoading" style="margin-top: 8px">
              <el-icon><Promotion /></el-icon> 发送
            </el-button>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :md="8">
        <el-card shadow="never">
          <template #header>
            <div class="card-header">
              <span class="card-title">模型调用统计</span>
              <el-radio-group v-model="callStatsRange" size="small" @change="updateCallStatsChart">
                <el-radio-button label="week">近7天</el-radio-button>
                <el-radio-button label="month">近30天</el-radio-button>
              </el-radio-group>
            </div>
          </template>
          <div ref="callStatsChartRef" class="chart-container"></div>
        </el-card>
        <el-card shadow="never" style="margin-top: 20px">
          <template #header>
            <span class="card-title">知识库分布</span>
          </template>
          <div ref="kbPieChartRef" class="chart-container-small"></div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :xs="24" :md="12">
        <el-card shadow="never" style="margin-bottom: 20px">
          <template #header>
            <div class="card-header">
              <span class="card-title">RAGFlow知识库</span>
              <el-button type="primary" size="small" @click="handleAddKb">
                <el-icon><Plus /></el-icon> 新增知识库
              </el-button>
            </div>
          </template>

          <div class="filter-tags">
            <span class="filter-label">快速筛选：</span>
            <el-tag
              v-for="tag in kbFilterTags"
              :key="tag.value"
              :effect="activeKbFilter === tag.value ? 'dark' : 'plain'"
              :type="activeKbFilter === tag.value ? '' : 'info'"
              class="filter-tag"
              @click="activeKbFilter = tag.value"
            >
              {{ tag.label }}
            </el-tag>
          </div>

          <el-table :data="filteredKnowledgeBases" stripe v-loading="loading" style="width: 100%">
            <el-table-column prop="kbName" label="知识库名称" min-width="140" show-overflow-tooltip />
            <el-table-column prop="documentCount" label="文档数量" width="100" align="center" sortable />
            <el-table-column prop="vectorStatus" label="向量化状态" width="110" align="center">
              <template #default="{ row }">
                <el-tag :type="row.vectorStatus === 'completed' ? 'success' : 'warning'" size="small">
                  {{ row.vectorStatus === 'completed' ? '已完成' : '处理中' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="updatedAt" label="最近更新" width="160" />
            <el-table-column label="操作" width="120" fixed="right" align="center">
              <template #default="{ row }">
                <el-button type="primary" link size="small" @click="handleViewKb(row)">查看</el-button>
                <el-button type="success" link size="small" @click="handleUploadDoc(row)">上传</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
      <el-col :xs="24" :md="12">
        <el-card shadow="never" style="margin-bottom: 20px">
          <template #header>
            <div class="card-header">
              <span class="card-title">记忆管理</span>
              <el-button size="small" class="danger-outline-btn" @click="handleClearMemory">
                <el-icon><Delete /></el-icon> 清理记忆
              </el-button>
            </div>
          </template>

          <div class="filter-tags">
            <span class="filter-label">快速筛选：</span>
            <el-tag
              v-for="tag in memoryFilterTags"
              :key="tag.value"
              :effect="activeMemoryFilter === tag.value ? 'dark' : 'plain'"
              :type="activeMemoryFilter === tag.value ? '' : 'info'"
              class="filter-tag"
              @click="activeMemoryFilter = tag.value"
            >
              {{ tag.label }}
            </el-tag>
          </div>

          <el-table :data="filteredMemories" stripe v-loading="loading" style="width: 100%">
            <el-table-column prop="memoryType" label="记忆类型" width="100" align="center">
              <template #default="{ row }">
                <el-tag :type="row.memoryType === 'short' ? 'warning' : 'success'" size="small">
                  {{ row.memoryType === 'short' ? '短期' : '长期' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="source" label="来源" width="120" show-overflow-tooltip />
            <el-table-column prop="summary" label="内容摘要" min-width="160" show-overflow-tooltip />
            <el-table-column prop="createdAt" label="创建时间" width="160" />
            <el-table-column prop="status" label="状态" width="90" align="center">
              <template #default="{ row }">
                <el-tag :type="row.status === 'active' ? 'success' : 'info'" size="small">
                  {{ row.status === 'active' ? '活跃' : '归档' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="80" fixed="right" align="center">
              <template #default="{ row }">
                <el-button type="danger" link size="small" @click="handleDeleteMemory(row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>

    <el-card shadow="never">
      <template #header>
        <span class="card-title">推理能力</span>
      </template>
      <el-row :gutter="16">
        <el-col :xs="12" :sm="6" v-for="item in reasoningList" :key="item.name">
          <div class="reasoning-card">
            <div class="reasoning-header">
              <el-icon :size="20" class="reasoning-icon"><ChatDotSquare /></el-icon>
              <span class="reasoning-name">{{ item.name }}</span>
            </div>
            <p class="reasoning-desc">{{ item.description }}</p>
            <el-tag :type="item.status === 'active' ? 'success' : 'info'" size="small">
              {{ item.status === 'active' ? '已启用' : '待接入' }}
            </el-tag>
          </div>
        </el-col>
      </el-row>
    </el-card>

    <el-dialog v-model="uploadDocVisible" title="上传文档" width="500px">
      <el-form label-width="100px">
        <el-form-item label="知识库">
          <el-input v-model="uploadDocForm.kbName" disabled />
        </el-form-item>
        <el-form-item label="文档名称">
          <el-input v-model="uploadDocForm.docName" placeholder="请输入文档名称" />
        </el-form-item>
        <el-form-item label="文档类型">
          <el-select v-model="uploadDocForm.docType" placeholder="请选择文档类型">
            <el-option label="PDF" value="pdf" />
            <el-option label="Word" value="word" />
            <el-option label="TXT" value="txt" />
            <el-option label="Markdown" value="md" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleConfirmUpload">确认上传</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted, computed, nextTick } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import * as echarts from 'echarts'
import { getLlmStatus, getKnowledgeBases, getMemories, getReasoningCapabilities } from '../api/llm'

const loading = ref(false)
const knowledgeBases = ref([])
const memories = ref([])
const reasoningList = ref([])
const statusData = reactive({ modelStatus: 'offline', kbCount: 0, shortMemoryCount: 0, longMemoryCount: 0, totalDocuments: 0 })

const chatInput = ref('')
const chatLoading = ref(false)
const chatMessages = ref([
  { role: 'ai', content: '您好！我是智慧运维助手，请问有什么可以帮助您的？', time: new Date().toLocaleTimeString() }
])
const chatContainer = ref(null)

const callStatsRange = ref('week')
const callStatsChartRef = ref(null)
const kbPieChartRef = ref(null)
let callStatsChart = null
let kbPieChart = null

const activeKbFilter = ref('all')
const activeMemoryFilter = ref('all')
const uploadDocVisible = ref(false)
const uploadDocForm = reactive({ kbName: '', docName: '', docType: '' })

const kbFilterTags = [
  { label: '全部', value: 'all' },
  { label: '已完成', value: 'completed' },
  { label: '处理中', value: 'processing' }
]

const memoryFilterTags = [
  { label: '全部', value: 'all' },
  { label: '短期', value: 'short' },
  { label: '长期', value: 'long' },
  { label: '活跃', value: 'active' }
]

const filteredKnowledgeBases = computed(() => {
  if (activeKbFilter.value === 'all') return knowledgeBases.value
  return knowledgeBases.value.filter(item => item.vectorStatus === activeKbFilter.value)
})

const filteredMemories = computed(() => {
  if (activeMemoryFilter.value === 'all') return memories.value
  if (activeMemoryFilter.value === 'active') {
    return memories.value.filter(item => item.status === 'active')
  }
  return memories.value.filter(item => item.memoryType === activeMemoryFilter.value)
})

const loadData = async () => {
  loading.value = true
  try {
    const res = await getLlmStatus()
    if (res.code === 200 && res.data) Object.assign(statusData, res.data)
  } catch (e) {
    console.warn('LLM接口异常，使用演示数据')
    statusData.modelStatus = 'online'
    statusData.kbCount = 5
    statusData.shortMemoryCount = 12
    statusData.longMemoryCount = 8
    statusData.totalDocuments = 156
  }
  try {
    const res = await getKnowledgeBases()
    if (res.code === 200 && Array.isArray(res.data)) knowledgeBases.value = res.data
  } catch (e) {
    knowledgeBases.value = getMockKnowledgeBases()
  }
  try {
    const res = await getMemories()
    if (res.code === 200 && Array.isArray(res.data)) memories.value = res.data
  } catch (e) {
    memories.value = getMockMemories()
  }
  try {
    const res = await getReasoningCapabilities()
    if (res.code === 200 && res.data) {
      reasoningList.value = Object.values(res.data)
    }
  } catch (e) {
    reasoningList.value = getMockReasoning()
  } finally {
    loading.value = false
  }
}

const getMockKnowledgeBases = () => [
  { id: 1, kbName: '运维操作手册', documentCount: 45, vectorStatus: 'completed', description: '设备运维操作标准流程文档', updatedAt: '2024-01-15 14:30:00' },
  { id: 2, kbName: '设备故障案例库', documentCount: 38, vectorStatus: 'completed', description: '历史故障诊断案例与解决方案', updatedAt: '2024-01-15 13:20:00' },
  { id: 3, kbName: '建筑能耗知识库', documentCount: 25, vectorStatus: 'completed', description: '建筑节能技术与能耗优化方案', updatedAt: '2024-01-15 12:10:00' },
  { id: 4, kbName: '碳排放政策库', documentCount: 18, vectorStatus: 'completed', description: '碳排放相关政策法规与标准', updatedAt: '2024-01-14 16:00:00' },
  { id: 5, kbName: 'IoT设备文档', documentCount: 30, vectorStatus: 'processing', description: '传感器与IoT设备技术文档', updatedAt: '2024-01-14 15:00:00' }
]

const getMockMemories = () => [
  { id: 1, memoryType: 'short', source: '用户对话', summary: '用户查询A栋办公楼昨日能耗数据', status: 'active', createdAt: '2024-01-15 14:30:00' },
  { id: 2, memoryType: 'short', source: 'Agent执行', summary: '能耗预测Agent完成今日预测任务', status: 'active', createdAt: '2024-01-15 14:25:00' },
  { id: 3, memoryType: 'long', source: '运维工单', summary: '中央空调系统定期维护记录与经验', status: 'active', createdAt: '2024-01-15 10:00:00' },
  { id: 4, memoryType: 'long', source: '故障诊断', summary: '配电柜过载故障诊断流程总结', status: 'active', createdAt: '2024-01-14 16:00:00' },
  { id: 5, memoryType: 'short', source: '系统事件', summary: 'B栋实验楼温度传感器异常告警', status: 'active', createdAt: '2024-01-15 13:00:00' },
  { id: 6, memoryType: 'long', source: '策略优化', summary: '基于强化学习的空调调度策略优化结果', status: 'active', createdAt: '2024-01-14 14:00:00' },
  { id: 7, memoryType: 'long', source: '用户反馈', summary: '用户对能耗预测准确率的反馈记录', status: 'archived', createdAt: '2024-01-13 10:00:00' },
  { id: 8, memoryType: 'short', source: 'Agent执行', summary: '报表生成Agent完成月度能耗报告', status: 'active', createdAt: '2024-01-15 12:00:00' }
]

const getMockReasoning = () => [
  { name: 'CoT思维链', status: 'active', description: '支持多步推理链，逐步展示推理过程' },
  { name: '子目标拆解', status: 'active', description: '将复杂任务拆解为可执行的子目标序列' },
  { name: '推理规划', status: 'active', description: '基于目标和约束条件生成执行计划' },
  { name: '语义本体', status: 'active', description: '运维领域知识图谱与语义本体管理' }
]

const aiResponses = [
  '根据运维操作手册，建议先检查设备运行状态，然后查看最近的告警记录。',
  'A栋办公楼昨日能耗数据已查询，总用电量为1250kWh，较前日下降8.5%。',
  '基于历史数据分析，该故障类型通常由传感器老化引起，建议安排定期维护。',
  '已为您生成月度能耗报告，报告显示整体能耗趋势呈下降态势，节能效果显著。',
  '根据知识库中的案例，类似问题可通过调整设备运行参数解决，具体方案已发送至您的邮箱。'
]

const sendMessage = async () => {
  if (!chatInput.value.trim()) return
  chatMessages.value.push({ role: 'user', content: chatInput.value, time: new Date().toLocaleTimeString() })
  const userQuestion = chatInput.value
  chatInput.value = ''
  chatLoading.value = true
  await nextTick()
  scrollToBottom()

  await new Promise(resolve => setTimeout(resolve, 1500))

  chatMessages.value.push({
    role: 'ai',
    content: aiResponses[Math.floor(Math.random() * aiResponses.length)],
    time: new Date().toLocaleTimeString()
  })
  chatLoading.value = false
  await nextTick()
  scrollToBottom()
}

const clearChat = () => {
  chatMessages.value = [
    { role: 'ai', content: '您好！我是智慧运维助手，请问有什么可以帮助您的？', time: new Date().toLocaleTimeString() }
  ]
  ElMessage.success('对话已清空')
}

const scrollToBottom = () => {
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight
  }
}

const handleAddKb = () => {
  ElMessage.info('新增知识库功能（演示模式）')
}

const handleViewKb = (row) => {
  ElMessage.info(`查看知识库：${row.kbName}`)
}

const handleUploadDoc = (row) => {
  uploadDocForm.kbName = row.kbName
  uploadDocForm.docName = ''
  uploadDocForm.docType = ''
  uploadDocVisible.value = true
}

const handleConfirmUpload = () => {
  if (!uploadDocForm.docName || !uploadDocForm.docType) {
    ElMessage.warning('请填写完整信息')
    return
  }
  ElMessage.success('文档上传成功（演示模式）')
  uploadDocVisible.value = false
}

const handleClearMemory = async () => {
  try {
    await ElMessageBox.confirm('确定要清理所有短期记忆吗？', '提示', { type: 'warning' })
    ElMessage.success('记忆清理完成')
  } catch (e) {}
}

const handleDeleteMemory = async (row) => {
  try {
    await ElMessageBox.confirm('确定要删除这条记忆吗？', '提示', { type: 'warning' })
    ElMessage.success('记忆已删除')
  } catch (e) {}
}

const initCallStatsChart = () => {
  if (!callStatsChartRef.value) return
  callStatsChart = echarts.init(callStatsChartRef.value)
  updateCallStatsChart()
}

const updateCallStatsChart = () => {
  if (!callStatsChart) return
  const isWeek = callStatsRange.value === 'week'
  const days = isWeek ? ['01-09', '01-10', '01-11', '01-12', '01-13', '01-14', '01-15'] : Array.from({ length: 30 }, (_, i) => `${i + 1}日`)
  const data = isWeek ? [85, 92, 78, 105, 95, 120, 110] : Array.from({ length: 30 }, () => Math.floor(Math.random() * 60 + 70))

  callStatsChart.setOption({
    tooltip: {
      trigger: 'axis',
      formatter: '{b}: {c} 次',
      backgroundColor: 'rgba(6, 24, 52, 0.92)',
      borderColor: 'rgba(0, 216, 255, 0.35)',
      textStyle: { color: '#b8eaff' }
    },
    grid: { left: '3%', right: '4%', bottom: '8%', top: '8%', containLabel: true },
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

const initKbPieChart = () => {
  if (!kbPieChartRef.value) return
  kbPieChart = echarts.init(kbPieChartRef.value)
  kbPieChart.setOption({
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} ({d}%)',
      backgroundColor: 'rgba(6, 24, 52, 0.92)',
      borderColor: 'rgba(0, 216, 255, 0.35)',
      textStyle: { color: '#b8eaff' }
    },
    legend: { orient: 'vertical', left: 'left', top: 'center', textStyle: { fontSize: 11, color: '#b8eaff' } },
    series: [
      {
        name: '知识库',
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['60%', '50%'],
        avoidLabelOverlap: false,
        itemStyle: { borderRadius: 8, borderColor: 'rgba(6, 24, 52, 0.88)', borderWidth: 2 },
        label: { show: false },
        emphasis: { label: { show: true, fontSize: 12, fontWeight: 'bold', color: '#fff' } },
        data: [
          { value: 45, name: '运维手册', itemStyle: { color: '#00d8ff' } },
          { value: 38, name: '故障案例', itemStyle: { color: '#00f5a0' } },
          { value: 25, name: '能耗知识', itemStyle: { color: '#ffcc33' } },
          { value: 18, name: '碳排政策', itemStyle: { color: '#ff4d5a' } },
          { value: 30, name: 'IoT文档', itemStyle: { color: '#7aa9c7' } }
        ]
      }
    ]
  })
}

const handleResize = () => {
  callStatsChart?.resize()
  kbPieChart?.resize()
}

onMounted(() => {
  loadData().then(() => {
    setTimeout(() => {
      initCallStatsChart()
      initKbPieChart()
    }, 300)
  })
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  callStatsChart?.dispose()
  kbPieChart?.dispose()
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.llm-page {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.stat-row,
.chart-row {
  margin: 0;
}

.chart-container {
  width: 100%;
  height: 320px;
}

.chart-container-small {
  width: 100%;
  height: 220px;
}

.chat-box {
  height: 400px;
  overflow-y: auto;
  padding: 18px;
  background: rgba(9, 19, 34, 0.72);
  border: 1px solid rgba(120, 200, 255, 0.1);
  border-radius: 20px;
  margin-bottom: 16px;
}

.chat-message {
  display: flex;
  margin-bottom: 16px;
  align-items: flex-start;
}

.user-message {
  flex-direction: row-reverse;
}

.message-avatar {
  width: 36px;
  height: 36px;
  border-radius: 14px;
  display: grid;
  place-items: center;
  flex-shrink: 0;
  background: rgba(102, 217, 255, 0.12);
  color: #66d9ff;
}

.user-message .message-avatar {
  background: linear-gradient(135deg, #8be6ff 0%, #27b2da 100%);
  color: #05111c;
}

.message-content {
  max-width: 70%;
  margin: 0 12px;
}

.message-text {
  background: rgba(11, 24, 41, 0.92);
  padding: 12px 16px;
  border-radius: 16px;
  margin: 0 0 4px;
  line-height: 1.6;
  border: 1px solid rgba(120, 200, 255, 0.1);
  color: #b4c5db;
}

.user-message .message-text {
  background: linear-gradient(135deg, #5fd7ff 0%, #1797d2 100%);
  color: #05111c;
}

.message-time {
  font-size: 11px;
  color: #7aa9c7;
  margin: 0;
}

.typing-indicator {
  display: flex;
  gap: 4px;
  padding: 10px 14px;
}

.typing-indicator span {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #66d9ff;
  animation: typing 1.4s infinite;
}

.typing-indicator span:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-indicator span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes typing {
  0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
  30% { transform: translateY(-8px); opacity: 1; }
}

.chat-input-area {
  display: flex;
  flex-direction: column;
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
.stat-card--purple .stat-card__icon { background: linear-gradient(135deg, #d8a7ff 0%, #8f61e8 100%); color: #160522; }

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

.reasoning-card {
  background: rgba(9, 19, 34, 0.72);
  border-radius: 20px;
  padding: 18px;
  margin-bottom: 16px;
  border: 1px solid rgba(120, 200, 255, 0.1);
}

.reasoning-header {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.reasoning-icon {
  color: #66d9ff;
  margin-right: 8px;
}

.reasoning-name {
  font-size: 14px;
  font-weight: 600;
  color: #eff7ff;
}

.reasoning-desc {
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

  .chat-box {
    height: 300px;
  }
  .chart-container {
    height: 250px;
  }
  .chart-container-small {
    height: 180px;
  }
}
</style>
