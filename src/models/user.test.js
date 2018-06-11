import { expect } from "chai";
import user from './user'
import fetchMock from "fetch-mock";

describe('user model', function() {
    before(() => {
        require("isomorphic-fetch");
        fetchMock.catch({});
        user.baseUrl='/'
    })
    after(fetchMock.restore);
    it('contains the http methods as functions in the model', function() {
        expect(user.get).to.exist
        expect(user.post).to.exist
        expect(user.put).to.exist
        expect(user.patch).to.exist
        expect(user.delete).to.exist
    });
    [ 
        'get',
        'post',
        'put',
        'patch',
        'delete'
    ].forEach(method => {
        it(`maps correctly the function ${method} and the http method ${method.toUpperCase()}`, (done) => {
            user[method]().then(() => {
                let call = fetchMock.lastCall('/user/', method.toUpperCase());
                expect(call[0]).to.eq('/user/')
                expect(call[1].method).to.eq(method.toUpperCase())
                done();
            })
            .catch((err) => {
                done(err);
            })
        });
    })
        
});

