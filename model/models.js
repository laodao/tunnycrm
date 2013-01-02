var dbutil = require('tunny').dbutil;
var db = dbutil.getDBConn("chatroom");
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var models = {
UserInfo:{
	'id':ObjectId,
	'account':{ type: Schema.ObjectId, ref: 'UserAccount' },
	'sex':{type:String},
	'birthDay':{ type: Date, index:true },
	'age':{type:Number},
	'phone':{type:String},
	'address':{ type: Schema.ObjectId, ref: 'Address' }
},

UserAccount:{
	'id':ObjectId,
	'nickname':{type:String},
	'passwd':{type:String},
	'email':{ type: String, index: { unique: true } },
	'domain':{type:String},
	'regTime':{type:Date},
	'status':{type:String},
	'lastLoginIp':{type:String},
	'lastLoginTime':{type:Date},
	//'userinfo':{ type: Schema.ObjectId, ref: 'UserInfo' },
	//'friends':[ this.UserAccount],
	'isAdmin':{type:Boolean}
},

Activity:{
    'id':ObjectId,
    'title':{type:String},
    'summary':{type:String},
    'plase':{type:String},
    'createUser':{ type: Schema.ObjectId, ref: 'UserAccount' },
    'contactInfo':{ type: String },
    'startTime':{type:Date},
    'endTime':{type:Date},
    'leader':{ type: Schema.ObjectId, ref: 'UserAccount' },
    'content':{ type: String },
    'cost':{type:Number},
    'crewSize':{type:Number},//预计的人数
    'bookedNumber':{type:Number},//实际报名的人数
    'pictures':[this.Picture],
    'status':{type:String}
},

Picture:{
	'id':ObjectId,
	'title':{type:String},
	'description':{type:String},
	'filePath':{type:String},
	'thumbnail':{type:String},
	'createUser':{ type: Schema.ObjectId, ref: 'UserAccount' },
	'createDate':{type:Date},
	'uploadTime':{type:Date},
	'theme':{type:String}//主题
},

Article:{
    'id':ObjectId,
    'title':{type:String},
    'summary':{type:String},
    'content':{type:String},
    'createUser':[this.UserAccount],
    'createDate':{type:Date},
    'theme':{type:String},//主题
    'activity':{type:Schema.ObjectId, ref:'Activity'},
    'comments':{type:Schema.ObjectId, ref:'Comment'}
},

Comment:{
    'id':ObjectId,
    'title':{type:String},
    'userName':{type:String},
    'email':{type:String},
    'content':{type:String},
    'quote':{ type: Schema.ObjectId, ref: 'Comment' },
    'target':{type:String},//评论的对象，可能是文章也可能是图片
    'targetType':{type:String},
    'createUser':{ type: Schema.ObjectId, ref: 'UserAccount' },
    'createTime':{type:Date},
    'ip':{type:String}
},

Category:{
    'id':ObjectId,
    'title':{type:String},
    'parent':{type:ObjectId,ref:"Category"},
    'status':{type:String}
}
};

exports.get = function(modelName){
    var db = mongoose.createConnection('localhost', 'chatroom');
    var schema = mongoose.Schema(models[modelName]);
//    var m = testdb.model(modelName, schema);
    return db.model(modelName, schema);
};
