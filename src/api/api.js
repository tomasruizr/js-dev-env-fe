import 'whatwg-fetch';
import getBaseUrl from './baseUrl';

let baseUrl = getBaseUrl();

function get(url) {
  return fetch(baseUrl + url)
  .then(onSuccess, onError)
}

function post(url) {
  return fetch(baseUrl + url)
  .then(onSuccess, onError)
}

function put(url) {
  return fetch(baseUrl + url)
  .then(onSuccess, onError)
}

function patch(url) {
  return fetch(baseUrl + url)
  .then(onSuccess, onError)
}

// Can't call func delete since reserved word.
function del(url) {
  const request = new Request(baseUrl + url, {
    method: 'DELETE'
  });
  return fetch(request).then(onSuccess, onError);
}

function onSuccess(response) {
  if (response.status >= 200 && response.status < 300) {
    return response.json()
  } else {
    var error = new Error(response.statusText)
    error.response = response
    throw error
  }
}

function onError(error) {
  return error // eslint-disable-line no-console
}

module.exports = {
  get,
  post,
  put,
  patch,
  delete: del
}