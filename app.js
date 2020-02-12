const Koa = require('koa');

const app = new Koa();

const static = require('koa-static'); //处理静态资源 中间件

const router = require('koa-router')();

const bodyparser = require('koa-bodyparser');  //中间件

const path = require('path');

const query = require('./bd/');

app.use(static(path.join(__dirname,'./public/')));

app.use(bodyparser()); //把前端传递的参数放在ctx.request.body

app.use(router.routes());

app.use(router.allowedMethods());
//查询所有成员
router.get('/api/userlist',async(ctx)=>{
     // 页码        条数
  let {pagenum=1,limit=2}=ctx.query;
  let startIndex=(pagenum-1) * limit //起始的下标   
  //1.0 2.2 3.4
    let data=await query(`select * from userlist limit ${startIndex},${limit}`)
    console.log(data)
//ctx.body="123"
  ctx.body={
      code:1,
      data
  }

})
//添加
router.post('/api/registry',async(ctx)=>{
   console.log(ctx.request.body)
  //获取前端传递的数据  
  let {name,age,phone,sex,password}=ctx.request.body;
  if(name&&age&&phone&&sex&&password){
    //排重
    let data=await query('select * from userlist where name=?',[name])
    console.log(data)
    if(data.length){
      //此人已存在
      ctx.body={
        code:3,
        msg:"此人存在"
      }
    }else{
       try{
       await query('insert into userlist(name,age,phone,sex,password) values (?,?,?,?,?)',[name,age,phone,sex,password]) 
          ctx.body={
              code:1,
              msg:'添加注册成功'
          }
      }catch(e){
        ctx.body={
          code:0,
          meg:e
        }
      }
    }
    }else{
      ctx.body={
          code:2,
            msg:'参数不完整'
      }
  }
})
//删除
router.delete('/api/del',async(ctx)=>{
  let {id} =ctx.query
  if(id){
    //容错处理
      try{
        await query('delete from userlist where id=?',[id]);
        ctx.body={
                code:1,
                msg:"删除成功"
        }
      }catch(e){
          ctx.body={
            code:0,
            msg:e
          }
      }
  }else{
    ctx.body={
      code:2,
      msg:"参数不完整"
    }
  }
})
//修改  genxin
router.put('/api/update',async(ctx)=>{
  let {name,age,phone,sex,id}=ctx.request.body
  if(name,age,phone,sex,id){
    try{
        await query('update userlist set name=?,age=?phone=?,sex=?,where id=?',[name,age,phone,sex,id])
        ctx.body={
              code:1,
              msg:"更新成功"
            }
    }catch(e){
      ctx.body={
        code:1,
        msg:e
      }       
    }
  }else{
    ctx.body={
      code:2,
      msg:'参数不完整'
    }    
  }

})
//邓肯
router.post('/api/login',async(ctx)=>{
   let {name,password}=ctx.request.body;
   if(name&&password){
     let data=await query("select * from userlist where name=? and password=?",[name,password])
      if(data.length){
            ctx.body="登陆成功"
      }
    }else{
      ctx.body="参数不完整"
    }
})
app.listen(3000,()=>{
    console.log("服务启动成功")
})
