import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from '../types/index'
import { parseHeaders } from '../helpers/headers'
import { createError } from '../helpers/error'
import { isURLSameOrigin } from '../helpers/url'
import cookie from '../helpers/cookie'
import { isFormData } from '../helpers/util'

export default function xhr(config: AxiosRequestConfig): AxiosPromise {
  return new Promise((resolve, reject) => {
    const {
      data = null,
      url,
      method = 'get',
      headers,
      responseType,
      timeout,
      cancelToken,
      withCredentials,
      xsrfCookieName,
      xsrfHeaderName,
      onDownLoadProgress,
      onUpLoadProgress,
      validateStatus
    } = config

    const request = new XMLHttpRequest()

    request.open(method.toUpperCase(), url!, true)

    configureRequest()

    addEvent()

    processHeaders()

    processCancel()

    request.send(data)

    function configureRequest(): void {
      if (responseType) request.responseType = responseType
      if (timeout) request.timeout = timeout
      if (withCredentials) request.withCredentials = withCredentials
    }

    function addEvent(): void {
      request.onreadystatechange = function handleLoad() {
        if (request.readyState !== 4 || request.status === 0) return

        // 获取header
        const responseHeader = parseHeaders(request.getAllResponseHeaders())
        const responseData = responseType !== 'text' ? request.response : request.responseText

        const response: AxiosResponse = {
          data: responseData,
          status: request.status,
          statusText: request.statusText,
          headers: responseHeader,
          config,
          request
        }
        handleResponse(response)
      }
      // 处理网络错误
      request.onerror = function handleError() {
        reject(createError('Network Error', config, null, request))
      }

      // 处理请求超时
      request.ontimeout = function handleTimeout() {
        reject(createError(`Timeout of ${timeout} ms exceeded`, config, 'ECONNABORTED', request))
      }

      if (onDownLoadProgress) {
        request.onprogress = onDownLoadProgress
      }

      if (onUpLoadProgress) {
        request.upload.onprogress = onUpLoadProgress
      }
    }

    function processHeaders(): void {
      if (isFormData(data)) {
        delete headers['Content-Type']
      }

      if ( (withCredentials || isURLSameOrigin(url!)) && xsrfCookieName) {
        const xsrfVal = cookie.read(xsrfCookieName)
        if (xsrfVal && xsrfHeaderName) {
          headers[xsrfHeaderName] = xsrfVal
        }
      }

      // 设置header
      Object.keys(headers).forEach(name => {
        if (data === null && name.toLowerCase() === 'content-type') {
          delete headers[name]
        } else {
          request.setRequestHeader(name, headers[name])
        }
      })
    }

    function processCancel(): void {
      if (cancelToken) {
        cancelToken.promise.then(reason => {
          request.abort()
          reject(reason)
        })
      }
    }

    function handleResponse(response: AxiosResponse) {
      if (!validateStatus || validateStatus(response.status)) {
        resolve(response)
      } else {
        reject(
          createError(
            `Request failed with status code ${response.status}`,
            config,
            null,
            request,
            response
          )
        )
      }
    }
  })
}
