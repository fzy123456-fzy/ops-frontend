<template>
  <div class="device-page">
    <section class="device-hero">
      <div class="device-hero__content">
        <p class="device-hero__eyebrow">Device Command Center</p>
        <div class="device-hero__heading">
          <div>
            <h1>设备管理中枢</h1>
            <p>聚合设备资产、运行状态与资源负载，快速定位高风险节点与异常设备。</p>
          </div>
          <div class="device-hero__badges">
            <div class="hero-badge">
              <span class="hero-badge__label">在线率</span>
              <span class="hero-badge__value">{{ onlineRate }}%</span>
            </div>
            <div class="hero-badge hero-badge--warn">
              <span class="hero-badge__label">高负载设备</span>
              <span class="hero-badge__value">{{ overloadedCount }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="device-hero__grid">
        <div class="hero-grid-card">
          <span class="hero-grid-card__label">核心机房</span>
          <strong>{{ stats.total }}</strong>
          <span>纳管设备</span>
        </div>
        <div class="hero-grid-card">
          <span class="hero-grid-card__label">告警聚焦</span>
          <strong>{{ stats.warning }}</strong>
          <span>待关注节点</span>
        </div>
        <div class="hero-grid-card">
          <span class="hero-grid-card__label">离线设备</span>
          <strong>{{ stats.offline }}</strong>
          <span>需巡检恢复</span>
        </div>
      </div>
    </section>

    <el-row :gutter="20" class="stat-row">
      <el-col :xs="12" :sm="6">
        <div class="stat-card stat-card--blue">
          <div class="stat-card__icon"><el-icon :size="28"><Monitor /></el-icon></div>
          <div class="stat-card__content">
            <p class="stat-card__value">{{ stats.total }}</p>
            <p class="stat-card__label">设备总数</p>
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="6">
        <div class="stat-card stat-card--green">
          <div class="stat-card__icon"><el-icon :size="28"><CircleCheck /></el-icon></div>
          <div class="stat-card__content">
            <p class="stat-card__value">{{ stats.online }}</p>
            <p class="stat-card__label">在线设备</p>
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="6">
        <div class="stat-card stat-card--orange">
          <div class="stat-card__icon"><el-icon :size="28"><Warning /></el-icon></div>
          <div class="stat-card__content">
            <p class="stat-card__value">{{ stats.warning }}</p>
            <p class="stat-card__label">告警设备</p>
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="6">
        <div class="stat-card stat-card--gray">
          <div class="stat-card__icon"><el-icon :size="28"><SwitchButton /></el-icon></div>
          <div class="stat-card__content">
            <p class="stat-card__value">{{ stats.offline }}</p>
            <p class="stat-card__label">离线设备</p>
          </div>
        </div>
      </el-col>
    </el-row>

    <el-card shadow="never" class="device-console-card">
      <template #header>
        <div class="card-header">
          <div>
            <span class="card-title">设备管理</span>
            <p class="card-subtitle">统一查看设备信息、区域分布与资源占用，支持快速筛选和维护。</p>
          </div>
          <div class="card-header__meta">
            <span class="meta-pill">当前页 {{ tableData.length }} 台</span>
            <span class="meta-pill meta-pill--accent">告警 {{ stats.warning }} 台</span>
          </div>
        </div>
      </template>

      <div class="quick-filter">
        <span class="filter-label">快速筛选：</span>
        <el-tag
          v-for="tag in statusTags"
          :key="tag.value"
          :type="activeFilter === tag.value ? tag.type : 'info'"
          :effect="activeFilter === tag.value ? 'dark' : 'plain'"
          class="filter-tag"
          @click="handleQuickFilter(tag.value)"
        >
          {{ tag.label }}
        </el-tag>
      </div>

      <div class="search-bar">
        <el-form :inline="true" :model="searchForm">
          <el-form-item label="设备名称">
            <el-input v-model="searchForm.deviceName" placeholder="请输入设备名称" clearable style="width: 200px" />
          </el-form-item>
          <el-form-item label="在线状态">
            <el-select v-model="searchForm.status" placeholder="请选择状态" clearable style="width: 150px">
              <el-option label="在线" value="online" />
              <el-option label="离线" value="offline" />
              <el-option label="告警" value="warning" />
              <el-option label="维护中" value="maintenance" />
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
        <div class="search-bar__right">
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon>
            新增设备
          </el-button>
        </div>
      </div>

      <el-table :data="tableData" v-loading="loading" style="width: 100%" row-key="id" class="thingsboard-table">
        <el-table-column type="selection" width="40" align="center" />
        <el-table-column prop="deviceName" label="设备信息" min-width="230">
          <template #default="{ row }">
            <div class="device-cell">
              <div class="device-cell__avatar" :class="`device-cell__avatar--${row.deviceType}`">
                {{ row.deviceName.slice(0, 1) }}
              </div>
              <div class="device-cell__content">
                <span class="device-cell__name">{{ row.deviceName }}</span>
                <span class="device-cell__desc">{{ row.description || '暂无设备描述' }}</span>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="ipAddress" label="网络信息" width="190">
          <template #default="{ row }">
            <div class="network-cell">
              <span class="network-cell__ip">{{ row.ipAddress }}</span>
              <span class="network-cell__os">{{ row.osType || '未填写系统信息' }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="deviceType" label="设备类型" width="110">
          <template #default="{ row }">
            <el-tag :type="getTypeColor(row.deviceType)" size="small" effect="plain">
              {{ getTypeText(row.deviceType) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="location" label="所属区域" min-width="170" show-overflow-tooltip>
          <template #default="{ row }">
            <div class="location-cell">
              <span class="location-cell__main">{{ row.location }}</span>
              <span class="location-cell__sub">设备编号 #{{ row.id }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="90" align="center">
          <template #default="{ row }">
            <el-tag :type="getStatusColor(row.status)" size="small">
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="资源负载" min-width="230">
          <template #default="{ row }">
            <div class="resource-stack">
              <div class="resource-item">
                <span class="resource-item__label">CPU</span>
                <el-progress :percentage="Number(row.cpuUsage)" :color="getUsageColor(row.cpuUsage)" :stroke-width="8" :show-text="false" />
                <span class="resource-item__value">{{ Number(row.cpuUsage).toFixed(0) }}%</span>
              </div>
              <div class="resource-item">
                <span class="resource-item__label">MEM</span>
                <el-progress :percentage="Number(row.memoryUsage)" :color="getUsageColor(row.memoryUsage)" :stroke-width="8" :show-text="false" />
                <span class="resource-item__value">{{ Number(row.memoryUsage).toFixed(0) }}%</span>
              </div>
              <div class="resource-item">
                <span class="resource-item__label">DISK</span>
                <el-progress :percentage="Number(row.diskUsage)" :color="getUsageColor(row.diskUsage)" :stroke-width="8" :show-text="false" />
                <span class="resource-item__value">{{ Number(row.diskUsage).toFixed(0) }}%</span>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="健康评分" width="110" align="center">
          <template #default="{ row }">
            <div class="health-badge" :class="getHealthClass(row)">
              <strong>{{ getHealthScore(row) }}</strong>
              <span>{{ getHealthText(row) }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="updateTime" label="更新时间" width="170" />
        <el-table-column label="操作" width="140" fixed="right" align="center">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="handleEdit(row)">
              <el-icon><Edit /></el-icon>
              编辑
            </el-button>
            <el-button type="danger" link size="small" @click="handleDelete(row)">
              <el-icon><Delete /></el-icon>
              删除
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

    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="580px" destroy-on-close>
      <el-form ref="formRef" :model="form" :rules="formRules" label-width="100px">
        <el-form-item label="设备名称" prop="deviceName">
          <el-input v-model="form.deviceName" placeholder="请输入设备名称" />
        </el-form-item>
        <el-form-item label="IP地址" prop="ipAddress">
          <el-input v-model="form.ipAddress" placeholder="请输入IP地址" />
        </el-form-item>
        <el-form-item label="设备类型" prop="deviceType">
          <el-select v-model="form.deviceType" placeholder="请选择设备类型" style="width: 100%">
            <el-option label="服务器" value="server" />
            <el-option label="网络设备" value="network" />
            <el-option label="存储设备" value="storage" />
          </el-select>
        </el-form-item>
        <el-form-item label="所属区域" prop="location">
          <el-input v-model="form.location" placeholder="请输入所属区域，如：机房A-机柜1-01" />
        </el-form-item>
        <el-form-item label="操作系统">
          <el-input v-model="form.osType" placeholder="请输入操作系统" />
        </el-form-item>
        <el-form-item label="在线状态">
          <el-select v-model="form.status" placeholder="请选择状态" style="width: 100%">
            <el-option label="在线" value="online" />
            <el-option label="离线" value="offline" />
            <el-option label="告警" value="warning" />
            <el-option label="维护中" value="maintenance" />
          </el-select>
        </el-form-item>
        <el-form-item label="设备描述">
          <el-input v-model="form.description" type="textarea" rows="3" placeholder="请输入设备描述" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button class="tech-outline-btn" @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitLoading" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Edit, Delete } from '@element-plus/icons-vue'
import { getDeviceList, getDevicePage, addDevice, updateDevice, deleteDevice } from '../api/device'

const loading = ref(false)
const submitLoading = ref(false)
const tableData = ref([])
const dialogVisible = ref(false)
const dialogTitle = ref('新增设备')
const isEdit = ref(false)
const formRef = ref(null)
const activeFilter = ref('')

const searchForm = reactive({ deviceName: '', status: '' })
const pagination = reactive({ current: 1, size: 10, total: 0 })

const stats = reactive({ total: 0, online: 0, offline: 0, warning: 0 })
const onlineRate = computed(() => (stats.total ? Math.round((stats.online / stats.total) * 100) : 0))
const overloadedCount = computed(() => tableData.value.filter((item) => {
  return Number(item.cpuUsage) >= 80 || Number(item.memoryUsage) >= 80 || Number(item.diskUsage) >= 80
}).length)

const statusTags = [
  { label: '全部', value: '', type: '' },
  { label: '在线', value: 'online', type: 'success' },
  { label: '离线', value: 'offline', type: 'info' },
  { label: '告警', value: 'warning', type: 'danger' },
  { label: '维护中', value: 'maintenance', type: 'warning' }
]

const handleQuickFilter = (value) => {
  activeFilter.value = value
  searchForm.status = value
  pagination.current = 1
  loadData()
}

const form = reactive({
  id: null,
  deviceName: '',
  ipAddress: '',
  deviceType: '',
  location: '',
  osType: '',
  status: 'online',
  description: ''
})

const formRules = {
  deviceName: [{ required: true, message: '请输入设备名称', trigger: 'blur' }],
  ipAddress: [{ required: true, message: '请输入IP地址', trigger: 'blur' }],
  deviceType: [{ required: true, message: '请选择设备类型', trigger: 'change' }],
  location: [{ required: true, message: '请输入所属区域', trigger: 'blur' }]
}

const typeMap = { server: { color: '', text: '服务器' }, network: { color: 'success', text: '网络设备' }, storage: { color: 'warning', text: '存储设备' } }
const statusMap = { online: { color: 'success', text: '在线' }, offline: { color: 'info', text: '离线' }, warning: { color: 'danger', text: '告警' }, maintenance: { color: 'warning', text: '维护中' } }

const getTypeColor = (type) => typeMap[type]?.color || ''
const getTypeText = (type) => typeMap[type]?.text || type
const getStatusColor = (status) => statusMap[status]?.color || 'info'
const getStatusText = (status) => statusMap[status]?.text || status
const getUsageColor = (usage) => {
  const n = Number(usage)
  if (n > 80) return '#ff4d5a'
  if (n > 60) return '#ffcc33'
  return '#00f5a0'
}
const getHealthScore = (row) => {
  const avg = (Number(row.cpuUsage) + Number(row.memoryUsage) + Number(row.diskUsage)) / 3
  return Math.max(32, Math.round(100 - avg * 0.72))
}
const getHealthText = (row) => {
  const score = getHealthScore(row)
  if (score >= 80) return '优'
  if (score >= 65) return '稳'
  return '风险'
}
const getHealthClass = (row) => {
  const score = getHealthScore(row)
  if (score >= 80) return 'health-badge--good'
  if (score >= 65) return 'health-badge--mid'
  return 'health-badge--risk'
}

const normalizeItem = (item) => ({
  id: item.id,
  deviceName: item.deviceName || '',
  ipAddress: item.ipAddress || '',
  deviceType: item.deviceType || '',
  location: item.location || '',
  osType: item.osType || '',
  status: item.status || 'online',
  cpuUsage: Number(item.cpuUsage) || 0,
  memoryUsage: Number(item.memoryUsage) || 0,
  diskUsage: Number(item.diskUsage) || 0,
  description: item.description || '',
  createTime: item.createTime || '',
  updateTime: item.updateTime || ''
})

const loadData = async () => {
  loading.value = true
  try {
    const res = await getDevicePage({
      current: pagination.current,
      size: pagination.size,
      deviceName: searchForm.deviceName || undefined,
      status: searchForm.status || undefined
    })
    if (res.code === 200 && res.data) {
      tableData.value = (res.data.records || []).map(normalizeItem)
      pagination.total = res.data.total || 0
    }
  } catch (e) {
    try {
      const res = await getDeviceList()
      if (res.code === 200 && Array.isArray(res.data)) {
        const all = res.data.map(normalizeItem)
        let filtered = all
        if (searchForm.deviceName) {
          filtered = filtered.filter((i) => i.deviceName.includes(searchForm.deviceName))
        }
        if (searchForm.status) {
          filtered = filtered.filter((i) => i.status === searchForm.status)
        }
        pagination.total = filtered.length
        const start = (pagination.current - 1) * pagination.size
        tableData.value = filtered.slice(start, start + pagination.size)
      }
    } catch (e2) {
      tableData.value = getMockData()
      pagination.total = 10
    }
  } finally {
    loading.value = false
  }
  updateStats()
}

const updateStats = () => {
  const data = tableData.value
  stats.total = data.length
  stats.online = data.filter((i) => i.status === 'online').length
  stats.offline = data.filter((i) => i.status === 'offline').length
  stats.warning = data.filter((i) => i.status === 'warning').length
}

const getMockData = () => [
  { id: 1, deviceName: 'Web服务器-01', deviceType: 'server', ipAddress: '192.168.1.100', osType: 'CentOS 7.9', cpuUsage: 45.20, memoryUsage: 62.50, diskUsage: 55.80, status: 'online', location: '机房A-机柜1-01', description: '主Web应用服务器', createTime: '2024-01-01 10:00:00', updateTime: '2024-01-15 14:30:00' },
  { id: 2, deviceName: 'Web服务器-02', deviceType: 'server', ipAddress: '192.168.1.101', osType: 'CentOS 7.9', cpuUsage: 38.50, memoryUsage: 58.30, diskUsage: 52.40, status: 'online', location: '机房A-机柜1-02', description: '备用Web应用服务器', createTime: '2024-01-01 10:00:00', updateTime: '2024-01-15 14:25:00' },
  { id: 3, deviceName: '数据库服务器-01', deviceType: 'server', ipAddress: '192.168.1.200', osType: 'Ubuntu 20.04', cpuUsage: 72.80, memoryUsage: 85.60, diskUsage: 78.90, status: 'warning', location: '机房A-机柜2-01', description: 'MySQL主数据库服务器', createTime: '2024-01-01 10:00:00', updateTime: '2024-01-15 14:20:00' },
  { id: 4, deviceName: '数据库服务器-02', deviceType: 'server', ipAddress: '192.168.1.201', osType: 'Ubuntu 20.04', cpuUsage: 25.40, memoryUsage: 45.20, diskUsage: 65.30, status: 'online', location: '机房A-机柜2-02', description: 'MySQL从数据库服务器', createTime: '2024-01-01 10:00:00', updateTime: '2024-01-15 14:15:00' },
  { id: 5, deviceName: '核心交换机', deviceType: 'network', ipAddress: '192.168.1.1', osType: 'Network OS', cpuUsage: 35.60, memoryUsage: 42.80, diskUsage: 28.50, status: 'online', location: '机房A-网络区', description: '核心层交换机', createTime: '2024-01-01 10:00:00', updateTime: '2024-01-15 14:10:00' },
  { id: 6, deviceName: '防火墙-01', deviceType: 'network', ipAddress: '192.168.1.2', osType: 'Firewall OS', cpuUsage: 28.90, memoryUsage: 38.50, diskUsage: 22.10, status: 'online', location: '机房A-网络区', description: '主防火墙设备', createTime: '2024-01-01 10:00:00', updateTime: '2024-01-15 14:05:00' },
  { id: 7, deviceName: '存储阵列-01', deviceType: 'storage', ipAddress: '192.168.1.50', osType: 'Storage OS', cpuUsage: 55.30, memoryUsage: 68.40, diskUsage: 82.60, status: 'online', location: '机房B-存储区', description: '主存储阵列，容量100TB', createTime: '2024-01-01 10:00:00', updateTime: '2024-01-15 14:00:00' },
  { id: 8, deviceName: '应用服务器-01', deviceType: 'server', ipAddress: '192.168.1.150', osType: 'Windows Server 2019', cpuUsage: 62.40, memoryUsage: 75.20, diskUsage: 68.90, status: 'online', location: '机房A-机柜3-01', description: '中间件应用服务器', createTime: '2024-01-01 10:00:00', updateTime: '2024-01-15 13:55:00' },
  { id: 9, deviceName: '监控服务器', deviceType: 'server', ipAddress: '192.168.1.250', osType: 'CentOS 8', cpuUsage: 42.10, memoryUsage: 52.80, diskUsage: 48.50, status: 'online', location: '机房A-机柜4-01', description: 'Zabbix监控服务器', createTime: '2024-01-01 10:00:00', updateTime: '2024-01-15 13:50:00' },
  { id: 10, deviceName: '备份服务器', deviceType: 'server', ipAddress: '192.168.1.251', osType: 'CentOS 8', cpuUsage: 18.50, memoryUsage: 35.60, diskUsage: 72.40, status: 'offline', location: '机房B-备份区', description: '数据备份服务器', createTime: '2024-01-01 10:00:00', updateTime: '2024-01-15 13:45:00' }
].map(normalizeItem)

const handleSearch = () => {
  pagination.current = 1
  loadData()
}

const handleReset = () => {
  searchForm.deviceName = ''
  searchForm.status = ''
  pagination.current = 1
  loadData()
}

const handleAdd = () => {
  dialogTitle.value = '新增设备'
  isEdit.value = false
  Object.assign(form, { id: null, deviceName: '', ipAddress: '', deviceType: '', location: '', osType: '', status: 'online', description: '' })
  dialogVisible.value = true
}

const handleEdit = (row) => {
  dialogTitle.value = '编辑设备'
  isEdit.value = true
  Object.assign(form, {
    id: row.id,
    deviceName: row.deviceName || '',
    ipAddress: row.ipAddress || '',
    deviceType: row.deviceType || '',
    location: row.location || '',
    osType: row.osType || '',
    status: row.status || 'online',
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
      await updateDevice(form.id, { ...form })
    } else {
      await addDevice({ ...form })
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

const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm(`确定删除设备「${row.deviceName}」吗？此操作不可恢复。`, '提示', {
      confirmButtonText: '确定删除',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await deleteDevice(row.id)
    ElMessage.success('删除成功')
    loadData()
  } catch (e) {
    if (e !== 'cancel') {
      ElMessage.success('删除成功（演示模式）')
      loadData()
    }
  }
}

onMounted(() => loadData())
</script>

<style scoped>
.device-page {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.device-hero {
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1.9fr) minmax(280px, 1fr);
  gap: 20px;
  padding: 28px;
  border-radius: 28px;
  background:
    radial-gradient(circle at top left, rgba(0, 212, 255, 0.18), transparent 34%),
    radial-gradient(circle at bottom right, rgba(0, 245, 160, 0.14), transparent 28%),
    linear-gradient(135deg, rgba(9, 22, 39, 0.98), rgba(5, 11, 20, 0.96));
  border: 1px solid rgba(115, 198, 255, 0.14);
  box-shadow: 0 26px 60px rgba(0, 0, 0, 0.22);
  overflow: hidden;
}

.device-hero::after {
  content: '';
  position: absolute;
  inset: 0;
  background:
    linear-gradient(120deg, rgba(255, 255, 255, 0.06), transparent 28%),
    repeating-linear-gradient(90deg, rgba(120, 200, 255, 0.04) 0, rgba(120, 200, 255, 0.04) 1px, transparent 1px, transparent 64px);
  pointer-events: none;
}

.device-hero__content,
.device-hero__grid {
  position: relative;
  z-index: 1;
}

.device-hero__eyebrow {
  margin: 0 0 12px;
  font-size: 12px;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  color: #7fdcff;
}

.device-hero__heading {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px;
}

.device-hero__heading h1 {
  margin: 0;
  font-size: 34px;
  line-height: 1.1;
  color: #f4fbff;
}

.device-hero__heading p {
  max-width: 620px;
  margin: 10px 0 0;
  color: #98abc1;
  line-height: 1.7;
}

.device-hero__badges {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.hero-badge {
  min-width: 120px;
  padding: 14px 16px;
  border-radius: 18px;
  background: rgba(11, 29, 50, 0.76);
  border: 1px solid rgba(125, 217, 255, 0.12);
  backdrop-filter: blur(18px);
}

.hero-badge--warn {
  background: rgba(55, 29, 12, 0.68);
  border-color: rgba(255, 201, 112, 0.16);
}

.hero-badge__label {
  display: block;
  margin-bottom: 8px;
  font-size: 12px;
  color: #92a6ba;
}

.hero-badge__value {
  font-size: 28px;
  font-weight: 700;
  color: #f4fbff;
}

.device-hero__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
  align-self: stretch;
}

.hero-grid-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 130px;
  padding: 18px;
  border-radius: 22px;
  background: rgba(8, 20, 36, 0.74);
  border: 1px solid rgba(114, 195, 255, 0.12);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.05);
}

.hero-grid-card__label {
  color: #88a3bf;
  font-size: 12px;
}

.hero-grid-card strong {
  font-size: 34px;
  line-height: 1;
  color: #eff7ff;
}

.hero-grid-card span:last-child {
  color: #6f859d;
  font-size: 12px;
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
.stat-card--gray .stat-card__icon { background: linear-gradient(135deg, #d0d8e4 0%, #8ea1b7 100%); color: #0b1623; }

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

.card-subtitle {
  margin: 8px 0 0;
  font-size: 13px;
  color: #90a5bc;
}

.card-header__meta {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.meta-pill {
  padding: 8px 12px;
  border-radius: 999px;
  background: rgba(10, 23, 40, 0.85);
  border: 1px solid rgba(118, 200, 255, 0.12);
  font-size: 12px;
  color: #b7cae0;
}

.meta-pill--accent {
  background: rgba(63, 27, 18, 0.8);
  border-color: rgba(255, 180, 100, 0.14);
  color: #ffd59a;
}

.device-console-card {
  overflow: hidden;
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

.search-bar__right {
  flex-shrink: 0;
}

.pagination-wrapper {
  margin-top: 8px;
}

.thingsboard-table {
  border-radius: 18px;
}

.device-cell {
  display: flex;
  align-items: center;
  gap: 12px;
}

.device-cell__avatar {
  width: 40px;
  height: 40px;
  border-radius: 14px;
  display: grid;
  place-items: center;
  font-size: 15px;
  font-weight: 700;
  color: #05111c;
  flex-shrink: 0;
}

.device-cell__avatar--server {
  background: linear-gradient(135deg, #8be6ff 0%, #35b9e7 100%);
}

.device-cell__avatar--network {
  background: linear-gradient(135deg, #92f0c0 0%, #31af81 100%);
}

.device-cell__avatar--storage {
  background: linear-gradient(135deg, #ffe5a8 0%, #ffb34d 100%);
}

.device-cell__content,
.network-cell,
.location-cell {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.device-cell__name,
.network-cell__ip,
.location-cell__main {
  color: #edf7ff;
  font-weight: 600;
  line-height: 1.3;
}

.device-cell__desc,
.network-cell__os,
.location-cell__sub {
  color: #90a5bc;
  font-size: 12px;
  line-height: 1.4;
}

.resource-stack {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.resource-item {
  display: grid;
  grid-template-columns: 36px 1fr 40px;
  gap: 10px;
  align-items: center;
}

.resource-item__label {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: #7fdcff;
}

.resource-item__value {
  text-align: right;
  font-size: 12px;
  color: #b6c9dd;
}

.health-badge {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-width: 62px;
  min-height: 62px;
  padding: 8px;
  border-radius: 18px;
  border: 1px solid transparent;
}

.health-badge strong {
  font-size: 20px;
  line-height: 1;
}

.health-badge span {
  margin-top: 4px;
  font-size: 11px;
}

.health-badge--good {
  background: rgba(21, 68, 49, 0.22);
  border-color: rgba(111, 234, 172, 0.18);
  color: #87f2bc;
}

.health-badge--mid {
  background: rgba(85, 58, 12, 0.22);
  border-color: rgba(255, 206, 97, 0.18);
  color: #ffd870;
}

.health-badge--risk {
  background: rgba(83, 25, 33, 0.22);
  border-color: rgba(255, 125, 125, 0.18);
  color: #ff9a9a;
}

@media (max-width: 768px) {
  .device-hero,
  .device-hero__heading,
  .device-hero__grid,
  .card-header,
  .search-bar {
    align-items: stretch;
    flex-direction: column;
  }

  .device-hero__grid {
    grid-template-columns: 1fr;
  }

  .resource-item {
    grid-template-columns: 32px 1fr 36px;
    gap: 8px;
  }
}
</style>
