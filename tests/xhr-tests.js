import { XHR, xhr } from '../src/xhr.js';

export let XHRTests = function() {
    let assert = chai.assert;

    describe('XHR tests', function() { 
        describe('xhr.init() tests', function() { 
            it('should fetch text data from an external resource', function(done) { 
                let request = xhr.init('../tests/xhr-test/xhr-test.txt', {
                    load : function(r) {
                        assert(request.response == 'test');
                        done();
                    }
                });
                request.send();
            });

            it('should return an unsent XMLHttpRequest object', function(done) { 
                let request = xhr.init('../does/not/really/matter');
                assert(request instanceof XMLHttpRequest);
                setTimeout(()=>{
                    assert(request.readyState == 1);
                    done();
                }, 5);
            });

            it('should allow for setting of XMLHttpRequest events', function(done) {
                let request = xhr.init('../tests/xhr-test/xhr-test.txt', { 
                    load : function() { 
                        done();
                    }
                });
                request.send();
            });

            it('should return a "thennable" interface', function() { 
                let request = xhr.init('../xyz', { 
                    load : function() {},
                    error : function() {}
                });
                assert(typeof(request.then) == 'function');
                assert(typeof(request.catch) == 'function');
            });

            it('should send when .then() is called', function(done) {
                xhr.init('../tests/xhr-test/xhr-test.txt')
                    .then(r => { done(); });
            });

        });
    });
}