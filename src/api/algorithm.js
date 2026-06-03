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

export function getAlgorithmModels() {
  return request.get('/api/algorithm/models')
}

export function getAlgorithmModelById(id) {
  return request.get(`/api/algorithm/models/${id}`)
}

export function deployModel(id) {
  return request.post(`/api/algorithm/models/${id}/deploy`)
}

export function stopModel(id) {
  return request.post(`/api/algorithm/models/${id}/stop`)
}

export function getAlgorithmStatistics() {
  return request.get('/api/algorithm/statistics')
}

export default request
