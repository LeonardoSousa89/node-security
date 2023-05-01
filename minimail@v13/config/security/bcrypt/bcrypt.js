const bcrypt=require('bcrypt')

function cryptograph(password){
    const salt = bcrypt.genSaltSync(10)
    return bcrypt.hashSync(password,salt)
}

module.exports={ cryptograph }