const SibApiV3Sdk = require('@getbrevo/brevo')

// Khởi tạo API client
let apiInstance = new SibApiV3Sdk.TransactionalEmailsApi()

// Gán API key từ biến môi trường
let apiKey = apiInstance.authentications['apiKey']
apiKey.apiKey = process.env.BREVO_API_KEY

// Hàm gửi email
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

// Xuất module theo kiểu CommonJS
module.exports = {
  BrevoProvider: {
    sendEmail
  }
}
