<template>
  <div class="login-page">
    <div class="login-aurora login-aurora--one"></div>
    <div class="login-aurora login-aurora--two"></div>

    <section class="login-hero">
      <p class="hero-kicker">Enterprise Operations</p>
      <h1>让运维控制台看起来像一套真正的产品</h1>
      <p class="hero-copy">
        集中管理设备、告警、任务、算法、数字孪生与 AI 智能体，让巡检、分析和处置都落在同一张工作台上。
      </p>

      <div class="hero-metrics">
        <div class="hero-metric">
          <strong>24/7</strong>
          <span>可视化监控</span>
        </div>
        <div class="hero-metric">
          <strong>10+</strong>
          <span>核心业务模块</span>
        </div>
        <div class="hero-metric">
          <strong>Mock</strong>
          <span>离线演示兜底</span>
        </div>
      </div>
    </section>

    <section class="login-panel">
      <div class="panel-top">
        <div class="panel-mark">
          <el-icon :size="28"><Monitor /></el-icon>
        </div>
        <div>
          <p class="panel-kicker">Smart Ops Console</p>
          <h2>登录智慧运维平台</h2>
        </div>
      </div>

      <el-form ref="formRef" :model="loginForm" :rules="rules" class="login-form">
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            placeholder="请输入用户名"
            size="large"
            prefix-icon="User"
          />
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="请输入密码"
            size="large"
            prefix-icon="Lock"
            show-password
            @keyup.enter="handleLogin"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            size="large"
            :loading="loading"
            class="login-btn"
            @click="handleLogin"
          >
            进入控制台
          </el-button>
        </el-form-item>
      </el-form>

      <div class="panel-footer">
        <div class="demo-tip">
          <el-icon><InfoFilled /></el-icon>
          <span>演示账号：admin / 123456</span>
        </div>
        <p>后端未启动时会自动进入演示模式，适合展示与答辩。</p>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import axios from 'axios'

const router = useRouter()
const formRef = ref(null)
const loading = ref(false)

const loginForm = reactive({
  username: 'admin',
  password: '123456'
})

const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
}

const handleLogin = async () => {
  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) return

  loading.value = true
  try {
    const res = await axios.post('/api/auth/login', loginForm)
    if (res.data.code === 200) {
      localStorage.setItem('token', res.data.data.token)
      localStorage.setItem('userInfo', JSON.stringify(res.data.data.user))
      ElMessage.success('登录成功')
      router.push('/dashboard')
    } else {
      ElMessage.error(res.data.message || '登录失败')
    }
  } catch (error) {
    localStorage.setItem('token', `ops-token-admin-${Date.now()}`)
    localStorage.setItem('userInfo', JSON.stringify({
      id: 1,
      username: 'admin',
      realName: '系统管理员',
      role: 'admin'
    }))
    ElMessage.success('登录成功（演示模式）')
    router.push('/dashboard')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-page {
  position: relative;
  min-height: 100vh;
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(360px, 460px);
  align-items: center;
  gap: 48px;
  padding: 48px 64px;
  overflow: hidden;
}

.login-aurora {
  position: absolute;
  border-radius: 50%;
  filter: blur(18px);
  opacity: 0.8;
  pointer-events: none;
}

.login-aurora--one {
  width: 420px;
  height: 420px;
  left: -120px;
  top: -80px;
  background: radial-gradient(circle, rgba(102, 217, 255, 0.28) 0%, transparent 70%);
}

.login-aurora--two {
  width: 520px;
  height: 520px;
  right: -160px;
  bottom: -160px;
  background: radial-gradient(circle, rgba(255, 183, 74, 0.2) 0%, transparent 72%);
}

.login-hero,
.login-panel {
  position: relative;
  z-index: 1;
}

.login-hero {
  max-width: 640px;
}

.hero-kicker,
.panel-kicker {
  color: #7f96ad;
  font-size: 12px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

.login-hero h1 {
  margin: 20px 0 18px;
  font-size: clamp(42px, 5vw, 68px);
  line-height: 1.02;
  color: #eff7ff;
  max-width: 10em;
}

.hero-copy {
  max-width: 560px;
  color: #b4c5db;
  font-size: 18px;
  line-height: 1.8;
}

.hero-metrics {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-top: 34px;
}

.hero-metric {
  min-width: 150px;
  padding: 18px 20px;
  border-radius: 22px;
  border: 1px solid rgba(120, 200, 255, 0.14);
  background: rgba(9, 19, 34, 0.5);
  backdrop-filter: blur(12px);
}

.hero-metric strong {
  display: block;
  color: #eff7ff;
  font-size: 28px;
  margin-bottom: 8px;
}

.hero-metric span {
  color: #98aec4;
  font-size: 13px;
}

.login-panel {
  padding: 32px;
  border-radius: 32px;
  background: linear-gradient(180deg, rgba(12, 24, 42, 0.92) 0%, rgba(8, 16, 28, 0.94) 100%);
  border: 1px solid rgba(120, 200, 255, 0.16);
  box-shadow: 0 30px 90px rgba(0, 0, 0, 0.35);
  backdrop-filter: blur(18px);
}

.panel-top {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 30px;
}

.panel-mark {
  width: 56px;
  height: 56px;
  display: grid;
  place-items: center;
  border-radius: 20px;
  color: #07111f;
  background: linear-gradient(135deg, #66d9ff 0%, #ffb74a 100%);
}

.panel-top h2 {
  margin-top: 6px;
  color: #eff7ff;
  font-size: 28px;
}

.login-form {
  margin-top: 18px;
}

.login-form :deep(.el-form-item) {
  margin-bottom: 22px;
}

.login-btn {
  width: 100%;
  height: 48px;
  font-size: 15px;
  letter-spacing: 0.08em;
}

.panel-footer {
  margin-top: 12px;
  padding-top: 22px;
  border-top: 1px solid rgba(120, 200, 255, 0.1);
}

.demo-tip {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  border-radius: 999px;
  background: rgba(102, 217, 255, 0.08);
  color: #dbe9f7;
  margin-bottom: 12px;
}

.panel-footer p {
  color: #8fa5bb;
  line-height: 1.7;
  font-size: 13px;
}

@media (max-width: 1100px) {
  .login-page {
    grid-template-columns: 1fr;
    padding: 32px 20px;
  }

  .login-hero {
    max-width: none;
  }

  .login-hero h1 {
    max-width: none;
  }
}

@media (max-width: 768px) {
  .login-page {
    gap: 24px;
  }

  .login-hero h1 {
    font-size: 40px;
  }

  .hero-copy {
    font-size: 16px;
  }

  .login-panel {
    padding: 24px;
  }
}
</style>
