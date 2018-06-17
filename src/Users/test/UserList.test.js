import { shallowMount } from '@vue/test-utils';
import { assert } from 'chai';
import fetchMock from 'fetch-mock';
import sinon from 'sinon';
import cheerio from 'cheerio';

fetchMock.getOnce( '*', []);
import UserList from '../UserList.vue';
import user from '../userModel';
let get, del;
describe( 'UserList.vue', function() {
  const wrapper = shallowMount( UserList );
  before(() => {
    get = sinon.stub( user, 'get' ).callsFake(() => {
      return new Promise(( resolve ) => {
        resolve([{ id: 1,firstName:'Bob',lastName:'Smith',email:'bob@gmail.com' }]);
      });
    });
    del = sinon.stub( user, 'delete' ).callsFake(() => {
      return new Promise(( resolve ) => {
        resolve({ id: 1,firstName:'Bob',lastName:'Smith',email:'bob@gmail.com' });
      });
    });
  });
  after(() => {
    get.restore();
    del.restore();
  });
  it( 'Is Loaded has a h1 tag that says Users', () => {
    let $ = cheerio.load( wrapper.html());
    let h1 = $( 'h1' )[0].childNodes[0];
    assert.equal( h1.data, 'Users' );
  });
  
  describe( 'getUsers', function() {
    it( 'should call user.get', function () {
      wrapper.vm.getUsers();
      assert.equal( get.callCount, 1 );
    });
    it( 'has a td with the details of the user', function(){
      wrapper.vm.getUsers();
      const index = wrapper.html();
      let $ = cheerio.load( index );
      let tr = $( '#users' )[0].childNodes[0].childNodes;
      assert.equal( tr[0].childNodes[0].childNodes[0].data, 'Delete' );
      assert.equal( tr[2].childNodes[0].data, 1 );
      assert.equal( tr[4].childNodes[0].data, 'Bob' );
      assert.equal( tr[6].childNodes[0].data, 'Smith' );
      assert.equal( tr[8].childNodes[0].data, 'bob@gmail.com' );
    });
  });
  describe( 'delete users', function() {
    it( 'should call user.get', function () {
      wrapper.vm.deleteUser( 1, 0 );
      assert.equal( del.callCount, 1 );
    });
    it( 'empties the user list after deletion', function(){
      wrapper.vm.getUsers();
      const index = wrapper.html();
      let $ = cheerio.load( index );
      let tr = $( '#users' )[0].childNodes;
      assert.typeOf( tr, 'array' );
      assert.deepEqual( tr, []);
    });
  });
});
  
fetchMock.restore();