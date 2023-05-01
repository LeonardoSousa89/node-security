const db=require('../db_I')['production']
const knex_I=require('knex')(db)

export default knex_I