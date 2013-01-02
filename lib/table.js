/**
 * Created with JetBrains WebStorm.
 * User: chengqiang
 * Date: 12-11-4
 * Time: 下午9:55
 * To change this template use File | Settings | File Templates.
 */

var DBUtil = require('./DBUtil').DBUtil, HashMap = require('./HashMap').HashMap;

function Condition(field,value,exp){
    this.field = field;
    this.value = value;
    this.exp = exp;
}

Condition.prototype.getField = function(){
    return this.field;
};

Condition.prototype.getValue = function(){
    return this.value;
};

Condition.prototype.getExp = function(){
    return this.exp||'=';
};

function Join(tableName, direction){
    this.tableName = tableName;
    this.direction = direction;
}

function Table(tableNames){
    this.db = new DBUtil();
    this.conn = this.db.getConn();
    this.tableNames = tableNames;
    this.fields = new HashMap();
    this.selectStr = "";
    this.whereCond = [];
    this.orCond = [];
    this.condParam = [];
    this.orderStr = "";
    this.start = null;
    this.end = null;
//    this.fields =
}

Table.prototype.querySql = function(){
    var instance = this;
    var sql = "select ";
    var fields = this.fields.getKeys();
//        if(fields.length>0){
//            sql += fields.join(",");
//        }
    if(this.select){
        sql += this.selectStr;
    }else{
        sql += "*";
    }
    sql += " from "+this.tableNames;
    if(this.whereCond.length>0){
        sql += " where "
        this.whereCond.forEach(function(cond){
            if(cond.getValue()){
                sql += cond.getField() + cond.getExp()+"? and";
                instance.condParam.push(cond.getValue());
            }else{
                sql += cond.getField();
            }
        });
        if(sql.lastIndexOf('and')==sql.length-3){
            sql = sql.substr(0,sql.length-3);
        }
    }
    if(this.orCond.length>0){
        sql += " where "
        this.orCond.forEach(function(cond){
            if(cond.getValue()){
                sql += cond.getField() + cond.getExp()+"? or";
                instance.condParam.push(cond.getValue());
            }else{
                sql += cond.getField();
            }
        });
        if(sql.lastIndexOf('or')==sql.length-2){
            sql = sql.substr(0,sql.length-2);
        }
    }
    if(this.orderStr){
        sql += " order by " + this.orderStr;
    }
    return sql;
};

Table.prototype.select = function(selectStr){
    this.selectStr = selectStr;
    return this;
};

Table.prototype.join = function(joinTable, direction){
    return this;
};

Table.prototype.where = function(k,v,exp){
    this.whereCond.push(new Condition(k,v,exp));
    return this;
};

Table.prototype.or = function(k,v,exp){
    this.orCond.put(new Condition(k,v,exp));
    return this;
};

Table.prototype.orderBy = function(order){
    if(this.orderStr){
        this.orderStr += " , " + order;
    }else{
        this.orderStr = order;
    }
    return this;
};

Table.prototype.limit = function(pageSize, pageNo){
    this.start = pageSize*(pageNo-1);
    this.end = pageSize*pageNo;
    return this;
};

Table.prototype.count = function(fn){
    var sql = "select count(*) from " + this.tableNames;
    var instance = this;
    if(this.whereCond.length>0){
        sql += " where "
        this.whereCond.forEach(function(cond){
            if(cond.getValue()){
                sql += cond.getField() + cond.getExp()+"? and";
                instance.condParam.push(cond.getValue());
            }else{
                sql += cond.getField();
            }
        });
        if(sql.lastIndexOf('and')==sql.length-3){
            sql = sql.substr(0,sql.length-3);
        }
    }
    if(this.orCond.length>0){
        sql += " where "
        this.orCond.forEach(function(cond){
            if(cond.getValue()){
                sql += cond.getField() + cond.getExp()+"? or";
                instance.condParam.push(cond.getValue());
            }else{
                sql += cond.getField();
            }
        });
        if(sql.lastIndexOf('or')==sql.length-2){
            sql = sql.substr(0,sql.length-2);
        }
    }
    this.conn.query(sql, fn);
};

Table.prototype.set = function(k, v){
    this.fields.set(k, v);
    return this;
};

Table.prototype.setFields = function(fields){
    for(f in fields){
        this.fields.put(f, fields[f]);
    }
    return this;
};

Table.prototype.save = function(fn){
    if(this.fields.isEmpty()){

    }else{
        this.conn.query("insert into " + this.tableName + "set ?", this.fields.toString(), fn);
    }
};

Table.prototype.update = function(fn){
    if(this.fields.isEmpty()){

    }else{
        this.conn.query("update " + this.tableName + "set ?", this.fields.toString(), fn);
    }
};

Table.prototype.delete = function(id, fn){
    if(this.fields.isEmpty()){

    }else{
        this.conn.query("delete from " + this.tableName + "where  id=?", [id], fn);
    }
};

Table.prototype.get = function(id, fn){
    if(this.fields.isEmpty()){

    }else{
        this.conn.query("select * from " + this.tableName + "where id=?", [id], fn);
    }
};

Table.prototype.exec = function(fn){
    var sql = this.querySql();
    this.conn.query(sql, fn);
};

exports.Table = Table;