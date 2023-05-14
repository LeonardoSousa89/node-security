const { knex_I }=require('../repositories/db_I')
const { knex_II }=require('../repositories/db_II')
const { cipher, decipher }=require('../config/security/crypto/crypto')
const { all }=require('../projections/mailProjection')
const { 
  exceptionFieldNullOrUndefined,
  exceptionFieldIsEqualZero,
  exceptionFieldIsEmpty
}=require('./error/error')

const { attachPaginate }=require('knex-paginate')

const jwt=require('jsonwebtoken')
const dotenv=require('dotenv') 

attachPaginate()
dotenv.config()

const Secret=process.env.TOKEN_SECRET_KEY

async function authorizedClient(req, res, next){
  
  const authorization=req.headers['authorization']
 
  if(!authorization) return res.status(401)
                               .json({
                                  error: 'authorization not sended'
  })
  
  const token=authorization.split(' ')[1]
  
  if(!token) return res.status(401)
                       .json({
                          error: 'user must be logged'
  })
   
  jwt.verify(token.trim(), Secret,(error, decoded)=>{
        if(error) {
            
            return res.status(401)
                      .json({
                        error: 'token invalid'
                          })
        }
        
        if(req.params.id != decoded.payload.id) return res.status(401)
                                                          .json({
                                          error: 'user not authorized'
        })
        
        req.payload=decoded.payload
        
        next()
    })
}



async function sendMail(req, res){
  
  const data={
    mail_destination: req.body.mail_destination,
    topic: req.body.topic,
    mail_msg: req.body.mail_msg,
    sender: req.body.sender
  }
  
 try{
    exceptionFieldNullOrUndefined(data.mail_destination, 'destination is undefined or null')
    exceptionFieldIsEmpty(data.mail_destination.trim(), 'destination can not be empty')
    exceptionFieldNullOrUndefined(data.mail_msg, 'email is undefined or null')
    exceptionFieldIsEmpty(data.mail_msg.trim(), 'email can not be empty')
    exceptionFieldNullOrUndefined(data.sender, 'sender is undefined or null')
    exceptionFieldIsEqualZero(data.sender, 'sender can not be empty')
  }catch(e){
    return res.status(400).json({
      error: e
    })
  }
  
  var mailDestinationValid=null
  
  await knex_I.select('*')
              .from('client')
              .then(response=>{
      
                const value=response.map(e=>{
                  return {
                    id: e.id,
                    email: e.email
        }
      })
      
      mailDestinationValid=value
  })
  
  var mailValid=mailDestinationValid.filter(e=>{
    const isValid=e.email === data.mail_destination
    
    return isValid
  })
  
  if(mailDestinationValid.length<=0 || mailValid.length<=0) return res.status(404)
                                                                      .json({
                              error: 'email from destination not found'
  })

  const topicCrypted=cipher(data.topic)
  const mail_msgCrypted=cipher(data.mail_msg)
  
  const dataCrypted={ 
     mail_destination: data.mail_destination,
     topic: topicCrypted,
     mail_msg: mail_msgCrypted,
     client_id: mailValid[0].id,
     sender: data.sender
  }
  
  const sendbox=await knex_I.insert(dataCrypted)
                            .from('email_server')
                            .then(_=>{
                    
                              knex_II.insert({
                                  sender: dataCrypted.sender,
                                  mail_destination: dataCrypted.mail_destination,
                                  topic: dataCrypted.topic,
                                  mail_msg: dataCrypted.mail_msg
                                })
                                .from('email_server')
                                .then(response=>response)
                                
                                return res.status(201).json({
                                  msg: 'email send'
                              })
                  })
                  .catch(_=>res.status(500).json({
                    msg: 'sorry, ocurred an error with server'
                  }))
  
  return sendbox
}



async function sendedMail(req, res){
  
  const mailMessage=await knex_II.select('*')
      .from('email_server')
      .where('sender', req.query.sender)
      .paginate({ 
              perPage: req.query.size, 
              currentPage: req.query.page
            })
      .then(response=>{
        
        if(response.data.length === 0) return res.status(404).json({
              error: 'there is not email in sendbox'
              })
                   
           const data=response.data.map(e=>{
             return {
                  id: e.id,
                  sender: e.sender,
                  mail_destination: e.mail_destination,
                  topic: decipher(e.topic),
                  mail_msg: decipher(e.mail_msg)
                }
             })
           
          return res.status(200).json({
                data,
                pagination: response.pagination
            })
          }).catch(_=>res.status(500).json({
            msg: 'sorry, ocurred an error with server'
          }))
          
  return mailMessage
}



async function receivedMail(req, res){
  
  const mailMessage=await knex_I.select(all)
      .from('email_server')
      .innerJoin('client', 'client.id', 'email_server.client_id')
      .where('email_server.mail_destination', req.query.email)
      .where('email_server.client_id', req.params.id)
      .paginate({ 
              perPage: req.query.size, 
              currentPage: req.query.page
            })
      .then(response=>{

        if(response.data.length === 0) return res.status(404).json({
              error: 'there is not email in inbox'
              })
                   
           const data=response.data.map(e=>{
             return {
                  id: e._email_id,
                  sender: e.sender,
                  mail_destination: e.mail_destination,
                  topic: decipher(e.topic),
                  mail_msg: decipher(e.mail_msg)
                }
             })
           
          return res.status(200).json({
                data,
                pagination: response.pagination
            })
          }).catch(_=>res.status(500).json({
            msg: 'sorry, ocurred an error with server'
          }))
          
  return mailMessage
}



async function deleteSendedEmailById(req, res){
  
  await knex_II.where('id', req.query.id)
               .from('email_server')
               .delete()
               .then(response=>{
                 
                 if(response === 0) return res.status(404).json({
                   msg: 'email not found'
                 })
                
                 return res.status(204).json({})
               })
               .catch(_=>res.status(500).json({
                     msg: 'sorry, ocurred an error with server'+_
              }))
               
}


async function deleteAllSendedEmail(req, res){
  
  await knex_II.where('sender', req.query.sender)
               .from('email_server')
               .delete()
               .then(response=>{
                 
                 if(response === 0) return res.status(404).json({
                   msg: 'there is not email in sendbox'
                 })
                
                 return res.status(204).json({})
               })
               .catch(_=>res.status(500).json({
                     msg: 'sorry, ocurred an error with server'+_
               }))
}


async function deleteReceivedEmailById(req, res){
  
  await knex_I.where('id', req.query.id)
              .from('email_server')
              .delete()
              .then(response=>{
                 
                if(response === 0) return res.status(404).json({
                   msg: 'email not found'
                 })
                
                 return res.status(204).json({})
               })
              .catch(_=>res.status(500).json({
                     msg: 'sorry, ocurred an error with server'+_
             }))
}


async function deleteAllReceivedEmail(req, res){
  
  await knex_I.where('mail_destination', req.query.mail_destination)
             .from('email_server')
             .delete()
             .then(response=>{
                 
                if(response === 0) return res.status(404).json({
                   msg: 'there is not email in inbox'
                 })
                
                 return res.status(204).json({})
               })
            .catch(_=>res.status(500).json({
                     msg: 'sorry, ocurred an error with server'+_
              }))
}



module.exports={
  authorizedClient,
  sendMail,
  sendedMail,
  receivedMail,
  deleteSendedEmailById,
  deleteAllSendedEmail,
  deleteReceivedEmailById,
  deleteAllReceivedEmail
}