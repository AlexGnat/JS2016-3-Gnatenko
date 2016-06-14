 /**
 * Created by Malkav on 12.06.2016.
 */
"use strict";
 const PostHTML = require("posthtml");
 const FileSync=require('fs');

 const html = FileSync.readFileSync('./index-before-posthtml.html');

 const bootstrapReg = new RegExp("active|affix|arrow|badge|bottom|breadcrumb|caption|caret|close|collapse|collapsing|container|control-label" +
    "|divider|fade|help-block|hide|initialism|invisible|item|jumbotron|lead|left|next|page-header|pager" +
    "|pagination|pill-pane|pre=scrollable|pretty-print|prev|right|row|show|sr-only|thumbnail|top" +
    "|alert(-(danger|dismissable|info|link|success|warning)){0,1}" +
    "|btn(-(block|danger|default|group|group-justified|group-vertical|info|lg|link|primary|success|warning|xs)){0,1}" +
    "|carousel(-(caption|control|indicators|inner)){0,1}" +
    "|col(-(lg|sm|md|xs)(-(offset|pull|push)){0,1}-[0-9]([0-1]){0,1}){0,1}" +
    "|checkbox(-inline){0,1}" +
    "|dropdown(-(backdrop|header|menu|toggle)){0,1}" +
    "|form-(control|control-static|group)" +
    "|glyphicon(-chevron-right){0,1}" +
    "|h[1-6]" +
    "|hidden(-(lg|md|sm|xs|print)){0,1}" +
    "|icon(-(bar|next)){0,1}" +
    "|img-(circle|responsive|rounded|thumbnail)" +
    "|input-(group|group-addon|group-btn|lg|sm)" +
    "|label(-(danger|default|info|primary|success|warning)){0,1}" +
    "|list-(group(-(item|item-heading|item-text)){0,1}|inline|unstyled)" +
    "|modal(-(backdrop|body|content|dialog|footer|header|open|title)){0,1}" +
    "|navbar(-(brand|btn|collapse|default|fixed-bottom|fixed-top|form|header|inverse|left|link|nav|right|static-top|text|toggle)){0,1}" +
    "|nav(-(divider|justified|tabs|tabs-justified)){0,1}" +
    "|panel(-(body|danger|default|footer|heading|info|primary|success|title|warning)){0,1}" +
    "|popover(-(content|title)){0,1}" +
    "|text-(muted|primary|warning|danger|success|info|left|right|center)" +
    "|progress(-bar-(danger|info|success|warning)){0,1}" +
    "|pull-(left|right)" +
    "|table(-(bordered|responsive)){0,1}" +
    "|tooltip(-(arrow|inner)){0,1}" +
    "|visible-(lg|md|print|sm|xs)" +
    "|well(-(lg|sm)){0,1}", "ig");

 const jsClassReg = new RegExp("js-[_a-zA-Z0-9-]+", "ig");

 const removeSpacesReg = /\s\s+/ig;

 const plugin = tree => tree
     .match([{ attrs: {'class': bootstrapReg}}, { attrs: {'class': jsClassReg}}], node => {
         let classes = " " + node.attrs.class + " ";
         classes = classes.replace(bootstrapReg, '');
         const jsClasses = classes.match(jsClassReg) || [];
         classes = classes.replace(jsClassReg, '');
         classes = classes.replace(removeSpacesReg, ' ').trim();
         node.attrs.class = classes;

         const jsClassesLen = jsClasses.length;
         let jsData = "";
         for (let i=0; i < jsClassesLen; i++) {
            let curJsClass = jsClasses[i].replace('js-', '');
            if (curJsClass) {
                jsData = jsData + " " + curJsClass;
            }
         }
         jsData = jsData.trim();
         if (jsData) {
             node.attrs['data-js'] = jsData;
         }
         return node;
    });
 PostHTML([ plugin ])
     .process(html)
     .then(result => {
        console.log(result.html);
        FileSync.writeFileSync('./index-after-posthtml.html', result.html, 'utf8');
    });

