const db=require('../db_I')['development']
const knex_I=require('knex')(db)

module.exports={ knex_I }