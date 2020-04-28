import nodemailer = require('nodemailer');
import { GMAIL_PASSWORD, GMAIL_USER } from './constants';

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: GMAIL_USER,
        pass: GMAIL_PASSWORD,
    },
});

export const sendPasswordResetEmail = (email: string, token: string) => {
    const message = {
        from: GMAIL_USER,
        to: email,
        subject: 'Request To Reset Password',
        text: `Attach this token to the authorization header when running updatePassword mutation: ${token}`,
    };
    transporter.sendMail(message, (error) => {
        if (error) {
            console.log(error);
            return error.message;
        }
        return 'Email sent successfully';
    });
};
