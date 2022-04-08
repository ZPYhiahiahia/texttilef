import request from '@/utils/request'

export const url = 'http://172.21.72.185:8886/api/'

export function get_status() {
  return request({
    url: url + 'server_status',
    method: 'get'
  })
}

export function get_extractor_status() {
  return request({
    url: url + 'extractor_status',
    method: 'get'
  })
}

export function get_dataset_status() {
  return request({
    url: url + 'dataset_status',
    method: 'get'
  })
}

export function get_feartures_db_status() {
  return request({
    url: url + 'features_db_status',
    method: 'get'
  })
}

export function get_progress_status() {
  return request({
    url: url + 'progress_status',
    method: 'get'
  })
}

export function build_features_db(data) {
  return request({
    url: url + 'build_features_db',
    method: 'post',
    data
  })
}

export function test_top10(data) {
  return request({
    url: url + 'test_top10',
    method: 'post',
    data
  })
}
