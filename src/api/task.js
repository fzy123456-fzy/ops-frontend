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

export function getTaskList(params) {
  return request.get('/api/task/list', { params })
}

export function getTaskPage(params) {
  return request.get('/api/task/page', { params })
}

export function getTaskById(id) {
  return request.get(`/api/task/${id}`)
}

export function addTask(data) {
  return request.post('/api/task', data)
}

export function updateTask(id, data) {
  return request.put(`/api/task/${id}`, data)
}

export function deleteTask(id) {
  return request.delete(`/api/task/${id}`)
}

export function executeTask(id) {
  return request.put(`/api/task/${id}/execute`)
}

export default request
