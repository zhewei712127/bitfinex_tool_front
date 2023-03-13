import request from '@/utils/request'

// auth
export function wallets() {
  return request({
    url: '/auth/wallets',
    method: 'get'
  })
}

export function transfer(data) {
  return request({
    url: '/auth/transfer',
    method: 'post',
    data: data
  })
}

// public
export function tickers(params = null) {
  return request({
    url: '/public/tickers',
    method: 'get',
    params: params
  })
}

export function book(params = null) {
  return request({
    url: '/public/book',
    method: 'get',
    params: params
  })
}

export function createOrder(data) {
  return request({
    url: '/auth/order/create',
    method: 'post',
    data: data
  })
}
