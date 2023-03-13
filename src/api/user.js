import request from '@/utils/request'

export function getInfo() {
  return request({
    url: '/auth/user_info',
    method: 'get'
  })
}

export function login(email, password) {
  return request({
    url: '/auth/login',
    method: 'post',
    data: {
      email: email,
      password: password
    }
  })
}
