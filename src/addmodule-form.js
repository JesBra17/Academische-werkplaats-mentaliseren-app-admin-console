import { LitElement, css, html } from 'lit'
import NewRouteService from '../../../service/newroute-service.js';
import { locationExists, fetchLocation, strictLocationExists, fetchdistance} from '../../../service/location-verification-service.js';
import Route from '../../../model/route.js';
import { calculateCO2 } from '../../../utils/newroute-utils.js';
import { inputCheck } from '../../../utils/newroute-utils.js';

//Imports kloppen

import Location from '../newroute/newroute-location'
import RideType from '../newroute/newroute-ridetype'
import Transport from '../newroute/newroute-transport'

//Events to listen to:
const ESTIMATE_TIME_EVENT = 'estimate-time-changed'
const START_CHANGED_EVENT = 'start-changed'
const END_CHANGED_EVENT = 'end-changed'
const TRANSPORT_CHANGED_EVENT = 'transport-changed'
const RIDETYPE_CHANGED_EVENT = 'ridetype-changed'
const EDIT_DIALOG_CLOSE_EVENT = 'close-edit-dialog'

export default class AddModuleForm extends LitElement {
  static get properties() {
    return { 
      newrouteId: { type: Number }, 
      start: { type: String }, 
      end: { type: String },
      transport: { type: String },
      ride: { type: String },
      favourited: { type: Boolean },
      co2: { type: Number },
      selectedRouteId: { type: Number }
    };
  }

  constructor() {
    super();

    //Make connections with the service layer where all promises are made
    this.newrouteservice = new NewRouteService();
    this.newrouteId = -1;
    this.start = "";
    this.end = "";
    this.transport = "";
    this.ride = "";
    this.favourited = false;
    this.co2 = 0;
    this.selectedRouteId = 0;
    const date = new Date();
  }

  connectedCallback() {
    super.connectedCallback();

    //Adds event listeners
    this.addEventListener(START_CHANGED_EVENT, this.#StartChangedHandler)
    this.addEventListener(END_CHANGED_EVENT, this.#EndChangedHandler)
    this.addEventListener(TRANSPORT_CHANGED_EVENT, this.#TransportChangedHandler)
    this.addEventListener(RIDETYPE_CHANGED_EVENT, this.#RideTypeChangedHandler)

    this.addEventListener(ESTIMATE_TIME_EVENT, this.#EstimatedTimeChangedHandler)
  }

  disconnectedCallback() {
    //Removes event listeners
    this.removeEventListener(START_CHANGED_EVENT, this.#StartChangedHandler)
    this.removeEventListener(END_CHANGED_EVENT, this.#EndChangedHandler)
    this.removeEventListener(TRANSPORT_CHANGED_EVENT, this.#TransportChangedHandler)
    this.removeEventListener(RIDETYPE_CHANGED_EVENT, this.#RideTypeChangedHandler)

    this.removeEventListener(ESTIMATE_TIME_EVENT, this.#EstimatedTimeChangedHandler)

    //Always call super.disconnectedCallback() after removing your own listeners, if done otherwise
    //it might be unable to work because some of your event listeners might be dependend on Lit.
    super.disconnectedCallback();
  }

  //
  #EstimatedTimeChangedHandler(event) {
    this.timeEstimation = event.detail.estimatedTime
  }

  //
  #StartChangedHandler(event) {
    //Set property value to input value
    this.start = event.detail.start
  }

  #EndChangedHandler(event) {
    //Set property value to input value
    this.end = event.detail.end
  }

  #TransportChangedHandler(event) {
    //Set property value to input value
    this.transport = event.detail.transport
  }

  #RideTypeChangedHandler(event) {
    //Set property value to input value
    this.ride = event.detail.ride
  }

  /**
   * 
   * This function makes sure that all details 
   * of users route will send. It also control the destination-point and depature point value of the user.
      If not, it issues an alert.If it exists then console.logged it's location its url,
      press that and you will see the JSON file.
    
   * @param { Event } event 
   */
  
  #confirmEditRoute(event) {
    event.preventDefault();
    /*variable with value function inputCheck, from utils/newroute-utils.js, inputs as attributes for route from model/route.js */
    let inputcheck = inputCheck(new Route(null, this.start, this.end, this.transport, this.ride, this.favourited));
    if(inputcheck) {/*Checks if any input is missing, if so causes pop up on screen with a String from utils/newroute-utils.js*/
      alert(inputcheck) 
    } else {
      locationExists(this.start).then((data) => {/*check if start location is real,fuction from servic/location-verification-service.js*/
        if(data) {
                
          locationExists(this.end).then((data) => { /*check if end location is real,fuction from servic/location-verification-service.js*/
            if(data) {
              if(data) {
                let startLocation = fetchLocation(this.start, 1);
                let endLocation = fetchLocation(this.end, 1);
                startLocation.then((location) => {
                  let latitudeStart = location[0].lat;
                  let longitudeStart = location[0].lon;
                  endLocation.then((location) => {
                    let latitudeEnd = location[0].lat;
                    let longitudeEnd = location[0].lon;
                    fetchdistance(longitudeStart, latitudeStart, longitudeEnd, latitudeEnd).then((calculatedDistanceFromPromise) => {
                      
                      //Make a new route with the given data to later use for co2 calculations
                      let newMadeRoute = new Route(this.selectedRouteId, this.start, this.end, this.transport, this.ride, false, calculatedDistanceFromPromise, false);
                      //Calculates CO2 with the new made route
                      let calculatedCO2 = calculateCO2(newMadeRoute)
                      //Uses the util to round it down
                      this.co2 = calculatedCO2.toFixed(0);
                      //Edit the route
                      this.newrouteservice.editNewRoute(this.selectedRouteId, this.start, this.end, this.transport, this.ride, this.favourited, calculatedDistanceFromPromise.toFixed(0), this.co2)
                      //Fire a event to close the edit route dialog on the history-table.js
                      const closeEditRoute = new CustomEvent(EDIT_DIALOG_CLOSE_EVENT, {
                        bubbles: true,
                        composed: true,
                        cancelable: true,
                        detail: {}
                      });
                      this.dispatchEvent(closeEditRoute);
                    })
                  })
              })
            } else {
              // throw alert
              alert('Eindpunt bestaat niet');
            }
          }})
        } else {
          // throw alert
          alert('Vertrekpunt bestaat niet');
        }
      })
    }

  }

  #cancelEditRoute(event) {
    event.preventDefault();
    const closeEditRoute = new CustomEvent(EDIT_DIALOG_CLOSE_EVENT, {
      bubbles: true,
      composed: true,
      cancelable: true,
      detail: {}
    });
    this.dispatchEvent(closeEditRoute);
  }

  render() {
    return html`
      <form>
        <button @click="${this.#cancelEditRoute}">Annuleer</button>
        <h1>Geselecteerde ID: "${this.selectedRouteId}"</h1>
        <location-element id="location" start="${this.start}" end="${this.end}"></location-element>
        <transport-element id="transport" transport="${this.transport}"></transport-element>
        <ridetype-element id="ridetype" newRideType="${this.ride}"></ridetype-element>
        <div class='button-window'>
          <button @click="${this.#confirmEditRoute}" id='send-route-button'>Wijzig Reis</button>
        </div>
      </form>
    `
  }
  
  /**
   * This function makes sure that the web-component 'form-element' is
   * styled through CSS code.
   * 
  */ 
  static get styles() {
    return css`  

    :host {
      font-family: sans-serif;
    }

    form {
      max-width: 800px;
      margin: auto;
    }

    h1 {
        text-align: center;
    }

    #send-route-button {
      margin-right: 7px;
    }

    button {
      height: 50px;
      width: 100%;
      font-size: 18px;
      background-color: #57abe7;
      border-radius: 100px;
      border: 2px outset rgba(226, 226, 226, 0.4);
      cursor: pointer;
      /* border-bottom: 1px solid black; */
      /* border-right: 1px solid black; */

    }

    .button-window {
      width: 100%;
      margin-top: 20px;
      display: inline-flex;
    }

    button:hover {
      background-color: rgba(0, 119, 204, 0.67);
    }
    
    legend {
        text-align: left;
        font-size: 10px;
    }
    
    fieldset {
      background-color: #f3f3f3;
    }
    `
  }
}

window.customElements.define('addmodule-form', AddModuleForm)