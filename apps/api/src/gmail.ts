import nodemailer from 'nodemailer'
export async  function gmail(data : any , to : string, subject : string, message : string){ 
    //user ke credentials , 
    try{
        const transporter = nodemailer.createTransport({
            host: 'smtp.resend.com',
            secure: true,
            port: 465,
            auth: {
                user: data.username,
                pass: data.password
            },
        });

        const info = await transporter.sendMail({
            from: 'onboarding@resend.dev',
            to: to,
            subject: subject,
            html: `<strong>${message}</strong>`,
        });
        console.log('Message sent: %s', info.messageId);
    
    }
    catch(e){ 
        console.error("Error " + e)
    }
    
}

