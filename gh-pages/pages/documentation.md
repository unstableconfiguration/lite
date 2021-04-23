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
    // Container can be set in the .extend object
    container : document.getElementById('container-demo-1') || 'container-demo-1',
    content : '<b>Container demo 1</b>'
});

new view().attach();
```
<div id='container-demo-1'></div>


```javascript
let view = lite.extend({ content : '<b>Container demo 2</b>' });
// The container can be set via .attach(container);
new view().attach('container-demo-2' || document.getElementById('container-demo-2'));
```
<div id='container-demo-2'></div>

## .content 


## .contentUrl

## .bindData()

## .setContent()

## .setData()

## view lifecycle

## .loadStyleSheet(path)

## .loadScript(path)



# Router

## initialization

## .paths[]

# XHR

## .get(url, args)

## .then(callback)

## .error(handler)