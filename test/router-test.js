import { router } from '../app/router.js';
let assert = chai.assert;

describe('Router Tests', function() { 

    describe('onHashChange tests', function() {
       
         it('should trigger custom onHashChange event when window hash changes', function(done) { 
            router.onHashChange = function(value) {
                done();
                window.onhashchange = null
            }            
            window.onhashchange();
        });
        
        it('should return path.value if a path.pattern matches location.hash', function(done) { 
            router.onHashChange = function(value) { value(); }
            router.addRoute({ 
                route : 'test/path',
                value : function() { 
                    done();
                    window.onhashchange = null;
                    window.location.hash = '';
                }
            });
            
            window.location.hash = 'test/path';
            window.onhashchange();
        });
    });
    

    describe('path.hash parsing / pattern matching tests', function() {
        it('should escape special characters', function() { 
            let pattern = router.getPathRegex('testing()');
            assert(pattern.test('testing()'))
        });
        
        it('should convert a path string to a regex when getHashRegex is called', function() {
            let pattern = router.getPathRegex('test/path');
            assert(pattern.test('test/path'));
        });

        it('should allow for path wildcards when {braces} are used in the path', function() {
            let pattern = router.getPathRegex('test/path/{id}');
            assert(pattern.test('test/path/wildcard'));
        });
    });

    describe('URLSearchParameter parsing tests', function() { 
        it('should parse url parameters into object when getSearchParams is called', function() { 
            let parsed = router.getSearchParams("?key1=val1&key2=val2");
            assert(parsed.key1 == "val1");
        });

        it('should convert "amp;" to "&" when location.hash is used', function() { 
            let parsed = router.getSearchParams("?key1=val1&amp;key2=val2");
            assert(parsed.key2 == 'val2');
        });
    });

});
