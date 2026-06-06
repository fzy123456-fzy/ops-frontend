<template>
  <div class="visual-screen">
    <!-- 顶部标题栏 -->
    <div class="screen-header">
      <div class="header-left">
        <span class="header-date">{{ currentDate }}</span>
        <span class="header-time">{{ currentTime }}</span>
        <span class="header-weather">今天 22°C</span>
      </div>
      <div class="header-center">
        <h1 class="system-title">智慧建筑智能运行中心</h1>
      </div>
      <div class="header-right">
        <el-button class="header-btn" size="small">大屏概览</el-button>
        <el-icon class="header-icon"><Bell /></el-icon>
        <el-icon class="header-icon"><User /></el-icon>
        <span class="user-name">管理员</span>
      </div>
    </div>

    <div class="screen-body">
      <!-- 首页 -->
      <div v-if="activeNav === 'home'" class="page-content smart-building-page">
        <!-- 背景 -->
        <div class="page-bg"></div>

        <!-- 顶部7个数据卡片 -->
        <div class="top-metrics">
          <div class="metric-card card-red">
            <div class="card-icon" style="background: rgba(255,68,68,0.2);">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color:#ff4444;">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
            </div>
            <div class="card-content">
              <span class="card-title">告警数量</span>
              <span class="card-value">12</span>
            </div>
          </div>

          <div class="metric-card card-blue">
            <div class="card-icon" style="background: rgba(0,212,255,0.2);">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color:#00d4ff;">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                <line x1="8" y1="21" x2="16" y2="21"/>
                <line x1="12" y1="17" x2="12" y2="21"/>
              </svg>
            </div>
            <div class="card-content">
              <span class="card-title">对接设备</span>
              <span class="card-value">2,848</span>
            </div>
          </div>

          <div class="metric-card card-green">
            <div class="card-icon" style="background: rgba(0,255,136,0.2);">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color:#00ff88;">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
              </svg>
            </div>
            <div class="card-content">
              <span class="card-title">综合能效</span>
              <span class="card-value">1.28 kWh/m²</span>
            </div>
          </div>

          <div class="metric-card card-blue2">
            <div class="card-icon" style="background: rgba(0,150,255,0.2);">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color:#0096ff;">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <line x1="3" y1="9" x2="21" y2="9"/>
                <line x1="9" y1="21" x2="9" y2="9"/>
              </svg>
            </div>
            <div class="card-content">
              <span class="card-title">工单进度</span>
              <span class="card-value">86 / 102</span>
              <span class="card-trend">已完成 84.3%</span>
            </div>
          </div>

          <div class="metric-card card-purple">
            <div class="card-icon" style="background: rgba(170,68,255,0.2);">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color:#aa44ff;">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
                <line x1="8" y1="7" x2="8" y2="3"/>
                <line x1="16" y1="7" x2="16" y2="3"/>
                <line x1="12" y1="12" x2="12" y2="15"/>
              </svg>
            </div>
            <div class="card-content">
              <span class="card-title">产品总数</span>
              <span class="card-value">56</span>
            </div>
          </div>

          <div class="metric-card card-cyan">
            <div class="card-icon" style="background: rgba(0,255,255,0.2);">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color:#00ffff;">
                <path d="M12 2l7 20-7-5-7 5z"/>
              </svg>
            </div>
            <div class="card-content">
              <span class="card-title">节能率</span>
              <span class="card-value">18.7%</span>
              <span class="card-trend">较昨日 ↑ 6%</span>
            </div>
          </div>

          <div class="metric-card card-blue3">
            <div class="card-icon" style="background: rgba(80,160,255,0.2);">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color:#50a0ff;">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
            </div>
            <div class="card-content">
              <span class="card-title">碳指标</span>
              <span class="card-value">128.6 吨</span>
            </div>
          </div>
        </div>

        <!-- 中间主体区域 -->
        <div class="building-main">
          <!-- 左侧空调机组 -->
          <div class="side-panels left-side">
            <div class="ac-unit-panel">
              <div class="panel-header">
                <span class="panel-title">空调机组1</span>
                <span class="panel-more">更多</span>
              </div>
              <div class="panel-body">
                <div class="ac-params-row">
                  <div class="ac-param">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color:#00d4ff;">
                      <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"/>
                    </svg>
                    <span class="param-label">温度</span>
                    <span class="param-value">12.5°C</span>
                  </div>
                  <div class="ac-param">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color:#00d4ff;">
                      <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
                    </svg>
                    <span class="param-label">湿度</span>
                    <span class="param-value">23.4%</span>
                  </div>
                  <div class="ac-param">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color:#00d4ff;">
                      <circle cx="11" cy="11" r="8"/>
                      <path d="M21 21l-4.35-4.35"/>
                    </svg>
                    <span class="param-label">管道温度</span>
                    <span class="param-value">-3.9°C</span>
                  </div>
                  <div class="ac-param">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color:#00d4ff;">
                      <path d="M12 1l9 4v14l-9 4-9-4V5l9-4z"/>
                      <circle cx="12" cy="13" r="3"/>
                    </svg>
                    <span class="param-label">噪声</span>
                    <span class="param-value">51.7 dB</span>
                  </div>
                </div>
                
                <div class="ac-warnings">
                  <div class="warning-item">
                    <span class="warning-dot warning-ok"></span>
                    <span class="warning-label">小波预警</span>
                    <span class="warning-status">正常</span>
                  </div>
                  <div class="warning-item">
                    <span class="warning-dot warning-ok"></span>
                    <span class="warning-label">振动预警</span>
                    <span class="warning-status">正常</span>
                  </div>
                </div>

                <div class="ac-temp-data">
                  <div class="temp-group">
                    <span class="temp-group-title">变压器铁芯温度</span>
                    <div class="temp-items">
                      <span class="temp-item">A相 27.9°C</span>
                      <span class="temp-item">B相 27.9°C</span>
                      <span class="temp-item">C相 27.9°C</span>
                    </div>
                  </div>
                  <div class="temp-group">
                    <span class="temp-group-title">变压器低压温度</span>
                    <div class="temp-items">
                      <span class="temp-item">A相 27.9°C</span>
                      <span class="temp-item">B相 27.9°C</span>
                      <span class="temp-item">C相 27.9°C</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="ac-unit-panel">
              <div class="panel-header">
                <span class="panel-title">空调机组3</span>
                <span class="panel-more">更多</span>
              </div>
              <div class="panel-body">
                <div class="ac-params-row">
                  <div class="ac-param">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color:#00d4ff;">
                      <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"/>
                    </svg>
                    <span class="param-label">温度</span>
                    <span class="param-value">17.9°C</span>
                  </div>
                  <div class="ac-param">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color:#00d4ff;">
                      <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
                    </svg>
                    <span class="param-label">湿度</span>
                    <span class="param-value">25.0%</span>
                  </div>
                  <div class="ac-param">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color:#00d4ff;">
                      <circle cx="11" cy="11" r="8"/>
                      <path d="M21 21l-4.35-4.35"/>
                    </svg>
                    <span class="param-label">管道温度</span>
                    <span class="param-value">-4.6°C</span>
                  </div>
                  <div class="ac-param">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color:#00d4ff;">
                      <path d="M12 1l9 4v14l-9 4-9-4V5l9-4z"/>
                      <circle cx="12" cy="13" r="3"/>
                    </svg>
                    <span class="param-label">噪声</span>
                    <span class="param-value">53.9 dB</span>
                  </div>
                </div>
                
                <div class="ac-warnings">
                  <div class="warning-item">
                    <span class="warning-dot warning-ok"></span>
                    <span class="warning-label">小波预警</span>
                    <span class="warning-status">正常</span>
                  </div>
                  <div class="warning-item">
                    <span class="warning-dot warning-alarm"></span>
                    <span class="warning-label">振动预警</span>
                    <span class="warning-status warning-status-alarm">报警</span>
                  </div>
                </div>

                <div class="ac-temp-data">
                  <div class="temp-group">
                    <span class="temp-group-title">变压器铁芯温度</span>
                    <div class="temp-items">
                      <span class="temp-item">A相 27.9°C</span>
                      <span class="temp-item">B相 27.9°C</span>
                      <span class="temp-item">C相 27.9°C</span>
                    </div>
                  </div>
                  <div class="temp-group">
                    <span class="temp-group-title">变压器低压温度</span>
                    <div class="temp-items">
                      <span class="temp-item">A相 27.9°C</span>
                      <span class="temp-item">B相 27.9°C</span>
                      <span class="temp-item">C相 27.9°C</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 中间建筑区域 -->
          <div class="center-building">
            <div class="alert-banner">
              <div class="alert-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color:#ff4444;">
                  <path d="M12 9v4m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                </svg>
              </div>
              <span class="alert-text">告警：14#风机空调故障，具体故障为XXX用户告警，需要进行优化处理</span>
              <div class="alert-actions">
                <span class="alert-time">20分钟前</span>
                <span class="alert-btn">查看详情</span>
              </div>
            </div>
            <div class="building-3d-container">
              <img src="/building-bg.jpg" alt="智慧建筑" class="building-image" />
            </div>
          </div>

          <!-- 右侧空调机组 -->
          <div class="side-panels right-side">
            <div class="ac-unit-panel">
              <div class="panel-header">
                <span class="panel-title">空调机组2</span>
                <span class="panel-more">更多</span>
              </div>
              <div class="panel-body">
                <div class="ac-params-row">
                  <div class="ac-param">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color:#00d4ff;">
                      <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"/>
                    </svg>
                    <span class="param-label">温度</span>
                    <span class="param-value">17.8°C</span>
                  </div>
                  <div class="ac-param">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color:#00d4ff;">
                      <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
                    </svg>
                    <span class="param-label">湿度</span>
                    <span class="param-value">22.9%</span>
                  </div>
                  <div class="ac-param">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color:#00d4ff;">
                      <circle cx="11" cy="11" r="8"/>
                      <path d="M21 21l-4.35-4.35"/>
                    </svg>
                    <span class="param-label">管道温度</span>
                    <span class="param-value">-3.7°C</span>
                  </div>
                  <div class="ac-param">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color:#00d4ff;">
                      <path d="M12 1l9 4v14l-9 4-9-4V5l9-4z"/>
                      <circle cx="12" cy="13" r="3"/>
                    </svg>
                    <span class="param-label">噪声</span>
                    <span class="param-value">60.7 dB</span>
                  </div>
                </div>
                
                <div class="ac-warnings">
                  <div class="warning-item">
                    <span class="warning-dot warning-ok"></span>
                    <span class="warning-label">小波预警</span>
                    <span class="warning-status">正常</span>
                  </div>
                  <div class="warning-item">
                    <span class="warning-dot warning-alarm"></span>
                    <span class="warning-label">振动预警</span>
                    <span class="warning-status warning-status-alarm">报警</span>
                  </div>
                </div>

                <div class="ac-temp-data">
                  <div class="temp-group">
                    <span class="temp-group-title">变压器铁芯温度</span>
                    <div class="temp-items">
                      <span class="temp-item">A相 27.9°C</span>
                      <span class="temp-item">B相 27.9°C</span>
                      <span class="temp-item">C相 27.9°C</span>
                    </div>
                  </div>
                  <div class="temp-group">
                    <span class="temp-group-title">变压器低压温度</span>
                    <div class="temp-items">
                      <span class="temp-item">A相 27.9°C</span>
                      <span class="temp-item">B相 27.9°C</span>
                      <span class="temp-item">C相 27.9°C</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="ac-unit-panel">
              <div class="panel-header">
                <span class="panel-title">空调机组4</span>
                <span class="panel-more">更多</span>
              </div>
              <div class="panel-body">
                <div class="ac-params-row">
                  <div class="ac-param">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color:#00d4ff;">
                      <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"/>
                    </svg>
                    <span class="param-label">温度</span>
                    <span class="param-value">12.6°C</span>
                  </div>
                  <div class="ac-param">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color:#00d4ff;">
                      <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
                    </svg>
                    <span class="param-label">湿度</span>
                    <span class="param-value">24.5%</span>
                  </div>
                  <div class="ac-param">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color:#00d4ff;">
                      <circle cx="11" cy="11" r="8"/>
                      <path d="M21 21l-4.35-4.35"/>
                    </svg>
                    <span class="param-label">管道温度</span>
                    <span class="param-value">-2.7°C</span>
                  </div>
                  <div class="ac-param">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color:#00d4ff;">
                      <path d="M12 1l9 4v14l-9 4-9-4V5l9-4z"/>
                      <circle cx="12" cy="13" r="3"/>
                    </svg>
                    <span class="param-label">噪声</span>
                    <span class="param-value">51.7 dB</span>
                  </div>
                </div>
                
                <div class="ac-warnings">
                  <div class="warning-item">
                    <span class="warning-dot warning-ok"></span>
                    <span class="warning-label">小波预警</span>
                    <span class="warning-status">正常</span>
                  </div>
                  <div class="warning-item">
                    <span class="warning-dot warning-ok"></span>
                    <span class="warning-label">振动预警</span>
                    <span class="warning-status">正常</span>
                  </div>
                </div>

                <div class="ac-temp-data">
                  <div class="temp-group">
                    <span class="temp-group-title">变压器铁芯温度</span>
                    <div class="temp-items">
                      <span class="temp-item">A相 27.9°C</span>
                      <span class="temp-item">B相 27.9°C</span>
                      <span class="temp-item">C相 27.9°C</span>
                    </div>
                  </div>
                  <div class="temp-group">
                    <span class="temp-group-title">变压器低压温度</span>
                    <div class="temp-items">
                      <span class="temp-item">A相 27.9°C</span>
                      <span class="temp-item">B相 27.9°C</span>
                      <span class="temp-item">C相 27.9°C</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 底部区域 -->
        <div class="bottom-section">
          <!-- LLM智能助手 -->
          <div class="bottom-panel llm-panel">
            <div class="panel-title-bar">
              <span class="panel-title">LLM智能助手</span>
              <div class="search-box">
                <input type="text" placeholder="" />
                <div class="send-btn">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M22 2L11 13M22 2L15 22l-4-9-9-4"/>
                  </svg>
                </div>
              </div>
            </div>
            <div class="llm-content">
              <div class="llm-functions">
                <div class="function-item">
                  <div class="function-icon"></div>
                  <span class="function-label">空调异常分析</span>
                </div>
                <div class="function-item">
                  <div class="function-icon"></div>
                  <span class="function-label">能耗异常分析</span>
                </div>
                <div class="function-item">
                  <div class="function-icon"></div>
                  <span class="function-label">故障诊断</span>
                </div>
                <div class="function-item">
                  <div class="function-icon"></div>
                  <span class="function-label">振动异常检测</span>
                </div>
              </div>
              <div class="llm-analysis">
                <p class="analysis-text">正在分析空调系统本月能耗数据……</p>
                <p class="analysis-alert">
                  <span style="color:#ff4444;">约5.3%超标</span>
                  <span class="analysis-btn">分析中</span>
                </p>
              </div>
            </div>
          </div>

          <!-- AI-Agent协同中心 -->
          <div class="bottom-panel agent-panel">
            <div class="panel-title-bar">
              <span class="panel-title">AI-Agent 协同中心</span>
              <span class="more-btn">更多</span>
            </div>
            <div class="agent-content">
              <div class="agent-cards">
                <div class="agent-card">
                  <div class="agent-status status-running">运行中</div>
                  <div class="agent-name">能耗优化 Agent</div>
                  <div class="agent-progress">
                    <div class="progress-bar">
                      <div class="progress-fill" style="width:70%;"></div>
                    </div>
                    <span class="progress-value">70%</span>
                  </div>
                </div>

                <div class="agent-card">
                  <div class="agent-status status-processing">进行中</div>
                  <div class="agent-name">故障诊断 Agent</div>
                  <div class="agent-progress">
                    <div class="progress-bar">
                      <div class="progress-fill" style="width:85%;"></div>
                    </div>
                    <span class="progress-value">85%</span>
                  </div>
                </div>

                <div class="agent-card">
                  <div class="agent-status status-running">运行中</div>
                  <div class="agent-name">工单调度 Agent</div>
                  <div class="agent-progress">
                    <div class="progress-bar">
                      <div class="progress-fill" style="width:55%;"></div>
                    </div>
                    <span class="progress-value">55%</span>
                  </div>
                </div>

                <div class="agent-card">
                  <div class="agent-status status-processing">进行中</div>
                  <div class="agent-name">工单调度 Agent</div>
                  <div class="agent-progress">
                    <div class="progress-bar">
                      <div class="progress-fill" style="width:65%;"></div>
                    </div>
                    <span class="progress-value">65%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- AI智能推荐 -->
          <div class="bottom-panel recommend-panel">
            <div class="recommend-content">
              <div class="circle-section">
                <div class="circle-chart">
                  <svg viewBox="0 0 160 160">
                    <circle cx="80" cy="80" r="70" fill="none" stroke="rgba(0,200,255,0.2)" stroke-width="12"/>
                    <circle cx="80" cy="80" r="70" fill="none" stroke="#00d4ff" stroke-width="12" 
                        stroke-dasharray="439.8" stroke-dashoffset="109.95" 
                        stroke-linecap="round"
                        transform="rotate(-90 80 80)"/>
                  </svg>
                  <div class="circle-inner">
                    <span class="circle-value">75.2%</span>
                    <span class="circle-label">综合评分</span>
                  </div>
                </div>
              </div>
              <div class="list-section">
                <div class="panel-title-bar">
                  <span class="panel-title">AI智能推荐</span>
                </div>
                <div class="recommend-list">
                  <div class="recommend-item">
                    <span class="item-dot" style="background:#00ff88;"></span>
                    <span class="item-text">空调系统优化</span>
                    <span class="item-range">5,310~10%</span>
                    <span class="item-percent" style="color:#00ff88;">40%</span>
                  </div>
                  <div class="recommend-item">
                    <span class="item-dot" style="background:#00d4ff;"></span>
                    <span class="item-text">照明系统优化</span>
                    <span class="item-range">5,300~10%</span>
                    <span class="item-percent" style="color:#00d4ff;">25%</span>
                  </div>
                  <div class="recommend-item">
                    <span class="item-dot" style="background:#ffaa00;"></span>
                    <span class="item-text">电梯系统优化</span>
                    <span class="item-range">5,200~10%</span>
                    <span class="item-percent" style="color:#ffaa00;">10%</span>
                  </div>
                  <div class="recommend-item">
                    <span class="item-dot" style="background:#aa44ff;"></span>
                    <span class="item-text">水系统优化</span>
                    <span class="item-range">2,890~10%</span>
                    <span class="item-percent" style="color:#aa44ff;">10%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 底部导航栏 -->
        <div class="bottom-nav">
          <div class="nav-tabs">
            <div class="nav-tab active" @click="activeNav = 'home'">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
              <span>首页</span>
            </div>
            <div class="nav-tab" @click="activeNav = 'energy'">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
              </svg>
              <span>智能耗能</span>
            </div>
            <div class="nav-tab" @click="activeNav = 'device'">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                <line x1="8" y1="21" x2="16" y2="21"/>
                <line x1="12" y1="17" x2="12" y2="21"/>
              </svg>
              <span>设备管理</span>
            </div>
            <div class="nav-tab" @click="activeNav = 'power'">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="2" y1="12" x2="22" y2="12"/>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
              </svg>
              <span>智能电力</span>
            </div>
            <div class="nav-tab" @click="activeNav = 'security'">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
                <line x1="12" y1="22.08" x2="12" y2="12"/>
              </svg>
              <span>智能安防</span>
            </div>
            <div class="nav-tab" @click="activeNav = 'quality'">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
              </svg>
              <span>质量分析</span>
            </div>
            <div class="nav-tab" @click="activeNav = 'asset'">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
              </svg>
              <span>数据资产</span>
            </div>
            <div class="nav-tab" @click="activeNav = 'ai'">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 8v8M8 12h8"/>
              </svg>
              <span>AI运营</span>
            </div>
            <div class="nav-tab" @click="activeNav = 'settings'">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="3"/>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
              </svg>
              <span>系统设置</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 智能能耗页面 -->
      <div v-if="activeNav === 'energy'" class="page-content energy-page">
        <div class="page-bg"></div>
        <div class="energy-content">
          <!-- 顶部数据卡片 -->
          <div class="energy-top-cards">
            <div class="energy-card">
              <div class="card-icon" style="background: rgba(0,212,255,0.2);">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: #00d4ff;">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
                </svg>
              </div>
              <div class="card-content">
                <span class="card-title">今日总能耗</span>
                <span class="card-value">651.00 kWh</span>
                <span class="card-trend trend-down">较昨日 -25%</span>
              </div>
            </div>
            <div class="energy-card">
              <div class="card-icon" style="background: rgba(0,255,136,0.2);">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: #00ff88;">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                  <line x1="3" y1="9" x2="21" y2="9"/>
                  <line x1="9" y1="21" x2="9" y2="9"/>
                </svg>
              </div>
              <div class="card-content">
                <span class="card-title">本月总能耗</span>
                <span class="card-value">18,420 kWh</span>
                <span class="card-trend trend-down">较上月 -18%</span>
              </div>
            </div>
            <div class="energy-card">
              <div class="card-icon" style="background: rgba(0,150,255,0.2);">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: #0096ff;">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
              </div>
              <div class="card-content">
                <span class="card-title">综合能效</span>
                <span class="card-value">1.28 kWh/m²</span>
                <span class="card-trend trend-down">较上月 -5%</span>
              </div>
            </div>
            <div class="energy-card">
              <div class="card-icon" style="background: rgba(170,68,255,0.2);">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: #aa44ff;">
                  <path d="M12 2l7 20-7-5-7 5z"/>
                </svg>
              </div>
              <div class="card-content">
                <span class="card-title">节能率</span>
                <span class="card-value">18.7%</span>
                <span class="card-trend trend-up">较上月 +3%</span>
              </div>
            </div>
            <div class="energy-card">
              <div class="card-icon" style="background: rgba(80,160,255,0.2);">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: #50a0ff;">
                  <path d="M21 10.5h-4V8a4 4 0 0 0-8 0v2.5H5c-.6 0-1 .4-1 1v10c0 .6.4 1 1 1h16c.6 0 1-.4 1-1v-10c0-.6-.4-1-1-1z"/>
                </svg>
              </div>
              <div class="card-content">
                <span class="card-title">碳排放</span>
                <span class="card-value">128.6 吨</span>
                <span class="card-trend trend-down">较上月 -12%</span>
              </div>
            </div>
            <div class="energy-card">
              <div class="card-icon" style="background: rgba(255,68,68,0.2);">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: #ff4444;">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
              </div>
              <div class="card-content">
                <span class="card-title">异常能耗</span>
                <span class="card-value">12 条</span>
                <span class="card-trend trend-up">较昨日 +2</span>
              </div>
            </div>
          </div>

          <!-- 主体三栏布局 -->
          <div class="energy-main">
            <!-- 左侧区域 -->
            <div class="energy-left">
              <!-- 今日能耗统计 -->
              <div class="energy-panel">
                <div class="panel-header">
                  <span class="panel-title">今日能耗统计</span>
                </div>
                <div class="panel-body energy-stat-body">
                  <div class="energy-big-stat">
                    <div class="stat-icon">⚡</div>
                    <div class="stat-main">
                      <span class="stat-value">651.00</span>
                      <span class="stat-unit">kWh</span>
                    </div>
                  </div>
                  <div class="stat-compare">
                    <span class="compare-label">同比：</span>
                    <span class="compare-value down">-25.00%</span>
                  </div>
                  <div class="stat-status">
                    <span class="status-dot"></span>
                    <span class="status-text">节能良好</span>
                  </div>
                </div>
              </div>

              <!-- 今日能耗分布 -->
              <div class="energy-panel">
                <div class="panel-header">
                  <span class="panel-title">今日能耗分布</span>
                </div>
                <div class="panel-body">
                  <div ref="todayEnergyPie" class="energy-chart"></div>
                </div>
              </div>

              <!-- 今日能耗排名 -->
              <div class="energy-panel">
                <div class="panel-header">
                  <span class="panel-title">今日能耗排名</span>
                </div>
                <div class="panel-body">
                  <div class="ranking-list">
                    <div class="ranking-item">
                      <span class="rank-num">1</span>
                      <span class="rank-name">地上2层</span>
                      <div class="rank-bar"><div class="rank-fill" style="width: 100%;"></div></div>
                      <span class="rank-value">2520 kWh</span>
                    </div>
                    <div class="ranking-item">
                      <span class="rank-num">2</span>
                      <span class="rank-name">地下2层</span>
                      <div class="rank-bar"><div class="rank-fill" style="width: 100%;"></div></div>
                      <span class="rank-value">2520 kWh</span>
                    </div>
                    <div class="ranking-item">
                      <span class="rank-num">3</span>
                      <span class="rank-name">屋顶</span>
                      <div class="rank-bar"><div class="rank-fill" style="width: 53%;"></div></div>
                      <span class="rank-value">1344 kWh</span>
                    </div>
                    <div class="ranking-item">
                      <span class="rank-num">4</span>
                      <span class="rank-name">地上12层</span>
                      <div class="rank-bar"><div class="rank-fill" style="width: 33%;"></div></div>
                      <span class="rank-value">840 kWh</span>
                    </div>
                    <div class="ranking-item">
                      <span class="rank-num">5</span>
                      <span class="rank-name">地上7层</span>
                      <div class="rank-bar"><div class="rank-fill" style="width: 27%;"></div></div>
                      <span class="rank-value">672 kWh</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 中间区域 -->
            <div class="energy-center">
              <div class="panel-header center-header">
                <span class="panel-title">楼宇能耗总览</span>
              </div>
              <div class="building-wrapper">
                <img src="/building-bg.jpg" alt="智慧建筑" class="building-image" />
                <div class="energy-markers">
                  <div class="marker marker-1">
                    <div class="marker-content">
                      <span class="marker-label">空调系统</span>
                      <span class="marker-value">142.3 kWh</span>
                    </div>
                  </div>
                  <div class="marker marker-2">
                    <div class="marker-content">
                      <span class="marker-label">照明系统</span>
                      <span class="marker-value">88.6 kWh</span>
                    </div>
                  </div>
                  <div class="marker marker-3">
                    <div class="marker-content">
                      <span class="marker-label">电梯系统</span>
                      <span class="marker-value">52.1 kWh</span>
                    </div>
                  </div>
                  <div class="marker marker-4">
                    <div class="marker-content">
                      <span class="marker-label">动力设备</span>
                      <span class="marker-value">230.4 kWh</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 右侧区域 -->
            <div class="energy-right">
              <!-- 历史电耗趋势 -->
              <div class="energy-panel">
                <div class="panel-header">
                  <span class="panel-title">历史电耗趋势</span>
                </div>
                <div class="panel-body">
                  <div ref="historyEnergyLine" class="energy-chart"></div>
                </div>
              </div>

              <!-- 能耗分布 -->
              <div class="energy-panel">
                <div class="panel-header">
                  <span class="panel-title">能耗分布</span>
                </div>
                <div class="panel-body">
                  <div ref="energyDistributionPie" class="energy-chart"></div>
                </div>
              </div>

              <!-- 能耗排名 -->
              <div class="energy-panel">
                <div class="panel-header">
                  <span class="panel-title">能耗排名</span>
                </div>
                <div class="panel-body">
                  <div ref="energyRankingBar" class="energy-chart"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 其他页面占位 -->
      <div v-if="activeNav !== 'home' && activeNav !== 'energy'" class="page-content">
        <div class="placeholder-page">
          <h2>{{ getPageTitle() }}</h2>
          <p>页面开发中……</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { Bell, User } from '@element-plus/icons-vue'
import * as echarts from 'echarts'

const currentDate = ref('')
const currentTime = ref('')
const activeNav = ref('home')

let timer = null
let charts = {
  todayEnergyPie: null,
  historyEnergyLine: null,
  energyDistributionPie: null,
  energyRankingBar: null
}

const todayEnergyPie = ref(null)
const historyEnergyLine = ref(null)
const energyDistributionPie = ref(null)
const energyRankingBar = ref(null)

const updateTime = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  const seconds = String(now.getSeconds()).padStart(2, '0')
  currentDate.value = `${year}-${month}-${day}`
  currentTime.value = `${hours}:${minutes}:${seconds}`
}

const getPageTitle = () => {
  const titles = {
    energy: '智能耗能',
    device: '设备管理',
    power: '智能电力',
    security: '智能安防',
    quality: '质量分析',
    asset: '数据资产',
    ai: 'AI运营',
    settings: '系统设置'
  }
  return titles[activeNav.value] || ''
}

const initTodayEnergyPie = () => {
  if (!todayEnergyPie.value) return
  const chart = echarts.init(todayEnergyPie.value)
  chart.setOption({
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(0,30,60,0.95)',
      borderColor: 'rgba(0,212,255,0.5)',
      textStyle: { color: '#fff' }
    },
    series: [{
      type: 'pie',
      radius: ['45%', '70%'],
      center: ['50%', '50%'],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 6,
        borderColor: 'rgba(0,20,40,1)',
        borderWidth: 2
      },
      label: { show: false },
      emphasis: { label: { show: true, fontSize: 14, fontWeight: 'bold' } },
      data: [
        { value: 57, name: '空调系统', itemStyle: { color: '#00d4ff' } },
        { value: 10, name: '照明系统', itemStyle: { color: '#00ff88' } },
        { value: 27, name: '动力用电', itemStyle: { color: '#ffcc33' } },
        { value: 6, name: '其他用电', itemStyle: { color: '#ff4d5a' } }
      ]
    }]
  })
  charts.todayEnergyPie = chart
}

const initHistoryEnergyLine = () => {
  if (!historyEnergyLine.value) return
  const chart = echarts.init(historyEnergyLine.value)
  chart.setOption({
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(0,30,60,0.95)',
      borderColor: 'rgba(0,212,255,0.5)',
      textStyle: { color: '#fff' }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '10%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      axisLine: { lineStyle: { color: 'rgba(0,212,255,0.3)' } },
      axisLabel: { color: '#b8eaff' }
    },
    yAxis: {
      type: 'value',
      axisLine: { lineStyle: { color: 'rgba(0,212,255,0.3)' } },
      axisLabel: { color: '#b8eaff' },
      splitLine: { lineStyle: { color: 'rgba(0,212,255,0.15)' } }
    },
    series: [{
      name: '电耗',
      type: 'line',
      smooth: true,
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: 'rgba(0,212,255,0.4)' },
          { offset: 1, color: 'rgba(0,212,255,0)' }
        ])
      },
      lineStyle: { color: '#00d4ff', width: 3 },
      itemStyle: { color: '#00d4ff' },
      data: [420, 530, 490, 620, 580, 760, 690]
    }]
  })
  charts.historyEnergyLine = chart
}

const initEnergyDistributionPie = () => {
  if (!energyDistributionPie.value) return
  const chart = echarts.init(energyDistributionPie.value)
  chart.setOption({
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(0,30,60,0.95)',
      borderColor: 'rgba(0,212,255,0.5)',
      textStyle: { color: '#fff' }
    },
    legend: {
      bottom: '5%',
      left: 'center',
      textStyle: { color: '#b8eaff' }
    },
    series: [{
      type: 'pie',
      radius: ['40%', '65%'],
      center: ['50%', '40%'],
      itemStyle: {
        borderRadius: 5,
        borderColor: 'rgba(0,20,40,1)',
        borderWidth: 2
      },
      label: { show: true, color: '#b8eaff' },
      data: [
        { value: 45, name: '空调系统', itemStyle: { color: '#00d4ff' } },
        { value: 20, name: '照明系统', itemStyle: { color: '#00ff88' } },
        { value: 15, name: '电梯系统', itemStyle: { color: '#ffcc33' } },
        { value: 12, name: '插座动力', itemStyle: { color: '#8b5cf6' } },
        { value: 8, name: '其他', itemStyle: { color: '#ff4d5a' } }
      ]
    }]
  })
  charts.energyDistributionPie = chart
}

const initEnergyRankingBar = () => {
  if (!energyRankingBar.value) return
  const chart = echarts.init(energyRankingBar.value)
  chart.setOption({
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(0,30,60,0.95)',
      borderColor: 'rgba(0,212,255,0.5)',
      textStyle: { color: '#fff' }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '5%',
      containLabel: true
    },
    xAxis: {
      type: 'value',
      axisLine: { lineStyle: { color: 'rgba(0,212,255,0.3)' } },
      axisLabel: { color: '#b8eaff' },
      splitLine: { lineStyle: { color: 'rgba(0,212,255,0.15)' } }
    },
    yAxis: {
      type: 'category',
      data: ['空调系统', '照明系统', '电梯系统', '动力设备'],
      axisLine: { lineStyle: { color: 'rgba(0,212,255,0.3)' } },
      axisLabel: { color: '#b8eaff' }
    },
    series: [{
      name: '能耗',
      type: 'bar',
      barWidth: '50%',
      itemStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
          { offset: 0, color: '#00d4ff' },
          { offset: 1, color: '#0066aa' }
        ]),
        borderRadius: [0, 4, 4, 0]
      },
      data: [3200, 1800, 1300, 980]
    }]
  })
  charts.energyRankingBar = chart
}

const initAllCharts = () => {
  nextTick(() => {
    initTodayEnergyPie()
    initHistoryEnergyLine()
    initEnergyDistributionPie()
    initEnergyRankingBar()
  })
}

const disposeAllCharts = () => {
  Object.values(charts).forEach(chart => {
    if (chart) {
      chart.dispose()
    }
  })
  charts = {
    todayEnergyPie: null,
    historyEnergyLine: null,
    energyDistributionPie: null,
    energyRankingBar: null
  }
}

const handleResize = () => {
  Object.values(charts).forEach(chart => {
    if (chart) chart.resize()
  })
}

watch(activeNav, (newVal) => {
  if (newVal === 'energy') {
    disposeAllCharts()
    nextTick(() => initAllCharts())
  } else {
    disposeAllCharts()
  }
})

onMounted(() => {
  updateTime()
  timer = setInterval(updateTime, 1000)
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
  disposeAllCharts()
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.visual-screen {
  width: 100%;
  height: 100vh;
  background: linear-gradient(180deg, #001020 0%, #001a30 50%, #001020 100%);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  position: relative;
}

.screen-header {
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 40px;
  background: linear-gradient(180deg, rgba(0,30,60,0.95) 0%, rgba(0,20,45,0.8) 100%);
  border-bottom: 2px solid rgba(0,150,255,0.35);
  position: relative;
  z-index: 20;
  flex-shrink: 0;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 24px;
}

.header-date, .header-time, .header-weather {
  font-size: 15px;
  color: #00d4ff;
  font-weight: 500;
}

.header-center {
  flex: 1;
  display: flex;
  justify-content: center;
}

.system-title {
  font-size: 28px;
  font-weight: 700;
  color: #fff;
  margin: 0;
  letter-spacing: 8px;
  text-shadow: 0 0 25px rgba(0,180,255,0.9), 0 0 50px rgba(0,100,255,0.5);
  background: linear-gradient(180deg, #ffffff 0%, #b0e8ff 40%, #00d4ff 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 18px;
}

.header-btn {
  background: rgba(0,150,255,0.25);
  border: 1px solid rgba(0,150,255,0.5);
  color: #00d4ff;
  font-size: 14px;
}

.header-icon {
  color: #00d4ff;
  font-size: 22px;
}

.user-name {
  color: #fff;
  font-size: 15px;
  font-weight: 500;
}

.screen-body {
  flex: 1;
  overflow: hidden;
  position: relative;
  display: flex;
  flex-direction: column;
}

.page-content {
  width: 100%;
  height: 100%;
  position: relative;
  flex: 1;
  overflow: hidden;
}

.smart-building-page {
  display: flex;
  flex-direction: column;
  padding: 16px 24px 0;
  height: 100%;
}

.page-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('/building-bg.jpg') center/cover;
  opacity: 0.25;
  z-index: 0;
}

/* 顶部指标卡片 */
.top-metrics {
  display: flex;
  justify-content: center;
  gap: 18px;
  padding: 0 0 16px;
  position: relative;
  z-index: 1;
  flex-shrink: 0;
}

.metric-card {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 20px;
  background: rgba(0,30,60,0.9);
  border: 1px solid rgba(0,150,255,0.35);
  border-radius: 10px;
  min-width: 170px;
}

.card-icon {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  flex-shrink: 0;
}

.card-icon svg {
  width: 24px;
  height: 24px;
}

.card-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.card-title {
  font-size: 13px;
  color: rgba(255,255,255,0.7);
  font-weight: 500;
}

.card-value {
  font-size: 20px;
  font-weight: 700;
  color: #fff;
}

.card-trend {
  font-size: 12px;
  color: #00ff88;
}

.card-red { border-left: 3px solid #ff4444; }
.card-blue { border-left: 3px solid #00d4ff; }
.card-green { border-left: 3px solid #00ff88; }
.card-blue2 { border-left: 3px solid #0096ff; }
.card-purple { border-left: 3px solid #aa44ff; }
.card-cyan { border-left: 3px solid #00ffff; }
.card-blue3 { border-left: 3px solid #50a0ff; }

/* 中间主体区域 */
.building-main {
  display: flex;
  gap: 20px;
  flex: 1;
  min-height: 0;
  position: relative;
  z-index: 1;
}

.side-panels {
  width: 340px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  flex-shrink: 0;
}

.ac-unit-panel {
  background: rgba(0,25,50,0.92);
  border: 1px solid rgba(0,150,255,0.3);
  border-radius: 12px;
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: linear-gradient(180deg, rgba(0,60,100,0.4) 0%, rgba(0,40,80,0.25) 100%);
  border-bottom: 1px solid rgba(0,150,255,0.2);
  flex-shrink: 0;
}

.panel-title {
  font-size: 15px;
  font-weight: 600;
  color: #00d4ff;
}

.panel-more {
  font-size: 13px;
  color: rgba(255,255,255,0.6);
}

.panel-body {
  padding: 16px;
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.ac-params-row {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.ac-param {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  background: rgba(0,50,100,0.3);
  border-radius: 8px;
}

.ac-param svg {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

.param-label {
  font-size: 12px;
  color: rgba(255,255,255,0.65);
  flex: 1;
}

.param-value {
  font-size: 14px;
  font-weight: 600;
  color: #00d4ff;
}

.ac-warnings {
  display: flex;
  gap: 16px;
  padding: 10px 12px;
  background: rgba(0,50,100,0.3);
  border-radius: 8px;
}

.warning-item {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
}

.warning-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.warning-ok {
  background: #00ff88;
  box-shadow: 0 0 10px #00ff88;
}

.warning-alarm {
  background: #ff4444;
  box-shadow: 0 0 10px #ff4444;
}

.warning-label {
  font-size: 13px;
  color: rgba(255,255,255,0.7);
}

.warning-status {
  font-size: 13px;
  color: #00ff88;
  font-weight: 600;
}

.warning-status-alarm {
  color: #ff4444;
}

.ac-temp-data {
  display: flex;
  gap: 14px;
}

.temp-group {
  flex: 1;
}

.temp-group-title {
  font-size: 12px;
  color: rgba(255,255,255,0.6);
  margin-bottom: 8px;
  display: block;
}

.temp-items {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.temp-item {
  padding: 8px 12px;
  background: rgba(0,50,100,0.3);
  border-radius: 6px;
  font-size: 13px;
  color: #fff;
}

/* 中间建筑区域 */
.center-building {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-width: 0;
}

.alert-banner {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 14px 22px;
  background: rgba(255,68,68,0.18);
  border: 1px solid rgba(255,68,68,0.5);
  border-radius: 10px;
  flex-shrink: 0;
}

.alert-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255,68,68,0.3);
  border-radius: 8px;
  flex-shrink: 0;
}

.alert-icon svg {
  width: 24px;
  height: 24px;
}

.alert-text {
  flex: 1;
  font-size: 14px;
  color: #fff;
}

.alert-actions {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-shrink: 0;
}

.alert-time {
  font-size: 13px;
  color: rgba(255,255,255,0.7);
}

.alert-btn {
  font-size: 13px;
  color: #ff4444;
  cursor: pointer;
}

.building-3d-container {
  flex: 1;
  border-radius: 14px;
  overflow: hidden;
  border: 1px solid rgba(0,150,255,0.3);
  min-height: 0;
}

.building-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* 底部区域 */
.bottom-section {
  display: flex;
  gap: 20px;
  padding: 16px 0 0;
  height: 190px;
  position: relative;
  z-index: 1;
  flex-shrink: 0;
  padding-bottom: 80px;
}

.bottom-panel {
  background: rgba(0,25,50,0.92);
  border: 1px solid rgba(0,150,255,0.3);
  border-radius: 12px;
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.llm-panel {
  width: 360px;
  flex-shrink: 0;
}

.agent-panel {
  flex: 1;
  max-width: 520px;
}

.recommend-panel {
  width: 400px;
  flex-shrink: 0;
}

.panel-title-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  font-size: 14px;
  font-weight: 600;
  color: #00d4ff;
}

.more-btn {
  font-size: 12px;
  color: rgba(255,255,255,0.6);
  font-weight: normal;
}

/* LLM智能助手 */
.llm-content {
  display: flex;
  gap: 20px;
  flex: 1;
}

.search-box {
  display: flex;
  align-items: center;
  background: rgba(0,50,100,0.3);
  border-radius: 6px;
  padding: 6px 10px;
  width: 160px;
}

.search-box input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: #fff;
  font-size: 13px;
  min-width: 0;
}

.send-btn {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0,150,255,0.3);
  border-radius: 4px;
  margin-left: 8px;
  cursor: pointer;
}

.send-btn svg {
  width: 16px;
  height: 16px;
  color: #00d4ff;
}

.llm-functions {
  display: flex;
  flex-direction: column;
  gap: 10px;
  border-right: 1px solid rgba(0,150,255,0.2);
  padding-right: 20px;
}

.function-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.function-icon {
  width: 24px;
  height: 24px;
  background: rgba(0,150,255,0.3);
  border-radius: 6px;
}

.function-label {
  font-size: 13px;
  color: #fff;
}

.llm-analysis {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 8px;
}

.analysis-text {
  font-size: 13px;
  color: rgba(255,255,255,0.8);
}

.analysis-alert {
  font-size: 14px;
  font-weight: 600;
}

.analysis-btn {
  margin-left: 12px;
  padding: 4px 12px;
  background: rgba(0,150,255,0.3);
  border-radius: 4px;
  color: #00d4ff;
  font-size: 12px;
}

/* AI-Agent协同中心 */
.agent-content {
  flex: 1;
  display: flex;
  align-items: center;
}

.agent-cards {
  display: flex;
  gap: 12px;
  width: 100%;
}

.agent-card {
  flex: 1;
  padding: 12px 14px;
  background: rgba(0,50,100,0.3);
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.agent-status {
  font-size: 11px;
  padding: 4px 10px;
  border-radius: 12px;
  align-self: flex-start;
  font-weight: 600;
}

.status-running {
  background: rgba(0,255,136,0.2);
  color: #00ff88;
}

.status-processing {
  background: rgba(255,170,0,0.2);
  color: #ffaa00;
}

.agent-name {
  font-size: 13px;
  color: #fff;
  font-weight: 500;
}

.agent-progress {
  display: flex;
  align-items: center;
  gap: 10px;
}

.progress-bar {
  flex: 1;
  height: 6px;
  background: rgba(0,50,100,0.5);
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #00d4ff 0%, #0096ff 100%);
  border-radius: 3px;
}

.progress-value {
  font-size: 13px;
  color: #00d4ff;
  font-weight: 600;
  min-width: 36px;
}

/* AI智能推荐 */
.recommend-content {
  display: flex;
  gap: 20px;
  height: 100%;
}

.circle-section {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 140px;
  flex-shrink: 0;
}

.circle-chart {
  position: relative;
  width: 130px;
  height: 130px;
}

.circle-chart svg {
  width: 100%;
  height: 100%;
}

.circle-inner {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.circle-value {
  font-size: 28px;
  font-weight: 700;
  color: #00d4ff;
}

.circle-label {
  font-size: 13px;
  color: rgba(255,255,255,0.8);
  margin-top: 4px;
}

.list-section {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.recommend-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
}

.recommend-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  background: rgba(0,50,100,0.3);
  border-radius: 8px;
}

.item-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}

.item-text {
  font-size: 13px;
  color: #fff;
  flex: 1;
}

.item-range {
  font-size: 12px;
  color: rgba(255,255,255,0.6);
}

.item-percent {
  font-size: 14px;
  font-weight: 600;
  min-width: 40px;
  text-align: right;
}

/* 底部导航栏 */
.bottom-nav {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(180deg, rgba(0,20,45,0.95) 0%, rgba(0,25,55,0.98) 100%);
  border-top: 2px solid rgba(0,150,255,0.4);
  padding: 12px 0;
  z-index: 30;
}

.nav-tabs {
  display: flex;
  justify-content: center;
  gap: 8px;
}

.nav-tab {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 10px 22px;
  border-radius: 10px;
  color: rgba(255,255,255,0.7);
  cursor: pointer;
  transition: all 0.3s;
}

.nav-tab:hover {
  color: #00d4ff;
  background: rgba(0,150,255,0.1);
}

.nav-tab.active {
  background: linear-gradient(180deg, rgba(0,150,255,0.25) 0%, rgba(0,100,200,0.15) 100%);
  color: #00d4ff;
  border-top: 2px solid #00d4ff;
  box-shadow: 0 0 20px rgba(0,150,255,0.3);
}

.nav-tab svg {
  width: 24px;
  height: 24px;
}

.nav-tab span {
  font-size: 12px;
  font-weight: 500;
}

/* 占位页面 */
.placeholder-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #fff;
}

.placeholder-page h2 {
  font-size: 28px;
  margin-bottom: 16px;
  color: #00d4ff;
}

.placeholder-page p {
  font-size: 16px;
  color: rgba(255,255,255,0.6);
}

/* 智能能耗页面 */
.energy-page {
  display: flex;
  flex-direction: column;
  padding: 16px 24px 0;
  height: 100%;
}

.energy-content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.energy-top-cards {
  display: flex;
  justify-content: center;
  gap: 16px;
  padding: 0 0 16px;
  flex-shrink: 0;
}

.energy-card {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 20px;
  background: rgba(0,30,60,0.9);
  border: 1px solid rgba(0,150,255,0.35);
  border-radius: 10px;
  min-width: 180px;
}

.energy-card .card-icon {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  flex-shrink: 0;
}

.energy-card .card-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.energy-card .card-title {
  font-size: 13px;
  color: rgba(255,255,255,0.7);
  font-weight: 500;
}

.energy-card .card-value {
  font-size: 18px;
  font-weight: 700;
  color: #fff;
}

.energy-card .card-trend {
  font-size: 12px;
}

.energy-card .card-trend.trend-down {
  color: #00ff88;
}

.energy-card .card-trend.trend-up {
  color: #ff4444;
}

.energy-main {
  display: flex;
  gap: 20px;
  flex: 1;
  min-height: 0;
}

.energy-left, .energy-right {
  width: 24%;
  display: flex;
  flex-direction: column;
  gap: 16px;
  flex-shrink: 0;
  min-width: 0;
}

.energy-center {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.energy-panel {
  background: rgba(0,25,50,0.92);
  border: 1px solid rgba(0,150,255,0.3);
  border-radius: 12px;
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.energy-panel .panel-body {
  flex: 1;
  padding: 12px 16px;
  overflow: hidden;
}

.energy-stat-body {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
}

.energy-big-stat {
  display: flex;
  align-items: center;
  gap: 16px;
}

.stat-icon {
  font-size: 48px;
}

.stat-main {
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.stat-value {
  font-size: 42px;
  font-weight: 700;
  color: #00d4ff;
}

.stat-unit {
  font-size: 20px;
  color: rgba(255,255,255,0.8);
}

.stat-compare {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
}

.compare-label {
  color: rgba(255,255,255,0.7);
}

.compare-value {
  font-weight: 600;
}

.compare-value.down {
  color: #00ff88;
}

.compare-value.up {
  color: #ff4444;
}

.stat-status {
  display: flex;
  align-items: center;
  gap: 8px;
}

.status-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #00ff88;
  box-shadow: 0 0 10px rgba(0,255,136,0.6);
}

.status-text {
  font-size: 15px;
  color: #00ff88;
  font-weight: 600;
}

.ranking-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.ranking-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.rank-num {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0,212,255,0.2);
  border: 1px solid rgba(0,212,255,0.4);
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  color: #00d4ff;
  flex-shrink: 0;
}

.rank-name {
  font-size: 14px;
  color: #fff;
  width: 80px;
  flex-shrink: 0;
}

.rank-bar {
  flex: 1;
  height: 20px;
  background: rgba(0,50,100,0.4);
  border-radius: 10px;
  overflow: hidden;
  min-width: 0;
}

.rank-fill {
  height: 100%;
  background: linear-gradient(90deg, #00d4ff 0%, #0096ff 100%);
  border-radius: 10px;
  transition: width 0.5s ease;
}

.rank-value {
  font-size: 14px;
  color: #00d4ff;
  font-weight: 600;
  width: 70px;
  text-align: right;
  flex-shrink: 0;
}

.center-header {
  justify-content: center;
}

.building-wrapper {
  flex: 1;
  position: relative;
  overflow: hidden;
  border-radius: 12px;
  border: 1px solid rgba(0,150,255,0.3);
  background: rgba(0,20,40,0.6);
}

.building-wrapper .building-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.8;
}

.energy-markers {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.marker {
  position: absolute;
  pointer-events: auto;
}

.marker .marker-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 8px 14px;
  background: rgba(0,60,120,0.9);
  border: 1px solid rgba(0,212,255,0.5);
  border-radius: 8px;
  box-shadow: 0 0 15px rgba(0,212,255,0.3);
}

.marker .marker-label {
  font-size: 13px;
  color: #00d4ff;
  font-weight: 600;
}

.marker .marker-value {
  font-size: 15px;
  color: #fff;
  font-weight: 700;
}

.marker-1 { top: 20%; left: 15%; }
.marker-2 { top: 35%; right: 20%; }
.marker-3 { bottom: 30%; left: 10%; }
.marker-4 { bottom: 15%; right: 15%; }

.energy-chart {
  width: 100%;
  height: 100%;
  min-height: 180px;
}
</style>