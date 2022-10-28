export const Lite = {}

/*
    clears container and appends content. 
*/
Lite.append = function(container, content) {
    container = getContainer(container);
    appendContent(container, content);
}

function getContainer(container) { 
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

function appendContent(container, content) { 
    while(container.firstChild)
        container.removeChild(container.firstChild);
    container.insertAdjacentHTML('afterbegin', content);
}
