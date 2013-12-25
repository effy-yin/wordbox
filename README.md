## About
可以使用jquery.wordbox.js轻松创建当下流行的分类标签。
## Usage
1. Include jQuery and jquery.wordbox.js
```html
<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>
<script type="text/javascript" src="jquery.wordbox.js"></script>
```
2. Create a HTML tag to hold the wordbox
```html
<div id="wordbox"></div>
```
2. Call wordbox()
```JavaScript
$("#wordbox").wordbox({
    options
});
```

## Options
To customize scrollIt.js, simply pass in an options object: (defaults shown)
```JavaScript
    var fontSize = 14;
    var titles = ['JavaScript', 'CSS', 'HTML', 'HTML5', 'SVG', 'PHP', 'Python', 'Shell', 'WebGL'];
    var words = [];
    for(var i = 0; i < titles.length; i++) {
        words[i] = {
            "title" : titles[i],
            "url" : ""
        }
    }
    var colors = ['#cc5b34', '#c27c4d'];
    $("#wordBox").wordbox({
        isLead: false,          
        leadWord: null,
        words: words,
        colors: colors,
        borderWidth: 2,
        isFixedWidth: true,
        width: 800,
        height: 200,
        fontSize: fontSize  
    });
```

## Credit
Created by @dodo糯, weibo(http://weibo.com/dodoroy)

Feel free to use, share and fork.

Enjoy!
