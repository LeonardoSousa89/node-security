import bcrypt from 'bcrypt'

function cryptograph(password){
    const salt = bcrypt.genSaltSync(10)
    return bcrypt.hashSync(password,salt)
}

export { cryptograph }