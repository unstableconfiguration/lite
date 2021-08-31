 
export const XHR = function() { 
    let _xhr = this;

    _xhr.open = function(url, args = {}) {
        args = _xhr.setDefaultArgs(args);

        let xhr = new XMLHttpRequest();        
        xhr.open(args.method, url, args.async);

        xhr = _xhr.__setEvents(xhr, args);
        xhr = _xhr.__setCallbackChains(xhr);
        xhr = _xhr.__setHeaders(xhr, args);
        
        for(let k in args) { 
            xhr[k] = args[k];
        }

        return xhr;
    }

    _xhr.get = function(url, args) { 
        return _xhr.open(url, args);
    }

    _xhr.post = function(url, data, args = {}) { 
        args.method = "POST";
        args.data = data;
        return _xhr.open(url, args);
    }

    _xhr.put = function(url, data, args = {}) {
        args.method = "PUT";
        args.data = data;
        return _xhr.open(url, args);
    }

    _xhr.delete = function(url, args = {}) {
        args.method = "DELETE";
        return _xhr.open(url, args);
    }

    _xhr.defaultArgs = { 
        method : 'GET',
        async : true,
        responseType : 'text'
    }

    _xhr.setDefaultArgs = function(args = {}) {
        for(let k in _xhr.defaultArgs) { 
            args[k] = args[k] || _xhr.defaultArgs[k]
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
            xhr.send(xhr.data);
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

    _xhr.__setHeaders = function(xhr, args = {}) {
        if(!Array.isArray(args.headers)) { return xhr; }
        args.headers.forEach(header => { 
            if(!header.header || !header.value) {  
                console.log('Header must be in form { header : "ABC", value : "XYZ" }');
                return;
            }
            xhr.setRequestHeader(header.header, header.value)
        });

        return xhr;
    }
    
    return _xhr;
}

export const xhr = new XHR();


