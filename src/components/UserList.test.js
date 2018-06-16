import { shallowMount } from '@vue/test-utils';
import { assert } from 'chai';
import { JSDOM } from 'jsdom';
import fetchMock from 'fetch-mock';
fetchMock.getOnce( '*', []);
import UserList from './UserList.vue';
describe( 'UserList.vue', () => {
  const wrapper = shallowMount( UserList );
  it( 'should have h1 that says Users', ( done ) => {
    const index = wrapper.html();
    let window = new JSDOM( index ).window;
    const h1 = window.document.getElementsByTagName( 'h1' )[0];
    assert.equal( h1.innerHTML, 'Users' );
    done();
    window.close();
  });
});
  
fetchMock.restore();