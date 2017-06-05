import axios from 'axios'
import {API_GATEWAY,REPORT_GATEWAY, ZEUS_GATEWAY} from '../config/aws-config'
import store from '../store'
import { getCurrentToken } from '@/api/auth'
import _ from 'lodash'
/**
cfg = { url: '', method: '', params:{id:'112'}, data:{ username:'' } }
*/
export const awsFetch = async(cfg) => {
  const [err,token] = await getCurrentToken()
  if (err) {
    return router.replace('/login')
  }
  const requestConfig = {
    baseURL: API_GATEWAY,
    headers: {
      Authorization:token
    },
    ...cfg
  }
  try {
    const response = await axios.request(requestConfig)
    return [0, response]
  } catch (e) {
    return [e, 0]
  }
}

export const reportFetch = async(cfg) => {
  const [err,token] = await getCurrentToken()
  if (err) {
    return router.replace('/login')
  }
  const requestConfig = {
    baseURL: REPORT_GATEWAY,
    headers: {
      Authorization:token
    },
    ...cfg
  }
  try {
    const response = await axios.request(requestConfig)
    return [0, response]
  } catch (e) {
    return [e, 0]
  }
}

export const zeusFetch = async(cfg) => {
  const [err,token] = await getCurrentToken()
  if (err) {
    return router.replace('/login')
  }
  const requestConfig = {
    baseURL: ZEUS_GATEWAY,
    headers: {
      Authorization:token
    },
    ...cfg
  }
  try {
    const response = await axios.request(requestConfig)
    return [0, response]
  } catch (e) {
    return [e, 0]
  }
}
