import { LitElement, css, html } from 'lit'
import litLogo from './assets/lit.svg'
import viteLogo from '/vite.svg'
import Config from './service/config'

/**
 * An example element.
 *
 * @slot - This element has a slot
 * @csspart button - The button
 */
export class Login extends LitElement {
  static get properties() {
    return {
      /**
       * Copy for the read the docs hint.
       */
      modules: { type: Array },

      /**
       * The number of times the button has been clicked.
       */
      count: { type: Number },
      url: { type: String }
    }
  }

  constructor() {
    super();
    this.modules = [];
    this.count = 0;
    this.url = new Config().getUrl();
  }


  connectedCallback(){
    super.connectedCallback();
    fetch(`${this.url}/module/all`)
    .then(response => response.json())
    .then(json => this.modules = json)
    .catch(error => console.log(error));
  }

  render() {`

      <form>
          <label>Gebruikersnaam</label>
          <input type="text">
          <label>Wachtwoord</label>
          <input type="password">
      </form>
    
    `
  }

  static get styles() {
    return css`
    
    `
  }
}

window.customElements.define('login-element', Login)
