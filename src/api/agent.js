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

export function getAgentList() {
  return request.get('/api/agent/list')
}

export function getAgentStatistics() {
  return request.get('/api/agent/statistics')
}

export function getAgentArchitecture() {
  return request.get('/api/agent/architecture')
}

export function startAgent(id) {
  return request.post(`/api/agent/${id}/start`)
}

export function stopAgent(id) {
  return request.post(`/api/agent/${id}/stop`)
}

export function testRunAgent(id) {
  return request.post(`/api/agent/${id}/test-run`)
}

export default request
