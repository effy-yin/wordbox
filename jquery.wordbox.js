(function(window, $){

    $.wordbox = function ($element, options) {
        this.$element = $element;

        if(!this._create(options)) {
            this.failed = true;
        }
    };

    $.wordbox.defaults = {        
        isLead: false,          //是否包含“全部”分类
        leadWord: null,
        words: null,
        colors: ['#cc5b34', '#c27c4d'],
        isFixedWidth: true,
        width: 1000,
        height: 200
    };

    $.wordbox.prototype = {
        /*
         * this.defaults or $.wordbox.defaults ?? 
         * defaults对象加在原型链上好还是加在$.wordbox上好？？
         * defaults: {

         * }, 
        */
       
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

            this._fillRect(this.$element, 
                            0, 
                            0, 
                            this.$element.width(), 
                            this.$element.height(), 
                            this.words);

            return true;
        },

        /*
         * 递归创建box
         */
        _fillRect: function(wrapper, left, top, width, height, words) {
            var wordLen = words.length,               
                ratio = width / height;

            if(wordLen == 1) {
                this._createBox(wrapper, 
                                left, 
                                top, 
                                width, 
                                height, 
                                words[0], 
                                this._getNextColor());
                return;
            } 

            var dot = this._randRange(1, 2, 0.5),
                wordLen1 = Math.round(wordLen * dot[0]),
                wordLen2 = wordLen - wordLen1;
            if(wordLen1 == 0) {
                wordLen1 = 1;
                wordLen2--;
            } else if(wordLen2 == 0) {
                wordLen2 = 1;
                wordLen1--;
            }

            if(ratio >= 2.5) {
                // 左右分割
                var leftW = Math.round(width * dot[0]),                    
                    rightW = width - leftW;

                this._fillRect( wrapper, 
                                left, 
                                top, 
                                leftW, 
                                height, 
                                words.slice(0, wordLen1));
                this._fillRect( wrapper, 
                                left+leftW, 
                                top, 
                                rightW, 
                                height, 
                                words.slice(wordLen1));             
           } else {
                // 上下分割
                var topH = Math.round(height * dot[0]),
                    bottomH = height - topH;

                this._fillRect( wrapper, 
                                left, 
                                top, 
                                width, 
                                topH, 
                                words.slice(0, wordLen1));
                this._fillRect( wrapper, 
                                left, 
                                top+topH, 
                                width, 
                                height-topH, 
                                words.slice(wordLen1));
            }
        },

        /*
         * 函数功能：创建box
         * 参数：left、right为box相对于wrapper绝对定位的偏移量
         */
        _createBox: function(wrapper, left, top, width, height, word, color) {
            var lineHeight = height,
                paddingTop = 0,        
                wordW = this._getWordsWidth(word.title);

            // 如果box中文字的宽度超出box本身的宽度，则需要分多行显示
            if(wordW > width) {
                var line = Math.ceil(wordW / width);
                // 注意设置line-height属性和padding-top属性
                lineHeight = this.$element.css('font-size');
                paddingTop = Math.max(0, (height - line * lineHeight) / 2);
                height -= paddingTop;
            }
            var html = '<div class="box" style="width:' + width + 'px;'
                + 'height:' + height + 'px;'
                + 'line-height:'+ lineHeight + 'px;'
                + 'top:' + top + 'px;'
                + 'left:' + left + 'px;'
                + 'background-color:' + color + ';'                
                + (paddingTop ? ('padding-top:' + paddingTop + 'px;') : '')
                + '">' + '<a href="' + word.url + '" >' + word.title + '</a></div>';          

            $(wrapper).append(html);
        },

        /* 函数功能:将base随机分成num份
         * base:    被分割的数
         * num:     分割的份数         
         * round:   base被分割之后两部分的最大差，为了避免每部分太大或太小
         * return:  包含num个分界点的数组
         */
        _randRange: function(base, num, round) {        
            if(num == 1) {
                return [base];
            }
            var center = base / num,
                min = center * (1 - round),
                max = center * (1 + round),
                rand = Math.random() * (max - min) + min;
            return [rand].concat(this._randRange(base - rand, num - 1, round));
        },

        

        _getNextColor: function() {
            var color = this.colors[this.colorPos % this.colors.length];
            this.colorPos++;
            return color;
        },

        /*
         * 获取指定字体大小的word的宽度
         */
        _getWordsWidth: function(word) {
            if($('#get_ww').size() < 1) {
                $('<div id="get_ww" style="display:block;visibility:hidden;font-size:'+this.$element.css('font-size')+'px"><span></span></div>').appendTo('body');
            }
            $('#get_ww span').html(word);
            return $('#get_ww span').width();
        },

        /*
         * 随机排列数组元素
         */
        _randArray: function(array) {
            var clone = array.slice(),          
                ret = [], 
                rand;
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
                        instance._fillRect(instance.$element, instance.words);
                    }
                    
                }, 200);                 
            });
        }
        // 返回jquery对象
        return this;
    };

})(window, jQuery);