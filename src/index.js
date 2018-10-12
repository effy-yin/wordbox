import './wordbox.scss'
//import $ from 'jquery';
import WordBox from './wordbox.js'

$.fn.wordbox = function(options) {

    let instance = new WordBox(this, options) 
    
    if (!instance) {
        console.log('创建失败')
        return null
    }               
    
    // 返回jquery对象 
    // this指的是应用插件的元素，而不是instance
    return $(this)
}

export {WordBox}
