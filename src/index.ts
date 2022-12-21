import express from 'express';
import dotenv from 'dotenv';
import {sendEmail} from './email-client';
import path from 'path';
dotenv.config();

const HOST = process.env.HOST || 'http://localhost';
const PORT = parseInt(process.env.PORT || '4500');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res) => {
  return res.json({ message: 'Hello World!' });
});

type ConfirmEmailPayload = {
  email: string;
  name: string;
  url: string;
};

app.post('/register',async (req, res) => {
  const {email, name} = req.body;

  const templateData: ConfirmEmailPayload = {
    email,
    name,
    url: 'generated_confirmation_url'
  };

  sendEmail<ConfirmEmailPayload>({
    subject: 'Confirm your account',
    templateData,
    templatePath: path.join(__dirname, './mail-template/confirm-account.html'),
    to: email
  });

  // return res.send({message :})
  /*const fromEmailAddress  = process.env.FROM_EMAIL;
  const smtpHost = process.env.SMTP_HOST ?? '';
  const smtpPort = parseInt(process.env.SMTP_PORT ?? '587', 10);
  const smtpUser = process.env.SMTP_USER ?? '';
  const smtpPassword = process.env.SMTP_PASSWORD ?? '';

  const smtpTransport: Mail = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    auth: {
      user: smtpUser,
      pass: smtpPassword
    }
  });

  const confirmationUrl = "generated_confirmation_url";

  const templateData: ConfirmEmailPayload = {
    email,
    name,
    url: confirmationUrl
  };

  const templatePath = path.join(__dirname, './mail-template/confirm-account.html');
  const source = fs.readFileSync(templatePath, { encoding: 'utf-8'});
  const template: HandlebarsTemplateDelegate<ConfirmEmailPayload> = handlebars.compile(source);

  const html: string = template(templateData);

  try {
    const updatedData : Mail.Options = {
      to: email,
      html,
      from: `Awesome App <${fromEmailAddress}>`,
      subject: 'Confirm your account',
    }

    smtpTransport.sendMail(updatedData).then((result: nodemailer.SentMessageInfo): void => {
      console.info(result);
    })
  }catch(err){
    console.error(err);
  }*/

  return res.send({message: 'User created successfully'});
})

app.listen(PORT, () => {
  console.log(`Application started on URL ${HOST}:${PORT} 🎉`);
});
