import axios from 'axios'

const service = axios.create({
  baseURL: 'http://127.0.0.1:7001',
  withCredentials: true,
})

service.interceptors.response.use(response => {
  return response.data
})

export function getPage(pageId) {
  return service.get(`/pages/${pageId}`)
}

export function getComponents() {
  return service.get('/components')
}

export function pageAddComponents(params) {
  return service.post('/page/addComponents', params)
}
