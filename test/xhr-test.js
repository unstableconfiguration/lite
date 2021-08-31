import { xhr } from '../app/xhr.js'
let assert = chai.assert;

let tests = {
    get : 'https://httpbin.org/get', //'./xhr-test/get-test.txt',
    fake : './does/not/matter.txt',
    post : 'https://httpbin.org/post',
    put : 'https://httpbin.org/put'
}

/* In-Browser tests for non-node utilities */
describe('xhr tests', function() { 
    describe('.open', function() { 

        it('should successfully execute a GET request', function(done) {            
            let request = xhr.open(tests.get, {
                onreadystatechange : function(r) {
                    if(request.readyState == 4 && request.status == 200) {
                        done();
                    }
                }
            });

            request.send();
        });
        it('should return an unsent XMLHttpRequest object', function() { 
            let request = xhr.open(tests.fake);
            assert(request instanceof XMLHttpRequest);
            assert(request.readyState == 1);
        });

        it('should allow for setting of XMLHttpRequest events', function(done) {
            let request = xhr.open(tests.get, { 
                load : function() { 
                    done();
                }
            });
            request.send();
        });

        it('should return a "thennable" interface', function() { 
            let request = xhr.open(tests.fake, { 
                load : function() {},
                error : function() {}
            });
            assert(typeof(request.then) == 'function');
            assert(typeof(request.catch) == 'function');
        });

        it('should send when .then() is called', function(done) {
            xhr.open(tests.get)
                .then(r => { 
                    // what is response
                    done(); 
                });
        });

        it('should throw an error when .then() fails', function(done) {
            xhr.get(tests.fake, { timeout : 50 })
                .then(r => {  return null; })
                .error(e => { 
                    done(); 
                });
        });

        it('should add headers if they are included in the args', function(done) { 
            xhr.post(tests.post, "test", {
                headers : [
                    { header : 'Content-Type', value : 'application/json' }
                ]
            }).then(r => { 
                let response = JSON.parse(r); 
                assert(response.headers["Content-Type"] == 'application/json');
                done();
            });
        });
    });

    describe('method wrappers', function() { 
        it('should send data with a POST request', function(done) {
            xhr.post(tests.post, JSON.stringify({ test : 'a' }))
                .then(r => {
                    // response echoes our data back at us in .data object
                    let response = JSON.parse(r);
                    assert(JSON.parse(response.data).test == 'a');
                    done();;
                })
                .error(e => console.log(e));
        });

        it('should send data with a PUT request', function(done) { 
            xhr.put(tests.put, JSON.stringify({ test : 'b'}))
                .then(r => { 
                    let response = JSON.parse(r);
                    assert(JSON.parse(response.data).test == 'b');
                    done();
                });
        });
    });
});


