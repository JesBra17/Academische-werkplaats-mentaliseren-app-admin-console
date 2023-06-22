import { LitElement, css, html } from 'lit';

import Config from '../../service/config';

export class Login extends LitElement {
  static get properties() {
    return {
      username: { type: String },
      password: { type: String },
      url: { type: String },
    };
  }

  constructor() {
    super();
    this.username = '';
    this.password = '';
    this.url = new Config().getUrl();
  }

  connectedCallback() {
    super.connectedCallback();
  }

  #checkUsernameAndPassword(event) {
    event.preventDefault();

    let requestData = {
      username: this.renderRoot.getElementById('username-input').value,
      password: this.renderRoot.getElementById('password-input').value,
    };

    let fetchOptions = {
      method: 'POST',
      body: JSON.stringify(requestData),
      headers: {
        'Content-type': 'application/json',
      },
    };

    fetch(`${this.url}/auth/login`, fetchOptions)
        .then(function(response) {
            if (response.status !== 200) {
                throw "Wrong credentials"
            } else {
                return response.json();
            }
        })
        .then(function(myJason) {
            localStorage.setItem("JWT", myJason['JWT']);
            window.location.href = "dashboard.html"
        });
    
  }

  render() {
    return html`
      <div class="container">
        <form>
          <label>Gebruikersnaam</label>
          <input type="text" id="username-input" /><br />
          <label>Wachtwoord</label>
          <input type="password" id="password-input" /><br /><br />
          <button @click="${this.#checkUsernameAndPassword}">Log In</button>
        </form>
      </div>
    `;
  }

  static get styles() {
    return css`
      * {
        font-family: Arial, Helvetica, sans-serif;
      }

      .container {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
      }

      form {
        border: 1px solid black;
        width: 40rem;
        height: 10rem;
        padding-top: 1rem;
        background-color:  #ffffff;
        border-radius: 0.5rem;
        margin-bottom: 20rem;
      }

      form label {
        font-weight: bold;
        margin-left: 1rem;
        color: black;
      }

      form input {
        height: 1.5rem;
        width: 30rem;
      }

      form input[type='password'] {
        margin-left: 1.9rem;
        margin-top: 1rem;
      }

      form button {
        height: 2rem;
        margin-left: 1rem;
        width: 6rem;
        margin-bottom: 1rem;
        cursor: pointer;
        font-weight: 700;
        width: 10rem;
        
      }

      form button:hover,
      form button:focus {
        background-color: #007e43;
        color: #ffffff;
      }
    

  @media only screen and (max-width: 700px) {
    form input {
      width: 20rem;
    }
  }
  `
  }
}

window.customElements.define('login-element', Login);
