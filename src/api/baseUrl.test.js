import { assert } from 'chai';
import getBaseUrl from './baseUrl';
import env from '../../config/env';

describe( 'baseUrl', function() {
  it( 'returns env.staticData if useStatic is passed as true', function() {
    let base;
    base = getBaseUrl( 'https://example.org/?useStaticData=true' );
    assert.equal( env.staticData, base );
    base = getBaseUrl( 'https://example.org/?asdfds&useStaticData=true' );
    assert.equal( env.staticData, base );
  });
  it( 'returns env.api if useStatic not passed', function() {
    let base = getBaseUrl( 'https://example.org/' );
    assert.equal( env.api, base );
  });
  it( 'returns env.api if passed as false', function() {
    let base = getBaseUrl( 'https://example.org/?useStaticData=false' );
    assert.equal( env.api, base );
  });
  it( 'returns env.api if passed without value', function() {
    let base = getBaseUrl( 'https://example.org/?useStaticData' );
    assert.equal( env.api, base );
  });
  
  
});
