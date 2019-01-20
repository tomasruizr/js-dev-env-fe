/**
 * Module that represent the prototype for the models.
 * Exposes methods 'get', 'post', 'put', 'patch', 'delete' based on fetch.
 * In case you want to implement with some other library like axios, make the change here.
 */
import 'whatwg-fetch';
import { getApiServer } from './urlManager';
import { stringify } from 'querystring';

let model = function( options = {}){
  this.headers = options.headers || { 'Content-Type': 'application/json' };
  this.credentials = options.credentials || 'include';
  this.apiServer = options.apiServer || getApiServer();
  this.url = options.url || '';
};
[
  'get',
  'post',
  'put',
  'patch',
  'delete'
].forEach( method => {
  model.prototype[method] = function( data, options_ = {}){
    let query = '';
    const options = Object.assign({
      headers: this.headers,
      credentials: this.credentials
    }, options_, { method: method.toUpperCase() });
    if ([ 'get', 'delete' ].includes( method ) && data ){
      if ( typeof data === 'object' ) {
        if ( !data.filter ){
          data = { filter : { ...data }};
        }
        if ( typeof data.filter === 'object' ) {
          data.filter = JSON.stringify( data.filter );
        }
        query = `?${ stringify( data )}`;
      } else {
        data = ( `${data}` ).replace( /^\?/mig, '' );
        query = `?${data}`;
      }
    } else {
      options.body = JSON.stringify( data );
    }
    return fetch( this.apiServer + this.url + query, options )
      .then( onSuccess, onError );
  };
});

function onSuccess( response ) {
  if ( response.status >= 200 && response.status < 300 ) {
    return response.json();
  } else {
    var error = new Error( response.statusText );
    error.response = response;
    throw error;
  }
}

function onError( error ) {
  throw error;
}

export default model;

//*******************************************
// Expose for testing
//*******************************************
/* istanbul ignore next */
if ( process.env.NODE_ENV === 'test' ) {
  global.moduleTests = global.moduleTests || {};
  global.moduleTests['modeljs'] = {
    onSuccess,
    onError
  };
}
