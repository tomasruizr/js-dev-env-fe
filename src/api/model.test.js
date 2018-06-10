import { expect } from "chai";
import model from './model'
import fetchMock from "fetch-mock";

describe('model of some resource', function() {
    before(() => {
        require("isomorphic-fetch");
    })
    it('contains the http methods as functions', function() {
        expect(model.get).to.exist
        expect(model.post).to.exist
        expect(model.put).to.exist
        expect(model.patch).to.exist
        expect(model.delete).to.exist
    });
    it('contains headers, credentials, baseUrl, and url properties to exist', function() {
        expect(model.headers).to.exist    
        expect(model.credentials).to.exist    
        expect(model.baseUrl).to.exist    
        expect(model.url).to.exist    
    });
    it('contains default values for headers and credentials', function() {
        expect(model.headers).to.deep.equal({ "Content-Type": "application/json" })
        expect(model.credentials).to.equal("same-origin")
    });
    describe('methods', function() {
        before(() => {
            fetchMock.catch({});
            model.baseUrl='/'
            model.url = 'resources/'
        })
        after(fetchMock.restore);
        [ 
            'get',
            'post',
            'put',
            'patch',
            'delete'
        ].forEach(method => {
            it('call the methods for the model', function(done) {
                model[method]().then(() => {
                    let call = fetchMock.lastCall('/resources/', method.toUpperCase());
                    expect(call[0]).to.eq('/resources/')
                    expect(call[1].method).to.eq(method.toUpperCase())
                    done();
                })
            });
        })
        describe('get and delete', function() {
            [ 
                'get',
                'delete'
            ].forEach(method => {
                it('does not contain body', function(done) {
                    model[method]().then(() => {
                        let call = fetchMock.lastCall('/resources/', method.toUpperCase());
                        expect(call[0]).to.eq('/resources/')
                        expect(call[1].body).to.not.exist
                        done();
                    }).catch((err) => {
                        done(err)
                    })
                });
            });
            
        });
        describe('post, put, patch', function() {
            [ 
                'post',
                'put',
                'patch',
            ].forEach(method => {
                it(method + ' contains body', function (done) {
                    model[method]({name: 'some name'}).then(() => {
                        let call = fetchMock.lastCall('/resources/', method.toUpperCase());
                        expect(call[0]).to.eq('/resources/')
                        expect(call[1].body).to.exist
                        expect(call[1].body).to.equal(JSON.stringify({"name": "some name"}))
                        done()
                    }).catch((err) => {
                        done(err)
                    })
                });
            });
            
        });
        
    });
    describe('get with query', function() {
        before(() => {
            fetchMock.mock('/resources/', {}, {
                query: {
                  name: 'tomas'
                }
              });
        })
        after(fetchMock.restore);
        it('call the get api with query parameters', function(done) {
            model.get('?name=tomas').then(() => {
                let call = fetchMock.lastCall('/resources/', 'GET');
                expect(call[0]).to.eq('/resources/?name=tomas')
                expect(call[1].body).to.not.exist
                done()
            }).catch((err) => {
                done(err);
            })
        });
        
    });
    
    
});
