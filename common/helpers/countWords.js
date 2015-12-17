/**
 * Count words for a given string. ONLY UTF-8
 */

'use strict';

/**
 * @see http://www.mediacollege.com/internet/javascript/text/count-words.html
 */
module.exports = function(text) {
    if (!text) {
        return 0;
    }

    return text
        // exclude  start and end white-space
        .replace(/(^\s*)|(\s*$)/gi, '')
        // 2 or more space to 1
        .replace(/[ ]{2,}/gi, ' ')
        // exclude newline with a start spacing
        .replace(/\n /, '\n')
        // count words
        .split(' ').length;
};
