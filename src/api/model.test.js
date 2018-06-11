import { expect } from 'chai';
import model from './model';
import fetchMock from 'fetch-mock';

describe('model of some resource', function() {
    it('contains the http methods as functions', function() {
        expect(model.get).to.exist;
        expect(model.post).to.exist;
        expect(model.put).to.exist;
        expect(model.patch).to.exist;
        expect(model.delete).to.exist;
    });
    it('contains headers, credentials, baseUrl, and url properties to exist', function() {
        expect(model.headers).to.exist;    
        expect(model.credentials).to.exist;    
        expect(model.baseUrl).to.exist;    
        expect(model.url).to.exist;    
    });
    it('contains default values for headers and credentials', function() {
        expect(model.headers).to.deep.equal({ 'Content-Type': 'application/json' });
        expect(model.credentials).to.equal('same-origin');
    });
    describe('methods', function() {
        before(() => {
            fetchMock.catch({});
            model.baseUrl='/';
            model.url = 'resources/';
        });
        after(fetchMock.restore);
        [ 
            'get',
            'post',
            'put',
            'patch',
            'delete'
        ].forEach(method => {
            it(`call the method ${method} for the model`, function(done) {
                model[method]().then(() => {
                    let call = fetchMock.lastCall('/resources/', method.toUpperCase());
                    expect(call[0]).to.eq('/resources/');
                    expect(call[1].method).to.eq(method.toUpperCase());
                    done();
                })
                .catch((err) => {
                    done(err);
                });
            });
        });
        describe('get and delete', function() {
            [ 
                'get',
                'delete'
            ].forEach(method => {
                it('does not contain body', function(done) {
                    model[method]().then(() => {
                        let call = fetchMock.lastCall('/resources/', method.toUpperCase());
                        expect(call[0]).to.eq('/resources/');
                        expect(call[1].body).to.not.exist;
                        done();
                    }).catch((err) => {
                        done(err);
                    });
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
                        expect(call[0]).to.eq('/resources/');
                        expect(call[1].body).to.exist;
                        expect(call[1].body).to.equal(JSON.stringify({name: 'some name'}));
                        done();
                    }).catch((err) => {
                        done(err);
                    });
                });
            });
            
        });
        
    });
    describe('delete and get with query', function() {
        before(() => {
            fetchMock.mock('/resources/', {}, {
                query: {
                  name: 'tomas'
                }
              });
        });
        after(fetchMock.restore);
        [ 
            'get',
            'delete'
        ].forEach(method => {
            it(`call the ${method} api with query params`, function(done) {
                model[method]('?name=tomas').then(() => {
                    let call = fetchMock.lastCall('/resources/', method.toUpperCase());
                    expect(call[0]).to.eq('/resources/?name=tomas');
                    expect(call[1].body).to.not.exist;
                    done();
                }).catch((err) => {
                    done(err);
                });
            });
        });
        
    });
    describe('delete and get with an object as query', function() {
        before(() => {
            fetchMock.mock('/resources/', {}, {
                query: {
                //   where: '%7B%22name%22%3A%7B%22contains%22%3A%22theodore%22%7D%7D'
                  where: '{"name":{"contains":"theodore"}}'
                }
              });
        });
        after(fetchMock.restore);
        [ 
            'get',
            'delete'
        ].forEach(method => {
            it(`call the ${method} api with query params`, function(done) {
                model[method]({
                        where: '{"name":{"contains":"theodore"}}'
                    }).then(() => {
                    let call = fetchMock.lastCall('/resources/', method.toUpperCase());
                    expect(call[0]).to.eq('/resources/?where=%7B%22name%22%3A%7B%22contains%22%3A%22theodore%22%7D%7D');
                    expect(call[1].body).to.not.exist;
                    done();
                }).catch((err) => {
                    done(err);
                });
            });
        });
        
    });
    describe('delete and get with id', function() {
        before(() => {
            fetchMock.mock('/resources/12', {});
        });
        after(fetchMock.restore);
        [ 
            'get',
            'delete'
        ].forEach(method => {
            it(`call the ${method} api with id`, function(done) {
                model[method](12).then(() => {
                    let call = fetchMock.lastCall('/resources/12', method.toUpperCase());
                    expect(call[0]).to.eq('/resources/12');
                    expect(call[1].body).to.not.exist;
                    done();
                }).catch((err) => {
                    done(err);
                });
            });
        });
    });
    
    
});
