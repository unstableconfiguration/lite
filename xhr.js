
export let XHR = function() { 
    let _xhr = this;

    _xhr.get = function(url, args = {}) { 
        let xhr = _xhr.init(url, args);
        return xhr;
    }

    _xhr.init = function(url, args = {}) {
        args = _xhr.setArgDefaults(args);

        let xhr = new XMLHttpRequest();
        xhr.open(args.method, url, args.async);

        _xhr.__setEvents(xhr, args);
        _xhr.__setCallbackChains(xhr);
        for(let k in args) { 
            xhr[k] = args[k];
        }
        return xhr;
    }

    _xhr.argDefaults = { 
        method : 'GET',
        async : true,
        responseType : 'text'
    }

    _xhr.setArgDefaults = function(args = {}) {
        for(let k in _xhr.argDefaults) { 
            args[k] = args[k] || _xhr.argDefaults[k]
        }
        return args;
    }

    let events = [ 
        'abort', 'error', 'load', 'loadend', 'loadstart', 'progress', 'timeout'
    ]

    /* If args contains events, e.g.: 'load', 'onload', 'onerror', 'progress'
        This will add an event listener for the relevant event.
    */
    _xhr.__setEvents = function(xhr, args = {}) { 
        events.forEach(e => { 
            let ev = args[e] || args['on' + e];
            if(ev) { 
                xhr.addEventListener(e, (e) => ev(e))
            }
        });
        return xhr;
    }

    /* Allows for handling callbacks with function chaining. Also makes xhr a 
        'thennable' interface.
        example:
        xhr.get(url)
            .then(response => { ... })
            .error(err => { ... }) 
    */
    _xhr.__setCallbackChains = function(xhr) { 
        xhr.load = function(onLoad) {
            xhr.addEventListener('load', (r) => onLoad(xhr.response));
            xhr.send();
            return xhr;
        }

        xhr.error = function(onError) { 
            xhr.addEventListener('error', onError);   
            return xhr;
        }

        xhr.then = xhr.load;
        xhr.catch = xhr.error;
        return xhr;
    }
    
    return _xhr;
}

export let xhr = new XHR();

