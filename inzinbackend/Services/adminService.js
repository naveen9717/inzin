/**
 * Author Shubham 
 * Service File For Mongoose functions
 * 
 */

const jwt = require("jsonwebtoken");
const User=require('../models/users');

const SimpleNodeLogger = require('simple-node-logger'),
    opts = {
        logFilePath:'./logs/logs.json',
        timestampFormat:'YYYY-MM-DD HH:mm:ss.SSS'
    },
log = SimpleNodeLogger.createSimpleLogger( opts );
const adminService={};

adminService.getUserByUsername=async(username,password)=>{
    try {
        let user = await User.findOne({
          username: username,
          isactive:true
        });
        if (!user) {
          return {"status":false,message:"User Not Found"};
        } 
        else {
          // checking password here for user
          if (password == user.password) {
    
           
            // authentication success
            const token = jwt.sign({
              "username": user.username,
              "role": user.role,
              "time":new Date()
              
            }, secretkey, {
              expiresIn: "1h"
            })
    
            
           return {
               "status":true,
              "message": "Successfull Login",
              "token": token,
              "user": user.username,
              "role": user.role,
            
              
            }
    
          } else {
           
            return{
              "status":false,
              "message": "Wrong Password or Username"
            }
          }
        }
      } catch (err) {
        log.error({type:"error while requesting username",date:new Date(),error:err});
        return{
            status:false,
            message:"Internal Server Error Occurred"
        }
      }
    


}

adminService.getAllUsers=async()=>{

    return  await User.find();

}

adminService.saveUser=async(...userdata)=>{
  try{
    let user =new User({

        username:userdata[0],
        password:userdata[1],
        role:userdata[2],
        isactive:userdata[3]
  
      });
  
      return await user.save();
  }
    catch(err)
    {
        log.error({type:"error while saving new user"+userdata[0],date:new Date(),error:err});
    }
   

}


module.exports=adminService;