/**
 * Created with JetBrains WebStorm.
 * User: chengqiang
 * Date: 12-11-15
 * Time: 下午8:56
 * To change this template use File | Settings | File Templates.
 */
var containerUrl = '/';
var lastUrl = '';
function loadUrl(url){
    lastUrl = containerUrl;
    containerUrl = url;
    $('#rowContent').load(url);
}

function refreshPage(){
    $('#rowContent').load(containerUrl);
}

function goback(){
    loadUrl(lastUrl);
}