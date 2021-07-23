// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
import { getFooter, getHelp } from '../../utils/mail'
// eslint-disable-next-line no-unused-vars
export default function (app, options = {}) {
  const { mailRedirection } = app.get('mailerConf')

  return async context => {
    //  check queries
    if (context.params.query.orderReceived) {
      let user = {}
      try {
        const data = await context.app.service('/api/users').get(parseInt(context.params.query.orderReceived))
        user = data.toJSON()
      } catch (e) {
        console.error(e)
      }
      const { firstname, lastname, email } = user
      const footer = getFooter(mailRedirection)
      const help = getHelp(mailRedirection)
      const mail = {
        to: [{ email: email }],
        subject: `${firstname}, votre commande vient d'être retirée`,
        htmlContent:
            `
            <link href="https://fonts.googleapis.com/css?family=Muli" rel='stylesheet' type='text/css'>
            <style type="text/css">
              * {font-family: 'Muli' !important;}
            </style>
            <div style="background-color: lightgray; font-family:Muli">
              <div style="margin: 0 auto;width: 675px">
                <img src="https://zupimages.net/up/20/16/zw9v.png" style="width:200px; background-color:lightgray" alt="logo Kanopée Koncept">
              </div>
              <div style="margin: 0 auto;padding: 20px; background-color:white; width: 600px">
                <h1 style="color:#316827">Bonjour ${firstname} ${lastname},</h1><br>
                <p style="font-size:18px">Vous venez de récupérer votre commande !</p>
                <p style="font-size:18px">Nous esperons que celle-ci vous satisfera pleinement.</p>
                <p style="font-size:18px">Ensemble on va pouvoir participer à une agriculture plus saine et plus locale.</p>
                <blockquote style="font-style: italic;font-size:18px">Dur de faire plus local, quand c'est cultivé au pied de chez vous hein ? ;) </blockquote><br>
                <p style="font-size:18px">Des à présent, vous pouvez consulter les détails de votre facture depuis votre interface de gestion : rubrique mes commandes.</p>
                <div style="text-align: center; margin: 30px 0">
                  <a class="button" href="${mailRedirection}" style="text-decoration:none; cursor: pointer; background-color:#316827; color: white; font-size: 20px; border-radius:5px ;padding: 5px 50px">
                    ACCEDER AU SITE
                  </a>
                </div>
                <hr>
                ${help}
              </div>
              ${footer}
            </div>
            `
      }
      try {
        await context.app.service('/api/mailer').create(mail)
      } catch (e) {
        console.error(e)
      }
      delete context.params.query.orderReceived
    }
  }
}
