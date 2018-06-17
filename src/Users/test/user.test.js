import { assert } from 'chai';
import user from '../userModel';
import fetchMock from 'fetch-mock';

describe( 'user model', function() {
  before(() => {
    fetchMock.mock( '*', {});
    // fetchMock.catch({});
    user.baseUrl = '/';
  });
  after( fetchMock.restore );
  it( 'contains the http methods as functions in the model', function() {
    assert.exists( user.get );
    assert.exists( user.post );
    assert.exists( user.put );
    assert.exists( user.patch );
    assert.exists( user.delete );
  });
  [ 
    'get',
    'post',
    'put',
    'patch',
    'delete'
  ].forEach( method => {
    it( `maps correctly the function ${method} and the http method ${method.toUpperCase()}`, ( done ) => {
      user[method]().then(() => {
        let call = fetchMock.lastCall( '/user/', method.toUpperCase());
        assert.equal( call[0], '/user/' );
        assert.equal( call[1].method, method.toUpperCase());
        done();
      })
        .catch(( err ) => {
          done( err );
        });
    });
  });
        
});

