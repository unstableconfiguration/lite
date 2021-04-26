import { Router } from '../src/router.js';

export let RouterTests = function() {
    let assert = chai.assert;
    describe('Router Tests', function() { 
        it('should trigger custom onHashChange event when window hash changes', function(done) { 
            return done();
            new Router({
                onHashChange : function() { 
                    done(); 
                    window.onhashchange = null;
                }
            });
            window.onhashchange();
        });

        it('should return path value if location hash matches path pattern', function(done) { 
            new Router({
                onHashChange : function(hash, value) {
                    value();
                },
                paths : [
                    { 
                        hash : 'test/path', 
                        value : function() { 
                            done();
                            window.onhashchange = null;
                            window.location.hash = '';
                        } 
                    }
                ]
            });
            window.location.hash = 'test/path';
            window.onhashchange();
        });

        it('should parse url parameters into object when getSearchParams is called', function() { 
            let router = new Router();
            window.onhashchange = null;
            let parsed = router.getSearchParams("?key1=val1&key2=val2");
            assert(parsed.key1 == "val1");
        });

        it('should escape special characters', function() { 
            let router = new Router(); 
            window.onhashchange = null;
            let pattern = router.getHashRegex('testing()');
            window.pattern = pattern;
            assert(pattern.test('#testing()'))
        });

        it('should convert a path string to a regex when getHashRegex is called', function() {
            let router = new Router();
            window.onhashchange = null;
            let pattern = router.getHashRegex('test/path');
            assert(pattern.test('#test/path'));
        });

        it('should allow for path wildcards when {braces} are used in the path', function() {
            let router = new Router();
            window.onhashchange = null;
            let pattern = router.getHashRegex('test/path/{id}');
            assert(pattern.test('#test/path/wildcard'));
        });

    });
}