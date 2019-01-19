import { assert } from 'chai';
import Model from './model';
import fetchMock from 'fetch-mock';
import { createNew } from '@tomasruizr/trutils';

let model;
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
  it( 'contains headers, credentials, baseUrl, and url properties to exist', function() {
    assert.exists( model.headers );
    assert.exists( model.credentials );
    assert.exists( model.baseUrl );
    assert.exists( model.url );
  });
  it( 'contains default values for headers and credentials', function() {
    assert.deepEqual( model.headers, { 'Content-Type': 'application/json' });
    assert.equal( model.credentials, 'same-origin' );
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
  describe( 'methods', function() {
    before(() => {
      fetchMock.catch({});
      model.baseUrl = '/';
      model.url = 'resources/';
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
          let call = fetchMock.lastCall( '/resources/', method.toUpperCase());
          assert.equal( call[0], '/resources/' );
          assert.equal( call[1].method, method.toUpperCase());
          done();
        })
          .catch(( err ) => {
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
            let call = fetchMock.lastCall( '/resources/', method.toUpperCase());
            assert.equal( call[0], '/resources/' );
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
            let call = fetchMock.lastCall( '/resources/', method.toUpperCase());
            assert.equal( call[0], '/resources/' );
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
  describe( 'delete and get with query', function() {
    before(() => {
      fetchMock.mock( '/resources/', {}, {
        query: {
          name: 'tomas'
        }
      });
    });
    after( fetchMock.restore );
    [
      'get',
      'delete'
    ].forEach( method => {
      it( `call the ${method} api with query params`, function( done ) {
        model[method]( '?name=tomas' ).then(() => {
          let call = fetchMock.lastCall( '/resources/', method.toUpperCase());
          assert.equal( call[0], '/resources/?name=tomas' );
          assert.notExists( call[1].body );
          done();
        }).catch(( err ) => {
          done( err );
        });
      });
    });

  });
  describe( 'delete and get with an object as query', function() {
    before(() => {
      fetchMock.mock( '/resources/', {}, {
        query: {
          //   where: '%7B%22name%22%3A%7B%22contains%22%3A%22theodore%22%7D%7D'
          where: '{"name":{"contains":"theodore"}}'
        }
      });
    });
    after( fetchMock.restore );
    [
      'get',
      'delete'
    ].forEach( method => {
      it( `call the ${method} api with query params`, function( done ) {
        model[method]({
          where: '{"name":{"contains":"theodore"}}'
        }).then(() => {
          let call = fetchMock.lastCall( '/resources/', method.toUpperCase());
          assert.equal( call[0], '/resources/?where=%7B%22name%22%3A%7B%22contains%22%3A%22theodore%22%7D%7D' );
          assert.notExists( call[1].body );
          done();
        }).catch(( err ) => {
          done( err );
        });
      });
    });

  });
  describe( 'delete and get with id', function() {
    before(() => {
      fetchMock.mock( '/resources/12', {});
    });
    after( fetchMock.restore );
    [
      'get',
      'delete'
    ].forEach( method => {
      it( `call the ${method} api with id`, function( done ) {
        model[method]( 12 ).then(() => {
          let call = fetchMock.lastCall( '/resources/12', method.toUpperCase());
          assert.equal( call[0], '/resources/12' );
          assert.notExists( call[1].body );
          done();
        }).catch(( err ) => {
          done( err );
        });
      });
    });
  });


});
