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

export function getLlmStatus() {
  return request.get('/api/llm/status')
}

export function getKnowledgeBases() {
  return request.get('/api/llm/knowledge-bases')
}

export function getMemories() {
  return request.get('/api/llm/memories')
}

export function getReasoningCapabilities() {
  return request.get('/api/llm/reasoning-capabilities')
}

export default request
