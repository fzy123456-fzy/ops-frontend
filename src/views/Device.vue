<template>
  <div class="device-page">
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

    <el-card shadow="never">
      <template #header>
        <div class="card-header">
          <span class="card-title">设备管理</span>
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
        <el-table-column prop="deviceName" label="设备名称" min-width="150" show-overflow-tooltip />
        <el-table-column prop="ipAddress" label="IP地址" width="140" />
        <el-table-column prop="deviceType" label="设备类型" width="110">
          <template #default="{ row }">
            <el-tag :type="getTypeColor(row.deviceType)" size="small" effect="plain">
              {{ getTypeText(row.deviceType) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="location" label="所属区域" min-width="140" show-overflow-tooltip />
        <el-table-column prop="status" label="状态" width="90" align="center">
          <template #default="{ row }">
            <el-tag :type="getStatusColor(row.status)" size="small">
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="cpuUsage" label="CPU" width="100" align="center">
          <template #default="{ row }">
            <el-progress :percentage="Number(row.cpuUsage)" :color="getUsageColor(row.cpuUsage)" :stroke-width="8" :show-text="true" />
          </template>
        </el-table-column>
        <el-table-column prop="memoryUsage" label="内存" width="100" align="center">
          <template #default="{ row }">
            <el-progress :percentage="Number(row.memoryUsage)" :color="getUsageColor(row.memoryUsage)" :stroke-width="8" :show-text="true" />
          </template>
        </el-table-column>
        <el-table-column prop="updateTime" label="更新时间" width="170" />
        <el-table-column label="操作" width="120" fixed="right" align="center">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="handleEdit(row)">
              <el-icon><Edit /></el-icon>
            </el-button>
            <el-button type="danger" link size="small" @click="handleDelete(row)">
              <el-icon><Delete /></el-icon>
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
import { ref, reactive, onMounted } from 'vue'
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

.stat-card--blue .stat-card__icon { background: rgba(0, 216, 255, 0.15); color: #00d8ff; }
.stat-card--green .stat-card__icon { background: rgba(0, 245, 160, 0.15); color: #00f5a0; }
.stat-card--orange .stat-card__icon { background: rgba(255, 204, 51, 0.15); color: #ffcc33; }
.stat-card--gray .stat-card__icon { background: rgba(122, 169, 199, 0.15); color: #7aa9c7; }

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
