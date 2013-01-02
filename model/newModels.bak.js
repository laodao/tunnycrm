/**
 * Created with JetBrains WebStorm.
 * User: chengqiang
 * Date: 12-11-1
 * Time: 下午3:13
 * To change this template use File | Settings | File Templates.
 */

var Sequelize = require("sequelize");

//var sequelize  = new Sequelize( {
//    host: "localhost",
//        port: 3306,
//        protocol: null,
//        logging: false,
//        maxConcurrentQueries: 100,
//        dialect: 'mysql',
//        storage: null,
//        omitNull: true,
//        define: { timestamps: false },
//    sync: { force: true },
//    pool: { maxConnections: 5, maxIdleTime: 30}
//});
var models = {

    Account : {
        id:{type:Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
        account:{type:Sequelize.STRING},
        passwd:{type:Sequelize.STRING},
        email:{type:Sequelize.STRING},
        position:{type:Sequelize.STRING}
    },

    Department : {
        id:{type:Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
        deptName:{type:Sequelize.STRING},
        level:{type:Sequelize.INTEGER},
        status:{type:Sequelize.STRING}
    },

    Customer : {
        id:{type:Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
        customerName:{type:Sequelize.STRING},
        legalRepresentative:{type:Sequelize.STRING},//法人代表
        assets:{type:Sequelize.STRING},
        turnover:{type:Sequelize.STRING},
        scale:{type:Sequelize.STRING},
        source:{type:Sequelize.INTEGER},
        industry:{type:Sequelize.INTEGER},
        customerNature:{type:Sequelize.INTEGER},
        customerType:{type:Sequelize.INTEGER},
        customerStatus:{type:Sequelize.INTEGER},
        phoneNo:{type:Sequelize.STRING},
        email:{type:Sequelize.STRING},
        faxNo:{type:Sequelize.STRING},
        address:{type:Sequelize.STRING},
        remark:{type:Sequelize.STRING}
    },

    LinkMan : {
        id:{type:Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
        name:{type:Sequelize.STRING},
        sex:{type:Sequelize.STRING},
        position:{type:Sequelize.STRING},
        phoneNo:{type:Sequelize.STRING},
        email:{type:Sequelize.STRING},
        faxNo:{type:Sequelize.STRING},
        assistant:{type:Sequelize.STRING},
        assistantPhoneNo:{type:Sequelize.STRING},
        QQ:{type:Sequelize.STRING},
        MSN:{type:Sequelize.STRING},
        twitter:{type:Sequelize.STRING},
        facebook:{type:Sequelize.STRING},
        weibo:{type:Sequelize.STRING},
        englishName:{type:Sequelize.STRING},
        birthday:{type:Sequelize.STRING},
        address:{type:Sequelize.STRING},
        salesState:{type:Sequelize.STRING},
        intention:{type:Sequelize.STRING},
        remark:{type:Sequelize.STRING}
    },

    ParameterValues : {
        id:{type:Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
        value:{type:Sequelize.STRING},
        objectId:{type:Sequelize.INTEGER}
    },

    Parameter : {
        id:{type:Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
        title:{type:Sequelize.STRING},
        items:{type:Sequelize.STRING},
        paramType:{type:Sequelize.STRING},
        paramCategory:{type:Sequelize.STRING}
    },

    financialInfo : {
        id:{type:Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
        depositBank:{type:Sequelize.STRING},
        bankAccount:{type:Sequelize.STRING},
        taxNo:{type:Sequelize.STRING},
        paymentType:{type:Sequelize.STRING},
        creditProblem:{type:Sequelize.STRING},
        currency:{type:Sequelize.STRING}
    },

    CustomerDept : {
        id:{type:Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
        deptName:{type:Sequelize.STRING},
        parentDept:{type:Sequelize.INTEGER}
    },

    Dictionary : {
        id:{type:Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
        code:{type:Sequelize.STRING},
        value:{type:Sequelize.STRING},
        status:{type:Sequelize.STRING}
    },

    DicCategory : {
        id:{type:Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
        categoryName:{type:Sequelize.STRING}
    }
};
//var sequelize = new Sequelize('database', 'username', 'password', {
//    host: "localhost",
//    port: 3306,
//    protocol: null,
//    logging: false,
//    maxConcurrentQueries: 100,
//    dialect: 'mysql',
//    storage: null,
//    omitNull: true,
//    define: { timestamps: false },
//    sync: { force: true },
//    pool: { maxConnections: 5, maxIdleTime: 30}
//});
//
//var Account = sequelize.define('Account', {
//    id:{type:Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
//    account:{type:Sequelize.STRING},
//    passwd:{type:Sequelize.STRING},
//    email:{type:Sequelize.STRING},
//    position:{type:Sequelize.STRING}
//});
//
//var Department = sequelize.define('Department', {
//    id:{type:Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
//    deptName:{type:Sequelize.STRING},
//    level:{type:Sequelize.INTEGER},
//    status:{type:Sequelize.STRING}
//});
//
//var Customer = sequelize.define('Customer', {
//    id:{type:Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
//    customerName:{type:Sequelize.STRING},
//    legalRepresentative:{type:Sequelize.STRING},//法人代表
//    assets:{type:Sequelize.STRING},
//    turnover:{type:Sequelize.STRING},
//    scale:{type:Sequelize.STRING},
//    source:{type:Sequelize.INTEGER},
//    industry:{type:Sequelize.INTEGER},
//    customerNature:{type:Sequelize.INTEGER},
//    customerType:{type:Sequelize.INTEGER},
//    customerStatus:{type:Sequelize.INTEGER},
//    phoneNo:{type:Sequelize.STRING},
//    email:{type:Sequelize.STRING},
//    faxNo:{type:Sequelize.STRING},
//    address:{type:Sequelize.STRING},
//    remark:{type:Sequelize.STRING}
//});
//
//var LinkMan = sequelize.define('LinkMan', {
//    id:{type:Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
//    name:{type:Sequelize.STRING},
//    sex:{type:Sequelize.STRING},
//    position:{type:Sequelize.STRING},
//    phoneNo:{type:Sequelize.STRING},
//    email:{type:Sequelize.STRING},
//    faxNo:{type:Sequelize.STRING},
//    assistant:{type:Sequelize.STRING},
//    assistantPhoneNo:{type:Sequelize.STRING},
//    QQ:{type:Sequelize.STRING},
//    MSN:{type:Sequelize.STRING},
//    twitter:{type:Sequelize.STRING},
//    facebook:{type:Sequelize.STRING},
//    weibo:{type:Sequelize.STRING},
//    englishName:{type:Sequelize.STRING},
//    birthday:{type:Sequelize.STRING},
//    address:{type:Sequelize.STRING},
//    salesState:{type:Sequelize.STRING},
//    intention:{type:Sequelize.STRING},
//    remark:{type:Sequelize.STRING}
//});
//
//var ParameterValues = sequelize.define('LinkManExt', {
//    id:{type:Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
//    value:{type:Sequelize.STRING},
//    objectId:{type:Sequelize.INTEGER}
//});
//
//var Parameter = sequelize.define('LinkManParameter', {
//    id:{type:Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
//    title:{type:Sequelize.STRING},
//    items:{type:Sequelize.STRING},
//    paramType:{type:Sequelize.STRING},
//    paramCategory:{type:Sequelize.STRING}
//});
//
//var financialInfo = sequelize.define('financialInfo', {
//    id:{type:Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
//    depositBank:{type:Sequelize.STRING},
//    bankAccount:{type:Sequelize.STRING},
//    taxNo:{type:Sequelize.STRING},
//    paymentType:{type:Sequelize.STRING},
//    creditProblem:{type:Sequelize.STRING},
//    currency:{type:Sequelize.STRING}
//});
//
//var CustomerDept = sequelize.define('CustomerDept', {
//    id:{type:Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
//    deptName:{type:Sequelize.STRING},
//    parentDept:{type:Sequelize.INTEGER}
//});
//
//var Dictionary = sequelize.define('Dictionary', {
//    id:{type:Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
//    code:{type:Sequelize.STRING},
//    value:{type:Sequelize.STRING},
//    status:{type:Sequelize.STRING}
//});
//
//var DicCategory = sequelize.define('DicCategory', {
//    id:{type:Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
//    categoryName:{type:Sequelize.STRING}
//});
//var models = {
//
//    Account : sequelize.define('Account', {
//        id:{type:Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
//        account:{type:Sequelize.STRING},
//        passwd:{type:Sequelize.STRING},
//        email:{type:Sequelize.STRING},
//        position:{type:Sequelize.STRING}
//    }),
//
//    Department : sequelize.define('Department', {
//        id:{type:Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
//        deptName:{type:Sequelize.STRING},
//        level:{type:Sequelize.INTEGER},
//        status:{type:Sequelize.STRING}
//    }),
//
//    Customer : sequelize.define('Customer', {
//        id:{type:Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
//        customerName:{type:Sequelize.STRING},
//        legalRepresentative:{type:Sequelize.STRING},//法人代表
//        assets:{type:Sequelize.STRING},
//        turnover:{type:Sequelize.STRING},
//        scale:{type:Sequelize.STRING},
//        source:{type:Sequelize.INTEGER},
//        industry:{type:Sequelize.INTEGER},
//        customerNature:{type:Sequelize.INTEGER},
//        customerType:{type:Sequelize.INTEGER},
//        customerStatus:{type:Sequelize.INTEGER},
//        phoneNo:{type:Sequelize.STRING},
//        email:{type:Sequelize.STRING},
//        faxNo:{type:Sequelize.STRING},
//        address:{type:Sequelize.STRING},
//        remark:{type:Sequelize.STRING}
//    }),
//
//    LinkMan : sequelize.define('LinkMan', {
//        id:{type:Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
//        name:{type:Sequelize.STRING},
//        sex:{type:Sequelize.STRING},
//        position:{type:Sequelize.STRING},
//        phoneNo:{type:Sequelize.STRING},
//        email:{type:Sequelize.STRING},
//        faxNo:{type:Sequelize.STRING},
//        assistant:{type:Sequelize.STRING},
//        assistantPhoneNo:{type:Sequelize.STRING},
//        QQ:{type:Sequelize.STRING},
//        MSN:{type:Sequelize.STRING},
//        twitter:{type:Sequelize.STRING},
//        facebook:{type:Sequelize.STRING},
//        weibo:{type:Sequelize.STRING},
//        englishName:{type:Sequelize.STRING},
//        birthday:{type:Sequelize.STRING},
//        address:{type:Sequelize.STRING},
//        salesState:{type:Sequelize.STRING},
//        intention:{type:Sequelize.STRING},
//        remark:{type:Sequelize.STRING}
//    }),
//
//    ParameterValues : sequelize.define('LinkManExt', {
//        id:{type:Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
//        value:{type:Sequelize.STRING},
//        objectId:{type:Sequelize.INTEGER}
//    }),
//
//    Parameter : sequelize.define('LinkManParameter', {
//        id:{type:Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
//        title:{type:Sequelize.STRING},
//        items:{type:Sequelize.STRING},
//        paramType:{type:Sequelize.STRING},
//        paramCategory:{type:Sequelize.STRING}
//    }),
//
//    financialInfo : sequelize.define('financialInfo', {
//        id:{type:Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
//        depositBank:{type:Sequelize.STRING},
//        bankAccount:{type:Sequelize.STRING},
//        taxNo:{type:Sequelize.STRING},
//        paymentType:{type:Sequelize.STRING},
//        creditProblem:{type:Sequelize.STRING},
//        currency:{type:Sequelize.STRING}
//    }),
//
//    CustomerDept : sequelize.define('CustomerDept', {
//        id:{type:Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
//        deptName:{type:Sequelize.STRING},
//        parentDept:{type:Sequelize.INTEGER}
//    }),
//
//    Dictionary : sequelize.define('Dictionary', {
//        id:{type:Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
//        code:{type:Sequelize.STRING},
//        value:{type:Sequelize.STRING},
//        status:{type:Sequelize.STRING}
//    }),
//
//    DicCategory : sequelize.define('DicCategory', {
//        id:{type:Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
//        categoryName:{type:Sequelize.STRING}
//    })
//};
exports.get = function(modelName){

}