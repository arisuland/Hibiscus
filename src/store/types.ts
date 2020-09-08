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

/**
 * A list of actions to use
 */
export enum ActionTypes {
  /** Way to fetch the current logged in user */
  GetUser = 'get:user',

  /** 
   * Log-outs from Monori and destroys a User session
   * @see [monori.Session](https://github.com/monori-site/backend/tree/master/docs/Sessions.md)
   */
  Logout  = 'logout',

  /**
   * Login to the backend service and populates `user` in the session with a minimal
   * session object.
   * 
   * @see [monori.Session](https://github.com/monori-site/backend/tree/master/docs/Sessions.md)
   */
  Login   = 'login'
}

/**
 * Represents a structure of the current state
 */
export interface State {
  /**
   * If the user is logged in or not
   */
  isLoggedIn: boolean;

  /**
   * The user object
   * @see [monori.DatabaseUser](https://github.com/monori-site/backend/tree/master/docs/API.md#struct-user)
   */
  user: User | null;
}

/**
 * Represents a [DatabaseUser] from the backend
 * @see [monori.DatabaseUser](https://github.com/monori-site/backend/tree/master/docs/API.md#struct-user)
 */
export interface User {
  /** The organisations the user has made, mapped by their ID */
  organisations: string[];

  /** If they contributed to any project */
  contributor: boolean;

  /** The user's description */
  description: string;

  /** The date the user was created */
  created_at: Date; // eslint-disable-line camelcase

  /** If they made a translation project in a user/org account */
  translator: boolean;

  /** The projects the user has made, mapped by their ID */
  projects: string[];

  /** The user's username */
  username: string;

  /** The user's avatar URL by path or Gravatar URL */
  avatar: string;

  /** The user's GitHub username */
  github: string | null;

  /** If they are an administrator or not */
  admin: boolean;

  /** The user's email address */
  email: string;

  /** The user's ID */
  id: string;
}
