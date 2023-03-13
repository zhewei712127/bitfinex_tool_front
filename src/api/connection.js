import request from '@/utils/request'

export function createConnection(data) {
  return request({
    url: '/connection',
    method: 'post',
    data: data
  })
}

export function getConnection(id) {
  return request({
    url: `/connection/${id}`,
    method: 'get'
  })
}
