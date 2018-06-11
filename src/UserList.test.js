import { shallowMount } from '@vue/test-utils';
import UserList from './UserList.vue';
import { assert } from 'chai';
import { JSDOM } from 'jsdom';

describe('UserList.vue', () => {
  const wrapper = shallowMount(UserList);
  it('should have h1 that says Users', (done) => {
    const index = wrapper.html();
    let window = new JSDOM(index).window;
    const h1 = window.document.getElementsByTagName('h1')[0];
    assert.equal(h1.innerHTML, 'Users');
    done();
    window.close();
  });
});
