let assert = chai.assert;

describe('Lite Tests', function(){
    
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

    describe('Content Loading', function(){
        it('Loads content via xhr request if content_url is provided', function(done){
            let view = lite.extend({
                content_url : 'test_template.html'
                , onContentLoaded : function(html) {
                    assert.isTrue(html.substr(0, 6) === '<html>');
                    done();
                }
            });
            new view().attach(document.createElement('div'));;
        });
        it('Calls onContentLoaded if .content is defined', function(done){
            let view = lite.extend({
                content : '<span>content</span>'
                , onContentLoaded : function() { done(); }
            });
            new view().attach(document.createElement('div'));
        });
    });

    describe('Data Loading', function(){
        it('Adds a script file to the page header if data_url is provided with .js extension', function(done){
            let view = lite.extend({
                data_url : 'test_data.js'
                ,onDataLoaded : function(data) { 
                    assert(typeof(test_data) !== 'undefined');
                    let scripts = document.getElementsByTagName('script');
                    let has = Array.from(scripts).some(scr => {
                        let src = scr.src.split('/').pop();
                        return src == 'test_data.js';
                    });
                    assert.isTrue(has, 'script was not found in header');
                    done(); 
                }
            });
            new view().attach(document.createElement('div'));
        });
        it('Loads data via Require.js if require is present')
        it('Loads data if .data is defined', function(done){
            let view = lite.extend({
                data : { defined : true }
                , onDataLoaded : function(){ done(); }
            });
            new view().attach(document.createElement('div'));
        })
        it('Loads data via xhr if .data_url is provided and does not have a .js extension', function(done){
            let view = lite.extend({
                data_url : 'test_data.txt',
                onDataLoaded : function(data){ 
                    assert.isTrue(data == 'test data')
                    done();
                }
            });
            new view().attach(document.createElement('div'));
        });
        it('Calls onDataLoaded if .data is defined', function(done){
            let view = lite.extend({
                data : { defined : true }
                , onDataLoaded : function() { done() }
            });
            new view().attach(document.createElement('div'));
        });

    })

    describe('View Lifecycle', function(){
        it('Executes event functions in order: initialize -> onDataLoaded/onContentLoaded -> onContentBound -> onDataBound', function(done){
          let view = lite.extend({
                data_url : 'test_data.js',
                content_url : 'test_template.html',
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
                    assert.isTrue(this.data_loaded && this.content_loaded);
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
            let div = document.createElement('div');
            div.id = "content_attach_test_1_div"
            div.style.display = 'none';
            document.body.appendChild(div);
            let view = lite.extend({
                content : '<span id="content_attach_test_1_span">test</span>'
                , onContentBound : function(){
                    assert.isTrue(document.getElementById('content_attach_test_1_span').innerHTML == 'test');
                    done();
                }
            });
            new view().attach(div);
        });
        

    });

    describe('Data binding', function(){
        it('Automatically populates html  fields with \'bind\' attributes', function(done){
            let div = document.createElement('div');
            div.id = 'data_binding_test_1_div';
            div.style.display = 'none';
            document.body.appendChild(div);
            let view = lite.extend({
                content : '<span id="data_binding_test_1_span" bind="TestField">a</span>',
                data : { TestField : 'b'},
                onDataBound : function(){
                    let inner = document.getElementById('data_binding_test_1_span').innerHTML;
                    assert.isTrue(inner === 'b');
                    done();
                }
            });
            new view().attach(div);
        });
    });

    describe('Utilities', function() { 
        it('Should add a .css file to the header using .loadStyleSheet()', function() { 

            let div = document.createElement('div');
            div.id = 'style_sheet_loading';
            div.style.display = 'none';
            document.body.appendChild(div);
            let view = lite.extend({
                content : '<span id="style_sheet_loading_span"></span>',
                onContentBound : function() { 
                    this.loadStyleSheet('lite_test_stylesheet.css');
                }
            });
            new view().attach(div);

            let found = false;
            let links = document.getElementsByTagName('link');
            for(let i = 0; i < links.length; i++){
                if(links[i].href.contains('style_sheet_loading')){
                    found = true;
                };
            }
            assert.isTrue(found);
        });
    });
});
