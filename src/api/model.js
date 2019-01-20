/**
 * Module that represent the prototype for the models.
 * Exposes methods 'get', 'post', 'put', 'patch', 'delete' based on fetch.
 * In case you want to implement with some other library like axios, make the change here.
 */
import 'whatwg-fetch';
import { stringify } from 'querystring';
let request;

let model = function( options = {}){
  this.headers = { 'Content-Type': 'application/json' };
  this.credentials = 'include';
  this.url = '';
  if ( typeof options === 'string' ){
    this.url = options;
  } else if ( typeof options === 'object' ){
    Object.assign( this, options );
  } else throw new Error( 'Unrecognized params for model' );
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
      // istanbul ignore next
      if ( typeof data !== 'object' || data instanceof Date || Array.isArray( data )) {
        throw new Error ( 'the query parameters should be an object' );
      }
      if ( !data.filter ){
        data = { filter : { ...data }};
      }
      if ( typeof data.filter === 'object' ) {
        data.filter = JSON.stringify( data.filter );
      }
      query = `?${ stringify( data )}`;
    } else {
      options.body = JSON.stringify( data );
    }
    // return fetch( this.url + query, options )
    return request( this.url + query, options )
      .then( onSuccess, onError );
  };
});

model.init = function ( params ) {
  request = params.request;
};

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
