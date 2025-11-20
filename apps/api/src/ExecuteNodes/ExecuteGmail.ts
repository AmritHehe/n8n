import nodemailer from 'nodemailer'
export async  function gmail(data : any , to : string, subject : string, message : string , awaitMail : boolean, id ?: number , workflowId?: string){ 
    //user ke credentials , 
      const base = process.env.NEXT_PUBLIC_BACKEND_API;
    try{
        const transporter = nodemailer.createTransport({
            host: data.HOST ,
            secure: true,
            port: data.PORT,
            auth: {
                user: data.username,
                pass: data.password
            },
        });
        if(awaitMail){ 
            const info = await transporter.sendMail({
                from: 'onboarding@resend.dev',
                to: to,
                subject: subject,
                html: `<strong>${message} please go on the following link to respond to the message ${base}/webhook/${id}?workflowId=${workflowId} </strong>`,
                
            });
            console.log('Message sent: %s', info.messageId);
        }
        else { 
            const info = await transporter.sendMail({
                from: 'onboarding@resend.dev',
                to: to,
                subject: subject,
                html: `<strong>${message} </strong>`,
            })
            console.log('Message sent: %s', info.messageId);
        }
        
    
    }
    catch(e){ 
        console.error("Error " + e)
    }
    
}

