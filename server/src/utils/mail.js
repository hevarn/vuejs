export function getFooter (baseURL) {
  return `
  <div style="margin: 0 auto ;padding: 40px 0; width: 600px; background-color: lightgray; text-align:center">
    <a style="text-decoration:none" href="https://www.facebook.com/kanopeekoncept/">
      <img style="width:40px" src="https://zupimages.net/up/20/22/yk1i.png">
    </a>
    <a style="text-decoration:none" href="https://twitter.com/kanopeekoncept?lang=fr">
      <img style="width:40px" src="https://zupimages.net/up/20/22/pnkl.png">
    </a>
    <a style="text-decoration:none" href="https://www.linkedin.com/company/kanop%C3%A9e-koncept/">
      <img style="width:40px" src="https://zupimages.net/up/20/22/gl2a.png">
    </a>
    <a style="text-decoration:none" href="https://www.instagram.com/kanopeekoncept/?hl=fr">
      <img style="width:40px" src="https://zupimages.net/up/20/22/6bon.png">
    </a>
    <br>
    <p style="font-size:18px"><a href="${baseURL}" style="text-decoration: underline; color: black">Kanopée Koncept</a>, permaculture urbaine</p>
    <p style="font-size:18px">60 place de la république, Saint Médard, 33140</p>
  </div>
    `
}

export function getHelp (baseURL) {
  return `
  <div style="text-align:center">
    <p style="font-size:18px">Vous avez des questions?</p>
    <p style="font-size:18px">Notre <a style="color:#316827" href="${baseURL}user/support">page d'aide</a> est là pour vous </p>
  </div>
  `
}
