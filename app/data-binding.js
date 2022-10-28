

export class DataBinding {

    bind(container, data, options = {}) {
        container = this.#getContainer(container);

        let proxy = new Proxy(data, this.#getProxyHandler(container, options));
        this.#addEventListeners(container, data, options);

        for(let key in data)
            proxy[key] = proxy[key];

        return proxy;
    }

    #getProxyHandler(container, options) {
        let binding = this;
        return {
            get(target, key) {
            return (typeof target[key] === 'object' && target[key] !== null) 
                ? new Proxy(target[key], binding.getProxyHandler(container, options))
                : target[key];
            },
            set (target, key, value) {
                let element = binding.#getElement(container, key, options);
                binding.#setValue(element, key, options, value);
                
                target[key] = value;
            }
        }
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
