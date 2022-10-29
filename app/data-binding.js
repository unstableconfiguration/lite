

export class DataBinding {

    bind(container, data, options = {}) {
        container = this.#getContainer(container);

        let proxy = new Proxy(data, this.#getProxyHandler(container, options));
        this.#addEventListeners(container, data, options);

        this.#activateSetters(data, proxy);

        return proxy;
    }

    #getProxyHandler(container, options) {
        let binding = this;
        return {
            get(target, key) {
                return Reflect.get(target, key);
            },
            set (target, key, value) {
                let element = binding.#getElement(container, key, options);
                binding.#setValue(element, key, options, value);
                
                return key.includes('.')
                    ? binding.#setNested(target, key, value)
                    : Reflect.set(target, key, value);
            }
        }
    }

    /* Sets each property to itself to activate the setters. 
        For a nested value { a : { b : { c : 1 } } }
        It sets proxy['a.b.c'] = proxy['a']['b']['c'];
    */
    #activateSetters(data, proxy, keyBase = '') {
        if(keyBase) keyBase = keyBase + '.';

        for(let key in data) {
            key = keyBase + key;
            // get value by accumulator
            let value = key.split('.').reduce((acc, p) => { return acc[p]; }, proxy);
            proxy[key] = value; 
            
            if(typeof(value) == 'object') this.#activateSetters(value, proxy, key)
        }
    }

    /* If our key is composite i.e. 'a.b.c'
        split the key up. 
        Get target.a 
        Update a.b.c
        Update target.a and return;
    */
    #setNested(target, key, value) {
        let props = key.split('.');
        let base = Reflect.get(target, props[0]);
        let nested = props.slice(1, -1).reduce((acc, p) => { return acc[p]; }, base);
        Reflect.set(nested, [props.slice(-1)], value);

        return Reflect.set(target, props[0], base);
    }

    #getElement(container, key, options) {
        let selector = `[name="${key}"]`;
        if(options[key]?.selector) {
            selector = options[key].selector;
            if(typeof(selector) == 'function') 
                selector = selector(key);
        }

        return container.querySelector(selector);
    }

    #setValue(element, key, options, value) {
        if(element) {
            let htmlValue = options[key]?.set
                ? options[key].set(value)
                : value;
            
            if('value' in element) element.value = htmlValue;
            else element.innerHTML = htmlValue;
        }
    }

    #addEventListeners(container, data, options) {
        for(let key in data) {
            let element = this.#getElement(container, key, options);
            if(element && ('value' in element)) {
                element.addEventListener('change', (ev) => {
                    let value = options[key]?.get
                        ? options[key].get(ev.target.value)
                        : ev.target.value;
                    
                    data[key] = value;
                });
            }
        }
    }

    #getContainer(container) { 
        if(container instanceof HTMLElement) return container;
        let element = container;
    
        if(typeof(container) == 'string') {
            element = document.getElementById(container);
            if(!element)
                element = document.querySelector(container);
        }
    
        if(!element instanceof HTMLElement)
            throw`container must be HTMLElement or a valid #id or css selector.`;
        return element;
    }
}
