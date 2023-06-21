const SERVER = 'https://mindgoblins-service.onrender.com';


// Add this to your component to import the host name
// import Config from "../constants/Config.js";
// const host = new Config().getUrl();

export default class Config{
    constructor(){
        this.base_url = `${SERVER}`
    }

    getUrl(){
        return this.base_url;
    }
}