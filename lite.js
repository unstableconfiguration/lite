

let Lite = function(args={}){
    let _lite = this;
    _lite.container = '';
    _lite.content = '<div>no content</div>';
    _lite.content_url = '';
    _lite.data;
    _lite.data_url = ''

    _lite.initialize = ()=>{}
    _lite.onContentLoaded = ((c)=>{});
    _lite.onContentBound = ((c)=>{});
    // data loading makes sense, it loads, it arrives. 
    _lite.onDataLoaded = ((d)=>{});
    // data bound only makes sense if we have additional binding logic 
    _lite.onDataBound = ((d)=>{});
    for(let a in args)
        this[a] = args[a];
    
    let _initialize = function() {
        _lite.initialize();
    }
    _initialize();
    
    _lite.attach = function(container) {
        if(container) _lite.container = container;
        please.do(_loadContent())
            .and(_loadData())
            .then((x, y)=>{


                _bindContent(_lite.content);
                _bindData(_lite.data);
            });
    }
    _lite.extend = function(args){
        return function(more_args) { 
            for(let k in more_args)
                args[k] = more_args[k];
            Lite.call(this, args);
        }
    }

    let _loadContent = function() { 
        if(_lite.content_url)
            return xhr.get(_lite.content_url, (content)=>{
                _lite.content = content;
                _lite.onContentLoaded(content);
            });
        if(!_lite.content) throw`no content or content url for template`;
        _lite.onContentLoaded(_lite.content);
    }
    let _bindContent = function(){
        if(_lite.container && _lite.content){
            while(_lite.container.firstChild)
                _lite.container.removeChild(_lite.container.firstChild);
            _lite.container.insertAdjacentHTML('afterbegin', _lite.content);
            _lite.onContentBound(_lite.content);
        }
        else throw`no container or no content for template`
    }
    let _loadData = function() {
        let data_loaded = function(data){
            _lite.data = data;
            _lite.onDataLoaded(data);
            return _lite.data;
        }
        if(_lite.data_url.slice(-3)==='.js') {
            if(typeof(require) !== 'undefined')
                return new Promise((s, f)=>{
                    require([_lite.data_url.slice(0, -3)], (data)=>{ 
                        s(data_loaded(data));
                    });
                });
            else {
                return new Promise((s, f)=>{
                    let script = document.createElement('script');
                    script.src = _lite.data_url;
                    let message = 'script ' + script.src + ' added to header';
                    script.onload = function(x){
                        s(data_loaded(message));
                    }

                    let has = Array.from(document.getElementsByTagName('script'))
                        .some(scr => scr.src === script.src);
                    if(!has) document.getElementsByTagName('head')[0].appendChild(script);
                    else s(data_loaded(message));
                });
            }
        }
        
        if(!_lite.data_url && _lite.data) 
            return data_loaded(_lite.data);
        
        if(_lite.data_url) return xhr.get(_lite.data_url, (data)=>{ data_loaded(data);});        
    }
    
    let _bindData = function(data) {
        _lite.container.querySelectorAll('[bind]')
            .forEach((el)=>{
                let prop = el.getAttribute('bind') || el.id;
                let val = prop.split('.').reduce((acc, p)=>{ return acc[p]; }, data)
                if(typeof(el.value) !== 'undefined') el.value = val;
                else el.innerHTML = val;
            });

        _lite.onDataBound(data);
    }

    _lite.loadStyleSheet = function(uri) {
        let links = document.getElementsByTagName('link');
        let has = Array.from(links).some((link) => { 
            return link.href === uri;
        });
        if(has) { return; }

        let css = document.createElement('link');
        css.rel = 'stylesheet';
        css.type = 'text/css';
        css.href = uri;
        
        let head = document.getElementsByTagName('head')[0];
        head.appendChild(css);
    }
};
let lite = new Lite();