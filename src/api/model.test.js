import { assert } from 'chai';
import Model from './model';
import fetchMock from 'fetch-mock';
import { createNew } from '@tomasruizr/trutils';

let model;

describe( 'model constructor', function() {
  it( 'accepts options for model configuration', () => {
    const model = createNew( Model, {
      headers: 'some headers',
      credentials: 'some creadentials',
      apiServer: 'some apiserver',
      url: 'some url'
    });

    assert.equal( model.headers, 'some headers' );
    assert.equal( model.credentials, 'some creadentials' );
    assert.equal( model.apiServer, 'some apiserver' );
    assert.equal( model.url, 'some url' );

  });
});

describe( 'model of some resource', function() {
  before(() => {
    fetchMock.mock( '*', {});
    model = createNew( Model );
  });
  after( fetchMock.restore );
  it( 'contains the http methods as functions', function() {
    assert.exists( model.get );
    assert.exists( model.post );
    assert.exists( model.put );
    assert.exists( model.patch );
    assert.exists( model.delete );
  });
  it( 'contains headers, credentials, apiServer, and url properties to exist', function() {
    assert.exists( model.headers );
    assert.exists( model.credentials );
    assert.exists( model.apiServer );
    assert.exists( model.url );
  });
  it( 'contains default values for headers and credentials', function() {
    assert.deepEqual( model.headers, { 'Content-Type': 'application/json' });
    assert.equal( model.credentials, 'include' );
  });
  describe( 'onSuccess', function() {
    it( 'should throw the error of the response if it reaches success function', function() {
      let onSuccess = global.moduleTests.modeljs.onSuccess;
      let response = {
        status: 400,
        statusText: 'There was a problem'
      };
      try{
        onSuccess( response );
        assert( false, 'you should not be here, throw fail.' );
      } catch ( e ){
        assert.equal( e.message, 'There was a problem' );
      }
    });

  });
  describe( 'onError', function() {
    it( 'should throw the error of the response', function() {
      let onError = global.moduleTests.modeljs.onError;
      try{
        onError( new Error( 'the error' ));
        assert( false, 'you should not be here, throw fail.' );
      } catch ( e ){
        assert.equal( e.message, 'the error' );
      }
    });

  });
  describe( 'methods with custom options', function() {
    before(() => {
      fetchMock.restore();
      fetchMock.mock( '*', {});
      // fetchMock.catch({});
      model.apiServer = '';
      model.url = '/resources';
    });
    after( fetchMock.restore );
    [
      'get',
      'post',
      'put',
      'patch',
      'delete'
    ].forEach( method => {
      it( `call the method ${method} for the model with custom options`, ( done ) => {
        model[method]( undefined, {
          headers: 'some Headers',
          credentials: 'some credentials'
        }).then(() => {
          let call = fetchMock.lastCall( '/resources', method.toUpperCase());
          assert.equal( call[0], '/resources' );
          assert.equal( call[1].method, method.toUpperCase());
          assert.equal( call[1].headers, 'some Headers', );
          assert.equal( call[1].credentials, 'some credentials' );
          done();
        }).catch(( err ) => {
          done( err );
        });
      });
    });
  });
  describe( 'methods', function() {
    before(() => {
      fetchMock.restore();
      fetchMock.mock( '*', {});
      // fetchMock.catch({});
      model.apiServer = '';
      model.url = '/resources';
    });
    after( fetchMock.restore );
    [
      'get',
      'post',
      'put',
      'patch',
      'delete'
    ].forEach( method => {
      it( `call the method ${method} for the model`, function( done ) {
        model[method]().then(() => {
          let call = fetchMock.lastCall( '/resources', method.toUpperCase());
          assert.equal( call[0], '/resources' );
          assert.equal( call[1].method, method.toUpperCase());
          done();
        }).catch(( err ) => {
          done( err );
        });
      });
    });

    describe( 'get and delete', function() {
      [
        'get',
        'delete'
      ].forEach( method => {
        it( 'does not contain body', function( done ) {
          model[method]().then(() => {
            let call = fetchMock.lastCall( '/resources', method.toUpperCase());
            assert.equal( call[0], '/resources' );
            assert.notExists( call[1].body );
            done();
          }).catch(( err ) => {
            done( err );
          });
        });
      });

    });
    describe( 'post, put, patch', function() {
      [
        'post',
        'put',
        'patch',
      ].forEach( method => {
        it( `${method } contains body`, function ( done ) {
          model[method]({ name: 'some name' }).then(() => {
            let call = fetchMock.lastCall( '/resources', method.toUpperCase());
            assert.equal( call[0], '/resources' );
            assert.exists( call[1].body );
            assert.equal( call[1].body, JSON.stringify({ name: 'some name' }));
            done();
          }).catch(( err ) => {
            done( err );
          });
        });
      });
    });

  });
  describe( 'delete and get with an object as query', function() {
    before(() => {
      fetchMock.catch({});
      fetchMock.mock( '/resources', {}, {
        query: {
          //   filter: '%7B%22name%22%3A%7B%22contains%22%3A%22theodore%22%7D%7D'
          filter: '{"name":{"contains":"theodore"}}'
        }
      });
    });
    after( fetchMock.restore );
    [
      'get',
      'delete'
    ].forEach( method => {
      it( `call the ${method} api with query params as stringify object`, function( done ) {
        model[method]({
          filter: '{"name":{"contains":"theodore"}}'
        }).then(() => {
          let call = fetchMock.lastCall( '/resources', method.toUpperCase());
          assert.equal( call[0], '/resources?filter=%7B%22name%22%3A%7B%22contains%22%3A%22theodore%22%7D%7D' );
          assert.notExists( call[1].body );
          done();
        }).catch(( err ) => {
          done( err );
        });
      });
    });
    [
      'get',
      'delete'
    ].forEach( method => {
      it( `call the ${method} api with query params as object with no filter prop`, function( done ) {
        model[method]({ name:{ contains:'theodore' }})
          .then(() => {
            let call = fetchMock.lastCall( '/resources', method.toUpperCase());
            assert.equal( call[0], '/resources?filter=%7B%22name%22%3A%7B%22contains%22%3A%22theodore%22%7D%7D' );
            assert.notExists( call[1].body );
            done();
          }).catch(( err ) => {
            done( err );
          });
      });
    });
    [
      'get',
      'delete'
    ].forEach( method => {
      it( `call the ${method} api with query params as object with filter prop`, function( done ) {
        model[method]({
          filter: { name:{ contains:'theodore' }}
        }).then(() => {
          let call = fetchMock.lastCall( '/resources', method.toUpperCase());
          assert.equal( call[0], '/resources?filter=%7B%22name%22%3A%7B%22contains%22%3A%22theodore%22%7D%7D' );
          assert.notExists( call[1].body );
          done();
        }).catch(( err ) => {
          done( err );
        });
      });
    });
    [
      'get',
      'delete'
    ].forEach( method => {
      it( `call the ${method} api with query params as something not object will throw`, function() {
        try{
          model[method]( 1 );
          assert( false, 'integer' );
        }catch( e ){
          assert.equal( e.message, 'the query parameters should be an object' );
        }
        try{
          model[method]( 'asdf' );
          assert( false, 'string' );
        }catch( e ){
          assert.equal( e.message, 'the query parameters should be an object' );
        }
        try{
          model[method]( new Date());
          assert( false, 'date' );
        }catch( e ){
          assert.equal( e.message, 'the query parameters should be an object' );
        }
        try{
          model[method]( 1.23 );
          assert( false, 'double' );
        }catch( e ){
          assert.equal( e.message, 'the query parameters should be an object' );
        }
        try{
          model[method](['name']);
          assert( false, 'array' );
        }catch( e ){
          assert.equal( e.message, 'the query parameters should be an object' );
        }
        try{
          model[method]( true );
          assert( false, 'boolean' );
        }catch( e ){
          assert.equal( e.message, 'the query parameters should be an object' );
        }

      });
    });
  });
});
