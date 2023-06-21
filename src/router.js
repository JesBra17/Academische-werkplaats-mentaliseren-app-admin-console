import {Router} from '@vaadin/router';

// Select the 'outlet' div element

const outlet = document.querySelector('#outlet');

// Create a new Router instance that uses the 'outlet' div as the container for the rendered components

export const router = new Router(outlet);

// Routes are defined

router.setRoutes([

  {path: '/dashboard.html', component: 'my-element'},
  {path: '/', component: 'my-element'},

]);