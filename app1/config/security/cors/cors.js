import cors from 'cors'

import express from 'express'
const policy=express()

policy.use((req, res, next)=>{
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Methods",['GET', 'POST', 'DELETE'])
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept, Authorization")
    policy.use(cors())
    next()
})

export { policy }