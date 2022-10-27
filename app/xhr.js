export class XHR {

    open(url, args = {}) {
        args = this.#setDefaultArgs(args);

        let xhr = new XMLHttpRequest();
        xhr.open(args.method, url, args.async);

        xhr = this.#setEvents(xhr, args);
        xhr = this.#setCallbackChains(xhr);
        xhr = this.#setHeaders(xhr, args);

        Object.assign(args, xhr);

        return xhr;
    }

    get(url, args) { return this.open(url, args); }

    post(url, data, args = {}) {
        args.method = 'POST';
        args.data = data;
        return this.open(url, args);
    }

    put(url, data, args = {}) {
        args.method = 'PUT';
        args.data = data;
        return this.open(url, args);
    }

    delete(url, args = {}) {
        args.method = 'DELETE';
        return this.open(url, args);
    }
    
    defaultArgs = { 
        method : 'GET',
        async : true,
        responseType : 'text'
    }

    #setDefaultArgs = function(args = {}) {
        for(let k in this.defaultArgs) { 
            args[k] = args[k] || this.defaultArgs[k]
        }
        return args;
    }

    #events = [ 
        'abort', 'error', 'load', 'loadend', 'loadstart', 'progress', 'timeout'
    ];

    #setEvents = function(xhr, args = {}) { 
        this.#events.forEach(e => { 
            let ev = args[e] || args['on' + e];
            if(ev) { 
                xhr.addEventListener(e, (e) => ev(e))
            }
        });
        return xhr;
    }

    #setCallbackChains = function(xhr) { 
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

    #setHeaders = function(xhr, args = {}) {
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
}
