/**
 * Copyright (c) 2020 August
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import { ActionTypes, State } from 'store/types';
import type { Action } from 'redux';
import { HttpClient } from '@augu/orchid';

const API_URL = process.env.NODE_ENV === 'development' ? 'http://localhost:3301' : 'https://i18n.augu.dev/api';

// we use mock data for now, so this isn't needed
const client = new HttpClient({
  defaults: {
    baseUrl: API_URL
  }
});

const defaultState: State = {
  isLoggedIn: false,
  user: null
};

const handler = (state: State = defaultState, action: Action<ActionTypes>): State => { // eslint-disable-line default-param-last
  switch (action.type) {
    case ActionTypes.GetUser: {
      console.log('get user');
      return state;
    }

    case ActionTypes.Logout: {
      console.log('logout owo');
      
      state.isLoggedIn = false;
      state.user = null;

      return state;
    }

    case ActionTypes.Login: {
      console.log('login!');

      state.isLoggedIn = true;
      state.user = {
        organisations: ['abcdef'],
        contributor: true,
        description: 'gay furry who likes to code | Developer & Founder of Monori',
        translator: true,
        created_at: new Date(), // eslint-disable-line camelcase
        projects: ['uwu'],
        username: 'auguwu',
        avatar: 'https://augu.dev/images/August.png',
        github: 'auguwu',
        admin: true,
        email: 'august@augu.dev',
        id: '1'
      };

      return state;
    }

    default: return state;
  }
};

/**
 * Handles all state changes with Redux
 * @param state The current state
 * @param data The data to supply
 */
export default handler;
