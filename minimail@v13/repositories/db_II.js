const db=require('../db_II')['development']
const knex_II=require('knex')(db)

module.exports={ knex_II }