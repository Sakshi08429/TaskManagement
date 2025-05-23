import nodeMailer from "nodemailer"
import path, { extname } from "path"
import dotenv from "dotenv"
import hbs from "nodemailer-express-handlebars"
import { fileURLToPath } from "node:url";
dotenv.config();

const _filename=fileURLToPath(import.meta.url);
const _dirname=path.dirname(_filename)

const sendEmail=async(
    //subject, send_to, send_from, reply_to, template, name,link
   
    subject,
    send_to,
    send_from,
    reply_to,
    template,
    name,
    link

)=>{

        const transporter=nodeMailer.createTransport({
            service:"gmail",
            host: "smtp.gmail.com", 
            port:587,
            secure:false,
            auth:{
                user:process.env.USER_EMAIL,
                pass:process.env.EMAIL_PASS,
            },
            tls:{
                ciphers:"SSLv3",
                rejectUnauthorized: false,
            }
        })

        const handlebarsOptions={
            viewEngine:{
                extname:".handlebars",
                partialsDir:path.resolve(_dirname,"../views"),
                defaultLayout:false,
            },
            viewPath:path.resolve(_dirname,"../views"),
            extName:".handlebars"
        }


            // Attach Handlebars plugin to the transporter
    transporter.use('compile', hbs(handlebarsOptions));
    const mailOptions = {
        from: send_from,
        to: send_to,
        replyTo: reply_to,
        subject: subject,
        template: template,
        context: {
          name: name,
          link: link,
        },
      };

      try {
        const info = await transporter.sendMail(mailOptions);
        console.log("Message sent: %s", info.messageId);
        return info;
      } catch (error) {
        console.log("Error sending email: ", error);
        throw error;
      }
    };
    
    export default sendEmail;