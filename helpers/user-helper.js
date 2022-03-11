var db = require("../config/connection");
var collection = require("../config/collections");
var bcrypt = require('bcrypt');
const { response } = require("express");
const { ObjectId } = require("mongodb");

module.exports={
    doSignup:(userData)=>{
        return new Promise(async(resolve,reject)=>{
            userData.Password = await bcrypt.hash(userData.Password,10)
            db.get().collection(collection.USER_COLLECTION).insertOne(userData).then((data) => {
                resolve(data.insertedId)
                console.log(data.insertedId)
            })
        })
    },
    doLogin:(userData)=>{
        return new Promise(async(resolve,reject)=>{
            let loginStatus=false
            let response={}
            let user = await db.get().collection(collection.USER_COLLECTION).findOne({email:userData.email})
            if(user){
                bcrypt.compare(userData.Password,user.Password).then((status)=>{
                    if(status){
                        
                        response.user=user
                        response.status=true
                        resolve(response)

                    }else{
                        console.log("Fail")
                        resolve({status:false})
                    }
                })
            }else{
                console.log("wrong email")
                resolve({status:false})
            }
        })
    },
    addDetails: (userid,newdata) => {
            return new Promise(async(resolve,reject)=>{
                let userObj = await db.get().collection(collection.DATA_COLLECTION).findOne({user:ObjectId(userid)})
                if (userObj){
                    db.get().collection(collection.DATA_COLLECTION)
                    .updateOne(
                        {user:ObjectId(userid)},
                        {
                            $push:{
                                data:newdata
                            }
                        }
                    ).then(()=>{
                        resolve()
                    })
                }
                else{
                    let dataObj={
                        user:ObjectId(userid),
                        data:[newdata]
                    }
                    db.get().collection(collection.DATA_COLLECTION)
                    .insertOne(dataObj)
                    .then(() => {
                        resolve()
                        console.log(data+"inserted")
                        
                    })
                    .catch(err => {
                        console.log("error:"+err)
                    });
                }
                
            })
            
    },
    getAllDetails:(user)=>{
        return new Promise(async(resolve,reject)=>{
            let data=await db.get().collection(collection.DATA_COLLECTION).aggregate(
                [   {
                        $match:{user:ObjectId(user._id)}
                    }
                ]
            ).toArray()  
           
            resolve(data[0].data)
        })
        
    }

}