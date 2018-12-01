/*
 * @Description:        WordBox类 
 * @Author:             Effy 
 * @Date:               2018-11-14 15:52:28 
 * @Last Modified by: Effy
 * @Last Modified time: 2018-11-14 16:17:18
 */

class WordBox {
  /**
   * Creates an instance of WordBox.
   * @param {String} wrapper 外层容器
   * @param {Object} options 插件选项
   * @memberof WordBox
   */
  constructor(wrapper, options) {
    const DEFAULTS = {        
      isLead: false,          // 是否包含“全部”分类，该分类会始终显示在第一个位置上
      leadWord: null,
      words: null,
      colors: ['#cc5b34', '#c27c4d'],
      isFixedWidth: true,
      width: 1000,
      height: 200
    }
    this.options = Object.assign({}, DEFAULTS, options)
    this.$wrapper = $(wrapper)
    if (!this.$wrapper || this.options.words.length < 1) {
      return false
    }
    
    this.words = []
    this.colors = []
    this.colorPos = 0

    this._create()
    this._bindListener()

    return this
  }
  /**
   * 初始化方法
   * @method _create
   * @memberof WordBox
   */
  _create() {
    if (this.options.isLead && this.options.leadWord) {
      this.words = [this.options.leadWord, ...this._randArray(this.options.words)]
    } else {
      this.words = this._randArray(this.options.words)
    }
            
    // 容器宽高初始化
    if (this.options.isFixedWidth) {
      // 容器固定宽高
      this.$wrapper.width(this.options.width)
      this.$wrapper.height(this.options.height)
    } else {
      // 容器宽高根据父级元素自适应
      this.$wrapper.width(this.$wrapper.parent().width())
      this.$wrapper.height(this.$wrapper.parent().height())
    }           
    
    // 递归创建box
    this.fillRect(this.$wrapper, 
      0,
      0, 
      this.$wrapper.width(), 
      this.$wrapper.height(), 
      this.words)
  }
  
  /**
   * 递归创建box
   * @method fillRect
   * @param {String} wrapper 外层容器
   * @param {Number} left
   * @param {Number} top
   * @param {Number} width
   * @param {Number} height
   * @param {Array} words
   * @memberof WordBox
   */
  fillRect(wrapper, left, top, width, height, words) {
    let wordLen = words.length,               
      ratio = width / height,
      dot = this._randRange(1, 2, 0.5),
      wordLen1 = Math.round(wordLen * dot[0]),
      wordLen2 = wordLen - wordLen1
    
    if (wordLen == 1) {
      this._createBox(wrapper, 
        left, 
        top, 
        width, 
        height, 
        words[0], 
        this._getNextColor())
      return
    } 
    
    if (wordLen1 == 0) {
      wordLen1 = 1
      wordLen2--
    } else if (wordLen2 == 0) {
      wordLen2 = 1
      wordLen1--
    }
    
    if (ratio >= 2.5) {
      // 左右分割
      let leftW = Math.round(width * dot[0]),                    
        rightW = width - leftW
    
      this.fillRect(wrapper, 
        left, 
        top, 
        leftW, 
        height, 
        words.slice(0, wordLen1))
      this.fillRect(wrapper, 
        left+leftW, 
        top, 
        rightW, 
        height, 
        words.slice(wordLen1))             
    } else {
      // 上下分割
      let topH = Math.round(height * dot[0])
      // bottomH = height - topH;
    
      this.fillRect(wrapper, 
        left, 
        top, 
        width, 
        topH, 
        words.slice(0, wordLen1))
      this.fillRect(wrapper, 
        left, 
        top+topH, 
        width, 
        height-topH, 
        words.slice(wordLen1))
    }
  }
    
  /**
   * 创建box
   * @method _createBox
   * @param {String} wrapper
   * @param {Number} left
   * @param {Number} top
   * @param {Number} width
   * @param {Number} height
   * @param {String} word
   * @param {String} color
   * @memberof WordBox
   */
  _createBox(wrapper, left, top, width, height, word, color) {
    let lineHeight = height,
      paddingTop = 0,        
      wordW = this._getWordsWidth(word.title)
    
    // 如果box中文字的宽度超出box本身的宽度，则需要分多行显示
    if (wordW > width) {
      let line = Math.ceil(wordW / width)
      // 注意设置 line-height 属性和 padding-top 属性
      lineHeight = parseInt(this.$wrapper.css('font-size'))
      paddingTop = Math.max(0, (height - line * lineHeight) / 2)
      height -= paddingTop
    }
    
    let html = '<div class="box" style="width:' + width + 'px;' +
                  'height:' + height + 'px;' +
                  'line-height:'+ lineHeight + 'px;' +
                  'top:' + top + 'px;' +
                  'left:' + left + 'px;' +
                  'background-color:' + color + ';' +             
                  (paddingTop ? ('padding-top:' + paddingTop + 'px;') : '') +
                  '">' + '<a href="' + word.url + '" >' + word.title + '</a></div>'          
    
    $(wrapper).append(html)
  }
    
  /**
   * 将base随机分成num份
   * @method _randRange
   * @param {Number} base  被分割的数
   * @param {Number} num   分割的份数
   * @param {Number} round base被分割之后两部分的最大差，为了避免每部分太大或太小
   * @return {Array} 包含num个分界点的数组
   */ 
  _randRange(base, num, round) {        
    let center = base / num,
      min = center * (1 - round),
      max = center * (1 + round),
      rand = Math.random() * (max - min) + min
    
    if (num == 1) {
      return [base]
    }
    
    return [rand].concat(this._randRange(base - rand, num - 1, round))
  }
    
  /**
   * 每次绘制box时获取color列表中下一个颜色值
   * @method _getNextColor
   * @return {String} 颜色值
   */
  _getNextColor() {
    let color = this.options.colors[this.colorPos % this.options.colors.length]
    this.colorPos++
    return color
  }
    
  /**
   * 获取指定字体大小的word的宽度，根据该宽度和 box 宽度判断是否分行
   * @method _getWordsWidth
   * @param {String} word 
   */ 
  _getWordsWidth(word) {
    if ($('#get_ww').length < 1) {
      $('<div id="get_ww" style="display:block;visibility:hidden;font-size:'+this.$wrapper.css('font-size')+'px"><span></span></div>').appendTo('body')
    }
    $('#get_ww span').html(word)
    return $('#get_ww span').width()
  }
    
  /**
   * 随机排列数组元素
   * @method _randArray
   * @param {String} array
   * @returns
   * @memberof WordBox
   */
  _randArray(array) {
    let clone = array.slice(),          
      ret = [], 
      rand
    for(let i = 0, len = array.length; i < len; i++) {
      rand = Math.floor(Math.random() * clone.length)
      let tmp = clone[0]
      clone[0] = clone[rand]
      clone[rand] = tmp
      ret.push(clone[0])
      clone = clone.slice(1)
    }
    return ret
  }
    
  /**
   * 绑定窗口大小改变事件
   * @method _bindListener
   * @memberof WordBox
   */
  _bindListener() {
    if (!this.options.isFixedWidth) {
      let _this = this, 
        timer = null
      $(window).bind('resize', function() {     
        if (timer) {
          clearTimeout(window.timer)
          timer = null
        }           
        timer = setTimeout(function() {
          // 响应式 wordbox 根据父级元素宽度和高度的变化来改变自身的宽度和高度，重新绘制
          if (_this.$wrapper.width() != _this.$wrapper.parent().width() || 
                            _this.$wrapper.height() != _this.$wrapper.parent().height()) {
            _this.$wrapper.width(_this.$wrapper.parent().width())
            _this.$wrapper.height(_this.$wrapper.parent().height())
            // 清除之前绘制的wordbox
            _this.$wrapper.empty()
            // 重新绘制wordbox
            _this.fillRect(_this.$wrapper, 
              0,
              0,
              _this.$wrapper.width(), 
              _this.$wrapper.height(),
              _this.words)
          }                    
        }, 800)                 
      })
    }
  }
}    

export default WordBox




