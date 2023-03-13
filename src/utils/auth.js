import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'
const RedirectKey = 'redirect'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function getRedirect() {
  return Cookies.get(RedirectKey)
}

export function setRedirect(redirect) {
  return Cookies.set(RedirectKey, redirect)
}

export function removeRedirect() {
  return Cookies.remove(RedirectKey)
}
