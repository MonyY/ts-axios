import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from '../types'
import xhr from './xhr'
import { buildURL } from '../helpers/url'
import { transformRequest, transformResponse } from '../helpers/data'
import { processHeaders, flattenHeaders } from '../helpers/headers'

function dispatchRequest(config: AxiosRequestConfig): AxiosPromise {
  processConfig(config)
  return xhr(config).then(res => {
    return transformResponseData(res)
  })
}

// 处理config
function processConfig(config: AxiosRequestConfig): void {
  config.url = tranformURL(config)
  config.headers = tranformHeader(config)
  config.data = tranformRequestData(config)
  config.headers = flattenHeaders(config.headers, config.method!)
}

// 转化URl
function tranformURL(config: AxiosRequestConfig): string {
  const { url, params } = config
  return buildURL(url!, params)
}

// 转化data
function tranformRequestData(config: AxiosRequestConfig): any {
  return transformRequest(config.data)
}

// 转化header
function tranformHeader(config: AxiosRequestConfig): any {
  const { headers = {}, data } = config
  return processHeaders(headers, data)
}
// 转化返回数据
function transformResponseData(res: AxiosResponse): AxiosResponse {
  return transformResponse(res)
}

export default dispatchRequest
