import { XHR, xhr } from '../xhr.js';

export let XHRTest = function() {
    let assert = chai.assert;

    describe('XHR tests', function() { 
        describe('xhr.get() tests', function() { 
            it('should fetch text data from an external resource', function(done) { 
                xhr.get('../tests/xhr-test/xhr-test.txt')
                    .then(r => {
                        assert(r == 'test');
                        done();
                    });
            });

            // fetch script or alternative data type?

            it('should return an unsent XMLHttpRequest object');

            it('should allow for setting of XMLHttpRequest events', function(done) {
                let request = xhr.get('../tests/xhr-test/xhr-test.txt', { 
                    load : function() { 
                        console.log(request.response);
                        done();
                    }, 
                    catch : function() { 
                        console.log('you done fucked up');
                        done();
                    }
                });
                console.log(request);
                request.send();
            });

            it('should return a "thennable" interface');

            it('should send when .then() is called')

        });
        
        it('should do stuff')

    });

}