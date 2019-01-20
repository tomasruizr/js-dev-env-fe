import { assert } from 'chai';
import { getApiServer } from './urlManager';
import env from '../../config';

describe( 'apiServer', function() {
  it( 'returns env.staticData if useStatic is passed as true', function() {
    let base;
    base = getApiServer( 'https://example.org/?useStaticData=true' );
    assert.equal( env.staticData, base );
    base = getApiServer( 'https://example.org/?asdfds&useStaticData=true' );
    assert.equal( env.staticData, base );
  });
  it( 'returns env.apiServer if useStatic not passed', function() {
    let base = getApiServer( 'https://example.org/' );
    assert.equal( env.apiServer, base );
  });
  it( 'returns env.apiServer if passed as false', function() {
    let base = getApiServer( 'https://example.org/?useStaticData=false' );
    assert.equal( env.apiServer, base );
  });
  it( 'returns env.apiServer if passed without value', function() {
    let base = getApiServer( 'https://example.org/?useStaticData' );
    assert.equal( env.apiServer, base );
  });


});
