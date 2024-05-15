import bcrypt from 'bcrypt';

const usuarios=[
    {
        nombre:"brandon",
        email:"brandon@gmail.com",
        confirmado:1,
        password: bcrypt.hashSync("password",10)
    }
]

export default usuarios;