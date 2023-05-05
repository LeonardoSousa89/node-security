const dotenv=require('dotenv') 
dotenv.config()

module.exports={

  development: {
    client:     'postgres',
    connection: {
      database: 'crypto_ii',
      user:     'postgres',
      password: '1234'
    },
    pool: {
      min: 2,
      max: 10
    }
  },

  production: {
    client:     process.env.CLIENT_II,
    connection: {
      host: process.env.HOST_II,
      database: process.env.DATABASE_II,
      user:     process.env.USER_II,
      password: process.env.PASSWORD_II
      
    },
    pool: {
      min: 2,
      max: 10
    },
  }
  
};