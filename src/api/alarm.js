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

export function getAlarmList(params) {
  return request.get('/api/alarm/list', { params })
}

export function getAlarmPage(params) {
  return request.get('/api/alarm/page', { params })
}

export function getAlarmById(id) {
  return request.get(`/api/alarm/${id}`)
}

export function addAlarm(data) {
  return request.post('/api/alarm', data)
}

export function updateAlarm(id, data) {
  return request.put(`/api/alarm/${id}`, data)
}

export function deleteAlarm(id) {
  return request.delete(`/api/alarm/${id}`)
}

export function handleAlarm(id, data) {
  return request.put(`/api/alarm/${id}/handle`, data)
}

export default request
