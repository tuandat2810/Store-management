const SibApiV3Sdk = require('@getbrevo/brevo')

let apiInstance = new SibApiV3Sdk.TransactionalEmailsApi()

let apiKey = apiInstance.authentications['apiKey']
apiKey.apiKey = process.env.BREVO_API_KEY

const sendEmail = async (emailReceiver, customSubject, customHtmlContent) => {
  let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail()

  sendSmtpEmail.sender = {
    email: process.env.ADMIN_EMAIL_ADDRESS,
    name: process.env.ADMIN_EMAIL_NAME
  }

  sendSmtpEmail.to = [{ email: emailReceiver }]
  sendSmtpEmail.subject = customSubject
  sendSmtpEmail.htmlContent = customHtmlContent

  return apiInstance.sendTransacEmail(sendSmtpEmail)
}

module.exports = {
  BrevoProvider: {
    sendEmail
  }
}
