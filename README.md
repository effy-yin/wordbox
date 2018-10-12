## About
wordbox.js makes it easy to create category tags and classify labels.
##Demo
*[Demo](http://htmlpreview.github.io/?https://github.com/dodoroy/jquery.wordbox.js/blob/master/examples/index.html)*


![screen](https://raw.github.com/dodoroy/jquery.wordbox.js/master/examples/pic1.png)
![screen](https://raw.github.com/dodoroy/jquery.wordbox.js/master/examples/pic2.png)
## Usage
1.Include wordbox.css, jQuery and wordbox.js

```html
<link rel="stylesheet" href="wordbox.css" />

<script type="text/javascript" src="jquery.min.js"></script>
<script type="text/javascript" src="wordbox.js"></script>
```
2.Create a HTML tag to hold the wordbox

```html
<div id="wordbox"></div>
```
3.Call wordbox()

```JavaScript
$("#wordbox").wordbox({
    /*options*/
});

or

new dodoroy.WordBox('#wordbox', {
    /*options*/
});
```

## Options
To customize wordbox.js, simply pass in an options object:
```JavaScript
    var titles = ['JavaScript', 'CSS', 'HTML', 'HTML5', 'SVG', 'PHP', 'Python', 'Shell', 'WebGL'];
    var words = [];
    for(var i = 0; i < titles.length; i++) {
        words[i] = {
            "title" : titles[i],
            "url" : ""
        }
    }
    var colors = ['#cc5b34', '#c27c4d'];
    $("#wordbox").wordbox({
        isLead: false,          
        leadWord: null,
        words: words,
        colors: colors,
        isFixedWidth: true,
        width: 800,
        height: 200
    });
```

## Credit
Created by [@dodo糯](http://weibo.com/dodoroy), *[blog](http://effy.me)*

Feel free to use, share and fork.

Enjoy!


## And
上面的笨蛋布局逻辑实在写的太烂了，重新写了下，从很烂优化到了有点烂的程度.


by 张玺 *[zhangxi.me](http://zhangxi.me)*

