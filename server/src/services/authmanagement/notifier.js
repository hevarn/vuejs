import logger from '../../logger'
import { getFooter, getHelp } from '../../utils/mail'

export default function (app) {
  const {
    mailRedirection
  } = app.get('mailerConf')

  function getLink (type, hash) {
    return mailRedirection + type + '?token=' + hash
  }
  const mailer = app.service('/api/mailer')
  async function sendEmail (email) {
    try {
      await mailer.create(email)
      logger.info('sent registration mail')
    } catch (e) {
      logger.error(`mailer : ${mailer}`)
      logger.error(`error sending registration mail ${e}`)
    }
  }

  return {
    path: '/api/authManagement',
    service: '/api/users',
    notifier: function (type, user) {
      let tokenLink
      const footer = getFooter(mailRedirection)
      const help = getHelp(mailRedirection)
      const email = {}
      email.to = [{
        email: user.email
      }]
      logger.info(`authManagement called with ${type}`)
      switch (type) {
        case 'resendVerifySignup':
          tokenLink = getLink('verify', user.verifyToken)
          email.subject = 'Bienvenue chez Kanopée Koncept'
          email.htmlContent =
            `
            <link href="https://fonts.googleapis.com/css?family=Muli" rel='stylesheet' type='text/css'>
            <style type="text/css">
              * {font-family: 'Muli' !important;}
            </style>
              <div style="background-color: lightgray;font-family:Muli">
                <div style="margin: 0 auto;width: 675px">
                  <img src="https://zupimages.net/up/20/16/zw9v.png" style="width:200px; background-color:lightgray" alt="logo Kanopée Koncept">
                </div>
                <div style="margin: 0 auto;padding: 20px; background-color:white; width: 600px">
                  <h1 style="color:#316827">Bonjour ${user.firstname},</h1><br>
                  <p style="font-size:18px">Merci de rejoindre notre Kommunauté !</p>
                  <p style="font-size:18px">Et bienvenue sur le site de ${user.pdtName.name}.</p>
                  <p style="font-size:18px">Ensemble on va pouvoir participer à une agriculture plus saine et plus locale.</p>
                  <blockquote style="font-style: italic;font-size:18px">Dur de faire plus local, quand c'est cultivé au pied de chez vous hein ? ;) </blockquote><br>
                  <p style="font-size:18px">Pour le moment, on a besoin de vérifier votre adresse e-mail pour finaliser la création de votre compte : </p>
                  <div style="text-align: center; margin: 30px 0">
                    <a class="button" style="text-decoration:none; cursor: pointer; background-color:#316827; color: white; font-size: 20px; border-radius:5px ;padding: 5px 50px" href=${tokenLink}>
                      CONFIRMER
                    </a>
                  </div>
                  <hr>
                  ${help}
                </div>
                ${footer}
              </div>
            </html>
          `
          return sendEmail(email)

        case 'verifySignup':
          tokenLink = getLink('verify', user.verifyToken)
          email.subject = 'Confirmation de l\'email'
          email.htmlContent = `
          <link href="https://fonts.googleapis.com/css?family=Muli" rel='stylesheet' type='text/css'>
            <style type="text/css">
              * {font-family: 'Muli' !important;}
            </style>
            <div style="background-color: lightgray;font-family:Muli">
              <div style="margin: 0 auto;width: 675px">
                <img src="https://zupimages.net/up/20/16/zw9v.png" style="width:200px; background-color:lightgray" alt="logo Kanopée Koncept">
              </div>
              <div style="margin: 0 auto;padding: 20px; background-color:white; width: 600px">
                <h1 style="color:#316827">Bonjour ${user.firstname},</h1><br>
                <p style="font-size:18px">Merci de votre confiance et de participer à une agriculture plus saine et plus locale.</p>
                <p style="font-size:18px">Nous vous confirmons que votre email a bien été validé.</p>
                <hr>
                ${help}
              </div>
              ${footer}
            </div>
          `
          return sendEmail(email)

        case 'sendResetPwd':
          tokenLink = getLink('reset', user.resetToken)
          email.subject = 'Changement de mot de passe'
          email.htmlContent =
            `
            <link href="https://fonts.googleapis.com/css?family=Muli" rel='stylesheet' type='text/css'>
            <style type="text/css">
              * {font-family: 'Muli' !important;}
            </style>
            <div style="background-color: lightgray;font-family:Muli">
              <div style="margin: 0 auto;width: 675px">
                <img src="https://zupimages.net/up/20/16/zw9v.png" style="width:200px; background-color:lightgray" alt="logo Kanopée Koncept">
              </div>
              <div style="margin: 0 auto;padding: 20px; background-color:white; width: 600px">
                <h1 style="color:#316827">Bonjour ${user.firstname},</h1><br>
                <p style="font-size:18px">Merci de votre confiance et de participer à une agriculture plus saine et plus locale.</p>
                <div style="text-align: center; margin: 30px 0">
                  <a class="button" style="text-decoration:none; cursor: pointer; background-color:#316827; color: white; font-size: 20px; border-radius:5px ;padding: 5px 50px" href=${tokenLink}>
                    CHANGER MON MOT DE PASSE
                  </a>
                </div>
                <hr>
                ${help}
              </div>
              ${footer}
            </div>
          `
          return sendEmail(email)

        case 'resetPwd':
          tokenLink = getLink('reset', user.resetToken)
          email.subject = 'Confirmation du changement de mot de passe'
          email.htmlContent =
            `
            <link href="https://fonts.googleapis.com/css?family=Muli" rel='stylesheet' type='text/css'>
            <style type="text/css">
              * {font-family: 'Muli' !important;}
            </style>
            <div style="background-color: lightgray;font-family:Muli">
              <div style="margin: 0 auto;width: 675px">
                <img src="https://zupimages.net/up/20/16/zw9v.png" style="width:200px; background-color:lightgray" alt="logo Kanopée Koncept">
              </div>
              <div style="margin: 0 auto;padding: 20px; background-color:white; width: 600px">
                <h1 style="color:#316827">Bonjour ${user.firstname},</h1><br>
                <p style="font-size:18px">Merci de votre confiance et de participer à une agriculture plus saine et plus locale.</p>
                <p style="font-size:18px">Nous vous confirmons que votre mot de passe a bien été changé.</p>
                <div style="text-align: center; margin: 30px 0">
                  <a class="button" style="text-decoration:none; cursor: pointer; background-color:#316827; color: white; font-size: 20px; border-radius:5px ;padding: 5px 50px" href="${mailRedirection}login">
                    CONNEXION
                  </a>
                </div>
                <hr>
                ${help}
              </div>
              ${footer}
            </div>
          `
          return sendEmail(email)

        case 'passwordChange':
          email.subject = ''
          email.htmlContent = ''
          return sendEmail(email)

        case 'identityChange':
          tokenLink = getLink('verifyChanges', user.verifyToken)
          email.subject = ''
          email.htmlContent = ''
          return sendEmail(email)

        default:
          break
      }
    }
  }
}
