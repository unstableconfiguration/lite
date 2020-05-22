let assert = chai.assert;

describe('Lite Tests', function(){
    let addDiv = function(id) {
        let div = document.createElement('div');
        div.style.display = 'none';
        div.id = id;
        document.body.appendChild(div);
        return div;
    }

    describe('Extensibility', function(){
        it('Extends the base object with provided arguments', function(){
            let view = lite.extend({ content : '<span>hello world</span>' });
            assert.isTrue(new view().content === '<span>hello world</span>');
        });
    });

    describe('Initialization', function(){
        it('Executes parameterized initialize function', function(done) {
            let view = lite.extend({
                initialize : function() { done(); }
            });
            view = new view();
        });
    });

    describe('Content Loading and Binding', function(){  
        it('Honors the content order of operations when content is set', function(done) {
            let div = addDiv('content-set-test')

            let view = lite.extend({
                container : div,
                content : `<div><span id='found'>test</span></div>`,
                onContentLoaded : function(html) {
                    assert.isTrue(this.content.substr(0, 5) === '<div>');
                    assert.isTrue(html.substr(0, 5) === '<div>');
                }, 
                onContentBound : function() {
                    let span = document.getElementById('found');
                    assert.isTrue(span.innerHTML === 'test');
                    done();
                }     
            });
            new view().attach();
        });
        
        it('Loads content via xhr request if contentUrl is provided', function(done){
            let div = addDiv('content-load-test');

            let view = lite.extend({
                container : div,
                contentUrl : 'test-template.html',
                onContentLoaded : function(html) {
                    assert.isTrue(this.content.substr(0, 5) === '<div>');
                }, 
                onContentBound : function() {
                    let div = document.getElementById('content-load-test');
                    assert.isTrue(div.id === 'content-load-test');
                    done();
                }     
            });
            new view().attach();;
        });
    });

    describe('Data Loading', function() { 
        it('Fulfills the data lifecycle when data is set', function(done) { 
            let div = addDiv('data-set-test');

            let view = lite.extend({
                content : '<div></div>',
                data : { message : 'testing' },
                onDataLoaded : function(data) {
                    assert.isTrue(data.message === 'testing' );
                    this.dataLoaded = true;
                },
                onDataBound : function(data) { 
                    assert(this.dataLoaded);
                    assert.isTrue(data.message === 'testing');
                    assert.isTrue(this.data.message === 'testing');
                    done();
                }
            });
            new view().attach(div);
        });
        it('Fulfills the data lifecycle when .setData is called', function(done) {
            let div = addDiv('data-load-test');

            let view = lite.extend({
                content : '<div></div>',
                loadData : function() { 
                    this.setData({ message : 'testing' });
                },
                onDataLoaded : function(data) {
                    assert.isTrue(data.message === 'testing' );
                    this.dataLoaded = true;
                },
                onDataBound : function(data) { 
                    assert(this.dataLoaded);
                    assert.isTrue(data.message === 'testing');
                    assert.isTrue(this.data.message === 'testing');
                    done();
                }
            });
            new view().attach(div);
        });
        
    });

    describe('Synchronicity', function() { 
        it('')

    });

    describe('View Lifecycle', function(){
        it('Executes event functions in order: initialize -> onDataLoaded/onContentLoaded -> onContentBound -> onDataBound', function(done){
          let view = lite.extend({
                contentUrl : 'test-template.html',
                loadData : function() {
                    let view = this;
                    import('./test-data.js')
                        .then((data) => {
                            view.setData(data.testData)
                        }); 
                },
                initialize : function(){
                    this.initialized = true;
                },
                onDataLoaded : function(){
                    this.data_loaded = true;
                    assert.isTrue(this.initialized);
                },
                onContentLoaded : function() {
                    this.content_loaded = true;
                    assert.isTrue(this.initialized)
                },
                onContentBound : function(){
                    this.content_bound = true;
                    assert.isTrue(this.content_loaded);
                },
                onDataBound : function(){
                    this.data_bound = true;
                    assert.isTrue(this.content_bound);
                    done();
                }
            });
            new view().attach(document.createElement('div'));   
        })
    });

    describe('Content attaching', function(){
        it('Binds content on attach', function(done){
            let div = addDiv('content-attach-test-1-div');
            let view = lite.extend({
                content : '<span id="content-attach-test-1-span">test</span>'
                , onContentBound : function(){
                    assert.isTrue(document.getElementById('content-attach-test-1-span').innerHTML == 'test');
                    done();
                }
            });
            new view().attach(div);
        });
        

    });

    describe('Data binding', function(){
        it('Automatically populates html  fields with \'bind\' attributes', function(done){
            let div = addDiv('data-binding-test-1-div');
            let view = lite.extend({
                content : '<span id="data-binding-test-1-span" bind="TestField">a</span>',
                data : { TestField : 'b'},
                onDataBound : function(){
                    let inner = document.getElementById('data-binding-test-1-span').innerHTML;
                    assert.isTrue(inner === 'b');
                    done();
                }
            });
            new view().attach(div);
        });
    });

    describe('Utilities', function() { 
        it('Should add a .css file to the header using .loadStyleSheet()', function() { 
            let div = addDiv('style-sheet-loading');
            let view = lite.extend({
                content : '<span id="style-sheet-loading-span"></span>',
                onContentBound : function() { 
                    this.loadStyleSheet('lite-test-stylesheet.css');
                }
            });
            new view().attach(div);

            let found = false;
            let links = document.getElementsByTagName('link');
            for(let i = 0; i < links.length; i++){
                if(links[i].href.split('/').pop() === 'lite-test-stylesheet.css') {
                    found = true;
                };
            }
            assert.isTrue(found);
        });
    });
});
