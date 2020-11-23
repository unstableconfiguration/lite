Here's a two-part demonstration using two views. In the first view, we're loading text from a *demo.md* markdown file. Then we're using the onContentLoaded hook to use [marked](https://github.com/markedjs/marked) to parse it to html before binding it to the page element.  
In the second view, rather than loading content, we're setting it. The content in this view is a  stringifying of the javascript that loads the content for this page and binding it to a \<code> element. As a bonus, we're demonstrating loading a style sheet for this view.


