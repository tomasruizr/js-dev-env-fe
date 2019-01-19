import socketClient from 'socket.io-client';
const request = {};
let socket, io;

request.init = function ( options_ = {}) {
  io = options_.io || socketClient;
  request.options = options_;
  if ( !options_.baseUrl ) throw new Error( 'No baseUrl specified for the request Library' );
  if ( options_.noSocket !== true )
    request.socketConnect( options_.baseUrl, options_.nsp );
};

request.socketConnect = function ( baseUrl, nsp ) {
  nsp = nsp ? `/${nsp}` : '';
  socket = io( `${baseUrl}${nsp}`, {
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

[
  'get',
  'post',
  'put',
  'patch',
  'delete'
].forEach( method => {
  request[method] = function ( uri, options = {}) {
    const noBase = options.urlPassThrough;
    delete options.urlPassThrough;
    options = {
      method: method,
      isSocket: false
      // headers: {},
      // credentials: {},
      ,
      ...options
    };
    if ( options.isSocket && !options.noSocket && !noBase ) {
      const params = [`VR:${method}:${uri}`];
      if ( options.body ) params.push( options.body );
      return new Promise( resolve => socket.emit.call( socket, ...params, resolve ));
    } else {
      uri = noBase ? uri : `${request.options.baseUrl}${uri}`;
      return fetch( uri, options );
    }
  };
});

export default request;
