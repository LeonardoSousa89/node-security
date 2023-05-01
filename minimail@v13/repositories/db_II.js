const db=require('../db_II')['production']
const knex_II=require('knex')(db)

module.exports={ knex_II }