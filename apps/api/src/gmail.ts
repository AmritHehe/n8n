import nodemailer from 'nodemailer'
export async  function gmail(){ 
    //user ke credentials , 
    
    const transporter = nodemailer.createTransport({
        host: 'smtp.resend.com',
        secure: true,
        port: 465,
        auth: {
            user: 'resend',
            pass: 're_xxxxxxxxx',
        },
    });

    const info = await transporter.sendMail({
        from: 'onboarding@resend.dev',
        to: 'delivered@resend.dev',
        subject: 'Hello World',
        html: '<strong>It works!</strong>',
    });
    console.log('Message sent: %s', info.messageId);
}

gmail().catch(console.error);
