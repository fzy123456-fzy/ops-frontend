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

export function getTwinModules() {
  return request.get('/api/digital-twin/modules')
}

export function getTwinObjects() {
  return request.get('/api/digital-twin/objects')
}

export function getTwinStatistics() {
  return request.get('/api/digital-twin/statistics')
}

export default request
