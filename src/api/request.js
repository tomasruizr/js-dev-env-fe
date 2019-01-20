import { getApiServer } from './urlManager';
let socket, io;

const request = function ( uri, options = {}) {
  if ( !uri || uri === '' ) throw new Error( 'uri must exist for request' );
  const noBase = options.urlPassThrough;
  delete options.urlPassThrough;
  options = {
    method: 'get',
    isSocket: false
    // headers: {},
    // credentials: {},
    ,
    ...options
  };
  if ( options.isSocket && !options.noSocket && !noBase ) {
    const params = [`VR:${options.method}:${uri}`];
    if ( options.body ) params.push( options.body );
    return new Promise( resolve => socket.emit.call( socket, ...params, resolve ));
  } else {
    uri = noBase ? uri : `${getApiServer()}${uri}`;
    return fetch( uri, options );
  }
};

request.init = function ( options = {}) {
  // if ( !options.apiServer ) throw new Error( 'No apiServer specified for the request Library' );
  if ( options.noSocket !== true ){
    if ( !options.io ) throw new Error( 'No websocket client (socket.io-client) specified for the request Library' );
    io = options.io;
    request.socketConnect( options.apiServer, options.nsp );
  }
};

request.socketConnect = function ( apiServer, nsp ) {
  nsp = nsp ? `/${nsp}` : '';
  socket = io( `${apiServer}${nsp}`, {
    transports: [ 'websocket', 'polling' ]
  });
  socket.once( 'connect', request.exposeSocketMethods );
};

request.exposeSocketMethods = function ( socket ) {
  [
    'on',
    'once',
    'off',
    'emit',
    'send'
  ].forEach( method => {
    request[method] = ( ...args ) => {
      socket[method].apply( socket, ...args );
    };
  });
};

export default request;
