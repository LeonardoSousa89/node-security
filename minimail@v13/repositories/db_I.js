const db=require('../db_I')['production']
const knex_I=require('knex')(db)

module.exports={ knex_I }