import { lite } from '../app/lite.js';
let assert = chai.assert;


describe('lite tests', function() { 

    describe('initialization', function() { 
        it('should allow properties to be set via .extend()', function(done) {
            let vm = lite.extend({ 
                initialize : function() { 
                    assert(this.test === 'a');
                    done(); 
                },
                test : 'a'
            });
            new vm();
        });
        
        it('should allow properties to be set via new()', function(done) {
            let vm = lite.extend();
            new vm({
                initialize : function() { 
                    assert(this.test === 'b');
                    done(); 
                },
                test : 'b'
            });
        });
        
        it('should execute initialize() during new() but not during .extend', function(done) {
            let vm = lite.extend({ initialize : () => assert(false) });
            new vm({ initialize : done });
        });

    });

    let div = () => document.createElement('div');
    describe('lifecycle', function() { 
        it('should not content bind during .extend()', function() {
            let dv = div();
            let vm = lite.extend({ container : dv, content : '<span>a</span>' });
            assert(dv.children.length == 0);
        });
        
        it('should content bind during new() if container and content are defined', function() {
            let vm = lite.extend({ container : div(), content : '<span>b</span>' });
            vm = new vm();
            assert(vm.container.children.length == 1);
        });

        it('should content bind after new if container and content are defined', function() { 
            let vm = lite.extend({ content : '<span>c</span>' });
            vm = new vm(); 
            vm.container = div();
            assert(vm.container.children.length == 1);
        });

        it('should data bind once container, content, and data are set', function() { 
            let vm = new (lite.extend({ data : { test : 'testing' } }));
            vm.content = '<span data-field="test"></span>';
            vm.container = div();
            assert(vm.container.firstChild.innerHTML == 'testing');
        });
    });

    describe('data-binding', function() { 
        it('should populate an element if "data-field" attribute is set to a data property', function() {
            let vm = new (lite.extend({ 
                container : div(),
                content : '<span data-field="testB"><span>',
                data : { testA : 'not test', testB : 'test' }
            }));
            assert(vm.container.firstChild.innerHTML == 'test');
        });

        it('should populate an element if data-field is present but empty and the element id is a data property', function() { 
            let vm = new (lite.extend({ 
                container : div(),
                content : '<span id="test" data-field><span>',
                data : { test : 'test' }
            }));
            assert(vm.container.firstChild.innerHTML == 'test');
        });

        it('should populate with data from nested objects when dot.notation is used', function() { 
            let vm = new (lite.extend({ 
                container : div(),
                content : '<span data-field="nested.test"><span>',
                data : { test : "not test", nested : { test : "test" } }
            }));
            assert(vm.container.firstChild.innerHTML == 'test');
        });

    });

    describe('utilities', function() { 
        it('should append a script to the header when .loadScript() is called', function() { 
            new (lite.extend({
                initialize : function() { this.loadScript('./lite-test-script.js'); }
            }));
            let headers = Array.from(document.getElementsByTagName('script'));
            let header = headers.find(h => h.src.split('/').slice(-1) == 'lite-test-script.js');
            assert(header);
        });

        it('shoud append a stylesheet to the header when .loadStyleSheet() is called', function() { 
            new (lite.extend({
                initialize : function() { this.loadStyleSheet('./lite-test.css'); }
            }));
            let headers = Array.from(document.getElementsByTagName('link'));
            let header = headers.find(h => h.href.split('/').slice(-1) == 'lite-test.css');
            assert(header);
        });
    });
});

