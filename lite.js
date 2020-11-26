import { XHR } from './xhr.js';
import { Router } from './router.js';

export let Lite = function(args={}){
    let _lite = this;
    _lite.xhr = new XHR();
    _lite.router = new Router();

    _lite.container;
    _lite.contentUrl = '';

    _lite.initialize = () => {}
    _lite.content = null;
    _lite.onContentLoaded = ((c) => {});
    _lite.onContentBound = ((c) => {}); 
    
    _lite.data = null;
    _lite.onDataBound = ((d) => {});

    /* setContent
        Explicitly kick off the content loading and binding process
    */
    _lite.setContent = function(content) {
        _lite.content = content;
        _lite.onContentLoaded(_lite.content);
        if(_lite.container) { 
            _lite._bindContent(_lite.content); 
            _lite.__isContentBound = true;
        }
        if(_lite.__isDataSet) { _lite.bindData(_lite.data); }
    }

    /* setData
        Explicitly kick off the data loading and binding process
    */
    _lite.setData = function(data) { 
        _lite.data = data;
        _lite.__isDataSet = true;
        if(_lite.__isContentBound) { _lite.bindData(_lite.data); }
    }
   
    /* Attach
        Kicks off the view lifecycle of loading and binding. 
    */
    _lite.attach = function(container) {
        if(container) { _lite.container = container; }
        if(_lite.data) { _lite.setData(_lite.data); }
        
        _lite._loadContent();
    }

    _lite._loadContent = function() { 
        if(_lite.contentUrl)
            return _lite.xhr.get(_lite.contentUrl)
                .then(r => _lite.setContent(r))
                .catch(e => { 
                    throw('Error when fetching resource ' + _lite.contentUrl);
                });
        else if (_lite.content) { _lite.setContent(_lite.content); }
        if(!_lite.content) { throw(new Error(`no content or content url for template`)); } 
    }

    _lite._bindContent = function(){
        if(_lite.container && _lite.content){
            while(_lite.container.firstChild)
                _lite.container.removeChild(_lite.container.firstChild);
            _lite.container.insertAdjacentHTML('afterbegin', _lite.content);
            _lite.onContentBound(_lite.content);
        }
        else { throw(new Error(`no container or no content for template`)); }
    }
    
    _lite.bindData = function(data) {
        _lite.container.querySelectorAll('[data-field]')
            .forEach((el)=>{
                let prop = el.getAttribute('data-field') || el.id;
                let val = prop.split('.').reduce((acc, p)=>{ return acc[p]; }, data)
                if(typeof(el.value) !== 'undefined') el.value = val;
                else el.innerHTML = val;
            });

        _lite.onDataBound(data);
    }

    _lite.loadStyleSheet = function(uri) {
        let css = document.createElement('link');
        css.rel = 'stylesheet';
        css.type = 'text/css';
        css.href = uri;
       
        let links = document.getElementsByTagName('link');
        let has = Array.from(links).some((link) => { 
            return link.href === css.href;
        });
        if(has) { return; }
  
        let head = document.getElementsByTagName('head')[0];
        head.appendChild(css);
    }

    /* When Lite or any derived class is instantiated, the args 
    can add to it or override its defaults. */
    for(let a in args) { this[a] = args[a]; }

    /* extend 
        Creates a base class. args passed in will be propagated to all 
        instances of the new class. */
    _lite.extend = function(args){
        return function(more_args) { 
            for(let k in more_args)
                args[k] = more_args[k];
            Lite.call(this, args);
        }
    }

    /* Call .initialize as the last thing we do as part of instantiation */
    _lite.initialize.bind(_lite)();
};

export let lite = new Lite();