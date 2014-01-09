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

            this.fontSize = opts.fontSize ? opts.fontSize : this.$element.css("fontSize");

            this._fillRect(this.$element, this.words, opts);       
            
            this.$element.css("fontSize", this.fontSize);

            return true;
        },

        _fillRect: function(wrapper, words) {
            var num = words.length,
                wrapperW = $(wrapper).width(),
                wrapperH = $(wrapper).height(),
                ratio = wrapperW / wrapperH;

            if(num == 0) {
                return;
            } else if(num == 1) {
                $(wrapper).html(createBox({width: wrapperW, height: wrapperH, top: 0, left: 0, word: words[0], color: this._getNextColor()}));
            } else if(ratio >= 2.5) {
                var randCol = this._randRange(2, 1, 0.5),
                    leftNum = Math.round(randCol[0] * num),
                    rightNum = num - leftNum,
                    leftWidth = Math.round(wrapperW * randCol[0]),                    
                    rightWidth = wrapperW - leftWidth,
                    html = '';

                if(leftNum == 0) {
                    leftNum = 1;
                    rightNum--;
                } else if(rightNum == 0) {
                    rightNum = 1;
                    leftNum--;
                }

                if(leftNum == 1) {
                    html += this._createBox({width: leftWidth, height: wrapperH, top: 0, left: 0, word: words[0], color: this._getNextColor(), borderR: true});
                } else {
                    html += this._createBox({width: leftWidth, height: wrapperH, top: 0, left: 0, word: '', borderR: true});
                }
                if(rightNum == 1) {
                    html += this._createBox({width: rightWidth, height: wrapperH, top: 0, left: leftWidth, word: words[num - 1], color: this._getNextColor()});
                } else {
                    html += this._createBox({width: rightWidth, height: wrapperH, top: 0, left: leftWidth, word: ''});
                }
                $(wrapper).html(html);

                if(leftNum > 1) {
                    var leftDiv = $(wrapper).children('div')[0];
                    this._fillRect(leftDiv, words.slice(0, leftNum));
                }
                if(rightNum > 1) {
                    var rightDiv = $(wrapper).children('div')[1];
                    this._fillRect(rightDiv, words.slice(leftNum));
                }
            } else {
                var randRow = this._randRange(2, 1, 0.5),
                    topNum = Math.round(randRow[0] * num),
                    bottomNum = num - topNum,
                    topHeight = Math.round(wrapperH * randRow[0]),
                    bottomHeight = wrapperH - topHeight,
                    html = '';

                if(topNum == 0) {
                    topNum = 1;
                    bottomNum--;
                } else if(bottomNum == 0) {
                    bottomNum = 1;
                    topNum--;
                }

                if(topNum == 1) {
                    html += this._createBox({width: wrapperW, height: topHeight, top: 0, left: 0, word: words[0], color: this._getNextColor(), borderB: true});
                } else {
                    html += this._createBox({width: wrapperW, height: topHeight, top: 0, left: 0, word: '', borderB: true});
                }
                if(bottomNum == 1) {
                    html += this._createBox({width: wrapperW, height: bottomHeight, top: topHeight, left: 0, word: words[num - 1], color: this._getNextColor()});
                } else {
                    html += this._createBox({width: wrapperW, height: bottomHeight, top: topHeight, left: 0, word: ''});
                }
                $(wrapper).html(html);

                if(topNum > 1) {
                    var topDiv = $(wrapper).children('div')[0];
                    this._fillRect(topDiv, words.slice(0, topNum));
                }
                if(bottomNum > 1) {
                    var bottomDiv = $(wrapper).children('div')[1];
                    this._fillRect(bottomDiv, words.slice(topNum));
                }
            }
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
                    height -= paddingTop;
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
                    + '">' + '<a href="'+option.word.url+'" >'+option.word.title + '</a></div>';
            } else {
                var html = '<div class="box" style="width:' + width + 'px;'
                    + 'height:' + height + 'px;'               
                    + 'top:' + option.top + 'px;'
                    + 'left:' + option.left + 'px;'
                    + (option.borderR ? 'border-right:' + this.borderWidth + 'px solid #fff;' : '')
                    + (option.borderB ? 'border-bottom:' + this.borderWidth + 'px solid #fff;' : '')               
                    + '"></div>';
            }

            return html;
        },

        _randRange: function(num, base, round) {        
            if(num == 1) {
                return [base];
            }
            var center = base / num,
                min = center * (1 - round),
                max = center * (1 + round),
                rand = Math.random() * (max - min) + min;
            return [rand].concat(this._randRange(num - 1, base - rand, round));
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

        _getNextColor: function() {
            var color = this.colors[this.colorPos % this.colors.length];
            this.colorPos++;
            return color;
        },

        _getWordsWidth: function(word) {
            if($('#get_ww').size() < 1) {
                $('<div id="get_ww" style="display:block;visibility:hidden;font-size:'+this.fontSize+'px"><span></span></div>').appendTo('body');
            }
            $('#get_ww span').html(word);
            return $('#get_ww span').width();
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
        return this;
    };

})(window, jQuery);