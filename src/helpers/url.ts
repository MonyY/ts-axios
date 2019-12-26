import { isDate, isPlainObject } from './util'

interface URLOrigin {
  protocol: string
  host: string
}

// 处理特殊字符
function encode(val: string): string {
  return encodeURIComponent(val)
    .replace(/%40/g, '@')
    .replace(/%3A/gi, ':')
    .replace(/%24/g, '$')
    .replace(/%2C/gi, ',')
    .replace(/%20/g, '+')
    .replace(/%5B/gi, '[')
    .replace(/%5D/gi, ']')
}

// 把 params 拼接到 url 上
export function buildURL(url: string, params?: any): string {
  if (!params) {
    return url
  }

  const parts: string[] = []

  Object.keys(params).forEach(key => {
    const val = params[key]

    // 空值忽略
    if (val === null || typeof val === 'undefined') return

    /*
      参数值为数组 /base/get?foo[]=bar&foo[]=baz'
      params: {
        foo: ['bar', 'baz']
      }
    */

    let values = []
    if (Array.isArray(val)) {
      values = val
      key += '[]'
    } else {
      values = [val]
    }

    values.forEach(val => {
      // 参数值为 Date 类型 /base/get?date=2019-04-01T05:55:39.030Z
      if (isDate(val)) {
        val = val.toISOString()
      } else if (isPlainObject(val)) {
        val = JSON.stringify(val)
      }

      parts.push(`${encode(key)}=${encode(val)}`)
    })
  })

  let serializedParams = parts.join('&')

  if (serializedParams) {
    const markIndex = url.indexOf('#')

    // 判断URL是否有hash
    if (markIndex !== -1) {
      // 截取#号之前的url
      url = url.slice(0, markIndex)
    }

    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams
  }

  return url
}

export function isURLSameOrigin(requestURL: string): boolean {
  const parsedOrigin = resolve(requestURL)
  return (parsedOrigin.protocol === curOrigin.protocol && parsedOrigin.host === curOrigin.host)
}

const urlParsingNode = document.createElement('a')
const curOrigin = resolve(window.location.href)

function resolve(url: string): URLOrigin {
  urlParsingNode.setAttribute('hrel', url)
  const { protocol, host } = urlParsingNode
  return {
    protocol,
    host
  }
}

export function isAbsoluteURL(url: string): boolean {
  return /(^[a-z][a-z\d\+\-\.]*:)?\/\//i.test(url)
}

export function combineURL(baseURL: string, relativeURL?: string): string {
  return relativeURL ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '') : baseURL
}
