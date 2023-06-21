import { LitElement, css, html } from 'lit'

import Config from '../../service/config'

export class Login extends LitElement {
  static get properties() {
    return {
      username: {type: String},
      password: { type: String },
      url: { type: String }
    }
  }

  constructor() {
    super();
    this.username = '';
    this.password = '';
    this.url = new Config().getUrl();
  }


  connectedCallback(){
    super.connectedCallback();
    
  }

  #checkUsernameAndPassword(event) {
    event.preventDefault();
    window.location.href = "dashboard.html"

  }

  render() {
    return html`

      <form>
          <label>Gebruikersnaam</label>
          <input type="text">
          <label>Wachtwoord</label>
          <input type="password">
          <button @click="${this.#checkUsernameAndPassword}">Log In</button>
      </form>
    
    `
  }

  static get styles() {
    return css `
    
  `
  }
}

window.customElements.define('login-element', Login)
