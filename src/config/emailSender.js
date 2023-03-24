import sgMail from '@sendgrid/mail'

const EMAIL_KEY = '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';
sgMail.setApiKey(EMAIL_KEY);

export const sendMail = function(email,OTP){
    const message = {
        to: email,
        from: 'sameerdevkar3@gmail.com',
        subject: 'Varification email',
        html: `OTP : ${OTP}`
    }
    sgMail.send(message).catch(error => console.log(error.message));
}