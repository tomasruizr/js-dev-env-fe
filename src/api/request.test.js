const { assert } = require( 'chai' );
import fetchMock from 'fetch-mock';
const sinon = require( 'sinon' );

describe( 'request module', function() {
  describe( 'init', function() {
    let request;
    beforeEach(() => {
      request = require( './request' ).default;
      sinon.stub( request, 'socketConnect' );
    });
    afterEach(() => {
      request.socketConnect.restore();
    });
    it( 'throws an exeption if no baseUrl',() => {
      try{
        request.init();
        assert( false );
      } catch( e ){
        assert.equal( e.message, 'No baseUrl specified for the request Library' );
      }
    });
    it( 'calls socketConnect', () => {
      request.init({ baseUrl:'asdf' });
      assert.equal( request.socketConnect.calledOnce, true );
    });
    it( 'does not calls socketConnect of options.noSocket === true', () => {
      request.init({ baseUrl:'asdf', noSocket:true });
      assert.equal( request.socketConnect.notCalled, true );
    });
  });
  describe( 'socketConnect()', function() {
    let request;
    let spies = {
      socket : {
        once: function(){}
      },
      io: function (){ return spies.socket; }
    };
    it( 'instantiates io with an url and options object with transport', () => {
      request = require( './request' ).default;
      sinon.spy( spies, 'io' );
      sinon.spy( spies.socket, 'once' );
      request.init({ io: spies.io, baseUrl: 'baseUrl' });
      assert.equal( spies.io.args[0][0], 'baseUrl', 'io is not invoked with the right baseUrl/nsp' );
      assert.deepEqual( spies.io.args[0][1], {
        transports: [ 'websocket', 'polling' ]
      }, 'io not invoked with the right object with transports with websocket and polling' );
      assert.isTrue( spies.socket.once.calledOnce, 'socket.once not called once' );
      spies.io.restore();
      spies.socket.once.restore();

    });
    it( 'instantiates io with an url/nsp', () => {
      request = require( './request' ).default;
      sinon.spy( spies, 'io' );
      request.init({ io: spies.io, baseUrl: 'baseUrl', nsp:'nsp' });
      assert.equal( spies.io.args[0][0], 'baseUrl/nsp', 'io is not invoked with the right baseUrl/nsp' );
      spies.io.restore();
    });
  });
  describe( 'exposeSocketMethods()', function() {
    let request;
    let spies = {
      socket : {
        on: sinon.spy(),
        off: sinon.spy(),
        emit: sinon.spy(),
        send: sinon.spy(),
        get: sinon.spy(),
        post: sinon.spy(),
        put: sinon.spy(),
        patch: sinon.spy(),
        delete: sinon.spy(),
        once: sinon.spy()
      },
      io: function (){ return spies.socket; }
    };
    it( 'augment all the socket methods', () => {
      request = require( './request' ).default;
      request.init({ io: spies.io, baseUrl: 'baseUrl', nsp:'nsp' });
      request.exposeSocketMethods( spies.socket );
      [ 'once', 'on', 'off', 'emit', 'send' ]
        .forEach( method=>{
          spies.socket[method].resetHistory();
          assert.exists( request[method] , `${method} does not exists in request` );
          request[method]();
          assert.isTrue( spies.socket[method].calledOnce, `${method} was not called once` );
        });
    });
    it ( 'augment all the fetch methods for http', () => {
      fetchMock.mock( '*', {});
      request = require( './request' ).default;
      request.init({ io: spies.io, baseUrl: 'baseUrl', nsp:'nsp' });
      request.exposeSocketMethods( spies.socket );
      spies.socket.once.resetHistory();
      [ 'get', 'post', 'put', 'patch', 'delete' ]
        .forEach( method=>{
          spies.socket[method].resetHistory();
          assert.exists( request[method] , `${method} does not exists in request` );
          request[method]();
          const lastCall = fetchMock.lastCall();
          assert.deepEqual( lastCall[1], { method, isSocket: false });
        });
      fetchMock.restore();
    });
    it( 'formats the url with the baseUrl using fetch', () => {
      fetchMock.mock( '*', {});
      request = require( './request' ).default;
      request.init({ io: spies.io, baseUrl: 'baseUrl', nsp:'nsp' });
      request.exposeSocketMethods( spies.socket );
      spies.socket.once.resetHistory();
      [ 'get', 'post', 'put', 'patch', 'delete' ]
        .forEach( method=>{
          spies.socket[method].resetHistory();
          assert.exists( request[method] , `${method} does not exists in request` );
          request[method]( '/someUrl' );
          const lastCall = fetchMock.lastCall();
          assert.equal( lastCall[0], 'baseUrl/someUrl' );
        });
      fetchMock.restore();
    });
    it( 'calls an external url using fetch', () => {
      fetchMock.mock( '*', {});
      request = require( './request' ).default;
      request.init({ io: spies.io, baseUrl: 'baseUrl', nsp:'nsp' });
      request.exposeSocketMethods( spies.socket );
      spies.socket.once.resetHistory();
      [ 'get', 'post', 'put', 'patch', 'delete' ]
        .forEach( method=>{
          spies.socket[method].resetHistory();
          assert.exists( request[method] , `${method} does not exists in request` );
          request[method]( 'someUrl', { urlPassThrough:true });
          const lastCall = fetchMock.lastCall();
          assert.equal( lastCall[0], 'someUrl' );
        });
      fetchMock.restore();
    });
    it( 'calls an external url using fetch even if isSocket=true', () => {
      fetchMock.mock( '*', {});
      request = require( './request' ).default;
      request.init({ io: spies.io, baseUrl: 'baseUrl', nsp:'nsp' });
      request.exposeSocketMethods( spies.socket );
      spies.socket.once.resetHistory();
      [ 'get', 'post', 'put', 'patch', 'delete' ]
        .forEach( method=>{
          spies.socket[method].resetHistory();
          assert.exists( request[method] , `${method} does not exists in request` );
          request[method]( 'someUrl', { urlPassThrough:true, isSocket:true });
          const lastCall = fetchMock.lastCall();
          assert.equal( lastCall[0], 'someUrl' );
        });
      fetchMock.restore();
    });
    it( 'augment all the fetch methods for socket', () => {
      request = require( './request' ).default;
      request.init({ io: spies.io, baseUrl: 'baseUrl', nsp:'nsp' });
      request.exposeSocketMethods( spies.socket );
      [ 'get', 'post', 'put', 'patch', 'delete' ]
        .forEach( method=>{
          spies.socket.emit.resetHistory();
          assert.exists( request[method] , `${method} does not exists in request` );
          request[method]( 'myUrl', { isSocket:true });
          assert.equal( spies.socket.emit.args[0][0], `VR:${method}:myUrl` );
        });
      fetchMock.restore();
    });
    it( 'augment all the fetch methods for socket with body', () => {
      request = require( './request' ).default;
      request.init({ io: spies.io, baseUrl: 'baseUrl', nsp:'nsp' });
      request.exposeSocketMethods( spies.socket );
      [ 'get', 'post', 'put', 'patch', 'delete' ]
        .forEach( method=>{
          spies.socket.emit.resetHistory();
          assert.exists( request[method] , `${method} does not exists in request` );
          request[method]( 'myUrl', { isSocket:true, body:{ name:'someName' }});
          assert.equal( spies.socket.emit.args[0][0], `VR:${method}:myUrl` );
          assert.deepEqual( spies.socket.emit.args[0][1], { name:'someName' });
        });
      fetchMock.restore();
    });
  });

});
