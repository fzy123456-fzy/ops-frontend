import axios from 'axios'

const request = axios.create({
  baseURL: '',
  timeout: 10000
})

request.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error('API Error:', error.message)
    return Promise.reject(error)
  }
)

export function getDeviceList(params) {
  return request.get('/api/device/list', { params })
}

export function getDevicePage(params) {
  return request.get('/api/device/page', { params })
}

export function getDeviceById(id) {
  return request.get(`/api/device/${id}`)
}

export function addDevice(data) {
  return request.post('/api/device', data)
}

export function updateDevice(id, data) {
  return request.put(`/api/device/${id}`, data)
}

export function deleteDevice(id) {
  return request.delete(`/api/device/${id}`)
}

export function getAlarmList(params) {
  return request.get('/api/alarm/list', { params })
}

export function getAlarmPage(params) {
  return request.get('/api/alarm/page', { params })
}

export function getTaskList(params) {
  return request.get('/api/task/list', { params })
}

export function getTaskPage(params) {
  return request.get('/api/task/page', { params })
}

export function getDashboardStats() {
  return request.get('/api/dashboard/stats')
}

export function getLogPage(params) {
  return request.get('/api/log/page', { params })
}

export function getUserPage(params) {
  return request.get('/api/user/page', { params })
}

export default request
