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
        it('Loads data if data_url is provided', function(done){
            let view = lite.extend({
                data_url : 'test_data.js'
                ,onDataLoaded : function(data) { 
                    assert(typeof(test_data) !== 'undefined');
                    done(); 
                }
            });
            new view().attach(document.createElement('div'));
        });
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

    describe('Attaching', function(){
        it('Binds content on attach')
        it('Binds data on attach')

        it('Loads both content and data before binding')


    });
});
