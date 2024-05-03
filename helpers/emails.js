import nodemailer from 'nodemailer';


const emailRegistro= async (datos) =>{
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD
        }
      });

      const {email, nombre, token}= datos;

      //enviar email

      await transport.sendMail({
        from: "BienesRaices.com",
        to: email,
        subject: 'Confirma tu cuenta en Bienes Raices',
        text:'Confirma tu cuenta en Bienes Raices',
        html: `
        <h1>Bienvenido ${nombre}</h1>
        <p>Por favor confirma tu cuenta haciendo click en el siguiente enlace:
        <a href="${process.env.BACKEND_URL}:${process.env.PORT ?? 3000}/auth/confirmar/${token}" >Confirma tu cuenta</a> </p>

        <p>Si no creaste esta cuenta omite el mensaje</p>
        <p>Si tienes alguna duda no dudes en contactar con nosotros</p>
        <p>Saludos</p>
        <p>Equipo de Bienes Raices</p>
        `
      })

}



const olvidePassword= async (datos) =>{
  const transport = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });

    const {email, nombre, token}= datos;

    //enviar email

    await transport.sendMail({
      from: "BienesRaices.com",
      to: email,
      subject: 'reestablece tu contraseña en Bienes Raices',
      text:'reestablece tu contraseña en Bienes Raices',
      html: `
      <h1>Hola ${nombre}</h1>
      <p>Haz solicitado el cambio de la contraseña a bienes raices:
      <p>Ingresa al siguiente link para realizar el cambio de tu contraseña:
      <a href="${process.env.BACKEND_URL}:${process.env.PORT ?? 3000}/auth/olvide-password/${token}" >Reestablecer contraseña</a> </p>

      <p>Si no solicitaste el cambio omite este mensaje</p>
      <p>Si tienes alguna duda no dudes en contactar con nosotros</p>
      <p>Saludos</p>
      <p>Equipo de Bienes Raices</p>
      `
    })

}




export{
    emailRegistro,
    olvidePassword
}