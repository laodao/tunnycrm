/**
 * Created with JetBrains WebStorm.
 * User: chengqiang
 * Date: 12-11-23
 * Time: 下午11:17
 * To change this template use File | Settings | File Templates.
 */

//var logger = require('../lib/logger').getLogger();

function SyncQueue(){
    this.queue = [];
    this.callback = null;
    this.isEnd = false;
}

SyncQueue.prototype.add = function(obj){
    this.queue.push(obj);
    return this;
};

SyncQueue.prototype.exec = function(fn){
    var instance = this;
    var recursion = function() {
        if(instance.isEnd){
            return;
        }
        var obj = instance.queue.pop();
        var result = fn(obj, function(){
            if(result==='error'){
                instance.isEnd = true;
                console.log('error while obj:'+obj);
            }
            recursion();
        });
    };
    recursion();
};

var q = new SyncQueue();
q.add('a').add('b');
q.exec(function(obj, fn){
    if(obj==='a'){
        console.log(obj);
    }
    if(obj==='b'){
        console.log(obj);
        return 'error';
    }
});