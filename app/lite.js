export let Lite = function(args = {}) {
    let _lite = this;

    _lite.__container = null;
    Object.defineProperty(_lite, "container", {
        get : () => _lite.__container,
        set : (value) => { 
            if(typeof(value) === 'string') { value = document.getElementById(value); }
            if(!(value instanceof HTMLElement)) { throw new Error('Cannot find HTMLElement: ' + value); }
            _lite.__container = value;

            _lite.__bindContent(); 
            _lite.__bindData();
        }
    });

    _lite.__content = null;
    Object.defineProperty(_lite, 'content', {
        get : () => _lite.__content,
        set : (value) => {
            if(typeof(value) !== 'string') { return; }
            _lite.__content = value;

            _lite.__bindContent();
            _lite.__bindData();
        }
    });

    _lite.__data = null;
    Object.defineProperty(_lite, 'data', {
        get : () => _lite.__data,
        set : (value) => { 
            _lite.__data = value; 

            _lite.__bindData();
        }
    });

    /* content binding
        Clears container and populates with content 
    */
    _lite.__bindContent = function() {
        if(!_lite.__container || !_lite.__content) { return; }
        while(_lite.container.firstChild) {
            _lite.container.removeChild(_lite.container.firstChild);
        }
        _lite.container.insertAdjacentHTML('afterbegin', _lite.content);
        _lite.onContentBound();
    }

    /* data binding
        If content is bound: finds any elements with data-field attributes and populates them with 
        values from data. Matches values on data-field=property or id=property.
        <span data-field="propertyA"></span>
        <textbox id="propertyB" data-field></textbox>
    */
    _lite.__bindData = function() {
        if(!_lite.__container || !_lite.__content || !_lite.__data) { return; }
        
        _lite.container.querySelectorAll('[data-field]')
            .forEach((el) => {
                let prop = el.getAttribute('data-field') || el.id;
                let val = prop.split('.').reduce((acc, p) => { return acc[p]; }, _lite.__data)
                if(typeof(el.value) !== 'undefined') { el.value = val; }
                else { el.innerHTML = val; }
            });
        _lite.onDataBound();
    }

    _lite.loadStyleSheet = function(uri) {
        let css = document.createElement('link');
        css.rel = 'stylesheet';
        css.type = 'text/css';
        css.href = uri;
       
        let links = document.getElementsByTagName('link');
        let hasLink = Array.from(links).some((link) => { 
            return link.href == css.href;
        });
        if(hasLink) { return; }
  
        let head = document.getElementsByTagName('head')[0];
        head.appendChild(css);
        return css;
    }

    _lite.loadScript = function(uri) {
        let script = document.createElement('script');
        script.src = uri;

        let scripts = document.getElementsByTagName('script');
        let hasScript = Array.from(scripts).some((s) => {
            return s.src == script.src;
        });
        if(hasScript) { return; }

        let head = document.getElementsByTagName('head')[0];
        head.appendChild(script);
        return script;
    }

    _lite.initialize = function(args) { }
    _lite.onContentBound = function() { }
    _lite.onDataBound = function() { }
    
    /* extend 
        Returns a 'new' constructor. Both .extend() and new() accept 
        arguments that will be combined together during initialization. 

    */
    _lite.extend = function(args = {}){
        return function(more_args = {}) { 
            for(let k in more_args)
                args[k] = more_args[k];
            
            Lite.call(this, args);
            return this;
        }
    }
    /* When lite or any derived class is instantiated, the args 
    can add to it or override its defaults. */
    for(let a in args) { this[a] = args[a]; }

    /* Call .initialize as the last thing we do as part of new() */
    //console.log(1, _lite.test)
    _lite.initialize.bind(_lite)();
    return _lite;
}

export let lite = new Lite();