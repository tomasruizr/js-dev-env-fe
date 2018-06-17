import { assert } from 'chai';
import { JSDOM } from 'jsdom';
import fs from 'fs';

describe( 'index.html', () => {
  it( 'should have h1 that says Users', ( done ) => {
    const index = fs.readFileSync( './src/index.html', 'utf-8' );
    let window = new JSDOM( index ).window;
    const h1 = window.document.getElementsByTagName( 'h1' )[0];
    assert.equal( h1.innerHTML, 'Users' );
    done();
    window.close();
  });
});
