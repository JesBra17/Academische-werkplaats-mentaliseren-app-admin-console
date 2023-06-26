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
      chapterId: { type: Number },
      moduleId: { type: Number },
      allPagesOfChapter: { type: Array },
      questions: { type: Array },
      url: { type: String },
    }
  }

  constructor() {
    super();
    this.modules = [];
    this.count = 0;
    this.chapterId = null;
    this.moduleId = null;
    this.allPagesOfChapter = [];
    this.questions = [];
    this.url = new Config().getUrl();
  }

  #openAddModule(event) {
    const addModuleDialog = this.renderRoot.getElementById('dialog-addmodule')
    addModuleDialog.showModal();
  }

  #openEditModule(event) {
    this.moduleId = event.target.value;
    const editModuleDialog = this.renderRoot.getElementById('dialog-editmodule')
    editModuleDialog.showModal();
  }

  #openEditChapter(event) {
    this.chapterId = event.target.value;
    const editChapterDialog = this.renderRoot.getElementById('dialog-editchapter')
    editChapterDialog.showModal();
  }

  #openAddChapter(event) {
    this.moduleId = event.target.value;
    const addChapterDialog = this.renderRoot.getElementById('dialog-addchapter')
    addChapterDialog.showModal();
  }

  #openEditQuestions(event) {
    this.chapterId = event.target.value;   

    let fetchOptions = {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("JWT")
      }                                                  
    }   

    fetch(`${this.url}/quiz/questions/` + this.chapterId, fetchOptions)
    .then((response) => response.json())
    .then(json => this.questions = json)
    .catch(error => console.log(error));

    console.log(this.questions);

    const addQuestionsDialog = this.renderRoot.getElementById('dialog-editquestions')
    addQuestionsDialog.showModal();
  }

  #openAddPage(event) {
    this.chapterId = event.target.value; 
    const addPageDialog = this.renderRoot.getElementById('dialog-addpage')
    addPageDialog.showModal();
  }

  #previewPagesOfChapter(event) {
    let fetchOptions = {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("JWT")
      }                                                  
    }   

    this.allPagesOfChapter = fetch(`${this.url}/module/chapters/` + this.chapterId + `/` + event.target.value, fetchOptions)
  }

  #deleteModule(event) {
    let fetchOptions = {
      method: "DELETE",
      headers: {
        "Content-type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("JWT")
      }                                                  
    }                                                                
    fetch(`${this.url}/module/deletemodule/` + event.target.value, fetchOptions)
  }

  #deleteChapter(event) {
    let fetchOptions = {
      method: "DELETE",
      headers: {
        "Content-type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("JWT")
      }                                                  
    }                                                                
    fetch(`${this.url}/module/deletechapter/` + event.target.value, fetchOptions)
  }

  #deleteQuestion(event) {
    event.preventDefault();
    let fetchOptions = {
      method: "DELETE",
      headers: {
        "Content-type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("JWT")
      }                                                  
    }                                                                
    fetch(`${this.url}/quiz/deletequestion/` + event.target.value, fetchOptions).catch((error) => console.log(error))
  }
  
  #cancelAddModule(event) {
    event.preventDefault();
    const addDialog = this.renderRoot.getElementById('dialog-addmodule')
    addDialog.close();
  }

  #cancelEditModule(event) {
    event.preventDefault();
    const editDialog = this.renderRoot.getElementById('dialog-editmodule')
    editDialog.close();
  }

  #cancelEditChapter(event) {
    event.preventDefault();
    const editDialog = this.renderRoot.getElementById('dialog-editchapter')
    editDialog.close();
  }

  #cancelAddQuestion(event) {
    event.preventDefault();
    const questionDialog = this.renderRoot.getElementById('dialog-editquestions')
    questionDialog.close();
  }

  #cancelAddChapter(event) {
    event.preventDefault();
    const addDialog = this.renderRoot.getElementById('dialog-addchapter')
    addDialog.close();
  }

  #cancelAddPage(event) {
    event.preventDefault();
    this.renderRoot.getElementById('page-body').value = ""
    const addDialog = this.renderRoot.getElementById('dialog-addpage')
    addDialog.close();
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
        "Content-type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("JWT")
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
      "moduleId": this.moduleId,
      "chapterName": this.renderRoot.getElementById('chapter-title-add').value
    }
  

    let fetchOptions = {
      method: "POST",
      body: JSON.stringify(requestData),
      headers: {
        "Content-type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("JWT")
      }                                                  
    }        

    fetch(`${this.url}/module/addchapter`, fetchOptions)
        .then((response) => response.json())

    const addDialog = this.renderRoot.getElementById('dialog-addmodule')
    addDialog.close();
  }

  #confirmAddQuestion(event) {
    event.preventDefault();

    let requestData = {
      "chapterId": this.chapterId,
      "questionText": this.renderRoot.getElementById('question-text').value,
      "explanation": "",
      "answers": [
        {"text": this.renderRoot.getElementById('answer-correct').value, "correct": true},
        {"text": this.renderRoot.getElementById('answer-wrong').value, "correct": false}
      ]
    }
  
    let fetchOptions = {
      method: "POST",
      body: JSON.stringify(requestData),
      headers: {
        "Content-type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("JWT")
      }                                                  
    }        

    fetch(`${this.url}/quiz/addquestion`, fetchOptions)
        .then((response) => response.json())

    const questionDialog = this.renderRoot.getElementById('dialog-editquestions')
    questionDialog.close();
  }

  #confirmAddPage(event) {
    event.preventDefault();

    let requestData = {
      "chapterId": this.chapterId,
      "body": this.renderRoot.getElementById('page-body').value
    }

    let fetchOptions = {
      method: "POST",
      body: JSON.stringify(requestData),
      headers: {
        "Content-type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("JWT")
      }                                                  
    }        

    fetch(`${this.url}/module/addpage`, fetchOptions)
        .then((response) => response.json())

    this.renderRoot.getElementById('page-body').value = ""

    const addDialog = this.renderRoot.getElementById('dialog-addpage')
    addDialog.close();
  }

  #confirmEditModule(event) {
    event.preventDefault();

    let requestData = {
      "id": this.moduleId,
      "title": this.renderRoot.getElementById('module-title-edit').value,
      "coverImage": this.renderRoot.getElementById("module-image-file").files[0]
    }

    let fetchOptions = {
      method: "PATCH",
      body: JSON.stringify(requestData),
      headers: {
        "Content-type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("JWT")
      }                                                  
    }        

    fetch(`${this.url}/module/editmodule`, fetchOptions)

    const addDialog = this.renderRoot.getElementById('dialog-addmodule')
    addDialog.close();
  }

  #confirmEditChapter(event) {
    event.preventDefault();
    let requestData = {
      "id": this.chapterId,
      "title": this.renderRoot.getElementById('chapter-title-edit').value,
      "coverImage": this.renderRoot.getElementById("chapter-image-file").files[0]
    }

    let fetchOptions = {
      method: "PATCH",
      body: JSON.stringify(requestData),
      headers: {
        "Content-type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("JWT")
      }                                                  
    }        

    fetch(`${this.url}/module/editchapter`, fetchOptions)
    const form = this.renderRoot.getElementById("chapter-file-form");
    let formData = new FormData();
    formData.append("file", form[1].files[0]);
    formData.append("chapterId", this.chapterId);
    const response = fetch(`${this.url}/admin/files/upload`, {
      method: "POST",
      body: formData,
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("JWT")
      }
    })

    console.log(response)

    fetch(`${this.url}/admin/files/upload`, fetchOptions2)

    const addDialog = this.renderRoot.getElementById('dialog-addmodule')
    addDialog.close();
  }

  connectedCallback(){
    super.connectedCallback();
    let fetchOptions = {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("JWT")
      }                                                  
    }        

    fetch(`${this.url}/module/all`, fetchOptions)
        .then((response) => response.json())
        .then(json => this.modules = json)
        .catch(error => console.log(error));
  }

  render() {
    this.#openEditQuestions
    console.log(this.modules)
    console.log(this.questions)
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
            <tr >
              <td data-label="Title">${module.title}<button id="title_button" @click="${this.#openEditModule}" value=${module.id}>Edit Module</button></td>
              <td data-label="Chapters">
                ${
                  module.chapters.map((chapter) => html`
                  <div class="button-container">${chapter.chapterName}
                    <button id="delete_chapter_button_id" @click="${this.#deleteChapter}" value=${chapter.id}>Delete Chapter</button>
                    <button id="edit_chapter_button_id" @click="${this.#openEditChapter}" value=${chapter.id}>Edit Chapter</button>
                    <button id="add_page_button_id" @click="${this.#openAddPage}" value=${chapter.id}>Add Page</button>
                    <button id="add_question_button_id" @click="${this.#openEditQuestions}" value=${chapter.id}>Questions</button><br><br>
                  </div><br>
                  `)
                }

              </td>
              <td data-label="Add-Chapter"><button @click="${this.#openAddChapter}" value=${module.id}>Add Chapter</button></td>
              <td data-label="Delete"><button id=delete_button_id @click="${this.#deleteModule}" value=${module.id}>Delete</button></td>
            </tr>
          `
          )}
          </tbody>
        </table>



      
      <dialog id="dialog-addmodule">
        <form>
          <button class="close-dialog"  @click="${this.#cancelAddModule}">Annuleer</button>
          <h1>Create Module</h1>
          <fieldset>
            <label for="module-title">Title</label><br>
            <input type="text" name="module-title" id="module-title-add"><br><br>
          </fieldset><br>
          <div class='button-window'>
            <button @click="${this.#confirmAddModule}" id='send-module-button'>Stuur Module</button>
          </div>
        </form>
      </dialog>


      <dialog id="dialog-editmodule">
        <form>
          <button class="close-dialog" @click="${this.#cancelEditModule}">Annuleer</button>
          <h1>Edit Module</h1>
          <fieldset>
            <label for="module-title">Title</label><br>
            <input type="text" name="module-title" id="module-title-edit"><br><br>
            <label for="module-image-file">Image</label><br>
            <input id="module-image-file" type="file" /><br><br>
          </fieldset><br>
          <div class='button-window'>
            <button @click="${this.#confirmEditModule}" id='send-module-button'>Wijzig Module</button>
          </div>
        </form>
      </dialog>


      <dialog id="dialog-editchapter">
        <button class="close-dialog" @click="${this.#cancelEditChapter}">Annuleer</button>
        <h1>Edit Chapter</h1>
        <form id="chapter-file-form" enctype="multipart/form-data" action="#" method="post">
          <label for="chapter-edit-title">Chapter Title</label><br>
          <input name="chapter-edit-title" id="chapter-title-edit" type="text" /><br><br>
          <label for="image-file">Image</label><br>
          <input name="image-file" id="chapter-image-file" type="file" /><br><br>
        </form>
        <button @click="${this.#previewPagesOfChapter}" id='preview-chapter-button'></button>
        <div class='button-window'>
          <button @click="${this.#confirmEditChapter}">Wijzig Chapter</button>
          <button @click="${this.#cancelEditChapter}">Annuleer</button>
        </div>
      </dialog>

      <dialog id="dialog-addchapter">
        <form>
          <button class="close-dialog" @click="${this.#cancelAddChapter}">Annuleer</button>
          <h1>Add Chapter</h1>
          <fieldset>
            <label for="module-title">Title</label><br>
            <input type="text" name="module-title" id="chapter-title-add"><br><br>
          </fieldset><br>
          <div class='button-window'>
            <button @click="${this.#confirmAddChapter}" id='send-module-button'>Add Chapter</button>
          </div>
        </form>
      </dialog>

      <dialog id="dialog-editquestions">
        <form>
          <button class="close-dialog" @click="${this.#cancelAddQuestion}">Annuleer</button>
          <h1>Add Question</h1>
          <fieldset>
            <label for="question-text">Question</label><br>
            <input type="text" name="question-text" id="question-text"><br><br>
            <label for="answer-correct">Correct Answer</label><br>
            <input type="text" name="answer-correct" id="answer-correct"><br><br>
            <label for="answer-wrong">Wrong Answer</label><br>
            <input type="text" name="answer-wrong" id="answer-wrong"><br><br>
          </fieldset><br>
          <div class='button-window'>
            <button @click="${this.#confirmAddQuestion}" id='send-module-button'>Add Question</button>
          </div>
          <hr>
          <h1>Current Questions</h1>
          ${
            this.questions
            .map((question) => html`
            <h3>Question: ${question.text}</h3>
            <table>
                <thead>
                  <tr>
                    <th>Answer Text</th>
                    <th>Correct</th>
                  </tr>
                </thead>
            <tbody>
            ${
              question.answers.map((answer) => html`
                <tr>
                  <td>${answer.text}</td>
                  <td>${answer.correct}</td>
                </tr>
              `)
            }
            </tbody>
            </table>
            <button id="question_button_delete" @click="${this.#deleteQuestion}" value=${question.id}>Delete Question</button>
            <hr>
          `
          )}
        </form>
      </dialog>

      <dialog id="dialog-addpage">
        <form>
          <button class="close-dialog" @click="${this.#cancelAddPage}">Annuleer</button>
          <h1>Add Page</h1>
          <fieldset>
            <label for="writtentext">Write here your text:</label><br><br>
            <textarea type="text" id="page-body" name="writtentext" maxlength="10000"></textarea>
          </fieldset><br>
          <div class='button-window'>
            <button @click="${this.#confirmAddPage}" id='send-module-button'>Add Page</button>
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
 
  td{
      text-align: left;
       text-decoration: underline;
        text-transform: uppercase;
    }


    th {
      background-color: #00C300
    }

    dialog {
      min-width: 80%;
    }

    tr:nth-child(even) {
      background-color: #E2E2E2;
    }

    .close-dialog {
      float: right;
    }

    #title_button{
      float: right
    }
    .button-container {
      
    text-align: left;
    text-transform: capitalize;
    text-decoration: underline;
 
  }
  #delete_chapter_button_id {
    float: right;
 
  }
  #edit_chapter_button_id{
    float: right;
  }

  #add_question_button_id {
    float: right;
  }

  #add_page_button_id {
    float: right;
  }
 

    button {
      background-color: #4CAF50;
      border: none;
      border-radius:10px;
      color: white;
      padding: 15px 32px;
      text-align: center;
      display: inline-block;
      font-size: 13px;
      margin: 4px 2px;
      cursor: pointer;
}
#delete_chapter_button_id:hover, #delete_button_id:hover,
#annuleer_dialog_addmodule_button:hover,#annuleer_editmodule_button:hover,
#editchapter_dialog_annnuleer_button:hover,#chapter_button_anulleer:hover{
  background-color: rgb(220,20,60);
}

    button:hover {
      border-radius:5px;
      background-color: rgba(0, 119, 204, 0.67);
    }
    `
  }
}

window.customElements.define('my-element', MyElement)
