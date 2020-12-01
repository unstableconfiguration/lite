# Lite
Lite is a utility suite for building single page applications. From a MVC standpoint, it can create a controller that loads a text/html template and binds it to a HTML element, while exposing event lifecycle hooks that allow for loading and binding data. It also contains a router utility that allows for control over changes to the window hash. 


## Example Usage

```
    let controller = lite.extend({
        // Content can be provided as a html string
        content : '<div id="exampleDiv"></div>'
        // Content can be loaded by url
        , contentUrl : 'exampleTemplate.html'

        // Data can be declared and added directly
        , data : { message : 'hello world' }

        // Data can be loaded via an async function 
            // loadData is called with .attach()
        , loadData : function() {
            let view = this;
            import('exampleData.js')
                .then((result) => {
                    // .setData kicks off the data binding lifecycle
                    view.setData(result.data);
                });
        }

        , onContentLoaded : function(content){
            console.log('1a', 'content loaded', content);
        }
        , onDataLoaded : function(data){
            console.log('2', 'data loaded', data)
        }
        // Executes after onContentLoaded
        , onContentBound : function(content){
            console.log('1b', 'content bound');
        }
        // Executes after onContentBound and onDataLoaded
        , onDataBound : function(data){
            console.log('3', 'data bound', data);
        }   
    });

    let container = document.createElement('div');
    document.body.appendChild(container);

    new controller().attach(container);
```

## Public functions

* .attach(container) : Initiates the view lifecycle, loading the content and data, and binding them to the page.
* .extend(options) : Creates a derived class with Lite as its base which is extended by the properties in the options object parameter. 
* .loadStyleSheet(uri) : Adds a <link> element to the page head if one does not already exist for the given uri

## View Lifecycle hooks
The view lifecycle contains several events that can be overridden to execute custom code. 

* initialize: Executes as the last part of the object initialization.
* loadData: Executes when .attach() is called if .data has not been set. 
* onDataLoaded: executes when .setData(data) is called
* onDataBound: Executes after .onDataLoaded() and after .onContentBound()
* onContentLoaded: Executes after content has been loaded but before it has been bound to the page.
* onContentBound: Executes after .html content has been added to the page. 

## Features

#### Data binding 
HTML elements in the content can be given a 'bind' attribute. If the value for bind matches a property in the data, the element's .value or .innerHTML will be set to the value from the data for that property. 

```
let controller = lite.extend({
    content : "<span id='spanMessage' data-field='message'></span>",
    data : { message : 'hi!' },
    onDataBound : function() { 
        let span = document.getElementById('spanMessage');
        console.log(span.innerHTML); // expect hi!
    }
});
let container = document.createElement('div');
document.body.appendChild(container);
new controller().attach(container);
```






