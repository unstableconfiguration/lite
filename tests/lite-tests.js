import { lite } from '../src/lite.js';

export let LiteTests = function() { 
    let assert = chai.assert;

    describe('Lite Tests', function() { 

        describe('View Lifecycle', function() {
            it('should execute provided initialize() function when initialized', function() {
                let isInitialized = false;
                let view = lite.extend({
                    initialize : function() { isInitialized = true; }
                });
                view = new view();
                assert(isInitialized);
            });

            it('should execute onContentLoaded() and onContentBound() in order when attached to container', function(done) {
                let view = lite.extend({
                    content : 1,
                    onContentLoaded : function(content) { assert(content == 1); this.content = 2; },
                    onContentBound : function(content) { assert(content == 2); this.content = 3; }
                });
                view = new view();
                assert(view.content == 1);
                view.attach(document.createElement('div'));
                assert(view.content == 3);
                done();
            });

            it('should execute onContentLoaded but not onContentBound when setContent() is called and container is not set', function(done) {
                let view = lite.extend({
                    content : 0,
                    onContentLoaded : function(content) { assert(content == 1); this.content = 2; },
                    onContentBound : function(content) { assert(content == 2); this.content = 3; }
                });
                view = new view();
                assert(view.content == 0);
                view.setContent(1);
                assert(view.content == 2);
                done();
            });

            it('should execute onContentLoaded and onContentBound when setContent() is called and contanier is set', function(done) {
                let view = lite.extend({
                    content : 0,
                    container : document.createElement('div'),
                    onContentLoaded : function(content) { assert(content == 1); this.content = 2; },
                    onContentBound : function(content) { assert(content == 2); this.content = 3; }
                });
                view = new view();
                assert(view.content == 0);
                view.setContent(1);
                assert(view.content == 3);
                done();
            });

            it('should call bindData after setData is called and content is bound', function(done) { 
                let view = lite.extend({
                    content : '<div data-field="test"></div>',
                    bindData : function(data) { assert(data == 1); this.data = 2; }
                });
                view = new view()
                view.attach(document.createElement('div'));
                view.setData(1);
                assert(view.data == 2);
                done();
            });
        });

        describe('Content loading and binding', function() { 
            it('should load text content from external source if contentUrl is provided', function(done) {
                let view = lite.extend({
                    contentUrl : '../tests/lite-test/lite-test.html',
                    container : document.createElement('div'),
                    onContentLoaded : function(content) { 
                        assert(content.includes('test-span'));
                        done();
                    }
                });
                view = new view();
                view.attach();
            });
            it('should attach content to container element', function(done) {
                let view = lite.extend({
                    contentUrl : '../tests/lite-test/lite-test.html',
                    container : document.createElement('div'),
                    onContentBound : function(content) { 
                        assert(view.container.innerHTML.includes('test-span')); 
                        done();
                    }
                });
                view = new view();
                view.attach();
            });

            it('should getElementById if container is an id string', function(done) {
                let div = document.createElement('div');
                div.id = 'container-attach-test';
                div.style.display = 'none';
                document.body.appendChild(div);

                let view = lite.extend({
                    container: 'container-attach-test',
                    content : 'test',
                    onContentBound : function() { 
                        assert(document.getElementById('container-attach-test').innerHTML == 'test')
                        done();
                    }
                });
                new view().attach();
            });
        });

        describe('Data binding', function() { 
            it('should bind data using the data-field attribute', function(done) { 
                let view = lite.extend({
                    contentUrl : '../tests/lite-test/lite-test.html',
                    data : { testField : 'testing' },
                    container : document.createElement('div'),
                    onDataBound : function(data) {
                        assert(data.testField == 'testing');
                        let span = this.container.firstChild.firstElementChild;
                        assert(span.innerHTML == 'testing');
                        done();
                    }
                });
                view = new view();
                view.attach();
            });
        });

        describe('Script and Stylesheet loading', function() {
            it('should load a css file if loadStyleSheet is called', function() { 
                let view = lite.extend({
                    content : 'a',
                    initialize : function() { 
                        this.loadStyleSheet('../tests/lite-test/lite-test.css');
                    }
                });
                new view().attach();
                let css = document.createElement('link');
                css.href = '../tests/lite-test/lite-test.css';
                
                let links = document.getElementsByTagName('link');
                let has = Array.from(links).some((link) => { 
                    return link.href == css.href;
                });
                assert(has);
            });
            it('should load a script file if loadScript is called', function() { 
                let view = lite.extend({
                    content : 'a',
                    initialize : function() { 
                        this.loadScript('../tests/lite-test/lite-test-script.js');
                    }
                });
                new view().attach();
                let script = document.createElement('script');
                script.src = '../tests/lite-test/lite-test-script.js';

                let scripts = Array.from(document.getElementsByTagName('script'));
                let hasScript = scripts.some(scr => {
                    return scr.src == script.src;
                });
                assert(hasScript);
            });
        });

        

    });
}