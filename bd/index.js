const mysql=require('mysql');
module.exports=(sql,params=[])=>{
    //1.创建间接对象创建连接对象
    let connection=mysql.createConnection({
        host :'localhost',
        port:3306,
        user:'root',
        password:'root',
        database:'1707f-userlist'
    
    })
    //连接数据库、、///连接数据库
    connection.connect((error)=>{
        if(error){
            console.log("数据库连接失败")
        }else{
            console.log("数据库连接成功")
        }
    })
    //增删改查 query(sql语句，[参数],(error,data)=>())
    return new Promise((resolve,reject)=>{
        connection.query(sql,params,(error,data)=>{
            if(error){
                reject(error)
            }else{
                resolve(data)
            }
            //关闭连接
            connection.end()
        })
    })
   
}