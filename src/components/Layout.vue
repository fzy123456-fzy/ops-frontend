<template>
  <div class="layout-container">
    <el-aside :width="isCollapse ? '64px' : '220px'" class="aside">
      <div class="logo">
        <el-icon :size="28" color="#fff"><Monitor /></el-icon>
        <span v-show="!isCollapse" class="logo-text">智慧运维管理平台</span>
      </div>
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        background-color="#0a1628"
        text-color="#b8eaff"
        active-text-color="#00d8ff"
        router
      >
        <el-menu-item index="/dashboard">
          <el-icon><DataAnalysis /></el-icon>
          <template #title>首页仪表盘</template>
        </el-menu-item>
        <el-menu-item index="/device">
          <el-icon><Monitor /></el-icon>
          <template #title>设备管理</template>
        </el-menu-item>
        <el-menu-item index="/alarm">
          <el-icon><Bell /></el-icon>
          <template #title>告警管理</template>
        </el-menu-item>
        <el-menu-item index="/task">
          <el-icon><List /></el-icon>
          <template #title>运维任务</template>
        </el-menu-item>
        <el-menu-item index="/log">
          <el-icon><Document /></el-icon>
          <template #title>操作日志</template>
        </el-menu-item>
        <el-menu-item index="/user">
          <el-icon><User /></el-icon>
          <template #title>用户管理</template>
        </el-menu-item>
        <el-menu-item index="/algorithm">
          <el-icon><Cpu /></el-icon>
          <template #title>算法模型中心</template>
        </el-menu-item>
        <el-menu-item index="/digital-twin">
          <el-icon><Connection /></el-icon>
          <template #title>数字孪生平台</template>
        </el-menu-item>
        <el-menu-item index="/llm">
          <el-icon><ChatDotSquare /></el-icon>
          <template #title>本地大模型中心</template>
        </el-menu-item>
        <el-menu-item index="/agent">
          <el-icon><Robot /></el-icon>
          <template #title>AI智能体中心</template>
        </el-menu-item>
        <el-menu-item index="/visual-screen" class="visual-screen-menu">
          <el-icon><FullScreen /></el-icon>
          <template #title>可视化大屏</template>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <el-container class="main-container">
      <el-header class="header">
        <div class="header-left">
          <el-icon class="collapse-btn" @click="isCollapse = !isCollapse">
            <Fold v-if="!isCollapse" />
            <Expand v-else />
          </el-icon>
          <el-breadcrumb separator="/" class="enhanced-breadcrumb">
            <el-breadcrumb-item :to="{ path: '/dashboard' }">
              <el-icon><DataAnalysis /></el-icon>
              首页
            </el-breadcrumb-item>
            <el-breadcrumb-item>{{ currentTitle }}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div class="header-right">
          <el-badge :value="notificationCount" :hidden="notificationCount === 0" class="notification-badge">
            <el-icon class="header-icon" @click="showNotifications">
              <Bell />
            </el-icon>
          </el-badge>
          <el-dropdown @command="handleCommand">
            <span class="user-info">
              <el-avatar :size="32" style="background-color: #0a5c8a">
                {{ userInfo.realName?.charAt(0) || 'U' }}
              </el-avatar>
              <span class="username">{{ userInfo.realName || '用户' }}</span>
              <el-icon><ArrowDown /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="profile">
                  <el-icon><User /></el-icon>
                  个人中心
                </el-dropdown-item>
                <el-dropdown-item command="settings">
                  <el-icon><Setting /></el-icon>
                  系统设置
                </el-dropdown-item>
                <el-dropdown-item divided command="logout">
                  <el-icon><SwitchButton /></el-icon>
                  退出登录
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>

      <el-main class="main-content">
        <router-view />
      </el-main>
    </el-container>

    <el-dialog v-model="notificationVisible" title="通知中心" width="600px">
      <el-tabs v-model="activeNotificationTab">
        <el-tab-pane :label="`告警通知 (${alarmNotifications.length})`" name="alarm">
          <el-timeline>
            <el-timeline-item
              v-for="item in alarmNotifications"
              :key="item.id"
              :timestamp="item.time"
              placement="top"
              :color="item.color"
            >
              <el-card shadow="hover">
                <div class="notification-item">
                  <div class="notification-header">
                    <el-tag :type="item.type" size="small">{{ item.level }}</el-tag>
                    <span class="notification-title">{{ item.title }}</span>
                  </div>
                  <p class="notification-content">{{ item.content }}</p>
                </div>
              </el-card>
            </el-timeline-item>
          </el-timeline>
        </el-tab-pane>
        <el-tab-pane :label="`系统通知 (${systemNotifications.length})`" name="system">
          <el-timeline>
            <el-timeline-item
              v-for="item in systemNotifications"
              :key="item.id"
              :timestamp="item.time"
              placement="top"
              color="#409EFF"
            >
              <el-card shadow="hover">
                <div class="notification-item">
                  <span class="notification-title">{{ item.title }}</span>
                  <p class="notification-content">{{ item.content }}</p>
                </div>
              </el-card>
            </el-timeline-item>
          </el-timeline>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = useRouter()
const route = useRoute()
const isCollapse = ref(false)
const currentTime = ref('')
const notificationVisible = ref(false)
const activeNotificationTab = ref('alarm')

let timer = null

const updateTime = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  const seconds = String(now.getSeconds()).padStart(2, '0')
  const weekDays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
  const weekDay = weekDays[now.getDay()]
  currentTime.value = `${year}-${month}-${day} ${hours}:${minutes}:${seconds} ${weekDay}`
}

const userInfo = computed(() => {
  try {
    return JSON.parse(localStorage.getItem('userInfo') || '{}')
  } catch {
    return {}
  }
})

const activeMenu = computed(() => route.path)

const menuTitleMap = {
  '/dashboard': '首页仪表盘',
  '/device': '设备管理',
  '/alarm': '告警管理',
  '/task': '运维任务',
  '/log': '操作日志',
  '/user': '用户管理',
  '/algorithm': '算法模型中心',
  '/digital-twin': '数字孪生平台',
  '/llm': '本地大模型中心',
  '/agent': 'AI智能体中心',
  '/visual-screen': '可视化大屏'
}

const currentTitle = computed(() => menuTitleMap[route.path] || '首页')

const alarmNotifications = ref([
  { id: 1, level: '严重', type: 'danger', color: '#F56C6C', title: '空调主机故障', content: '3号空调主机通信中断，请立即检查设备状态', time: '2024-01-15 14:30:00' },
  { id: 2, level: '重要', type: 'warning', color: '#E6A23C', title: '温度超限告警', content: 'A栋3层温度达到28.5℃，超过设定阈值', time: '2024-01-15 14:25:00' },
  { id: 3, level: '一般', type: 'info', color: '#909399', title: '设备离线通知', content: 'B栋2层传感器已离线超过30分钟', time: '2024-01-15 14:20:00' },
  { id: 4, level: '重要', type: 'warning', color: '#E6A23C', title: '能耗异常告警', content: '今日能耗较昨日同期增长15%，请关注', time: '2024-01-15 14:15:00' }
])

const systemNotifications = ref([
  { id: 1, title: '系统升级通知', content: '系统将于今晚22:00-23:00进行升级维护，届时部分功能可能不可用', time: '2024-01-15 10:00:00' },
  { id: 2, title: '新增功能', content: 'AI智能体中心已上线，支持能耗预测、故障诊断等智能运维功能', time: '2024-01-14 16:00:00' },
  { id: 3, title: '数据备份完成', content: '系统数据已自动备份，备份文件大小：2.3GB', time: '2024-01-14 02:00:00' }
])

const notificationCount = computed(() => alarmNotifications.value.length + systemNotifications.value.length)

const showNotifications = () => {
  notificationVisible.value = true
}

const handleCommand = (command) => {
  if (command === 'logout') {
    localStorage.removeItem('token')
    localStorage.removeItem('userInfo')
    ElMessage.success('已退出登录')
    router.push('/login')
  } else if (command === 'profile') {
    ElMessage.info('个人中心功能（演示模式）')
  } else if (command === 'settings') {
    ElMessage.info('系统设置功能（演示模式）')
  }
}

onMounted(() => {
  updateTime()
  timer = setInterval(updateTime, 1000)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<style scoped>
.layout-container {
  height: 100vh;
  display: flex;
}

.aside {
  background: linear-gradient(180deg, #0a1628 0%, #051024 100%);
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  box-shadow: 2px 0 12px rgba(0, 0, 0, 0.4);
  border-right: 1px solid rgba(0, 216, 255, 0.15);
}

.logo {
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  background: rgba(0, 0, 0, 0.2);
  cursor: pointer;
  border-bottom: 1px solid rgba(0, 216, 255, 0.2);
}

.logo-text {
  color: #00d8ff;
  font-size: 15px;
  font-weight: 600;
  white-space: nowrap;
  letter-spacing: 0.5px;
}

.el-menu {
  border-right: none;
  background: transparent !important;
}

.el-menu-item {
  transition: all 0.2s !important;
  color: rgba(184, 234, 255, 0.8) !important;
  border-radius: 0;
  margin: 2px 8px;
  height: 44px;
  line-height: 44px;
}

.el-menu-item:hover {
  background-color: rgba(0, 216, 255, 0.1) !important;
  color: #00d8ff !important;
}

.el-menu-item.is-active {
  background-color: rgba(0, 216, 255, 0.15) !important;
  color: #00d8ff !important;
  font-weight: 500;
}

.el-menu-item.is-active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  bottom: auto;
  width: 3px;
  height: 20px;
  border-radius: 0 2px 2px 0;
  background: #00d8ff;
  box-shadow: 0 0 8px rgba(0, 216, 255, 0.6);
}

.main-container {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.header {
  background: linear-gradient(180deg, #0a1628 0%, #08142a 100%);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.3);
  border-bottom: 1px solid rgba(0, 216, 255, 0.15);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  height: 56px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.collapse-btn {
  font-size: 20px;
  cursor: pointer;
  color: rgba(255, 255, 255, 0.9);
  transition: all 0.3s;
  padding: 6px;
  border-radius: 4px;
}

.collapse-btn:hover {
  color: #fff;
  background-color: rgba(255, 255, 255, 0.1);
}

.enhanced-breadcrumb {
  font-size: 14px;
}

.enhanced-breadcrumb :deep(.el-breadcrumb__item) {
  display: flex;
  align-items: center;
}

.enhanced-breadcrumb :deep(.el-breadcrumb__item .el-icon) {
  margin-right: 4px;
}

.enhanced-breadcrumb :deep(.el-breadcrumb__inner) {
  color: rgba(255, 255, 255, 0.9) !important;
}

.enhanced-breadcrumb :deep(.el-breadcrumb__inner:hover) {
  color: #fff !important;
}

.enhanced-breadcrumb :deep(.el-breadcrumb__separator) {
  color: rgba(255, 255, 255, 0.6) !important;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.header-icon {
  font-size: 20px;
  cursor: pointer;
  color: rgba(255, 255, 255, 0.9);
  transition: all 0.3s;
  padding: 6px;
  border-radius: 4px;
}

.header-icon:hover {
  color: #fff;
  background-color: rgba(255, 255, 255, 0.1);
}

.notification-badge {
  cursor: pointer;
}

.notification-badge :deep(.el-badge__content) {
  background-color: #ff5252;
  border: 2px solid #0a1628;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  color: rgba(255, 255, 255, 0.9);
  padding: 6px 12px;
  border-radius: 4px;
  transition: all 0.3s;
}

.user-info:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: #fff;
}

.username {
  font-size: 14px;
  font-weight: 500;
}

.main-content {
  background: #020b1f;
  padding: 16px;
  overflow-y: auto;
  background-image:
    radial-gradient(rgba(0, 216, 255, 0.06) 1px, transparent 1px),
    radial-gradient(rgba(0, 216, 255, 0.03) 1px, transparent 1px);
  background-size: 30px 30px, 50px 50px;
  background-position: 0 0, 15px 15px;
}

.visual-screen-menu {
  color: #00d4ff !important;
  font-weight: 600;
}

.visual-screen-menu .el-icon {
  color: #00d4ff !important;
}

.notification-item {
  padding: 8px 0;
}

.notification-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.notification-title {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
}

.notification-content {
  font-size: 13px;
  color: #606266;
  margin: 0;
  line-height: 1.5;
}
</style>
