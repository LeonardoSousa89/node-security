const dotenv=require('dotenv') 
dotenv.config()

module.exports={

  development: {
    client:     'postgres',
    connection: {
      database: 'crypto',
      user:     'postgres',
      password: '1234'
    },
    pool: {
      min: 2,
      max: 10
    }
  },

  production: {
    client:     process.env.CLIENT_I,
    connection: {
      host: process.env.HOST_I,
      database: process.env.DATABASE_I,
      user:     process.env.USER_I,
      password: process.env.PASSWORD_I
      
    },
    pool: {
      min: 2,
      max: 10
    },
  }
  
};