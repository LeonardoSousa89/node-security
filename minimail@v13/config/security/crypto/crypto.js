const crypto=require('crypto')
const dotenv=require('dotenv') 

dotenv.config()

const algorithm=process.env.ALGORITHM

const key=process.env.CRYPTO_SECRET_KEY

const strategy=process.env.STRATEGY

function cipher(args){
  
  const cryptography=crypto.createCipher(algorithm, key)
  const crypt=cryptography.update(args, 'utf8', strategy)
 
  return crypt
}

function decipher(args){
  
  const cryptography=crypto.createDecipher(algorithm, key)
  const decrypt=cryptography.update(args, strategy, 'utf8')
 
  return decrypt
}


module.exports={
  cipher,
  decipher
}