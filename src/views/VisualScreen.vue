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

      <!-- 智慧环境页面 -->
      <div v-if="activeNav === 'environment'" class="page-content environment-page">
        <div class="page-bg"></div>
        <div class="environment-content">
          <!-- 顶部环境指标卡片 -->
          <div class="env-top-metrics">
            <div class="metric-card card-blue">
              <div class="card-icon" style="background: rgba(0,212,255,0.2);">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color:#00d4ff;">
                  <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"/>
                </svg>
              </div>
              <div class="card-content">
                <span class="card-title">平均温度</span>
                <span class="card-value">24.8°C</span>
              </div>
            </div>
            <div class="metric-card card-green">
              <div class="card-icon" style="background: rgba(0,255,136,0.2);">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color:#00ff88;">
                  <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
                </svg>
              </div>
              <div class="card-content">
                <span class="card-title">平均湿度</span>
                <span class="card-value">52%</span>
              </div>
            </div>
            <div class="metric-card card-purple">
              <div class="card-icon" style="background: rgba(170,68,255,0.2);">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color:#aa44ff;">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="16"/>
                  <line x1="8" y1="12" x2="16" y2="12"/>
                </svg>
              </div>
              <div class="card-content">
                <span class="card-title">CO₂浓度</span>
                <span class="card-value">430 ppm</span>
              </div>
            </div>
            <div class="metric-card card-cyan">
              <div class="card-icon" style="background: rgba(0,255,255,0.2);">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color:#00ffff;">
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
                </svg>
              </div>
              <div class="card-content">
                <span class="card-title">PM2.5</span>
                <span class="card-value">18 μg/m³</span>
              </div>
            </div>
            <div class="metric-card card-blue2">
              <div class="card-icon" style="background: rgba(0,150,255,0.2);">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color:#0096ff;">
                  <path d="M12 1l9 4v14l-9 4-9-4V5l9-4z"/>
                  <circle cx="12" cy="13" r="3"/>
                </svg>
              </div>
              <div class="card-content">
                <span class="card-title">噪声</span>
                <span class="card-value">42 dB</span>
              </div>
            </div>
            <div class="metric-card card-blue3">
              <div class="card-icon" style="background: rgba(80,160,255,0.2);">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color:#50a0ff;">
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                  <line x1="8" y1="21" x2="16" y2="21"/>
                  <line x1="12" y1="17" x2="12" y2="21"/>
                </svg>
              </div>
              <div class="card-content">
                <span class="card-title">在线设备</span>
                <span class="card-value">60 台</span>
              </div>
            </div>
          </div>

          <!-- 主体三栏布局 -->
          <div class="environment-main">
            <!-- 左侧区域 -->
            <div class="env-left">
              <!-- 设备统计 -->
              <div class="env-panel">
                <div class="panel-header">
                  <span class="panel-title">设备统计</span>
                </div>
                <div class="panel-body env-device-stat-body">
                  <div ref="deviceRingChart" class="env-ring-chart"></div>
                  <div class="device-legend">
                    <div class="legend-item">
                      <span class="legend-dot" style="background:#00ff88;"></span>
                      <span class="legend-label">在线设备</span>
                      <span class="legend-num">60</span>
                    </div>
                    <div class="legend-item">
                      <span class="legend-dot" style="background:#ffaa00;"></span>
                      <span class="legend-label">离线设备</span>
                      <span class="legend-num">0</span>
                    </div>
                    <div class="legend-item">
                      <span class="legend-dot" style="background:#ff4444;"></span>
                      <span class="legend-label">故障设备</span>
                      <span class="legend-num">0</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 设备状态统计 -->
              <div class="env-panel env-status-panel">
                <div class="panel-header">
                  <span class="panel-title">设备状态统计</span>
                </div>
                <div class="panel-body env-status-body">
                  <div class="device-group" v-for="group in deviceGroups" :key="group.name">
                    <div class="group-header">
                      <span class="group-name">{{ group.name }}</span>
                    </div>
                    <div class="group-stats">
                      <span class="stat-badge online">在线 {{ group.online }}</span>
                      <span class="stat-badge offline">离线 {{ group.offline }}</span>
                      <span class="stat-badge fault">故障 {{ group.fault }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 中间区域 -->
            <div class="env-center">
              <div class="panel-header center-header">
                <span class="panel-title">楼宇环境总览</span>
              </div>
              <div class="building-wrapper">
                <img src="/building-bg.jpg" alt="智慧建筑" class="building-image" />
                <div class="env-markers">
                  <div class="env-marker env-marker-1">
                    <div class="env-marker-dot"></div>
                    <div class="env-marker-tag">
                      <span class="env-marker-label">1F 温度</span>
                      <span class="env-marker-value">24.8°C</span>
                    </div>
                  </div>
                  <div class="env-marker env-marker-2">
                    <div class="env-marker-dot"></div>
                    <div class="env-marker-tag">
                      <span class="env-marker-label">2F 湿度</span>
                      <span class="env-marker-value">52%</span>
                    </div>
                  </div>
                  <div class="env-marker env-marker-3">
                    <div class="env-marker-dot"></div>
                    <div class="env-marker-tag">
                      <span class="env-marker-label">3F CO₂</span>
                      <span class="env-marker-value">430 ppm</span>
                    </div>
                  </div>
                  <div class="env-marker env-marker-4">
                    <div class="env-marker-dot"></div>
                    <div class="env-marker-tag">
                      <span class="env-marker-label">4F PM2.5</span>
                      <span class="env-marker-value">18 μg/m³</span>
                    </div>
                  </div>
                  <div class="env-marker env-marker-5">
                    <div class="env-marker-dot"></div>
                    <div class="env-marker-tag">
                      <span class="env-marker-label">5F 噪声</span>
                      <span class="env-marker-value">42 dB</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 右侧区域 -->
            <div class="env-right">
              <!-- 空调系统检测 -->
              <div class="env-panel">
                <div class="panel-header">
                  <span class="panel-title">空调系统检测</span>
                </div>
                <div class="panel-body">
                  <div ref="acCheckChart" class="env-chart"></div>
                </div>
              </div>

              <!-- 季节统计 -->
              <div class="env-panel">
                <div class="panel-header">
                  <span class="panel-title">季节统计</span>
                </div>
                <div class="panel-body">
                  <div ref="seasonChart" class="env-chart"></div>
                </div>
              </div>

              <!-- 设备运行统计 -->
              <div class="env-panel env-run-panel">
                <div class="panel-header">
                  <span class="panel-title">设备运行统计</span>
                </div>
                <div class="panel-body env-run-body">
                  <div class="run-card-grid">
                    <div class="run-card">
                      <span class="run-card-value">1</span>
                      <span class="run-card-unit">台</span>
                      <span class="run-card-label">一次泵</span>
                    </div>
                    <div class="run-card">
                      <span class="run-card-value">1</span>
                      <span class="run-card-unit">台</span>
                      <span class="run-card-label">二次泵</span>
                    </div>
                    <div class="run-card">
                      <span class="run-card-value">1</span>
                      <span class="run-card-unit">台</span>
                      <span class="run-card-label">冷却塔</span>
                    </div>
                    <div class="run-card">
                      <span class="run-card-value">1</span>
                      <span class="run-card-unit">台</span>
                      <span class="run-card-label">风机盘管</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 智能安防页面 -->
      <div v-if="activeNav === 'security'" class="page-content security-page">
        <div class="page-bg"></div>
        <div class="security-content">
          <!-- 顶部安防指标卡片 -->
          <div class="security-top-metrics">
            <div class="metric-card card-red">
              <div class="card-icon" style="background: rgba(255,68,68,0.2);">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color:#ff4444;">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                  <line x1="12" y1="9" x2="12" y2="13"/>
                  <line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
              </div>
              <div class="card-content">
                <span class="card-title">今日告警</span>
                <span class="card-value" style="color:#ff4444;">12 次</span>
              </div>
            </div>
            <div class="metric-card card-orange">
              <div class="card-icon" style="background: rgba(255,170,0,0.2);">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color:#ffaa00;">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
              </div>
              <div class="card-content">
                <span class="card-title">待处理事件</span>
                <span class="card-value" style="color:#ffaa00;">3 条</span>
              </div>
            </div>
            <div class="metric-card card-blue">
              <div class="card-icon" style="background: rgba(0,212,255,0.2);">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color:#00d4ff;">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
              </div>
              <div class="card-content">
                <span class="card-title">摄像头在线</span>
                <span class="card-value">156 路</span>
              </div>
            </div>
            <div class="metric-card card-green">
              <div class="card-icon" style="background: rgba(0,255,136,0.2);">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color:#00ff88;">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              </div>
              <div class="card-content">
                <span class="card-title">门禁设备</span>
                <span class="card-value">42 个</span>
              </div>
            </div>
            <div class="metric-card card-purple">
              <div class="card-icon" style="background: rgba(170,68,255,0.2);">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color:#aa44ff;">
                  <rect x="2" y="2" width="20" height="20" rx="2"/>
                  <line x1="8" y1="2" x2="8" y2="22"/>
                  <line x1="16" y1="2" x2="16" y2="22"/>
                  <line x1="2" y1="8" x2="22" y2="8"/>
                </svg>
              </div>
              <div class="card-content">
                <span class="card-title">电梯运行</span>
                <span class="card-value">18 台</span>
              </div>
            </div>
            <div class="metric-card card-cyan">
              <div class="card-icon" style="background: rgba(0,255,255,0.2);">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color:#00ffff;">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
              </div>
              <div class="card-content">
                <span class="card-title">巡检完成率</span>
                <span class="card-value">96%</span>
              </div>
            </div>
          </div>

          <!-- 主体三栏布局 -->
          <div class="security-main">
            <!-- 左侧区域 -->
            <div class="security-left">
              <!-- 电梯故障趋势 -->
              <div class="security-panel">
                <div class="panel-header">
                  <span class="panel-title">电梯故障趋势</span>
                </div>
                <div class="panel-body">
                  <div ref="elevatorFaultTrend" class="security-chart"></div>
                </div>
              </div>

              <!-- 电梯故障排行 TOP5 -->
              <div class="security-panel security-fault-rank-panel">
                <div class="panel-header">
                  <span class="panel-title">电梯故障排行TOP5</span>
                </div>
                <div class="panel-body security-rank-body">
                  <div class="rank-item" v-for="(item, index) in elevatorFaultRank" :key="item.name">
                    <span class="rank-index" :class="'rank-' + (index + 1)">{{ index + 1 }}</span>
                    <span class="rank-name">{{ item.name }}</span>
                    <div class="rank-bar-wrap">
                      <div class="rank-bar" :style="{ width: (item.count / 8 * 100) + '%' }"></div>
                    </div>
                    <span class="rank-value">{{ item.count }}次</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- 中间区域 -->
            <div class="security-center">
              <div class="security-center-top">
                <div class="panel-header center-header">
                  <span class="panel-title">故障类型分布</span>
                </div>
                <div class="fault-type-content">
                  <div ref="faultTypePie" class="fault-type-pie"></div>
                  <div class="fault-type-legend">
                    <div class="fault-legend-item" v-for="item in faultTypeData" :key="item.name">
                      <span class="fault-legend-dot" :style="{ background: item.color }"></span>
                      <span class="fault-legend-label">{{ item.name }}</span>
                      <span class="fault-legend-value">{{ item.value }}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="security-center-bottom">
                <div class="panel-header center-header">
                  <span class="panel-title">安防总览</span>
                </div>
                <div class="building-wrapper">
                  <img src="/building-bg.jpg" alt="智慧建筑" class="building-image" />
                  <div class="security-markers">
                    <div class="security-marker security-marker-1">
                      <div class="security-marker-dot danger"></div>
                      <div class="security-marker-tag">
                        <span class="security-marker-label">1F 门禁异常</span>
                      </div>
                    </div>
                    <div class="security-marker security-marker-2">
                      <div class="security-marker-dot warning"></div>
                      <div class="security-marker-tag">
                        <span class="security-marker-label">2F 摄像头离线</span>
                      </div>
                    </div>
                    <div class="security-marker security-marker-3">
                      <div class="security-marker-dot danger"></div>
                      <div class="security-marker-tag">
                        <span class="security-marker-label">3F 电梯告警</span>
                      </div>
                    </div>
                    <div class="security-marker security-marker-4">
                      <div class="security-marker-dot normal"></div>
                      <div class="security-marker-tag">
                        <span class="security-marker-label">5F 消防巡检</span>
                      </div>
                    </div>
                    <div class="security-marker security-marker-5">
                      <div class="security-marker-dot warning"></div>
                      <div class="security-marker-tag">
                        <span class="security-marker-label">B1 周界告警</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 右侧区域 -->
            <div class="security-right">
              <!-- 电梯利用率排行 TOP5 -->
              <div class="security-panel security-util-rank-panel">
                <div class="panel-header">
                  <span class="panel-title">电梯利用率排行TOP5</span>
                </div>
                <div class="panel-body security-rank-body">
                  <div class="rank-item" v-for="(item, index) in elevatorUtilRank" :key="item.name">
                    <span class="rank-index" :class="'rank-' + (index + 1)">{{ index + 1 }}</span>
                    <span class="rank-name">{{ item.name }}</span>
                    <div class="rank-bar-wrap">
                      <div class="rank-bar util" :style="{ width: (item.count / 30 * 100) + '%' }"></div>
                    </div>
                    <span class="rank-value">{{ item.count }}次</span>
                  </div>
                </div>
              </div>

              <!-- 安防事件统计 -->
              <div class="security-panel security-event-panel">
                <div class="panel-header">
                  <span class="panel-title">安防事件统计</span>
                </div>
                <div class="panel-body security-event-body">
                  <div class="event-card-grid">
                    <div class="event-card">
                      <span class="event-card-value" style="color:#ff4444;">12</span>
                      <span class="event-card-unit">次</span>
                      <span class="event-card-label">今日告警</span>
                    </div>
                    <div class="event-card">
                      <span class="event-card-value" style="color:#00ff88;">9</span>
                      <span class="event-card-unit">次</span>
                      <span class="event-card-label">已处理</span>
                    </div>
                    <div class="event-card">
                      <span class="event-card-value" style="color:#ffaa00;">3</span>
                      <span class="event-card-unit">次</span>
                      <span class="event-card-label">待处理</span>
                    </div>
                    <div class="event-card">
                      <span class="event-card-value" style="color:#00ff88;">98%</span>
                      <span class="event-card-unit"></span>
                      <span class="event-card-label">设备在线率</span>
                    </div>
                    <div class="event-card">
                      <span class="event-card-value" style="color:#00d4ff;">156</span>
                      <span class="event-card-unit">路</span>
                      <span class="event-card-label">摄像头在线</span>
                    </div>
                    <div class="event-card">
                      <span class="event-card-value" style="color:#00ff88;">42</span>
                      <span class="event-card-unit">个</span>
                      <span class="event-card-label">门禁正常</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 智能消防页面 -->
      <div v-if="activeNav === 'quality'" class="page-content fire-page">
        <div class="page-bg"></div>
        <div class="fire-content">
          <!-- 顶部消防指标卡片 -->
          <div class="fire-top-metrics">
            <div class="metric-card card-red">
              <div class="card-icon" style="background: rgba(255,68,68,0.2);">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color:#ff4444;">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                  <line x1="12" y1="9" x2="12" y2="13"/>
                  <line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
              </div>
              <div class="card-content">
                <span class="card-title">今日报警</span>
                <span class="card-value" style="color:#ff4444;">74 次</span>
              </div>
            </div>
            <div class="metric-card card-orange">
              <div class="card-icon" style="background: rgba(255,170,0,0.2);">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color:#ffaa00;">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
              </div>
              <div class="card-content">
                <span class="card-title">未处理报警</span>
                <span class="card-value" style="color:#ffaa00;">74 条</span>
              </div>
            </div>
            <div class="metric-card card-green">
              <div class="card-icon" style="background: rgba(0,255,136,0.2);">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color:#00ff88;">
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                  <line x1="8" y1="21" x2="16" y2="21"/>
                  <line x1="12" y1="17" x2="12" y2="21"/>
                </svg>
              </div>
              <div class="card-content">
                <span class="card-title">在线设备</span>
                <span class="card-value">486 台</span>
              </div>
            </div>
            <div class="metric-card card-red2">
              <div class="card-icon" style="background: rgba(255,80,80,0.2);">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color:#ff5050;">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 8v4M12 16h.01"/>
                </svg>
              </div>
              <div class="card-content">
                <span class="card-title">故障设备</span>
                <span class="card-value" style="color:#ff5050;">10 台</span>
              </div>
            </div>
            <div class="metric-card card-blue">
              <div class="card-icon" style="background: rgba(0,212,255,0.2);">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color:#00d4ff;">
                  <path d="M17.5 19H9a7 7 0 0 1-6.23-3.5M14.5 5a7 7 0 0 1 5.73 3.5"/>
                  <path d="M8 19c0-3.5 2.5-7 4-7s4 3.5 4 7"/>
                </svg>
              </div>
              <div class="card-content">
                <span class="card-title">联动次数</span>
                <span class="card-value">28 次</span>
              </div>
            </div>
            <div class="metric-card card-cyan">
              <div class="card-icon" style="background: rgba(0,255,255,0.2);">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color:#00ffff;">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
              </div>
              <div class="card-content">
                <span class="card-title">巡检完成率</span>
                <span class="card-value">96%</span>
              </div>
            </div>
          </div>

          <!-- 主体三栏布局 -->
          <div class="fire-main">
            <!-- 左侧区域 -->
            <div class="fire-left">
              <!-- 设备统计 -->
              <div class="fire-panel">
                <div class="panel-header">
                  <span class="panel-title">设备统计</span>
                </div>
                <div class="panel-body fire-device-stat-body">
                  <div ref="fireDeviceRingChart" class="fire-ring-chart"></div>
                  <div class="device-legend">
                    <div class="legend-item">
                      <span class="legend-dot" style="background:#00ff88;"></span>
                      <span class="legend-label">在线设备</span>
                      <span class="legend-num">80</span>
                    </div>
                    <div class="legend-item">
                      <span class="legend-dot" style="background:#ffaa00;"></span>
                      <span class="legend-label">离线设备</span>
                      <span class="legend-num">10</span>
                    </div>
                    <div class="legend-item">
                      <span class="legend-dot" style="background:#ff4444;"></span>
                      <span class="legend-label">故障设备</span>
                      <span class="legend-num">10</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 消防设备统计 -->
              <div class="fire-panel">
                <div class="panel-header">
                  <span class="panel-title">消防设备统计</span>
                </div>
                <div class="panel-body fire-device-grid-body">
                  <div class="fire-device-grid">
                    <div class="fire-device-card">
                      <span class="fire-device-num">96</span>
                      <span class="fire-device-total">/ 100</span>
                      <span class="fire-device-label">消防水泵</span>
                    </div>
                    <div class="fire-device-card">
                      <span class="fire-device-num">75</span>
                      <span class="fire-device-total">/ 82</span>
                      <span class="fire-device-label">排烟风机</span>
                    </div>
                    <div class="fire-device-card">
                      <span class="fire-device-num">215</span>
                      <span class="fire-device-total">/ 216</span>
                      <span class="fire-device-label">喷淋末端</span>
                    </div>
                    <div class="fire-device-card">
                      <span class="fire-device-num">105</span>
                      <span class="fire-device-total">/ 115</span>
                      <span class="fire-device-label">消防电源</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 报警统计 -->
              <div class="fire-panel fire-alarm-panel">
                <div class="panel-header">
                  <span class="panel-title">报警统计</span>
                </div>
                <div class="panel-body fire-alarm-body">
                  <div class="fire-alarm-summary">
                    <div class="fire-alarm-total">
                      <span class="fire-alarm-total-label">今日报警总数</span>
                      <span class="fire-alarm-total-value" style="color:#ff4444;">74</span>
                    </div>
                    <div class="fire-alarm-total">
                      <span class="fire-alarm-total-label">未处理</span>
                      <span class="fire-alarm-total-value" style="color:#ff4444;">74</span>
                    </div>
                  </div>
                  <div class="fire-alarm-list">
                    <div class="fire-alarm-item" v-for="(alarm, idx) in fireAlarmList" :key="idx">
                      <span class="fire-alarm-idx">{{ idx + 1 }}</span>
                      <span class="fire-alarm-name">{{ alarm.name }}</span>
                      <span class="fire-alarm-time">{{ alarm.time }}</span>
                      <span class="fire-alarm-status" :class="alarm.status === '未处理' ? 'unhandled' : 'handled'">{{ alarm.status }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 中间区域 -->
            <div class="fire-center">
              <div class="panel-header center-header">
                <span class="panel-title">建筑消防总览</span>
              </div>
              <div class="building-wrapper">
                <img src="/building-bg.jpg" alt="智慧建筑" class="building-image" />
                <div class="fire-markers">
                  <div class="fire-marker fire-marker-1">
                    <div class="fire-marker-dot normal"></div>
                    <div class="fire-marker-tag">
                      <span class="fire-marker-label">1F 烟感正常</span>
                    </div>
                  </div>
                  <div class="fire-marker fire-marker-2">
                    <div class="fire-marker-dot normal"></div>
                    <div class="fire-marker-tag">
                      <span class="fire-marker-label">2F 喷淋正常</span>
                    </div>
                  </div>
                  <div class="fire-marker fire-marker-3">
                    <div class="fire-marker-dot warning"></div>
                    <div class="fire-marker-tag warn">
                      <span class="fire-marker-label">3F 排烟风机</span>
                    </div>
                  </div>
                  <div class="fire-marker fire-marker-4">
                    <div class="fire-marker-dot normal"></div>
                    <div class="fire-marker-tag">
                      <span class="fire-marker-label">4F 消防水泵</span>
                    </div>
                  </div>
                  <div class="fire-marker fire-marker-5">
                    <div class="fire-marker-dot normal"></div>
                    <div class="fire-marker-tag">
                      <span class="fire-marker-label">B1 消防电源</span>
                    </div>
                  </div>
                  <div class="fire-marker fire-marker-6">
                    <div class="fire-marker-dot danger"></div>
                    <div class="fire-marker-tag danger">
                      <span class="fire-marker-label">5F 水压异常</span>
                    </div>
                  </div>
                  <div class="fire-marker fire-marker-7">
                    <div class="fire-marker-dot danger"></div>
                    <div class="fire-marker-tag danger">
                      <span class="fire-marker-label">B2 风机离线</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 右侧区域 -->
            <div class="fire-right">
              <!-- 消防联动趋势 -->
              <div class="fire-panel">
                <div class="panel-header">
                  <span class="panel-title">消防联动趋势</span>
                </div>
                <div class="panel-body">
                  <div ref="fireLinkageTrend" class="fire-chart"></div>
                </div>
              </div>

              <!-- 消防设备排行 -->
              <div class="fire-panel">
                <div class="panel-header">
                  <span class="panel-title">消防设备排行</span>
                </div>
                <div class="panel-body">
                  <div ref="fireDeviceRank" class="fire-chart"></div>
                </div>
              </div>

              <!-- 消防设备运行排行 -->
              <div class="fire-panel fire-run-rank-panel">
                <div class="panel-header">
                  <span class="panel-title">消防设备运行排行</span>
                </div>
                <div class="panel-body fire-rank-body">
                  <div class="rank-item" v-for="(item, index) in fireDeviceRunRank" :key="item.name">
                    <span class="rank-index" :class="'rank-' + (index + 1)">{{ index + 1 }}</span>
                    <span class="rank-name">{{ item.name }}</span>
                    <div class="rank-bar-wrap">
                      <div class="rank-bar fire-rank" :style="{ width: (item.count / 40 * 100) + '%' }"></div>
                    </div>
                    <span class="rank-value">{{ item.count }}次</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 智慧电力页面 -->
      <div v-if="activeNav === 'power'" class="page-content power-page">
        <div class="page-bg"></div>
        <div class="power-content">
          <!-- 顶部电力指标卡片 -->
          <div class="power-top-metrics">
            <div class="power-metric-card">
              <div class="power-metric-icon" style="background:rgba(0,212,255,0.15);">
                <svg viewBox="0 0 24 24" fill="none" stroke="#00d4ff" stroke-width="2" width="20" height="20"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
              </div>
              <div class="power-metric-info">
                <span class="power-metric-label">今日用电</span>
                <span class="power-metric-value">8,426 <small>kWh</small></span>
                <span class="power-metric-trend up">+3.2%</span>
              </div>
            </div>
            <div class="power-metric-card">
              <div class="power-metric-icon" style="background:rgba(0,245,160,0.15);">
                <svg viewBox="0 0 24 24" fill="none" stroke="#00f5a0" stroke-width="2" width="20" height="20"><path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83"/></svg>
              </div>
              <div class="power-metric-info">
                <span class="power-metric-label">当前负荷</span>
                <span class="power-metric-value">1,286 <small>kW</small></span>
                <span class="power-metric-trend up">+5.8%</span>
              </div>
            </div>
            <div class="power-metric-card">
              <div class="power-metric-icon" style="background:rgba(255,204,51,0.15);">
                <svg viewBox="0 0 24 24" fill="none" stroke="#ffcc33" stroke-width="2" width="20" height="20"><path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83"/></svg>
              </div>
              <div class="power-metric-info">
                <span class="power-metric-label">峰值负荷</span>
                <span class="power-metric-value">1,580 <small>kW</small></span>
                <span class="power-metric-trend">12:00</span>
              </div>
            </div>
            <div class="power-metric-card">
              <div class="power-metric-icon" style="background:rgba(0,245,160,0.15);">
                <svg viewBox="0 0 24 24" fill="none" stroke="#00f5a0" stroke-width="2" width="20" height="20"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
              </div>
              <div class="power-metric-info">
                <span class="power-metric-label">功率因数</span>
                <span class="power-metric-value">0.96</span>
                <span class="power-metric-trend normal">正常</span>
              </div>
            </div>
            <div class="power-metric-card">
              <div class="power-metric-icon" style="background:rgba(0,212,255,0.15);">
                <svg viewBox="0 0 24 24" fill="none" stroke="#00d4ff" stroke-width="2" width="20" height="20"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>
              </div>
              <div class="power-metric-info">
                <span class="power-metric-label">在线回路</span>
                <span class="power-metric-value">86 / 90</span>
                <span class="power-metric-trend normal">正常</span>
              </div>
            </div>
            <div class="power-metric-card">
              <div class="power-metric-icon" style="background:rgba(255,77,90,0.15);">
                <svg viewBox="0 0 24 24" fill="none" stroke="#ff4d5a" stroke-width="2" width="20" height="20"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
              </div>
              <div class="power-metric-info">
                <span class="power-metric-label">电力告警</span>
                <span class="power-metric-value danger">5 <small>条</small></span>
                <span class="power-metric-trend danger">需处理</span>
              </div>
            </div>
          </div>

          <!-- 主体三栏布局 -->
          <div class="power-main">
            <!-- 左侧 -->
            <div class="power-left">
              <!-- 电力总览 -->
              <div class="power-panel">
                <div class="panel-header">
                  <span class="panel-title-bar"></span>
                  <span class="panel-title-text">电力总览</span>
                </div>
                <div class="power-overview-body">
                  <div class="power-overview-grid">
                    <div class="power-ov-card">
                      <span class="power-ov-label">当前负荷</span>
                      <span class="power-ov-value">1,286</span>
                      <span class="power-ov-unit">kW</span>
                    </div>
                    <div class="power-ov-card">
                      <span class="power-ov-label">今日用电</span>
                      <span class="power-ov-value">8,426</span>
                      <span class="power-ov-unit">kWh</span>
                    </div>
                    <div class="power-ov-card">
                      <span class="power-ov-label">本月用电</span>
                      <span class="power-ov-value">186,420</span>
                      <span class="power-ov-unit">kWh</span>
                    </div>
                    <div class="power-ov-card">
                      <span class="power-ov-label">功率因数</span>
                      <span class="power-ov-value">0.96</span>
                      <span class="power-ov-unit">&#8203;</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 配电设备状态 -->
              <div class="power-panel">
                <div class="panel-header">
                  <span class="panel-title-bar"></span>
                  <span class="panel-title-text">配电设备状态</span>
                </div>
                <div class="power-ring-body">
                  <div ref="powerOverviewRing" class="power-ring-chart"></div>
                  <div class="power-ring-legend">
                    <span class="power-legend-item"><i style="background:#00ff88;"></i>正常 82</span>
                    <span class="power-legend-item"><i style="background:#ffaa00;"></i>预警 6</span>
                    <span class="power-legend-item"><i style="background:#ff4444;"></i>故障 2</span>
                  </div>
                </div>
              </div>

              <!-- 电力告警列表 -->
              <div class="power-panel power-alarm-panel">
                <div class="panel-header">
                  <span class="panel-title-bar"></span>
                  <span class="panel-title-text">电力告警</span>
                </div>
                <div class="power-alarm-body">
                  <div v-for="(item, idx) in powerAlarmList" :key="idx" class="power-alarm-item">
                    <span class="power-alarm-idx">{{ idx + 1 }}</span>
                    <span class="power-alarm-name">{{ item.name }}</span>
                    <span class="power-alarm-time">{{ item.time }}</span>
                    <span class="power-alarm-status" :class="item.statusClass">{{ item.status }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- 中间 -->
            <div class="power-center">
              <div class="power-panel power-center-panel">
                <div class="panel-header">
                  <span class="panel-title-bar"></span>
                  <span class="panel-title-text">建筑电力总览</span>
                </div>
                <div class="power-center-body">
                  <img src="/building-bg.jpg" alt="智慧建筑" class="power-building-img" />
                  <!-- 电力监测标签 -->
                  <div class="power-markers">
                    <div class="power-marker power-marker-1">
                      <span class="power-marker-dot normal"></span>
                      <div class="power-marker-tag">
                        <span class="power-marker-label">1F 照明回路 128 kW</span>
                      </div>
                    </div>
                    <div class="power-marker power-marker-2">
                      <span class="power-marker-dot warning"></span>
                      <div class="power-marker-tag warn">
                        <span class="power-marker-label">2F 空调回路 326 kW</span>
                      </div>
                    </div>
                    <div class="power-marker power-marker-3">
                      <span class="power-marker-dot normal"></span>
                      <div class="power-marker-tag">
                        <span class="power-marker-label">3F 动力回路 245 kW</span>
                      </div>
                    </div>
                    <div class="power-marker power-marker-4">
                      <span class="power-marker-dot normal"></span>
                      <div class="power-marker-tag">
                        <span class="power-marker-label">4F 插座回路 86 kW</span>
                      </div>
                    </div>
                    <div class="power-marker power-marker-5">
                      <span class="power-marker-dot warning"></span>
                      <div class="power-marker-tag warn">
                        <span class="power-marker-label">B1 配电室 512 kW</span>
                      </div>
                    </div>
                    <div class="power-marker power-marker-6">
                      <span class="power-marker-dot normal"></span>
                      <div class="power-marker-tag">
                        <span class="power-marker-label">UPS 电源正常</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 右侧 -->
            <div class="power-right">
              <!-- 用电负荷趋势 -->
              <div class="power-panel">
                <div class="panel-header">
                  <span class="panel-title-bar"></span>
                  <span class="panel-title-text">用电负荷趋势</span>
                </div>
                <div ref="powerLoadTrend" class="power-chart power-chart-lg"></div>
              </div>

              <!-- 电力参数监测 -->
              <div class="power-panel">
                <div class="panel-header">
                  <span class="panel-title-bar"></span>
                  <span class="panel-title-text">电力参数监测</span>
                </div>
                <div class="power-params-body">
                  <div class="power-params-grid">
                    <div class="power-param-card">
                      <span class="power-param-label">A相电压</span>
                      <span class="power-param-value">220.6 <small>V</small></span>
                    </div>
                    <div class="power-param-card">
                      <span class="power-param-label">B相电压</span>
                      <span class="power-param-value">221.3 <small>V</small></span>
                    </div>
                    <div class="power-param-card">
                      <span class="power-param-label">C相电压</span>
                      <span class="power-param-value">219.8 <small>V</small></span>
                    </div>
                    <div class="power-param-card">
                      <span class="power-param-label">频率</span>
                      <span class="power-param-value">50.02 <small>Hz</small></span>
                    </div>
                    <div class="power-param-card">
                      <span class="power-param-label">总电流</span>
                      <span class="power-param-value">586 <small>A</small></span>
                    </div>
                    <div class="power-param-card">
                      <span class="power-param-label">功率因数</span>
                      <span class="power-param-value">0.96</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 回路负载排行 -->
              <div class="power-panel power-rank-panel">
                <div class="panel-header">
                  <span class="panel-title-bar"></span>
                  <span class="panel-title-text">回路负载排行</span>
                </div>
                <div class="power-rank-body">
                  <div v-for="(item, idx) in powerLoadRank" :key="idx" class="rank-item">
                    <span class="rank-num" :class="'rank-' + (idx + 1)">{{ idx + 1 }}</span>
                    <span class="rank-name">{{ item.name }}</span>
                    <div class="rank-bar-wrap">
                      <div class="rank-bar power-rank-bar" :style="{ width: (item.value / 520) * 100 + '%' }"></div>
                    </div>
                    <span class="rank-value">{{ item.value }} kW</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 其他页面占位 -->
      <div v-if="activeNav !== 'home' && activeNav !== 'energy' && activeNav !== 'environment' && activeNav !== 'security' && activeNav !== 'quality' && activeNav !== 'power'" class="page-content">
        <div class="placeholder-page">
          <h2>{{ getPageTitle() }}</h2>
          <p>页面开发中……</p>
        </div>
      </div>
    </div>
    
    <!-- 底部导航栏 -->
    <div class="bottom-nav">
      <div class="nav-tabs">
        <div class="nav-tab" :class="{ active: activeNav === 'home' }" @click="activeNav = 'home'">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
          <span>首页</span>
        </div>
        <div class="nav-tab" :class="{ active: activeNav === 'energy' }" @click="activeNav = 'energy'">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
          </svg>
          <span>智能能耗</span>
        </div>
        <div class="nav-tab" :class="{ active: activeNav === 'environment' }" @click="activeNav = 'environment'">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2z"/>
            <path d="M2 12h20"/>
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
          </svg>
          <span>智慧环境</span>
        </div>
        <div class="nav-tab" :class="{ active: activeNav === 'device' }" @click="activeNav = 'device'">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
            <line x1="8" y1="21" x2="16" y2="21"/>
            <line x1="12" y1="17" x2="12" y2="21"/>
          </svg>
          <span>设备管理</span>
        </div>
        <div class="nav-tab" :class="{ active: activeNav === 'power' }" @click="activeNav = 'power'">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
          </svg>
          <span>智能电力</span>
        </div>
        <div class="nav-tab" :class="{ active: activeNav === 'security' }" @click="activeNav = 'security'">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
          <span>智能安防</span>
        </div>
        <div class="nav-tab" :class="{ active: activeNav === 'quality' }" @click="activeNav = 'quality'">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M17.5 19H9a7 7 0 0 1-6.23-3.5M14.5 5a7 7 0 0 1 5.73 3.5"/>
            <path d="M8 19c0-3.5 2.5-7 4-7s4 3.5 4 7"/>
            <path d="M12 12c-1.5 1.5-3 3-3 7"/>
            <path d="M12 12c1.5 1.5 3 3 3 7"/>
          </svg>
          <span>智能消防</span>
        </div>
        <div class="nav-tab" :class="{ active: activeNav === 'asset' }" @click="activeNav = 'asset'">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
            <line x1="3" y1="9" x2="21" y2="9"/>
            <line x1="9" y1="21" x2="9" y2="9"/>
          </svg>
          <span>数据资产</span>
        </div>
        <div class="nav-tab" :class="{ active: activeNav === 'ai' }" @click="activeNav = 'ai'">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <span>AI运营</span>
        </div>
        <div class="nav-tab" :class="{ active: activeNav === 'settings' }" @click="activeNav = 'settings'">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="3"/>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
          </svg>
          <span>系统设置</span>
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
  energyRankingBar: null,
  deviceRingChart: null,
  acCheckChart: null,
  seasonChart: null,
  elevatorFaultTrend: null,
  faultTypePie: null,
  fireDeviceRingChart: null,
  fireLinkageTrend: null,
  fireDeviceRank: null,
  powerOverviewRing: null,
  powerLoadTrend: null
}

const todayEnergyPie = ref(null)
const historyEnergyLine = ref(null)
const energyDistributionPie = ref(null)
const energyRankingBar = ref(null)
const deviceRingChart = ref(null)
const acCheckChart = ref(null)
const seasonChart = ref(null)
const elevatorFaultTrend = ref(null)
const faultTypePie = ref(null)
const fireDeviceRingChart = ref(null)
const fireLinkageTrend = ref(null)
const fireDeviceRank = ref(null)
const powerOverviewRing = ref(null)
const powerLoadTrend = ref(null)

// 智慧环境 - 设备分组 mock 数据
const deviceGroups = ref([
  { name: '排烟阀 / 排烟防火阀', online: 1, offline: 0, fault: 0 },
  { name: '防火阀', online: 0, offline: 0, fault: 0 },
  { name: '加压机房', online: 0, offline: 0, fault: 0 },
  { name: '送补风机房', online: 0, offline: 0, fault: 0 },
  { name: '排风机房', online: 0, offline: 0, fault: 0 }
])

// 智能安防 - 电梯故障排行 mock 数据
const elevatorFaultRank = ref([
  { name: 'A3楼电梯05', count: 6 },
  { name: 'A3楼电梯04', count: 5 },
  { name: 'A3楼电梯03', count: 4 },
  { name: 'A3楼电梯02', count: 3 },
  { name: 'A3楼电梯01', count: 2 }
])

// 智能安防 - 电梯利用率排行 mock 数据
const elevatorUtilRank = ref([
  { name: 'A3楼电梯05', count: 25 },
  { name: 'A3楼电梯04', count: 22 },
  { name: 'A3楼电梯03', count: 18 },
  { name: 'A3楼电梯02', count: 16 },
  { name: 'A3楼电梯01', count: 15 }
])

// 智能安防 - 故障类型分布 mock 数据
const faultTypeData = ref([
  { name: '人力支援', value: 21, color: '#8b5cf6' },
  { name: '电梯故障', value: 19, color: '#ff4d5a' },
  { name: '消防告警', value: 12, color: '#ffcc33' },
  { name: '门禁异常', value: 8, color: '#00d4ff' },
  { name: '周界告警', value: 6, color: '#00f5a0' }
])

// 智能消防 - 报警列表 mock 数据
const fireAlarmList = ref([
  { name: '消防水压异常', time: '2025-07-31 11:06:39', status: '未处理' },
  { name: '排烟风机离线', time: '2025-07-31 10:46:39', status: '未处理' },
  { name: '喷淋压力过低', time: '2025-07-31 09:59:42', status: '未处理' },
  { name: '烟感设备告警', time: '2025-07-31 09:32:41', status: '已处理' }
])

// 智能消防 - 消防设备运行排行 mock 数据
const fireDeviceRunRank = ref([
  { name: '消防水泵', count: 35 },
  { name: '排烟风机', count: 30 },
  { name: '喷淋末端', count: 28 },
  { name: '烟感探测器', count: 22 },
  { name: '消防电源', count: 17 }
])

// 智慧电力 - 电力告警列表 mock 数据
const powerAlarmList = ref([
  { name: 'A区配电柜温度过高', time: '10:26', status: '未处理', statusClass: 'danger' },
  { name: 'B2回路负载过高', time: '10:12', status: '处理中', statusClass: 'warning' },
  { name: '3F照明回路电流波动', time: '09:45', status: '已处理', statusClass: 'normal' },
  { name: 'UPS电池电压偏低', time: '09:12', status: '未处理', statusClass: 'danger' }
])

// 智慧电力 - 回路负载排行 mock 数据
const powerLoadRank = ref([
  { name: 'B1配电室', value: 512 },
  { name: '空调主回路', value: 326 },
  { name: '动力设备回路', value: 245 },
  { name: '照明回路', value: 128 },
  { name: '插座回路', value: 86 }
])

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
    environment: '智慧环境',
    device: '设备管理',
    power: '智能电力',
    security: '智能安防',
    quality: '智能消防',
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

const initDeviceRingChart = () => {
  if (!deviceRingChart.value) return
  const chart = echarts.init(deviceRingChart.value)
  chart.setOption({
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(0,30,60,0.95)',
      borderColor: 'rgba(0,212,255,0.5)',
      textStyle: { color: '#fff' }
    },
    series: [{
      type: 'pie',
      radius: ['55%', '75%'],
      center: ['50%', '50%'],
      silent: true,
      itemStyle: { borderRadius: 4, borderColor: 'rgba(0,20,40,1)', borderWidth: 2 },
      label: { show: false },
      data: [
        { value: 60, itemStyle: { color: '#00ff88' } },
        { value: 0, itemStyle: { color: '#ffaa00' } },
        { value: 0, itemStyle: { color: '#ff4444' } }
      ]
    }],
    graphic: [{
      type: 'text',
      left: 'center',
      top: 'center',
      style: {
        text: '60',
        textAlign: 'center',
        fill: '#fff',
        fontSize: 32,
        fontWeight: 'bold'
      }
    }]
  })
  charts.deviceRingChart = chart
}

const initAcCheckChart = () => {
  if (!acCheckChart.value) return
  const chart = echarts.init(acCheckChart.value)
  chart.setOption({
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(0,30,60,0.95)',
      borderColor: 'rgba(0,212,255,0.5)',
      textStyle: { color: '#fff' }
    },
    legend: {
      data: ['平均水温', '冷冻水'],
      bottom: 0,
      textStyle: { color: '#b8eaff', fontSize: 11 },
      itemWidth: 14,
      itemHeight: 8
    },
    grid: {
      left: '8%',
      right: '5%',
      bottom: '15%',
      top: '10%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: ['0', '4', '8', '12', '16', '20', '24'],
      axisLine: { lineStyle: { color: 'rgba(0,212,255,0.3)' } },
      axisLabel: { color: '#b8eaff', fontSize: 10 }
    },
    yAxis: {
      type: 'value',
      axisLine: { lineStyle: { color: 'rgba(0,212,255,0.3)' } },
      axisLabel: { color: '#b8eaff', fontSize: 10 },
      splitLine: { lineStyle: { color: 'rgba(0,212,255,0.15)' } }
    },
    series: [
      {
        name: '平均水温',
        type: 'line',
        smooth: true,
        lineStyle: { color: '#00d4ff', width: 2 },
        itemStyle: { color: '#00d4ff' },
        data: [18, 20, 23, 25, 24, 22, 20]
      },
      {
        name: '冷冻水',
        type: 'line',
        smooth: true,
        lineStyle: { color: '#ffcc33', width: 2 },
        itemStyle: { color: '#ffcc33' },
        data: [15, 17, 20, 22, 21, 19, 17]
      }
    ]
  })
  charts.acCheckChart = chart
}

const initSeasonChart = () => {
  if (!seasonChart.value) return
  const chart = echarts.init(seasonChart.value)
  chart.setOption({
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(0,30,60,0.95)',
      borderColor: 'rgba(0,212,255,0.5)',
      textStyle: { color: '#fff' }
    },
    legend: {
      data: ['夏季', '冬季'],
      bottom: 0,
      textStyle: { color: '#b8eaff', fontSize: 11 },
      itemWidth: 14,
      itemHeight: 8
    },
    grid: {
      left: '8%',
      right: '5%',
      bottom: '15%',
      top: '10%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: ['3', '6', '9', '12', '15', '18', '21', '23'],
      axisLine: { lineStyle: { color: 'rgba(0,212,255,0.3)' } },
      axisLabel: { color: '#b8eaff', fontSize: 10 }
    },
    yAxis: {
      type: 'value',
      axisLine: { lineStyle: { color: 'rgba(0,212,255,0.3)' } },
      axisLabel: { color: '#b8eaff', fontSize: 10 },
      splitLine: { lineStyle: { color: 'rgba(0,212,255,0.15)' } }
    },
    series: [
      {
        name: '夏季',
        type: 'line',
        smooth: true,
        lineStyle: { color: '#00ff88', width: 2 },
        itemStyle: { color: '#00ff88' },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(0,255,136,0.3)' },
            { offset: 1, color: 'rgba(0,255,136,0)' }
          ])
        },
        data: [18, 28, 42, 36, 25, 18, 14, 12]
      },
      {
        name: '冬季',
        type: 'line',
        smooth: true,
        lineStyle: { color: '#00d4ff', width: 2 },
        itemStyle: { color: '#00d4ff' },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(0,212,255,0.3)' },
            { offset: 1, color: 'rgba(0,212,255,0)' }
          ])
        },
        data: [10, 18, 26, 24, 18, 14, 11, 10]
      }
    ]
  })
  charts.seasonChart = chart
}

const initSecurityCharts = () => {
  nextTick(() => {
    initElevatorFaultTrend()
    initFaultTypePie()
  })
}

const initElevatorFaultTrend = () => {
  if (!elevatorFaultTrend.value) return
  const chart = echarts.init(elevatorFaultTrend.value)
  chart.setOption({
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(0,30,60,0.95)',
      borderColor: 'rgba(0,212,255,0.5)',
      textStyle: { color: '#fff' }
    },
    grid: {
      left: '8%',
      right: '5%',
      bottom: '10%',
      top: '10%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      axisLine: { lineStyle: { color: 'rgba(0,212,255,0.3)' } },
      axisLabel: { color: '#b8eaff', fontSize: 10 }
    },
    yAxis: {
      type: 'value',
      axisLine: { lineStyle: { color: 'rgba(0,212,255,0.3)' } },
      axisLabel: { color: '#b8eaff', fontSize: 10 },
      splitLine: { lineStyle: { color: 'rgba(0,212,255,0.15)' } }
    },
    series: [{
      type: 'line',
      smooth: true,
      lineStyle: { color: '#00d4ff', width: 2 },
      itemStyle: { color: '#00d4ff' },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: 'rgba(0,212,255,0.3)' },
          { offset: 1, color: 'rgba(0,212,255,0)' }
        ])
      },
      data: [3, 5, 4, 7, 6, 4, 2]
    }]
  })
  charts.elevatorFaultTrend = chart
}

const initFaultTypePie = () => {
  if (!faultTypePie.value) return
  const chart = echarts.init(faultTypePie.value)
  chart.setOption({
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(0,30,60,0.95)',
      borderColor: 'rgba(0,212,255,0.5)',
      textStyle: { color: '#fff' }
    },
    series: [{
      type: 'pie',
      radius: ['50%', '72%'],
      center: ['40%', '50%'],
      avoidLabelOverlap: false,
      itemStyle: { borderRadius: 4, borderColor: 'rgba(0,20,40,1)', borderWidth: 2 },
      label: { show: false },
      data: faultTypeData.value.map(item => ({
        value: item.value,
        name: item.name,
        itemStyle: { color: item.color }
      }))
    }]
  })
  charts.faultTypePie = chart
}

const initPowerCharts = () => {
  nextTick(() => {
    initPowerOverviewRing()
    initPowerLoadTrend()
  })
}

const initPowerOverviewRing = () => {
  if (!powerOverviewRing.value) return
  const chart = echarts.init(powerOverviewRing.value)
  chart.setOption({
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(0,30,60,0.95)',
      borderColor: 'rgba(0,212,255,0.5)',
      textStyle: { color: '#fff' }
    },
    series: [{
      type: 'pie',
      radius: ['55%', '75%'],
      center: ['50%', '50%'],
      silent: true,
      itemStyle: { borderRadius: 4, borderColor: 'rgba(0,20,40,1)', borderWidth: 2 },
      label: { show: false },
      data: [
        { value: 82, itemStyle: { color: '#00ff88' } },
        { value: 6, itemStyle: { color: '#ffaa00' } },
        { value: 2, itemStyle: { color: '#ff4444' } }
      ]
    }],
    graphic: [{
      type: 'text',
      left: 'center',
      top: 'center',
      style: {
        text: '90',
        textAlign: 'center',
        fill: '#fff',
        fontSize: 32,
        fontWeight: 'bold'
      }
    }]
  })
  charts.powerOverviewRing = chart
}

const initPowerLoadTrend = () => {
  if (!powerLoadTrend.value) return
  const chart = echarts.init(powerLoadTrend.value)
  chart.setOption({
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(0,30,60,0.95)',
      borderColor: 'rgba(0,212,255,0.5)',
      textStyle: { color: '#fff' }
    },
    legend: {
      data: ['总负荷', '空调负荷'],
      bottom: 0,
      textStyle: { color: '#b8eaff', fontSize: 11 },
      itemWidth: 14,
      itemHeight: 8
    },
    grid: {
      left: '8%',
      right: '5%',
      bottom: '15%',
      top: '10%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: ['0时', '4时', '8时', '12时', '16时', '20时', '24时'],
      axisLine: { lineStyle: { color: 'rgba(0,212,255,0.3)' } },
      axisLabel: { color: '#b8eaff', fontSize: 10 }
    },
    yAxis: {
      type: 'value',
      name: 'kW',
      axisLine: { lineStyle: { color: 'rgba(0,212,255,0.3)' } },
      axisLabel: { color: '#b8eaff', fontSize: 10 },
      splitLine: { lineStyle: { color: 'rgba(0,212,255,0.15)' } }
    },
    series: [
      {
        name: '总负荷',
        type: 'line',
        smooth: true,
        lineStyle: { color: '#00d4ff', width: 2 },
        itemStyle: { color: '#00d4ff' },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(0,212,255,0.25)' },
            { offset: 1, color: 'rgba(0,212,255,0)' }
          ])
        },
        data: [680, 720, 980, 1280, 1580, 1320, 900]
      },
      {
        name: '空调负荷',
        type: 'line',
        smooth: true,
        lineStyle: { color: '#ffcc33', width: 2 },
        itemStyle: { color: '#ffcc33' },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(255,204,51,0.2)' },
            { offset: 1, color: 'rgba(255,204,51,0)' }
          ])
        },
        data: [260, 280, 420, 560, 720, 610, 390]
      }
    ]
  })
  charts.powerLoadTrend = chart
}

const initFireCharts = () => {
  nextTick(() => {
    initFireDeviceRingChart()
    initFireLinkageTrend()
    initFireDeviceRank()
  })
}

const initFireDeviceRingChart = () => {
  if (!fireDeviceRingChart.value) return
  const chart = echarts.init(fireDeviceRingChart.value)
  chart.setOption({
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(0,30,60,0.95)',
      borderColor: 'rgba(0,212,255,0.5)',
      textStyle: { color: '#fff' }
    },
    series: [{
      type: 'pie',
      radius: ['55%', '75%'],
      center: ['50%', '50%'],
      silent: true,
      itemStyle: { borderRadius: 4, borderColor: 'rgba(0,20,40,1)', borderWidth: 2 },
      label: { show: false },
      data: [
        { value: 80, itemStyle: { color: '#00ff88' } },
        { value: 10, itemStyle: { color: '#ffaa00' } },
        { value: 10, itemStyle: { color: '#ff4444' } }
      ]
    }],
    graphic: [{
      type: 'text',
      left: 'center',
      top: 'center',
      style: {
        text: '100',
        textAlign: 'center',
        fill: '#fff',
        fontSize: 32,
        fontWeight: 'bold'
      }
    }]
  })
  charts.fireDeviceRingChart = chart
}

const initFireLinkageTrend = () => {
  if (!fireLinkageTrend.value) return
  const chart = echarts.init(fireLinkageTrend.value)
  chart.setOption({
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(0,30,60,0.95)',
      borderColor: 'rgba(0,212,255,0.5)',
      textStyle: { color: '#fff' }
    },
    legend: {
      data: ['报警次数', '联动次数'],
      bottom: 0,
      textStyle: { color: '#b8eaff', fontSize: 11 },
      itemWidth: 14,
      itemHeight: 8
    },
    grid: {
      left: '8%',
      right: '5%',
      bottom: '15%',
      top: '10%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      axisLine: { lineStyle: { color: 'rgba(0,212,255,0.3)' } },
      axisLabel: { color: '#b8eaff', fontSize: 10 }
    },
    yAxis: {
      type: 'value',
      axisLine: { lineStyle: { color: 'rgba(0,212,255,0.3)' } },
      axisLabel: { color: '#b8eaff', fontSize: 10 },
      splitLine: { lineStyle: { color: 'rgba(0,212,255,0.15)' } }
    },
    series: [
      {
        name: '报警次数',
        type: 'line',
        smooth: true,
        lineStyle: { color: '#ff4d5a', width: 2 },
        itemStyle: { color: '#ff4d5a' },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(255,77,90,0.25)' },
            { offset: 1, color: 'rgba(255,77,90,0)' }
          ])
        },
        data: [12, 18, 15, 22, 20, 16, 14]
      },
      {
        name: '联动次数',
        type: 'line',
        smooth: true,
        lineStyle: { color: '#00d4ff', width: 2 },
        itemStyle: { color: '#00d4ff' },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(0,212,255,0.25)' },
            { offset: 1, color: 'rgba(0,212,255,0)' }
          ])
        },
        data: [8, 12, 10, 16, 15, 11, 9]
      }
    ]
  })
  charts.fireLinkageTrend = chart
}

const initFireDeviceRank = () => {
  if (!fireDeviceRank.value) return
  const chart = echarts.init(fireDeviceRank.value)
  chart.setOption({
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(0,30,60,0.95)',
      borderColor: 'rgba(0,212,255,0.5)',
      textStyle: { color: '#fff' }
    },
    grid: {
      left: '8%',
      right: '8%',
      bottom: '5%',
      top: '8%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: ['烟感', '喷淋', '水泵', '风机', '电源'],
      axisLine: { lineStyle: { color: 'rgba(0,212,255,0.3)' } },
      axisLabel: { color: '#b8eaff', fontSize: 10 }
    },
    yAxis: {
      type: 'value',
      axisLine: { lineStyle: { color: 'rgba(0,212,255,0.3)' } },
      axisLabel: { color: '#b8eaff', fontSize: 10 },
      splitLine: { lineStyle: { color: 'rgba(0,212,255,0.15)' } }
    },
    series: [{
      type: 'bar',
      barWidth: 18,
      itemStyle: {
        borderRadius: [4, 4, 0, 0],
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: '#00ff88' },
          { offset: 1, color: 'rgba(0,255,136,0.3)' }
        ])
      },
      data: [96, 82, 75, 60, 45]
    }]
  })
  charts.fireDeviceRank = chart
}

const initEnvironmentCharts = () => {
  nextTick(() => {
    initDeviceRingChart()
    initAcCheckChart()
    initSeasonChart()
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
    energyRankingBar: null,
    deviceRingChart: null,
    acCheckChart: null,
    seasonChart: null,
    elevatorFaultTrend: null,
    faultTypePie: null,
    fireDeviceRingChart: null,
    fireLinkageTrend: null,
    fireDeviceRank: null,
    powerOverviewRing: null,
    powerLoadTrend: null
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
  } else if (newVal === 'environment') {
    disposeAllCharts()
    nextTick(() => initEnvironmentCharts())
  } else if (newVal === 'security') {
    disposeAllCharts()
    nextTick(() => initSecurityCharts())
  } else if (newVal === 'quality') {
    disposeAllCharts()
    nextTick(() => initFireCharts())
  } else if (newVal === 'power') {
    disposeAllCharts()
    nextTick(() => initPowerCharts())
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
  background:
    radial-gradient(circle at 20% 0%, rgba(0, 212, 255, 0.16), transparent 28%),
    radial-gradient(circle at 80% 10%, rgba(127, 92, 255, 0.12), transparent 26%),
    linear-gradient(180deg, #020817 0%, #041224 36%, #03111f 100%);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  position: relative;
}

.visual-screen::before {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  background:
    linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px);
  background-size: 34px 34px;
  mask-image: radial-gradient(circle at center, rgba(0,0,0,0.9), transparent 92%);
}

.screen-header {
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 28px;
  background: linear-gradient(180deg, rgba(8, 20, 39, 0.96) 0%, rgba(5, 15, 30, 0.82) 100%);
  border-bottom: 1px solid rgba(102, 217, 255, 0.16);
  box-shadow: 0 22px 44px rgba(0, 0, 0, 0.24);
  position: relative;
  z-index: 20;
  flex-shrink: 0;
}

.screen-header::after {
  content: '';
  position: absolute;
  left: 28px;
  right: 28px;
  bottom: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent 0%, rgba(102,217,255,0.6) 50%, transparent 100%);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 24px;
}

.header-date, .header-time, .header-weather {
  font-size: 13px;
  color: #8fbad1;
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.header-center {
  flex: 1;
  display: flex;
  justify-content: center;
}

.system-title {
  font-size: 30px;
  font-weight: 700;
  color: #fff;
  margin: 0;
  letter-spacing: 10px;
  text-shadow: 0 0 20px rgba(0,180,255,0.35), 0 0 40px rgba(0,100,255,0.24);
  background: linear-gradient(180deg, #ffffff 0%, #d8f6ff 35%, #7ddaff 72%, #45c9ff 100%);
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
  background: rgba(12, 39, 68, 0.76);
  border: 1px solid rgba(102, 217, 255, 0.24);
  color: #d9f6ff;
  font-size: 13px;
  border-radius: 999px;
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.16);
}

.header-icon {
  color: #66d9ff;
  font-size: 18px;
  width: 38px;
  height: 38px;
  display: grid;
  place-items: center;
  background: rgba(12, 39, 68, 0.76);
  border: 1px solid rgba(102, 217, 255, 0.18);
  border-radius: 12px;
}

.user-name {
  color: #eff7ff;
  font-size: 14px;
  font-weight: 500;
}

.screen-body {
  flex: 1;
  overflow: hidden;
  position: relative;
  display: flex;
  flex-direction: column;
  padding-bottom: 92px;
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
  padding: 18px 24px 0;
  height: 100%;
}

.page-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('/building-bg.jpg') center/cover;
  opacity: 0.12;
  z-index: 0;
  filter: saturate(0.7) blur(1px);
}

/* 顶部指标卡片 */
.top-metrics {
  display: flex;
  justify-content: center;
  gap: 14px;
  padding: 0 0 14px;
  position: relative;
  z-index: 1;
  flex-shrink: 0;
}

.metric-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  background: linear-gradient(180deg, rgba(10, 27, 47, 0.96) 0%, rgba(7, 18, 32, 0.94) 100%);
  border: 1px solid rgba(102, 217, 255, 0.14);
  border-radius: 18px;
  min-width: 168px;
  box-shadow: 0 18px 34px rgba(0, 0, 0, 0.16);
  position: relative;
  overflow: hidden;
}

.metric-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(255,255,255,0.035), transparent 42%);
  pointer-events: none;
}

.card-icon {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 14px;
  flex-shrink: 0;
}

.card-icon svg {
  width: 22px;
  height: 22px;
}

.card-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.card-title {
  font-size: 13px;
  color: rgba(239,247,255,0.68);
  font-weight: 500;
}

.card-value {
  font-size: 22px;
  font-weight: 700;
  color: #f4fbff;
}

.card-trend {
  font-size: 12px;
  color: #72f1ba;
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
  gap: 16px;
  flex: 1;
  min-height: 0;
  position: relative;
  z-index: 1;
}

.side-panels {
  width: 336px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex-shrink: 0;
}

.ac-unit-panel {
  background: linear-gradient(180deg, rgba(10, 26, 45, 0.96) 0%, rgba(6, 18, 30, 0.94) 100%);
  border: 1px solid rgba(102, 217, 255, 0.14);
  border-radius: 20px;
  box-shadow: 0 20px 38px rgba(0,0,0,0.18);
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
  background: linear-gradient(180deg, rgba(15, 48, 74, 0.48) 0%, rgba(9, 29, 52, 0.18) 100%);
  border-bottom: 1px solid rgba(102, 217, 255, 0.12);
  flex-shrink: 0;
}

.panel-title {
  font-size: 15px;
  font-weight: 600;
  color: #eff7ff;
}

.panel-more {
  font-size: 13px;
  color: rgba(180,197,219,0.72);
}

.panel-body {
  padding: 14px 16px;
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.ac-params-row {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.ac-param {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  background: rgba(10, 33, 57, 0.78);
  border: 1px solid rgba(102,217,255,0.08);
  border-radius: 12px;
}

.ac-param svg {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

.param-label {
  font-size: 12px;
  color: rgba(180,197,219,0.68);
  flex: 1;
}

.param-value {
  font-size: 14px;
  font-weight: 600;
  color: #eaf8ff;
}

.ac-warnings {
  display: flex;
  gap: 14px;
  padding: 10px 12px;
  background: rgba(10, 33, 57, 0.78);
  border: 1px solid rgba(102,217,255,0.08);
  border-radius: 12px;
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
  color: rgba(180,197,219,0.74);
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
  padding: 8px 10px;
  background: rgba(10, 33, 57, 0.78);
  border: 1px solid rgba(102,217,255,0.08);
  border-radius: 10px;
  font-size: 13px;
  color: #eef7ff;
}

/* 中间建筑区域 */
.center-building {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-width: 0;
}

.alert-banner {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 12px 18px;
  background: linear-gradient(90deg, rgba(255,107,122,0.16) 0%, rgba(255,107,122,0.08) 100%);
  border: 1px solid rgba(255,107,122,0.34);
  border-radius: 16px;
  box-shadow: 0 18px 32px rgba(0,0,0,0.14);
  flex-shrink: 0;
}

.alert-icon {
  width: 34px;
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255,68,68,0.3);
  border-radius: 8px;
  flex-shrink: 0;
}

.alert-icon svg {
  width: 20px;
  height: 20px;
}

.alert-text {
  flex: 1;
  font-size: 14px;
  color: #f7fbff;
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
  color: #ff9aa5;
  cursor: pointer;
}

.building-3d-container {
  flex: 1;
  border-radius: 22px;
  overflow: hidden;
  border: 1px solid rgba(102,217,255,0.12);
  box-shadow: 0 24px 40px rgba(0,0,0,0.18);
  min-height: 0;
  position: relative;
}

.building-3d-container::after {
  content: '';
  position: absolute;
  inset: 0;
  background:
    linear-gradient(180deg, rgba(4, 12, 24, 0.08), rgba(3, 12, 22, 0.36)),
    radial-gradient(circle at center, transparent 38%, rgba(0,212,255,0.08) 100%);
  pointer-events: none;
}

.building-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: scale(1.03);
}

/* 底部区域 */
.bottom-section {
  display: flex;
  gap: 16px;
  padding: 14px 0 0;
  height: 198px;
  position: relative;
  z-index: 1;
  flex-shrink: 0;
}

.bottom-panel {
  background: linear-gradient(180deg, rgba(10, 26, 45, 0.96) 0%, rgba(6, 18, 30, 0.94) 100%);
  border: 1px solid rgba(102, 217, 255, 0.14);
  border-radius: 20px;
  padding: 12px 16px;
  box-shadow: 0 20px 38px rgba(0,0,0,0.18);
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
  margin-bottom: 10px;
  font-size: 14px;
  font-weight: 600;
  color: #eaf7ff;
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
  background: rgba(10, 33, 57, 0.78);
  border: 1px solid rgba(102,217,255,0.1);
  border-radius: 12px;
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
  background: linear-gradient(135deg, rgba(95,215,255,0.22) 0%, rgba(23,151,210,0.26) 100%);
  border-radius: 8px;
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
  background: linear-gradient(135deg, rgba(95,215,255,0.18) 0%, rgba(23,151,210,0.22) 100%);
  border-radius: 8px;
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
  background: rgba(12, 39, 68, 0.76);
  border: 1px solid rgba(102,217,255,0.14);
  border-radius: 999px;
  color: #dff8ff;
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
  padding: 14px;
  background: rgba(10, 33, 57, 0.78);
  border: 1px solid rgba(102,217,255,0.08);
  border-radius: 16px;
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
  background: rgba(255,255,255,0.08);
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
  background: rgba(10, 33, 57, 0.78);
  border: 1px solid rgba(102,217,255,0.08);
  border-radius: 12px;
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
  height: 92px;
  background: linear-gradient(180deg, rgba(6, 17, 31, 0.96) 0%, rgba(7, 17, 34, 0.98) 100%);
  border-top: 1px solid rgba(102, 217, 255, 0.16);
  padding: 12px 0;
  z-index: 30;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 -20px 36px rgba(0, 0, 0, 0.2);
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
  padding: 11px 22px;
  border-radius: 16px;
  color: rgba(239,247,255,0.66);
  cursor: pointer;
  transition: all 0.3s;
  border: 1px solid transparent;
}

.nav-tab:hover {
  color: #66d9ff;
  background: rgba(102,217,255,0.08);
}

.nav-tab.active {
  background: linear-gradient(180deg, rgba(95,215,255,0.16) 0%, rgba(23,151,210,0.08) 100%);
  color: #eff7ff;
  border-color: rgba(102,217,255,0.18);
  box-shadow: 0 0 24px rgba(23,151,210,0.18);
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
  padding: 16px 24px 90px;
  height: 100%;
  position: relative;
  overflow: hidden;
}

.energy-page::after {
  content: '';
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 12% 18%, rgba(0, 212, 255, 0.15), transparent 28%),
    radial-gradient(circle at 88% 20%, rgba(0, 255, 136, 0.12), transparent 26%),
    linear-gradient(180deg, rgba(5, 24, 46, 0.18), rgba(5, 24, 46, 0));
  pointer-events: none;
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
  flex-wrap: wrap;
}

.energy-card {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 15px 20px;
  background: linear-gradient(180deg, rgba(7, 31, 57, 0.96), rgba(4, 18, 36, 0.92));
  border: 1px solid rgba(82, 203, 255, 0.22);
  border-radius: 18px;
  min-width: 180px;
  box-shadow: 0 18px 36px rgba(0, 0, 0, 0.28), inset 0 1px 0 rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(18px);
  position: relative;
  overflow: hidden;
}

.energy-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.08), transparent 42%);
  pointer-events: none;
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
  background: linear-gradient(180deg, rgba(7, 29, 54, 0.96), rgba(5, 18, 36, 0.94));
  border: 1px solid rgba(72, 179, 255, 0.22);
  border-radius: 18px;
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  min-height: 0;
  box-shadow: 0 18px 36px rgba(1, 8, 18, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.04);
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
  border-radius: 22px;
  border: 1px solid rgba(82, 203, 255, 0.24);
  background:
    radial-gradient(circle at top, rgba(0, 212, 255, 0.12), transparent 42%),
    linear-gradient(180deg, rgba(0, 20, 40, 0.72), rgba(0, 10, 20, 0.72));
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.06);
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
  padding: 9px 15px;
  background: linear-gradient(180deg, rgba(8, 56, 99, 0.94), rgba(4, 31, 57, 0.92));
  border: 1px solid rgba(0, 212, 255, 0.45);
  border-radius: 12px;
  box-shadow: 0 12px 24px rgba(0, 27, 48, 0.28), 0 0 18px rgba(0, 212, 255, 0.18);
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

/* 智慧环境页面 */
.environment-page {
  display: flex;
  flex-direction: column;
  padding: 16px 24px 90px;
  height: 100%;
  position: relative;
  overflow: hidden;
}

.environment-page::after {
  content: '';
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 14% 16%, rgba(0, 255, 200, 0.12), transparent 24%),
    radial-gradient(circle at 82% 18%, rgba(0, 212, 255, 0.16), transparent 28%);
  pointer-events: none;
}

.environment-content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.env-top-metrics {
  display: flex;
  justify-content: center;
  gap: 16px;
  padding: 0 0 16px;
  flex-shrink: 0;
  position: relative;
  z-index: 1;
  flex-wrap: wrap;
}

.env-top-metrics .metric-card {
  background: linear-gradient(180deg, rgba(8, 33, 52, 0.95), rgba(3, 20, 32, 0.92));
  border: 1px solid rgba(86, 242, 207, 0.18);
  border-radius: 18px;
  box-shadow: 0 18px 34px rgba(0, 0, 0, 0.26), inset 0 1px 0 rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(18px);
}

.environment-main {
  display: flex;
  gap: 20px;
  flex: 1;
  min-height: 0;
}

.env-left, .env-right {
  width: 24%;
  display: flex;
  flex-direction: column;
  gap: 16px;
  flex-shrink: 0;
  min-width: 0;
}

.env-center {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.env-panel {
  background: linear-gradient(180deg, rgba(8, 31, 48, 0.96), rgba(4, 21, 31, 0.94));
  border: 1px solid rgba(70, 212, 179, 0.18);
  border-radius: 18px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  min-height: 0;
  box-shadow: 0 18px 36px rgba(0, 11, 15, 0.28), inset 0 1px 0 rgba(255, 255, 255, 0.05);
}

.env-panel .panel-body {
  flex: 1;
  padding: 12px 16px;
  overflow: hidden;
}

.env-device-stat-body {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
}

.env-ring-chart {
  width: 160px;
  height: 160px;
  flex-shrink: 0;
}

.device-legend {
  display: flex;
  gap: 20px;
  justify-content: center;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
}

.legend-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}

.legend-label {
  font-size: 12px;
  color: rgba(255,255,255,0.7);
}

.legend-num {
  font-size: 14px;
  font-weight: 600;
  color: #fff;
}

.env-status-panel {
  flex: 2;
}

.env-status-body {
  display: flex;
  flex-direction: column;
  gap: 0;
  padding: 8px 16px !important;
  overflow-y: auto;
}

.device-group {
  padding: 12px 0;
  border-bottom: 1px solid rgba(86,242,207,0.1);
}

.device-group:last-child {
  border-bottom: none;
}

.group-header {
  margin-bottom: 8px;
}

.group-name {
  font-size: 13px;
  color: #00d4ff;
  font-weight: 500;
}

.group-stats {
  display: flex;
  gap: 16px;
}

.stat-badge {
  font-size: 12px;
  padding: 3px 10px;
  border-radius: 4px;
  font-weight: 500;
}

.stat-badge.online {
  color: #00ff88;
  background: rgba(0,255,136,0.12);
}

.stat-badge.offline {
  color: #ffaa00;
  background: rgba(255,170,0,0.12);
}

.stat-badge.fault {
  color: #ff4444;
  background: rgba(255,68,68,0.12);
}

.env-markers {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.env-marker {
  position: absolute;
  display: flex;
  align-items: center;
  gap: 8px;
  pointer-events: auto;
}

.env-marker-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #00d4ff;
  box-shadow: 0 0 8px #00d4ff, 0 0 16px rgba(0,212,255,0.5);
  flex-shrink: 0;
}

.env-marker-tag {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 7px 12px;
  background: linear-gradient(180deg, rgba(6, 59, 78, 0.94), rgba(3, 31, 42, 0.92));
  border: 1px solid rgba(86, 242, 207, 0.34);
  border-radius: 12px;
  box-shadow: 0 10px 22px rgba(0, 24, 24, 0.28), 0 0 16px rgba(86, 242, 207, 0.14);
}

.env-marker-label {
  font-size: 12px;
  color: #00d4ff;
  font-weight: 500;
}

.env-marker-value {
  font-size: 14px;
  color: #fff;
  font-weight: 700;
}

.env-marker-1 { top: 10%; left: 20%; }
.env-marker-2 { top: 25%; right: 18%; }
.env-marker-3 { top: 50%; left: 12%; }
.env-marker-4 { bottom: 28%; right: 15%; }
.env-marker-5 { bottom: 10%; left: 25%; }

.env-chart {
  width: 100%;
  height: 100%;
  min-height: 140px;
}

.env-run-panel {
  flex: 1;
}

.env-run-body {
  display: flex;
  align-items: center;
  justify-content: center;
}

.run-card-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  width: 100%;
}

.run-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 14px 10px;
  background: linear-gradient(180deg, rgba(9, 54, 70, 0.72), rgba(5, 27, 37, 0.76));
  border: 1px solid rgba(86, 242, 207, 0.18);
  border-radius: 14px;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.04);
}

.run-card-value {
  font-size: 26px;
  font-weight: 700;
  color: #00d4ff;
  line-height: 1;
}

.run-card-unit {
  font-size: 13px;
  color: rgba(255,255,255,0.7);
}

.run-card-label {
  font-size: 12px;
  color: rgba(255,255,255,0.6);
  margin-top: 2px;
}

/* 智能安防页面 */
.security-page {
  display: flex;
  flex-direction: column;
  padding: 16px 24px 90px;
  height: 100%;
  position: relative;
  overflow: hidden;
}

.security-page::after {
  content: '';
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 10% 12%, rgba(255, 90, 90, 0.14), transparent 24%),
    radial-gradient(circle at 84% 22%, rgba(255, 170, 0, 0.12), transparent 26%);
  pointer-events: none;
}

.security-content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.security-top-metrics {
  display: flex;
  justify-content: center;
  gap: 16px;
  padding: 0 0 16px;
  flex-shrink: 0;
  position: relative;
  z-index: 1;
  flex-wrap: wrap;
}

.security-top-metrics .metric-card {
  background: linear-gradient(180deg, rgba(49, 20, 31, 0.9), rgba(22, 14, 24, 0.92));
  border: 1px solid rgba(255, 112, 112, 0.16);
  border-radius: 18px;
  box-shadow: 0 18px 34px rgba(10, 2, 4, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.05);
}

.security-main {
  display: flex;
  gap: 20px;
  flex: 1;
  min-height: 0;
}

.security-left, .security-right {
  width: 24%;
  display: flex;
  flex-direction: column;
  gap: 16px;
  flex-shrink: 0;
  min-width: 0;
}

.security-center {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  gap: 16px;
}

.security-center-top {
  background: linear-gradient(180deg, rgba(43, 18, 28, 0.94), rgba(19, 13, 21, 0.92));
  border: 1px solid rgba(255, 119, 119, 0.16);
  border-radius: 18px;
  overflow: hidden;
  flex-shrink: 0;
  box-shadow: 0 18px 34px rgba(11, 4, 8, 0.28);
}

.security-center-bottom {
  flex: 1;
  background: linear-gradient(180deg, rgba(39, 19, 28, 0.94), rgba(18, 12, 20, 0.92));
  border: 1px solid rgba(255, 119, 119, 0.16);
  border-radius: 18px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  min-height: 0;
  box-shadow: 0 18px 34px rgba(11, 4, 8, 0.28);
}

.security-center-bottom .building-wrapper {
  flex: 1;
  min-height: 0;
}

.security-panel {
  background: linear-gradient(180deg, rgba(39, 19, 28, 0.94), rgba(18, 12, 20, 0.92));
  border: 1px solid rgba(255, 119, 119, 0.16);
  border-radius: 18px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  min-height: 0;
  box-shadow: 0 18px 34px rgba(11, 4, 8, 0.28);
}

.security-panel .panel-body {
  flex: 1;
  padding: 12px 16px;
  overflow: hidden;
}

.security-chart {
  width: 100%;
  height: 100%;
  min-height: 160px;
}

.security-fault-rank-panel {
  flex: 1;
}

.security-rank-body {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px 16px !important;
  justify-content: center;
}

.rank-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.rank-index {
  width: 22px;
  height: 22px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
  flex-shrink: 0;
  color: #fff;
  background: rgba(0,150,255,0.3);
}

.rank-index.rank-1 {
  background: #ff4444;
  box-shadow: 0 0 8px rgba(255,68,68,0.5);
}

.rank-index.rank-2 {
  background: #ffaa00;
  box-shadow: 0 0 8px rgba(255,170,0,0.5);
}

.rank-index.rank-3 {
  background: #00d4ff;
  box-shadow: 0 0 8px rgba(0,212,255,0.5);
}

.rank-name {
  font-size: 12px;
  color: #b8eaff;
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.rank-bar-wrap {
  flex: 1;
  height: 6px;
  background: rgba(0,150,255,0.12);
  border-radius: 3px;
  overflow: hidden;
  min-width: 40px;
}

.rank-bar {
  height: 100%;
  border-radius: 3px;
  background: linear-gradient(90deg, #00d4ff, #0096ff);
  box-shadow: 0 0 6px rgba(0,212,255,0.4);
}

.rank-bar.util {
  background: linear-gradient(90deg, #00ff88, #00d4ff);
  box-shadow: 0 0 6px rgba(0,255,136,0.4);
}

.rank-value {
  font-size: 13px;
  font-weight: 600;
  color: #fff;
  flex-shrink: 0;
}

.fault-type-content {
  display: flex;
  align-items: center;
  padding: 8px 16px;
  gap: 16px;
}

.fault-type-pie {
  width: 160px;
  height: 160px;
  flex-shrink: 0;
}

.fault-type-legend {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
}

.fault-legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.fault-legend-dot {
  width: 10px;
  height: 10px;
  border-radius: 2px;
  flex-shrink: 0;
}

.fault-legend-label {
  font-size: 12px;
  color: #b8eaff;
  flex: 1;
}

.fault-legend-value {
  font-size: 13px;
  font-weight: 600;
  color: #fff;
}

.security-markers {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.security-marker {
  position: absolute;
  display: flex;
  align-items: center;
  gap: 8px;
  pointer-events: auto;
}

.security-marker-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
  box-shadow: 0 0 8px currentColor, 0 0 16px currentColor;
}

.security-marker-dot.danger {
  background: #ff4444;
  color: #ff4444;
}

.security-marker-dot.warning {
  background: #ffaa00;
  color: #ffaa00;
}

.security-marker-dot.normal {
  background: #00ff88;
  color: #00ff88;
}

.security-marker-tag {
  padding: 7px 12px;
  background: linear-gradient(180deg, rgba(87, 34, 48, 0.94), rgba(42, 19, 28, 0.92));
  border: 1px solid rgba(255, 145, 145, 0.3);
  border-radius: 12px;
  box-shadow: 0 10px 22px rgba(26, 8, 10, 0.32), 0 0 16px rgba(255, 109, 109, 0.14);
}

.security-marker-label {
  font-size: 12px;
  color: #fff;
  font-weight: 500;
  white-space: nowrap;
}

.security-marker-1 { top: 8%; left: 22%; }
.security-marker-2 { top: 28%; right: 18%; }
.security-marker-3 { top: 50%; left: 15%; }
.security-marker-4 { bottom: 28%; right: 20%; }
.security-marker-5 { bottom: 8%; left: 25%; }

.security-util-rank-panel {
  flex: 1;
}

.security-event-panel {
  flex: 1;
}

.security-event-body {
  display: flex;
  align-items: center;
  justify-content: center;
}

.event-card-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  width: 100%;
}

.event-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3px;
  padding: 12px 8px;
  background: linear-gradient(180deg, rgba(79, 34, 41, 0.54), rgba(37, 18, 24, 0.68));
  border: 1px solid rgba(255, 132, 132, 0.14);
  border-radius: 14px;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.04);
}

.event-card-value {
  font-size: 24px;
  font-weight: 700;
  line-height: 1;
}

.event-card-unit {
  font-size: 12px;
  color: rgba(255,255,255,0.6);
}

.event-card-label {
  font-size: 11px;
  color: rgba(255,255,255,0.55);
  margin-top: 1px;
}

/* 智能消防页面 */
.fire-page {
  display: flex;
  flex-direction: column;
  padding: 16px 24px 90px;
  height: 100%;
  position: relative;
  overflow: hidden;
}

.fire-page::after {
  content: '';
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 12% 16%, rgba(255, 120, 80, 0.16), transparent 26%),
    radial-gradient(circle at 84% 18%, rgba(255, 204, 51, 0.12), transparent 24%);
  pointer-events: none;
}

.fire-content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.fire-top-metrics {
  display: flex;
  justify-content: center;
  gap: 16px;
  padding: 0 0 16px;
  flex-shrink: 0;
  position: relative;
  z-index: 1;
  flex-wrap: wrap;
}

.fire-top-metrics .metric-card {
  background: linear-gradient(180deg, rgba(55, 22, 18, 0.92), rgba(26, 14, 14, 0.92));
  border: 1px solid rgba(255, 157, 102, 0.16);
  border-radius: 18px;
  box-shadow: 0 18px 36px rgba(16, 5, 3, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.05);
}

.fire-main {
  display: flex;
  gap: 20px;
  flex: 1;
  min-height: 0;
}

.fire-left, .fire-right {
  width: 24%;
  display: flex;
  flex-direction: column;
  gap: 16px;
  flex-shrink: 0;
  min-width: 0;
}

.fire-center {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.fire-panel {
  background: linear-gradient(180deg, rgba(52, 21, 18, 0.94), rgba(24, 14, 14, 0.92));
  border: 1px solid rgba(255, 157, 102, 0.16);
  border-radius: 18px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  min-height: 0;
  box-shadow: 0 18px 36px rgba(16, 5, 3, 0.28);
}

.fire-panel .panel-body {
  flex: 1;
  padding: 12px 16px;
  overflow: hidden;
}

.fire-device-stat-body {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
}

.fire-ring-chart {
  width: 160px;
  height: 160px;
  flex-shrink: 0;
}

.fire-device-grid-body {
  display: flex;
  align-items: center;
  justify-content: center;
}

.fire-device-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  width: 100%;
}

.fire-device-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  padding: 12px 8px;
  background: linear-gradient(180deg, rgba(76, 33, 23, 0.56), rgba(39, 19, 17, 0.68));
  border: 1px solid rgba(255, 173, 112, 0.16);
  border-radius: 14px;
}

.fire-device-num {
  font-size: 24px;
  font-weight: 700;
  color: #00d4ff;
  line-height: 1;
}

.fire-device-total {
  font-size: 12px;
  color: rgba(255,255,255,0.45);
  margin-top: -2px;
}

.fire-device-label {
  font-size: 11px;
  color: rgba(255,255,255,0.55);
  margin-top: 2px;
}

.fire-alarm-panel {
  flex: 2;
}

.fire-alarm-body {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 10px 16px !important;
  overflow: hidden;
}

.fire-alarm-summary {
  display: flex;
  justify-content: space-around;
  padding: 8px 0;
  border-bottom: 1px solid rgba(0,150,255,0.15);
}

.fire-alarm-total {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.fire-alarm-total-label {
  font-size: 12px;
  color: #b8eaff;
}

.fire-alarm-total-value {
  font-size: 28px;
  font-weight: 700;
  line-height: 1;
}

.fire-alarm-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
  overflow-y: auto;
  flex: 1;
}

.fire-alarm-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  background: linear-gradient(180deg, rgba(73, 30, 22, 0.5), rgba(38, 17, 16, 0.62));
  border-radius: 10px;
  border: 1px solid rgba(255, 152, 103, 0.12);
}

.fire-alarm-idx {
  font-size: 11px;
  color: rgba(255,255,255,0.4);
  width: 16px;
  flex-shrink: 0;
}

.fire-alarm-name {
  font-size: 12px;
  color: #fff;
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.fire-alarm-time {
  font-size: 10px;
  color: rgba(255,255,255,0.45);
  flex-shrink: 0;
}

.fire-alarm-status {
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 4px;
  font-weight: 500;
  flex-shrink: 0;
}

.fire-alarm-status.unhandled {
  color: #ff4444;
  background: rgba(255,68,68,0.15);
}

.fire-alarm-status.handled {
  color: #00ff88;
  background: rgba(0,255,136,0.12);
}

.fire-markers {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.fire-marker {
  position: absolute;
  display: flex;
  align-items: center;
  gap: 8px;
  pointer-events: auto;
}

.fire-marker-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}

.fire-marker-dot.normal {
  background: #00ff88;
  box-shadow: 0 0 8px #00ff88, 0 0 16px rgba(0,255,136,0.5);
}

.fire-marker-dot.warning {
  background: #ffaa00;
  box-shadow: 0 0 8px #ffaa00, 0 0 16px rgba(255,170,0,0.5);
}

.fire-marker-dot.danger {
  background: #ff4444;
  box-shadow: 0 0 8px #ff4444, 0 0 16px rgba(255,68,68,0.5);
}

.fire-marker-tag {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 7px 12px;
  background: linear-gradient(180deg, rgba(80, 34, 24, 0.94), rgba(39, 18, 16, 0.92));
  border: 1px solid rgba(255, 176, 117, 0.26);
  border-radius: 12px;
  box-shadow: 0 10px 22px rgba(26, 10, 7, 0.32), 0 0 16px rgba(255, 145, 91, 0.16);
}

.fire-marker-tag.warn {
  border-color: rgba(255,170,0,0.5);
  box-shadow: 0 0 12px rgba(255,170,0,0.25);
}

.fire-marker-tag.danger {
  border-color: rgba(255,68,68,0.5);
  box-shadow: 0 0 12px rgba(255,68,68,0.25);
}

.fire-marker-label {
  font-size: 12px;
  color: #fff;
  font-weight: 500;
  white-space: nowrap;
}

.fire-marker-1 { top: 8%; left: 20%; }
.fire-marker-2 { top: 22%; right: 18%; }
.fire-marker-3 { top: 40%; left: 15%; }
.fire-marker-4 { top: 58%; right: 20%; }
.fire-marker-5 { bottom: 18%; left: 25%; }
.fire-marker-6 { top: 15%; right: 25%; }
.fire-marker-7 { bottom: 8%; right: 18%; }

.fire-chart {
  width: 100%;
  height: 100%;
  min-height: 140px;
}

.fire-run-rank-panel {
  flex: 1;
}

.fire-rank-body {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px 16px !important;
  justify-content: center;
}

.rank-bar.fire-rank {
  background: linear-gradient(90deg, #ff4d5a, #ffaa00);
  box-shadow: 0 0 6px rgba(255,77,90,0.4);
}

/* 智慧电力页面 */
.power-page {
  display: flex;
  flex-direction: column;
  padding: 16px 24px 90px;
  height: 100%;
  position: relative;
  overflow: hidden;
}

.power-page::after {
  content: '';
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 12% 18%, rgba(0, 212, 255, 0.15), transparent 26%),
    radial-gradient(circle at 84% 18%, rgba(255, 204, 51, 0.12), transparent 24%);
  pointer-events: none;
}

.power-content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.power-top-metrics {
  display: flex;
  justify-content: center;
  gap: 16px;
  padding: 0 0 16px;
  flex-shrink: 0;
  position: relative;
  z-index: 1;
  flex-wrap: wrap;
}

.power-metric-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 18px;
  background: linear-gradient(180deg, rgba(9, 32, 55, 0.96), rgba(5, 17, 34, 0.94));
  border: 1px solid rgba(83, 201, 255, 0.2);
  border-radius: 18px;
  min-width: 0;
  flex: 1;
  box-shadow: 0 18px 36px rgba(0, 8, 18, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(16px);
}

.power-metric-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.power-metric-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.power-metric-label {
  font-size: 11px;
  color: rgba(255,255,255,0.5);
}

.power-metric-value {
  font-size: 20px;
  font-weight: 700;
  color: #fff;
  line-height: 1.2;
}

.power-metric-value small {
  font-size: 11px;
  font-weight: 400;
  color: rgba(255,255,255,0.5);
}

.power-metric-value.danger {
  color: #ff4d5a;
}

.power-metric-trend {
  font-size: 10px;
  color: rgba(255,255,255,0.45);
}

.power-metric-trend.up {
  color: #00ff88;
}

.power-metric-trend.normal {
  color: #00d4ff;
}

.power-metric-trend.danger {
  color: #ff4d5a;
}

.power-main {
  display: flex;
  gap: 20px;
  flex: 1;
  min-height: 0;
}

.power-left, .power-right {
  width: 24%;
  display: flex;
  flex-direction: column;
  gap: 16px;
  flex-shrink: 0;
  min-width: 0;
}

.power-center {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.power-panel {
  background: linear-gradient(180deg, rgba(8, 28, 48, 0.96), rgba(4, 17, 31, 0.94));
  border: 1px solid rgba(83, 201, 255, 0.18);
  border-radius: 18px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  min-height: 0;
  box-shadow: 0 18px 36px rgba(0, 8, 18, 0.28), inset 0 1px 0 rgba(255, 255, 255, 0.04);
}

.power-panel .panel-body {
  flex: 1;
  padding: 12px 16px;
  overflow: hidden;
}

.power-overview-body {
  padding: 14px 16px;
  flex: 1;
}

.power-overview-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.power-ov-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 12px 8px;
  background: linear-gradient(180deg, rgba(7, 53, 79, 0.72), rgba(4, 27, 41, 0.76));
  border: 1px solid rgba(83, 201, 255, 0.16);
  border-radius: 14px;
  gap: 2px;
}

.power-ov-label {
  font-size: 11px;
  color: rgba(255,255,255,0.5);
}

.power-ov-value {
  font-size: 24px;
  font-weight: 700;
  color: #00d4ff;
  line-height: 1;
}

.power-ov-unit {
  font-size: 11px;
  color: rgba(255,255,255,0.4);
}

.power-ring-body {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 12px 16px;
  gap: 12px;
  flex: 1;
}

.power-ring-chart {
  width: 150px;
  height: 150px;
  flex-shrink: 0;
}

.power-ring-legend {
  display: flex;
  gap: 16px;
  font-size: 11px;
  color: #b8eaff;
}

.power-legend-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.power-legend-item i {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.power-alarm-panel {
  flex: 2;
}

.power-alarm-body {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 10px 16px;
  overflow-y: auto;
  flex: 1;
}

.power-alarm-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  background: linear-gradient(180deg, rgba(8, 46, 71, 0.56), rgba(5, 24, 37, 0.68));
  border-radius: 10px;
  border: 1px solid rgba(83, 201, 255, 0.12);
}

.power-alarm-idx {
  font-size: 11px;
  color: rgba(255,255,255,0.4);
  width: 16px;
  flex-shrink: 0;
}

.power-alarm-name {
  font-size: 12px;
  color: #fff;
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.power-alarm-time {
  font-size: 10px;
  color: rgba(255,255,255,0.45);
  flex-shrink: 0;
}

.power-alarm-status {
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 4px;
  font-weight: 500;
  flex-shrink: 0;
}

.power-alarm-status.danger {
  color: #ff4444;
  background: rgba(255,68,68,0.15);
}

.power-alarm-status.warning {
  color: #ffaa00;
  background: rgba(255,170,0,0.15);
}

.power-alarm-status.normal {
  color: #00ff88;
  background: rgba(0,255,136,0.12);
}

.power-center-panel {
  flex: 1;
}

.power-center-body {
  position: relative;
  flex: 1;
  overflow: hidden;
  border-radius: 0 0 12px 12px;
}

.power-building-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: brightness(0.7);
}

.power-markers {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.power-marker {
  position: absolute;
  display: flex;
  align-items: center;
  gap: 8px;
  pointer-events: auto;
}

.power-marker-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}

.power-marker-dot.normal {
  background: #00ff88;
  box-shadow: 0 0 8px #00ff88, 0 0 16px rgba(0,255,136,0.5);
}

.power-marker-dot.warning {
  background: #ffaa00;
  box-shadow: 0 0 8px #ffaa00, 0 0 16px rgba(255,170,0,0.5);
}

.power-marker-tag {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 7px 12px;
  background: linear-gradient(180deg, rgba(8, 62, 102, 0.94), rgba(4, 31, 53, 0.92));
  border: 1px solid rgba(83, 201, 255, 0.32);
  border-radius: 12px;
  box-shadow: 0 10px 22px rgba(0, 16, 27, 0.3), 0 0 18px rgba(83, 201, 255, 0.14);
}

.power-marker-tag.warn {
  border-color: rgba(255,170,0,0.5);
  box-shadow: 0 0 12px rgba(255,170,0,0.25);
}

.power-marker-label {
  font-size: 12px;
  color: #fff;
  font-weight: 500;
  white-space: nowrap;
}

.power-marker-1 { top: 8%; left: 20%; }
.power-marker-2 { top: 22%; right: 18%; }
.power-marker-3 { top: 40%; left: 15%; }
.power-marker-4 { top: 58%; right: 20%; }
.power-marker-5 { bottom: 15%; left: 25%; }
.power-marker-6 { top: 12%; right: 22%; }

.power-chart {
  width: 100%;
  height: 100%;
  min-height: 150px;
}

.power-chart-lg {
  min-height: 180px;
}

.power-params-body {
  padding: 12px 16px;
  flex: 1;
}

.power-params-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.power-param-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  padding: 12px 8px;
  background: linear-gradient(180deg, rgba(8, 52, 79, 0.7), rgba(4, 24, 39, 0.74));
  border: 1px solid rgba(83, 201, 255, 0.16);
  border-radius: 14px;
}

.power-param-label {
  font-size: 11px;
  color: rgba(255,255,255,0.5);
}

.power-param-value {
  font-size: 18px;
  font-weight: 700;
  color: #00d4ff;
  line-height: 1;
}

.power-param-value small {
  font-size: 10px;
  font-weight: 400;
  color: rgba(255,255,255,0.45);
}

.power-rank-panel {
  flex: 1;
}

.power-rank-body {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px 16px;
  justify-content: center;
}

.rank-bar.power-rank-bar {
  background: linear-gradient(90deg, #00d4ff, rgba(0,212,255,0.4));
  box-shadow: 0 0 6px rgba(0,212,255,0.4);
}
</style>
