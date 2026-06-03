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

export function getUserList(params) {
  return request.get('/api/user/list', { params })
}

export function getUserPage(params) {
  return request.get('/api/user/page', { params })
}

export function getUserById(id) {
  return request.get(`/api/user/${id}`)
}

export function addUser(data) {
  return request.post('/api/user', data)
}

export function updateUser(id, data) {
  return request.put(`/api/user/${id}`, data)
}

export function deleteUser(id) {
  return request.delete(`/api/user/${id}`)
}

export function toggleUserStatus(id, status) {
  return request.put(`/api/user/${id}/status`, { status })
}

export default request
