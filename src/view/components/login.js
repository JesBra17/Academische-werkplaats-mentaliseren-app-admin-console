import { LitElement, css, html } from 'lit'

import Config from '../../service/config';

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

    let requestData = {
      "username": this.renderRoot.getElementById('username-input').value,
      "password": this.renderRoot.getElementById('password-input').value
    }

    let fetchOptions = {
      method: "POST",
      body: JSON.stringify(requestData),
      headers: { 
        "Content-type": "application/json"
      }
    }

    fetch(`${this.url}/auth/login`, fetchOptions)
        .then(function(response) {
            if (response.status !== 200) {
                throw "Wrong credentials"
            } else {
                return response.json();
            }
        })
        .then(function(myJason) {
            loginStorage.setItem("JWT", myJason['JWT-token']);
            window.location.href = "dashboard.html"
        });
    

  }

  render() {
    return html`

      <form>
          <label>Gebruikersnaam</label>
          <input type="text" id="username-input">
          <label>Wachtwoord</label>
          <input type="password" id="password-input">
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
