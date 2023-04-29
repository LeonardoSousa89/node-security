import knex_I from '../repositories/db_I'
  
import { 
  exceptionFieldNullOrUndefined,
  exceptionFieldIsEmpty,
  exceptionFieldValueLessToType,
  exceptionFieldValueLongToType
} from './error/error'

import { cryptograph } from '../config/security/bcrypt/bcrypt'

import bcrypt from 'bcrypt'

import jwt from 'jsonwebtoken'
import * as dotenv from 'dotenv' 

dotenv.config()

const Secret=process.env.TOKEN_SECRET_KEY

async function signup(req, res){
  
  const data={
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  }
  
  try{
    exceptionFieldNullOrUndefined(data.email, 'email is undefined or null')
    exceptionFieldIsEmpty(data.email.trim(), 'email can not be empty')
    exceptionFieldNullOrUndefined(data.password, 'password is undefined or null')
    exceptionFieldIsEmpty(data.password.trim(), 'invalid password')
    exceptionFieldValueLessToType(data.password.trim(), 'password must be greather than 4')
    exceptionFieldValueLongToType(data.password.trim(), 'password maximun size 8')
  }catch(error){
    return res.status(400)
              .json({
                error: error
    })
  }

 const clientAlreadyExist=await knex_I.where('email', data.email)
                                      .from('client')
                                      .first()
  
  if(clientAlreadyExist) return res.status(400)
                                   .json({  msg: 'email already exist' })
  
  data.password=cryptograph(data.password)

  const client=await knex_I.insert(data)
                           .from('client')
                           .then(_=>{
                              res.redirect(201, 'http://127.0.0.1:34568/login')
              })
                           .catch(_=>res.status(500).json({
                              msg: 'sorry, ocurred an error with server' 
              }))
  
  return client 
}



async function login(req, res){
  
  const data={
    email: req.body.email,
    password: req.body.password
  }
  
  try{
    exceptionFieldNullOrUndefined(data.email, 'email is undefined or null')
    exceptionFieldIsEmpty(data.email.trim(), 'email can not be empty')
    exceptionFieldNullOrUndefined(data.password, 'password is undefined or null')
    exceptionFieldIsEmpty(data.password.trim(), 'invalid password')
    exceptionFieldValueLessToType(data.password.trim(), 'password must be greather than 4')
    exceptionFieldValueLongToType(data.password.trim(), 'password maximun size 8')
  }catch(error){
    return res.status(400).json({
      error: error
    })
  }
  
  const clientAlready=await knex_I.where('email', data.email)
                                  .from('client')
                                  .first()
  
  if(!clientAlready) return res.status(400).json({  msg: 'email not exist' })

  const comparePassword=bcrypt.compareSync(data.password, clientAlready.password)
  
  if(comparePassword !== true)return res.status(401)
                                        .json({
      error: 'password incorrect! verify if has blank spaces, password is correctly write'
  })
  
  const payload={
    id: clientAlready.id,
    name: clientAlready.name,
    email: clientAlready.email
  }

  const fiveMinutes=300 
  
  const token=jwt.sign(
                  { payload },
                    Secret,
                  { expiresIn: fiveMinutes })
  
  return knex_I.where('email', data.email)
               .first()
               .table('client')
               .then(response=>{
               
                const data={
                    id: response.id,
                    name: response.name,
                    email: response.email
                    }
               
                res.status(200).json({
                     client: data,
                     auth: true,
                     token
                })
             })
               .catch(_=>res.status(500)
                            .json({
                              error: 'sorry, ocurred an error with server'
             }))
  
}



async function logout(req, res){
  
 res.status(200)
    .json({
      client: null,
      auth: false,
      token: null
 })
}



export {
  signup,
  login,
  logout
}