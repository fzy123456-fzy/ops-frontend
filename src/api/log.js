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

export function getLogPage(params) {
  return request.get('/api/log/page', { params })
}

export function getLogById(id) {
  return request.get(`/api/log/${id}`)
}

export function deleteLog(id) {
  return request.delete(`/api/log/${id}`)
}

export function clearLogs() {
  return request.delete('/api/log/clear')
}

export default request
