# lite  

## basic usage
At its most basic, lite is about attaching text or html content to a container HTMLElement in a predictable and customizable way. 

```javascript 
let view = lite.extend({
    container : 'base-demo',
    content : '<span>Basic usage test.</span>'
});

new view().attach();
```
<div id='base-demo'></div>

## .extend(options = {})
.extend creates a clone of the base lite object with all its defaults. It accepts an object as a parameter. The clone will contain all of the property:value pairings of the parameter object, which is used to overwrite default values or to add custom functionality to the view.

```javascript 
let view = lite.extend({
    container : 'extend-demo',
    content : '<b>Default Content :</b> ',
    customProperty : 'custom text',
    onContentLoaded : function() { 
        this.content = this.content + this.customProperty;
    }
});

new view().attach();
```
<div id='extend-demo'></div>

## .container 
Each lite view needs a container element to attach to. The container can be defined either as part of the .extend({}) parameter object, or as a parameter to the .attach() function. In either case, the container can be a reference to an HTMLElement, or it can be an id to look up the element with. 

```javascript
let view = lite.extend({
    // Container can be set in the .extend object. It can be an ID or an HTMLElement
    container : document.getElementById('container-demo') || 'container-demo',
    content : '<b>Container demo</b>'
});

new view().attach();
```
<div id='container-demo'></div>

## .attach();
.attach() begins the view lifecycle, resulting in the content being bound to the container. The .container can be passed to .attach() as an optional parameter. 

```javascript
let view = lite.extend({ content : '<span style="background:#966; color:white; font-weight:bold;; padding:0 .2em;">Attach Test</span>' });

// Just as with setting .container in the object, the parameter can be a HTMLElement or a id string.
new view().attach('attach-demo');
```
<div id='attach-demo'></div>

## .content 
.content represents what will become the .innerHTML value of the .container. Typically it will be some form of stringified HTML, but there are no limitations on it.

```javascript
let view = lite.extend({
    container : 'content-demo',
    content : '<div><span style="background:#555; color:#fff;">HTML content: </span><span style="border:solid thin #555; padding:0em .2em;">Typical content will be a HTML string</span></div>'
});

new view().attach();
```
<div id='content-demo'></div>

## .contentUrl
An alternative to setting content is setting a .contentUrl. In this case, the text of the specified file will be loaded via XMLHttpRequest.

```javascript
let view = lite.extend({
    container : 'contentUrl-demo',
    // We can load the markdown source for this page.
    contentUrl : './documentation.md'
});

new view().attach();
```
<div id='contentUrl-demo' style='max-height:100px; overflow:scroll;'></div>

## .setContent(content = '');
Content can be explicitly set via the .setContent() function. Doing so will trigger the normal view lifecycle.


```javascript
let view = lite.extend({
    onContentLoaded : function(content) { this.content = marked(content); },
});
view = new view();
view.attach('setContent-demo')

view.setContent('**Setting via .setContent**: Content is set and view lifecycle is triggered');
```
<div id='setContent-demo'></div>

## view lifecycle
There are several events in the view lifecycle that execute in order and can allow for customization of the view as it is being built up.

#### initialize(): 
* executes immediately after .attach() is called  
* can be used to kick off asynchronous events or define constants

#### onContentLoaded(content)
* executes immediately if .content is defined  
* executes after content is loaded if .contentUrl is defined  
* executes immediately after .bindContent is called  
* can be used to manipulate content before it has been bound 

#### onContentBound(content)
* executes after .container.innerHTML has been populated with .content
* executes after onContentLoaded  
* can be used to modify the container after content has been bound or to perform cleanup

#### onDataBound(data)
* executes automatically after onContentBound if .data is defined  
* executes after .bindData is called
* can be used to modify the container after data has been bound

```javascript
let view = lite.extend({
    container : 'lifecycle-demo',
    content : '',
    data : {},
    initialize : function() { 
        this.content += '<span style="color:white; background:#555; padding:.2em;">1.</span>' 
    },
    onContentLoaded : function(content) {
        this.content += '<span style="color:white; background:#666; padding:.2em;">2.</span>';
    },
    onContentBound : function(content) { 
        this.content = content + '<span style="color:white; background:#777; padding:.2em;">3.</span>';
        this.container.innerHTML = this.content;
    },
    onDataBound : function(data) {
        this.content = this.content + '<span style="color:white; background:#888; padding:.2em;">4.</span>';
        this.container.innerHTML = this.content
    }

});

new view().attach();
```
<div id='lifecycle-demo'></div>

## .bindData()
.bindData(data) is a data binding utility that uses a 'data-field' custom attribute to populate HTML elements with data. It will be called automatically if .data is defined, but can be called explicitly otherwise. 
If the data-field is set to a data property name, bindData will populate the element with that property value. If data field is left empty, bindData will use the element's id. If the data property is nested, dot.notation can be used to recursively load the property.

```javascript
let view = lite.extend({
    container : 'bindData-demo',
    content : '' +
        '<div data-field="fieldA"></div>' +
        '<input type="text" id="fieldB" data-field style="width:200px"></input>' +
        '<div data-field="nested.field"></div>',
    data : {
        fieldA : 'data-field = property',
        fieldB : 'data-field and id = property',
        nested : { field : 'dot.notation for nested values' }
    }

});

new view().attach();
```
<div id='bindData-demo'></div>

## .loadStyleSheet(path)
loadStyleSheet is a utility that can be used to add a .css link to the header. It accepts a string parameter that will become the 'href' value of the link. It won't do anything if a link already exists with that href. 

```javascript
let view = lite.extend({
    initialize : function() { 
        this.loadStyleSheet('../css/vendor/prism.css');
    }
});
```
Will add a link like this to the header: 
```html
<link rel="stylesheet" type="text/css" href="../css/vendor/prism.css">
```

## .loadScript(path)
loadScript is a utility that can be used to add a script tag to the header. It accepts a string parameter that will become the 'src' value of the tag. It won't do anything if a script already exists with that src.
```javascript
let view = lite.extend({
    initialize : function() { 
        this.loadScript('../scripts/vendor/prism.js');
    }
});
```
Will add a script link like this to the header:
```html
<script src="../scripts/vendor/prism.js"></script>
```

# Router

## initialization

## .paths[]

# XHR

## .get(url, args)

## .then(callback)

## .error(handler)