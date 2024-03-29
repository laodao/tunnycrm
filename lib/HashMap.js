/**
 * 该类的代码来自网络
 */

var HashMap = function (){
	this.length = 0;
	this.maxLength = Number.MAX_VALUE;
	this.container = {};
    this.keys = [];
}

HashMap.prototype.put = function(objName,objValue){
	try{
		if(this.length >= this.maxLength)
			throw new Error("[Error HashMap] : Map Datas' count overflow !");
		if(objValue && objName && objName != ""){
            if(!this.container[objName]){
                this.keys.push(objName);
            }
            this.container[objName] = objValue;
            this.length ++ ;
        }
	}catch(e){
		return e;
	}
};

HashMap.prototype.get = function(objName){
	if(this.container[objName])
		return this.container[objName];
};

HashMap.prototype.contains = function(objValue){
	try{
		for(var p in this.container){
			if(this.container[p] === objValue)
				return true;
		}
		return false;
	}catch(e){
		return e;
	}
};

HashMap.prototype.remove = function(objName){
	try{
		if(this.container[objName]){
			delete this.container[objName];
			this.length -- ;
		}
	}catch(e){
		return e;
	}
};

HashMap.prototype.pop = function(objName){
	try{
		var ov = this.container[objName];
		if(ov){
			delete this.container[objName];
			this.length -- ;
			return ov;
		}
		return null;
	}catch(e){
		return e;
	}
};

HashMap.prototype.removeAll = function(){
	try{
		this.clear();
	}catch(e){
		return e;	
	}
};

HashMap.prototype.clear = function(){
	try{
		delete this.container;
		this.container = {};
		this.length = 0;
	}catch(e){
		return e;
	}
};

HashMap.prototype.isEmpty = function(){
	if(this.length === 0)
		return true;
	else
		return false;
};

HashMap.prototype.runIn = function(fun){
	try{
		if(!fun)
			throw new Error("[Error HashMap] : The paramer is null !");
		for(var p in this.container){
			var ov = this.container[p];
			fun(ov);
		}
	}catch(e){
		return e;
	}
};
HashMap.prototype.getKeys = function(){
    return this.keys;
};
HashMap.prototype.toString = function(){
    var str = "{";
    var instance = this;
    this.keys.forEach(function(key){
        str += key;
        str += ":";
        str += instance.get(key);
        str += ",";
    });
    if(str.length>1){
        str = str.substr(str.length-2);
    }
    str += "}";
    return str;
};
exports.HashMap = HashMap;