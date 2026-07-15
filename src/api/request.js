import axios from 'axios'
// 全局基础地址
const baseUrl = 'http://localhost:3000'

// 创建实例
const service = axios.create({
  baseURL: baseUrl,
  timeout: 5000
})

// 登录接口
export const loginApi = (params) => service.post('/login', params)