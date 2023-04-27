const nodemailer = require("nodemailer");

module.exports = async(userEmail,subject,htmlTemplate)=>
{
    try
    {
        const transporter = nodemailer.createTransport({
            service : process.env.APP_EMAIL_SERVER,
            auth : {
                user : process.env.APP_EMAIL_ADDRESS, //sender
                pass : process.env.APP_EMAIL_PASSORD
            }
        });


        const mailOptions = {
            from : process.env.APP_EMAIL_ADDRESS, //sender 
            to: userEmail, 
            subject: subject, 
            html: htmlTemplate
        }

        const info = transporter.sendMail(mailOptions);
        console.log('Email Sent : '+ (await info).response);


    }
    catch(error){
        console.log(error);
        throw new Error('Internal serever Error (nodemailer) ');
    }

};