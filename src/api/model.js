/**
 * Module that represent the prototype for the models.
 * Exposes methods 'get', 'post', 'put', 'patch', 'delete' based on fetch.
 * In case you want to implement with some other library like axios, make the change here.
 */
import 'whatwg-fetch'
import getBaseUrl from './baseUrl'

let model = {}
model.headers = { "Content-Type": "application/json" }
model.credentials = "same-origin"
model.baseUrl = getBaseUrl();
model.url = '';
[ 
  'get',
  'post',
  'put',
  'patch',
  'delete'
].forEach(method => {
  model[method] = function(data, options = {}){
    let query = typeof data === 'string' ? data : "";
    data = method === 'get' || method === 'delete' ? options : data
    options = Object.assign({
      method: method.toUpperCase(),
      body: JSON.stringify(data),
      headers: this.headers,
      credentials: this.credentials
    }, options)
    if (method === 'get' || method === 'delete'){
      delete options.body
    }
    return fetch(this.baseUrl + this.url + query, options)
    .then(onSuccess, onError)
  }
})

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
  throw error
}

export default model