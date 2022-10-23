export class Lite {
    /* Container: 
        Can be set as an id for an html element
        Can be set as a query selector for an html element
        Can be set as a reference to an html element
    */
    container = '';
    /* Content
        String value to set as the container's innerHTML
    */
    content = '';

    constructor(options = {}) { 
        Object.assign(this, options);
        
        this.container = this.#getContainer();
        if(!this.container instanceof HTMLElement)
            throw `could not parse container to html element. value is ${this.container}`;
    
        this.#appendContent();
        this.onContentBound();
    }

    /* onContentBound
        Overridable. Is called after content is appended to the container
    */
    onContentBound() { }

    #getContainer() { 
        let element = this.container;
        if(typeof(element) == 'string') {
            element = document.getElementById(element);
            if(!element)
                element = document.querySelector(element);
        }

        return element instanceof HTMLElement
            ? element
            : this.container;
    }

    #appendContent() { 
        while(this.container.firstChild)
            this.container.removeChild(this.container.firstChild);
        this.container.insertAdjacentHTML('afterbegin', this.content);
    }
}