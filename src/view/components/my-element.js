import { LitElement, css, html } from 'lit'
import { Login } from './login'
import Config from '../../service/config';


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
      url: { type: String }
    }
  }

  constructor() {
    super();
    this.modules = [];
    this.count = 0;
    this.url = new Config().getUrl();
  }

  #openAddModule(event) {
    const addModuleDialog = this.renderRoot.getElementById('dialog-addmodule')
    addModuleDialog.showModal();
  }

  #openEditModule(event) {
    const editModuleDialog = this.renderRoot.getElementById('dialog-editmodule')
    editModuleDialog.showModal();
  }

  #openEditChapter(event) {
    const editChapterDialog = this.renderRoot.getElementById('dialog-editchapter')
    editChapterDialog.showModal();
  }

  #openAddChapter(event) {
    const addChapterDialog = this.renderRoot.getElementById('dialog-addchapter')
    addChapterDialog.showModal();
  }

  #deleteModule(event) {
    let fetchOptions = {
      method: "DELETE",
      headers: {
        "Content-type": "application/json"
      }                                                  
    }                                                                
    fetch(`${this.url}/module/deletemodule/` + event.target.value, fetchOptions)
        .then((response) => response.json())
  }

  #deleteChapter(event) {
    let fetchOptions = {
      method: "DELETE",
      headers: {
        "Content-type": "application/json"
      }                                                  
    }                                                                
    fetch(`${this.url}/module/deletechapter/` + event.target.value, fetchOptions)
        .then((response) => response.json())
  }
  
  #cancelAddModule(event) {
    const addDialog = this.renderRoot.getElementById('dialog-addmodule')
    addDialog.close();
  }

  #cancelEditModule(event) {
    const editDialog = this.renderRoot.getElementById('dialog-editmodule')
    editDialog.close();
  }

  #cancelEditChapter(event) {
    const editDialog = this.renderRoot.getElementById('dialog-editchapter')
    editDialog.close();
  }

  #confirmAddModule(event) {
    event.preventDefault();

    let requestData = {
      "title": this.renderRoot.getElementById('module-title-add').value
    }
  

    let fetchOptions = {
      method: "POST",
      body: JSON.stringify(requestData),
      headers: {
        "Content-type": "application/json"
      }                                                  
    }        

    fetch(`${this.url}/module/addmodule`, fetchOptions)
        .then((response) => response.json())

    const addDialog = this.renderRoot.getElementById('dialog-addmodule')
    addDialog.close();
  }

  #confirmAddChapter(event) {
    event.preventDefault();

    let requestData = {
      "title": this.renderRoot.getElementById('chapter-title-add').value
    }
  

    let fetchOptions = {
      method: "POST",
      body: JSON.stringify(requestData),
      headers: {
        "Content-type": "application/json"
      }                                                  
    }        

    fetch(`${this.url}/module/addchapter`, fetchOptions)
        .then((response) => response.json())

    const addDialog = this.renderRoot.getElementById('dialog-addmodule')
    addDialog.close();
  }

  #confirmEditModule(event) {
    event.preventDefault();

    let requestData = {
      "id": event.target.value,
      "title": this.renderRoot.getElementById('module-title-edit').value
    }
  

    let fetchOptions = {
      method: "POST",
      body: JSON.stringify(requestData),
      headers: {
        "Content-type": "application/json"
      }                                                  
    }        

    fetch(`${this.url}/module/editmodule`, fetchOptions)
        .then((response) => response.json())

    const addDialog = this.renderRoot.getElementById('dialog-addmodule')
    addDialog.close();
  }

  #confirmEditChapter(event) {
    event.preventDefault();

    let requestData = {
      "id": event.target.value,
      "title": this.renderRoot.getElementById('module-title-edit').value
    }
  

    let fetchOptions = {
      method: "POST",
      body: JSON.stringify(requestData),
      headers: {
        "Content-type": "application/json"
      }                                                  
    }        

    fetch(`${this.url}/module/editchapter`, fetchOptions)
        .then((response) => response.json())

    const addDialog = this.renderRoot.getElementById('dialog-addmodule')
    addDialog.close();
  }

  connectedCallback(){
    super.connectedCallback();
    fetch(`${this.url}/module/all`)
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
              <th>Chapters</th>
              <th>Add Chapter</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
          ${
            this.modules
            .map((module) => html`
            <tr>
              <td data-label="Title">${module.title}<button @click="${this.#openEditModule}" value=${module.id}>Edit Module</button></td>
              <td data-label="Chapters">
                ${
                  module.chapters.map((chapter) => html`
                  <div>${chapter.chapterName}
                    <button @click="${this.#deleteChapter}" value=${chapter.id}>Delete Chapter</button>
                    <button @click="${this.#openEditChapter}" value=${chapter.id}>Edit Chapter</button>
                  </div>
                  `)
                }

              </td>
              <td data-label="Add-Chapter"><button @click="${this.#openAddChapter}" value=${module.id}>Add Chapter</button></td>
              <td data-label="Delete"><button @click="${this.#deleteModule}" value=${module.id}>Delete</button></td>
            </tr>
          `
          )}
          </tbody>
        </table>



      
      <dialog id="dialog-addmodule">
        <form>
          <button @click="${this.#cancelAddModule}">Annuleer</button>
          <h1>Create Module</h1>
          <fieldset>
            <label for="moduletitle">Title</label><br>
            <input type="text" name="moduletitle" id="module-title-add"><br><br>
          </fieldset><br>
          <div class='button-window'>
            <button @click="${this.#confirmAddModule}" id='send-module-button'>Stuur Module</button>
          </div>
        </form>
      </dialog>


      <dialog id="dialog-editmodule">
        <form>
          <button @click="${this.#cancelEditModule}">Annuleer</button>
          <h1>Edit Module</h1>
          <fieldset>
            <label for="moduletitle">Title</label><br>
            <input type="text" name="moduletitle" id="module-title-edit"><br><br>
          </fieldset><br>
          <div class='button-window'>
            <button @click="${this.#confirmEditModule}" id='send-module-button'>Wijzig Module</button>
          </div>
        </form>
      </dialog>


      <dialog id="dialog-editchapter">
        <form>
          <button @click="${this.#cancelEditChapter}">Annuleer</button>
          <h1>Edit Chapter</h1>
          <fieldset>
            <label for="moduletitle">Title</label><br>
            <input type="text" name="moduletitle" id="chapter-title-edit"><br><br>
          </fieldset><br>
          <div class='button-window'>
            <button @click="${this.#confirmEditChapter}" id='send-module-button'>Wijzig Chapter</button>
          </div>
        </form>
      </dialog>

      <dialog id="dialog-addchapter">
        <form>
          <button @click="${this.#cancelEditChapter}">Annuleer</button>
          <h1>Add Chapter</h1>
          <fieldset>
            <label for="moduletitle">Title</label><br>
            <input type="text" name="moduletitle" id="chapter-title-add"><br><br>
          </fieldset><br>
          <div class='button-window'>
            <button @click="${this.#confirmAddChapter}" id='send-module-button'>Add Chapter</button>
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