<template>
  <div class="layout-shell">
    <aside :class="['layout-aside', { 'is-collapse': isCollapse }]">
      <div class="brand-card">
        <div class="brand-mark">
          <el-icon :size="24"><Monitor /></el-icon>
        </div>
        <div v-show="!isCollapse" class="brand-copy">
          <p class="brand-eyebrow">Smart Ops Console</p>
          <h1>智慧运维平台</h1>
        </div>
      </div>

      <div v-show="!isCollapse" class="nav-summary">
        <p>系统在线率</p>
        <strong>98.4%</strong>
        <span>当前运行平稳，可继续巡检与处置。</span>
      </div>

      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        class="nav-menu"
        router
      >
        <el-menu-item v-for="item in menuItems" :key="item.path" :index="item.path">
          <el-icon><component :is="item.icon" /></el-icon>
          <template #title>{{ item.label }}</template>
        </el-menu-item>
      </el-menu>

      <div v-show="!isCollapse" class="aside-footer">
        <div class="footer-label">今日待办</div>
        <div class="footer-value">{{ notificationCount }} 条通知</div>
      </div>
    </aside>

    <div class="layout-main">
      <header class="topbar">
        <div class="topbar-left">
          <button class="collapse-toggle" type="button" @click="isCollapse = !isCollapse">
            <el-icon :size="18">
              <Fold v-if="!isCollapse" />
              <Expand v-else />
            </el-icon>
          </button>

          <div class="header-copy">
            <p class="header-kicker">{{ currentTitle }}</p>
            <el-breadcrumb separator="/" class="breadcrumb">
              <el-breadcrumb-item :to="{ path: '/dashboard' }">控制台</el-breadcrumb-item>
              <el-breadcrumb-item>{{ currentTitle }}</el-breadcrumb-item>
            </el-breadcrumb>
          </div>
        </div>

        <div class="topbar-right">
          <div class="runtime-card">
            <span class="runtime-label">系统时间</span>
            <strong>{{ currentTime }}</strong>
          </div>

          <el-badge :value="notificationCount" :hidden="notificationCount === 0" class="notification-badge">
            <button class="icon-button" type="button" @click="showNotifications">
              <el-icon :size="18"><Bell /></el-icon>
            </button>
          </el-badge>

          <el-dropdown @command="handleCommand">
            <div class="user-panel">
              <el-avatar :size="38" class="user-avatar">
                {{ userInfo.realName?.charAt(0) || 'U' }}
              </el-avatar>
              <div class="user-copy">
                <strong>{{ userInfo.realName || '用户' }}</strong>
                <span>{{ userInfo.role === 'admin' ? '系统管理员' : '平台成员' }}</span>
              </div>
              <el-icon><ArrowDown /></el-icon>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="profile">个人中心</el-dropdown-item>
                <el-dropdown-item command="settings">系统设置</el-dropdown-item>
                <el-dropdown-item divided command="logout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </header>

      <main class="workspace">
        <router-view />
      </main>
    </div>

    <el-dialog v-model="notificationVisible" title="通知中心" width="620px">
      <el-tabs v-model="activeNotificationTab" class="notification-tabs">
        <el-tab-pane :label="`告警通知 (${alarmNotifications.length})`" name="alarm">
          <div class="timeline-list">
            <div v-for="item in alarmNotifications" :key="item.id" class="timeline-item">
              <div class="timeline-dot" :style="{ background: item.color }"></div>
              <div class="timeline-card">
                <div class="timeline-header">
                  <el-tag :type="item.type" size="small">{{ item.level }}</el-tag>
                  <span>{{ item.title }}</span>
                </div>
                <p>{{ item.content }}</p>
                <time>{{ item.time }}</time>
              </div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane :label="`系统通知 (${systemNotifications.length})`" name="system">
          <div class="timeline-list">
            <div v-for="item in systemNotifications" :key="item.id" class="timeline-item">
              <div class="timeline-dot timeline-dot--system"></div>
              <div class="timeline-card">
                <div class="timeline-header">
                  <span>{{ item.title }}</span>
                </div>
                <p>{{ item.content }}</p>
                <time>{{ item.time }}</time>
              </div>
            </div>
          </div>
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

const menuItems = [
  { path: '/dashboard', label: '首页仪表盘', icon: 'DataAnalysis' },
  { path: '/device', label: '设备管理', icon: 'Monitor' },
  { path: '/alarm', label: '告警管理', icon: 'Bell' },
  { path: '/task', label: '运维任务', icon: 'List' },
  { path: '/log', label: '操作日志', icon: 'Document' },
  { path: '/user', label: '用户管理', icon: 'User' },
  { path: '/algorithm', label: '算法模型中心', icon: 'Cpu' },
  { path: '/digital-twin', label: '数字孪生平台', icon: 'Connection' },
  { path: '/llm', label: '本地大模型中心', icon: 'ChatDotSquare' },
  { path: '/agent', label: 'AI智能体中心', icon: 'Robot' },
  { path: '/visual-screen', label: '可视化大屏', icon: 'FullScreen' }
]

const menuTitleMap = Object.fromEntries(menuItems.map((item) => [item.path, item.label]))

const updateTime = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  const weekDays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
  currentTime.value = `${year}-${month}-${day} ${hours}:${minutes} ${weekDays[now.getDay()]}`
}

const userInfo = computed(() => {
  try {
    return JSON.parse(localStorage.getItem('userInfo') || '{}')
  } catch {
    return {}
  }
})

const activeMenu = computed(() => route.path)
const currentTitle = computed(() => menuTitleMap[route.path] || '控制台')

const alarmNotifications = ref([
  { id: 1, level: '严重', type: 'danger', color: '#ff6b7a', title: '空调主机故障', content: '3号空调主机通信中断，请立即检查设备状态', time: '2024-01-15 14:30' },
  { id: 2, level: '重要', type: 'warning', color: '#ffd166', title: '温度超限告警', content: 'A栋3层温度达到28.5℃，超过设定阈值', time: '2024-01-15 14:25' },
  { id: 3, level: '一般', type: 'info', color: '#66d9ff', title: '设备离线通知', content: 'B栋2层传感器已离线超过30分钟', time: '2024-01-15 14:20' },
  { id: 4, level: '重要', type: 'warning', color: '#ffd166', title: '能耗异常告警', content: '今日能耗较昨日同期增长15%，请关注', time: '2024-01-15 14:15' }
])

const systemNotifications = ref([
  { id: 1, title: '系统升级通知', content: '系统将于今晚22:00-23:00进行升级维护，届时部分功能可能不可用', time: '2024-01-15 10:00' },
  { id: 2, title: '新增功能', content: 'AI智能体中心已上线，支持能耗预测、故障诊断等智能运维功能', time: '2024-01-14 16:00' },
  { id: 3, title: '数据备份完成', content: '系统数据已自动备份，备份文件大小：2.3GB', time: '2024-01-14 02:00' }
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
    return
  }

  if (command === 'profile') {
    ElMessage.info('个人中心功能（演示模式）')
    return
  }

  ElMessage.info('系统设置功能（演示模式）')
}

onMounted(() => {
  updateTime()
  timer = setInterval(updateTime, 60000)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<style scoped>
.layout-shell {
  min-height: 100vh;
  display: flex;
  gap: 18px;
  padding: 18px;
}

.layout-aside {
  width: 280px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  padding: 18px 14px;
  border-radius: 30px;
  background:
    linear-gradient(180deg, rgba(12, 24, 42, 0.98) 0%, rgba(7, 14, 24, 0.96) 100%);
  border: 1px solid rgba(120, 200, 255, 0.14);
  box-shadow: 0 28px 72px rgba(0, 0, 0, 0.32);
  backdrop-filter: blur(20px);
  transition: width 0.28s ease;
}

.layout-aside.is-collapse {
  width: 88px;
  padding-inline: 10px;
}

.brand-card {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 12px 18px;
}

.brand-mark {
  width: 48px;
  height: 48px;
  display: grid;
  place-items: center;
  border-radius: 18px;
  color: #06111d;
  background: linear-gradient(135deg, #66d9ff 0%, #ffb74a 100%);
  box-shadow: 0 18px 32px rgba(23, 151, 210, 0.28);
}

.brand-copy h1 {
  font-size: 18px;
  font-weight: 700;
  color: #eff7ff;
}

.brand-eyebrow {
  margin-bottom: 4px;
  color: #7f96ad;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  font-size: 11px;
}

.nav-summary {
  margin: 8px 8px 18px;
  padding: 16px 18px;
  border-radius: 22px;
  background: linear-gradient(135deg, rgba(16, 33, 55, 0.92) 0%, rgba(12, 55, 82, 0.72) 100%);
  border: 1px solid rgba(102, 217, 255, 0.16);
}

.nav-summary p,
.nav-summary span {
  color: #9bb0c7;
}

.nav-summary strong {
  display: block;
  margin: 8px 0 10px;
  color: #eff7ff;
  font-size: 28px;
  line-height: 1;
}

.nav-summary span {
  display: block;
  font-size: 12px;
  line-height: 1.6;
}

.nav-menu {
  flex: 1;
  border: none;
  background: transparent;
}

.nav-menu :deep(.el-menu) {
  border-right: none;
}

.nav-menu :deep(.el-menu-item) {
  height: 48px;
  margin: 6px 0;
  border-radius: 16px;
  color: #9fb2ca;
}

.nav-menu :deep(.el-menu-item:hover) {
  background: rgba(102, 217, 255, 0.08);
  color: #eff7ff;
}

.nav-menu :deep(.el-menu-item.is-active) {
  background: linear-gradient(135deg, rgba(102, 217, 255, 0.18) 0%, rgba(255, 183, 74, 0.12) 100%);
  color: #eff7ff;
  border: 1px solid rgba(102, 217, 255, 0.18);
}

.aside-footer {
  margin-top: 14px;
  padding: 14px 18px;
  border-top: 1px solid rgba(120, 200, 255, 0.12);
}

.footer-label {
  color: #7f96ad;
  font-size: 12px;
  margin-bottom: 6px;
}

.footer-value {
  color: #eff7ff;
  font-size: 15px;
  font-weight: 600;
}

.layout-main {
  min-width: 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  padding: 18px 22px;
  border-radius: 28px;
  border: 1px solid rgba(120, 200, 255, 0.14);
  background: rgba(8, 18, 31, 0.72);
  backdrop-filter: blur(20px);
  box-shadow: 0 24px 70px rgba(0, 0, 0, 0.22);
}

.topbar-left,
.topbar-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.collapse-toggle,
.icon-button {
  width: 42px;
  height: 42px;
  border-radius: 14px;
  border: 1px solid rgba(120, 200, 255, 0.14);
  background: rgba(14, 28, 47, 0.82);
  color: #eff7ff;
  display: grid;
  place-items: center;
  cursor: pointer;
}

.header-kicker {
  margin-bottom: 4px;
  color: #eff7ff;
  font-size: 18px;
  font-weight: 700;
}

.breadcrumb {
  font-size: 13px;
}

.runtime-card {
  padding: 10px 14px;
  border-radius: 18px;
  background: rgba(14, 28, 47, 0.82);
  border: 1px solid rgba(120, 200, 255, 0.12);
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.runtime-label {
  color: #7f96ad;
  font-size: 11px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.runtime-card strong {
  color: #eff7ff;
  font-size: 13px;
}

.user-panel {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px 8px 8px;
  border-radius: 20px;
  background: rgba(14, 28, 47, 0.82);
  border: 1px solid rgba(120, 200, 255, 0.12);
  cursor: pointer;
}

.user-avatar {
  color: #06111d;
  font-weight: 700;
  background: linear-gradient(135deg, #66d9ff 0%, #ffb74a 100%);
}

.user-copy {
  display: flex;
  flex-direction: column;
}

.user-copy strong {
  color: #eff7ff;
  font-size: 14px;
}

.user-copy span {
  color: #8094ac;
  font-size: 12px;
}

.workspace {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 6px 2px 2px;
}

.notification-tabs :deep(.el-tabs__item) {
  color: #b4c5db;
}

.timeline-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.timeline-item {
  display: flex;
  gap: 14px;
  align-items: flex-start;
}

.timeline-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-top: 18px;
  box-shadow: 0 0 16px currentColor;
}

.timeline-dot--system {
  background: #66d9ff;
}

.timeline-card {
  flex: 1;
  padding: 16px 18px;
  border-radius: 18px;
  background: rgba(9, 19, 34, 0.84);
  border: 1px solid rgba(120, 200, 255, 0.1);
}

.timeline-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
  color: #eff7ff;
  font-weight: 600;
}

.timeline-card p {
  color: #b4c5db;
  line-height: 1.7;
  margin-bottom: 10px;
}

.timeline-card time {
  color: #8094ac;
  font-size: 12px;
}

@media (max-width: 1200px) {
  .runtime-card {
    display: none;
  }
}

@media (max-width: 960px) {
  .layout-shell {
    padding: 12px;
    gap: 12px;
  }

  .layout-aside {
    position: fixed;
    inset: 12px auto 12px 12px;
    z-index: 20;
    height: auto;
  }

  .layout-main {
    width: 100%;
    margin-left: 0;
  }

  .topbar {
    padding-inline: 16px;
  }
}

@media (max-width: 768px) {
  .layout-shell {
    display: block;
  }

  .layout-aside {
    display: none;
  }

  .topbar {
    flex-direction: column;
    align-items: stretch;
  }

  .topbar-left,
  .topbar-right {
    justify-content: space-between;
  }

  .user-copy {
    display: none;
  }
}
</style>
