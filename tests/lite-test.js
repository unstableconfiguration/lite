import { lite } from '../lite.js';
window.lite = lite;

export let LiteTest = function() { 
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
            it('should load text content from external source if contentUrl is provided')
            it('should allow content to be set')
            it('should attach content to container element')

        });

        describe('Data binding', function() { 
            it('should bind data using the data-field attribute')
        });

        describe('Script and Stylesheet loading', function() {
            it('should load a css file if loadStyleSheet is called');
            if('should load a script file if loadScript is called');
        });


    });
}