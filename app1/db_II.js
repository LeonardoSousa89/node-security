import * as dotenv from 'dotenv' 
dotenv.config()

module.exports={

  development: {
    client:     'postgresql',
    connection: {
      database: 'database',
      user:     'user',
      password: 'password'
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