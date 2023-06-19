import { LitElement, css, html } from 'lit'
import litLogo from './assets/lit.svg'
import viteLogo from '/vite.svg'

/**
 * An example element.
 *
 * @slot - This element has a slot
 * @csspart button - The button
 */
export class MyElement extends LitElement {
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
    }
  }

  constructor() {
    super();
    this.modules = [];
    this.count = 0;
  }

  #openAddModule(event) {
    const editDialog = this.renderRoot.getElementById('dialog-popup')
    editDialog.showModal();
  }

  #deleteModule(event) {
    // fetch("http://localhost:8080/module/deletemodule/" + event.target.value, {
    //   method: 'DELETE'
    // });
    const id = event.target.value;
    let requestData = {
      "id": id
    }

    let fetchOptions = {
      method: "DELETE",
      body: JSON.stringify(requestData),
      headers: {
        "Content-type": "application/json"
      }                                                  
    }                                                                
    fetch("http://localhost:8080/module/deletemodule", fetchOptions)
        .then((response) => response.json())
  }
  
  #cancelAddModule(event) {
    const addDialog = this.renderRoot.getElementById('dialog-popup')
    addDialog.close();
  }

  #confirmAddModule(event) {
    event.preventDefault();

    let requestData = {
      "title": this.renderRoot.getElementById('module-title').value
    }
  

    let fetchOptions = {
      method: "POST",
      body: JSON.stringify(requestData),
      headers: {
        "Content-type": "application/json"
      }                                                  
    }        

    fetch("http://localhost:8080/module/addmodule", fetchOptions)
        .then((response) => response.json())

    const addDialog = this.renderRoot.getElementById('dialog-popup')
    addDialog.close();
  }

  connectedCallback(){
    super.connectedCallback();
    fetch('http://localhost:8080/module/all')
    .then(response => response.json())
    .then(json => this.modules = json)
    .catch(error => console.log(error));
  }

  render() {
    console.log(this.modules)
    return html`
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.1/css/all.min.css" />
    <button @click="${this.#openAddModule}">Add Module</button>
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
          ${
            this.modules
            .map((module) => html`
            <tr>
              <td data-label="Title">${module.title}</td>
              <td data-label="Delete"><button @click="${this.#deleteModule}" value=${module.id}><i class="fa-regular fa-copy"></i></button></td>
            </tr>
          `
          )}
          </tbody>
        </table>
      <dialog id="dialog-popup">
        <form>
          <button @click="${this.#cancelAddModule}">Annuleer</button>
          <h1>Create Module</h1>
          <fieldset>
            <label for="moduletitle">Title</label><br>
            <input type="text" name="moduletitle" id="module-title"><br><br>
          </fieldset><br>
          <div class='button-window'>
            <button @click="${this.#confirmAddModule}" id='send-module-button'>Stuur Module</button>
          </div>
        </form>
      </dialog>
    `
  }

  static get styles() {
    return css`
    body {
      margin: 0;
      padding: 20px;
      font-family: sans-serif
    }

    * {
      box-sizing: border-box;
    }

    table {
      font-family: arial, sans-serif;
      border-collapse: collapse;
      width: 100%;
    }

    td, th {
    border: 1px solid #000000;
    text-align: center;
    padding: 12px 15px;
    text-align: center;
    font-size: 16px;
    }

    th {
      background-color: #00C300
    }

    tr:nth-child(even) {
      background-color: #E2E2E2;
    }

    button {
      background-color: #57abe7;
      border: none;
      color: black;
      padding: 12px 16px;
      font-size: 16px;
      cursor: pointer;
    }

    button:hover {
      background-color: rgba(0, 119, 204, 0.67);
    }
    `
  }
}

window.customElements.define('my-element', MyElement)
