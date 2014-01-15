(function(window, $){

   $.wordbox = function ($element, options) {
     this.$element = $element

        if(!this._create(options)) {
            this.failed = true;
        }
    };

    $.wordbox.defaults = {        
        isLead: false,          //是否包含“全部”分类
        leadWord: null,
        words: null,
        colors: ['#cc5b34', '#c27c4d'],
        borderWidth: 2,
        isFixedWidth: true,
        width: 1000,
        height: 200,
        fontSize: null  
    };

    $.wordbox.prototype = {

        _create: function(options) {
            
            var opts = $.extend({}, $.wordbox.defaults, options);
            if(!this.$element || opts.words.length < 1) {
                return false;
            }           
            
            if(opts.isLead && opts.leadWord) {
                this.words = [opts.leadWord].concat(this._randArray(opts.words, false));
            }
            else {
                this.words = this._randArray(opts.words, false);
            }

            this.borderWidth = opts.borderWidth;

            this.colors = opts.colors;  
            this.colorPos = 0;
            
            //容器宽高初始化
            this.isFixedWidth = opts.isFixedWidth;
            if(this.isFixedWidth) {
                this.$element.width(opts.width);
                this.$element.height(opts.height);
            }
            else {
                this.$element.width(this.$element.parent().width());
                this.$element.height(this.$element.parent().height());
            }

            this.fontSize = opts.fontSize ? opts.fontSize : $element.css("fontSize");


            this._fillRect(this.$element,
                           this.words,
                           0,
                           this.words.length);
            
            return true;
        },

        //随机排列数组元素，若priority为true，则返回数组arr前wordnum个元素
        _randArray: function(array, priority) {
            var clone = array.slice();
            if(priority) {
                return clone;
            } else {
                var ret = [], rand;
                for(var i = 0, len = array.length; i < len; i++) {
                    rand = Math.floor(Math.random() * clone.length);
                    tmp = clone[0];
                    clone[0] = clone[rand];
                    clone[rand] = tmp;
                    ret.push(clone[0]);
                    clone = clone.slice(1);
                }
                return ret;
            }
        },

     
        _fillRect: function(wrapper,words,left,right) 
        {
            var width  = parseFloat($(wrapper).css("width")),
                height = parseFloat($(wrapper).css("height"));

            if(right-left == 1)
            {//只剩下一个单词，创建一个box
                var div = this._createBox({width: width,
                                          height: height,
                                             top: 0,
                                            left: 0,
                                            word: words[left],
                                           color: this._getNextColor(),
                                         borderR: false});
                $(wrapper).html(div);

            }else if(right-left>1)
            {//剩下大于两个单词，需要继续分割
                var separator = this._separator(left,right); //随机分割线
                var vertical  = !((width/height) >=2.5);     //是否垂直分割

                this._sliceDiv($(wrapper),left,right,separator,vertical); //分割div
                //填充
                this._fillRect($(wrapper).children('div')[0],words,left,separator);
                this._fillRect($(wrapper).children('div')[1],words,separator,right);
            }
        },


        _sliceDiv: function(wrapper,left,right,separator,vertical) 
        {
            var width     = parseFloat(wrapper.css("width")),
                height    = parseFloat(wrapper.css("height"));

            if(vertical)
            {
                var leftValue = (separator-left)/(right-left)*height;
                var rightValue = height-leftValue;
                
                var leftDiv  = this._createEmptyBox(0,0,width,leftValue);
                var rightDiv = this._createEmptyBox(leftValue,0,width,rightValue);

                wrapper.append(leftDiv);
                wrapper.append(rightDiv);
            }else
            {
                var leftValue  = (separator-left)/(right-left)*width;
                var rightValue = width-leftValue;

                var leftDiv  = this._createEmptyBox(0,0,leftValue,height);
                var rightDiv = this._createEmptyBox(0,leftValue,rightValue,height);

                wrapper.append(leftDiv);
                wrapper.append(rightDiv);
            }
        },

      
        _getNextColor: function() {
            var color = this.colors[this.colorPos % this.colors.length];
            this.colorPos++;
            return color;
        },
        
        _createEmptyBox: function(top,left,width,height) {
        var html = '<div class="empty" style="width:' + width + 'px;'
                + 'height:' + height + 'px;'
                + 'top:' + top + 'px;'
                + 'left:' + left + 'px;" ></div>';

                //wrapper.append(html);
                return html;
        },
        _createBox: function(option) {
            var width = option.borderR ? option.width - this.borderWidth : option.width,
                height = option.borderB ? option.height - this.borderWidth : option.height,
                lineHeight = height;            

            if(option.word) {
                var wordW = this._getWordsWidth(option.word.title);
                if(wordW > width) {
                    var line = Math.ceil(wordW / width);
                    lineHeight = this.fontSize;
                    var paddingTop = Math.max(0, (height - line * lineHeight) / 2);
                }
            }
            
            var html = '<div class="box" style="width:' + width + 'px;'
                + 'height:' + height + 'px;'
                + 'line-height:'+ lineHeight + 'px;'
                + 'top:' + option.top + 'px;'
                + 'left:' + option.left + 'px;'
                + (option.color ? ('background-color:' + option.color + ';') : '')
                + (option.borderR ? 'border-right:' + this.borderWidth + 'px solid #fff;' : '')
                + (option.borderB ? 'border-bottom:' + this.borderWidth + 'px solid #fff;' : '')
                + (paddingTop ? ('padding-top:' + paddingTop + 'px;') : '')
                + '">' + '<a href="'+option.word.url+'" '+fontSize+' >'+option.word.title + '</a></div>';

            return html;
        },

        _getWordsWidth: function(word) {
            if($('#get_ww').size() < 1) {
               $('<div id="get_ww" style="display:block;visibility:hidden;font-size:'+this.fontSize+'px"><span></span></div>').appendTo('body');
            }
            $('#get_ww span').html(word);
            return $('#get_ww span').width();
        },

        _separator: function(left, right) {        
        
            if(left == right) 
            {
               return left;
            }
            else
            {
                var result = parseInt(Math.random() * (right - left)+ left);
                if(result == left) result ++;
                if(result == right) result --;
                return result;
            }
        }
    };

    $.fn.wordbox = function(options) {        
        var instance = new $.wordbox(this, options); 
        if(instance.failed) {
            console.log("创建失败");
            return null;
        }
     
        if(!instance.isFixedWidth) {
            $(window).bind('resize', function() {
     
                if(window.fillTimeout) {
                    clearTimeout(window.fillTimeout);
                    window.fillTimeout = null;
                }           
                window.fillTimeout = setTimeout(function() {
                    if(instance.$element.width() != instance.$element.parent().width() || instance.$element.height() != instance.$element.parent().height()) {
                        instance.$element.width(instance.$element.parent().width());
                        instance.$element.height(instance.$element.parent().height());
                        instance._newFillRect(instance.$element, instance.words);
                    }
                    
                }, 200);                 
            });
        }
        return this;
    };

})(window, jQuery);