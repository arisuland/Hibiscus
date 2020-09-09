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

import type { User } from 'store/types';
import { Link } from 'react-router-dom';
import React from 'react';

interface AccountDropdownProps {
  [x: string]: any;
  user: User;
}

interface AccountDropdownState {
  isOpen: boolean;
}

class AccountDropdownComponent extends React.Component<AccountDropdownProps, AccountDropdownState> {
  constructor(props: AccountDropdownProps) {
    super(props);

    this.state = { isOpen: false };
  }

  open() {
    const value = !this.state.isOpen;
    this.setState({ isOpen: value });
  }

  render() {
    // TODO: find a way to react (haha get it? >:3) when a user
    // unclicks this dropdown (this will get annoying lol)
    return <div className='relative'>
      <button onClick={this.open.bind(this)} className='relative z-10 block h-8 w-8 rounded-full overflow-hidden border-2 border-purple-700 focus:outline-none focus:border-white'>
        <img className='h-full w-full object-cover' src={this.props.user.avatar} alt='cutie'></img>
      </button>
      {this.state.isOpen ? <div className='absolute right-0 mt-2 py-2 w-48 rounded-lg shadow-xl bg-gray-900'>
        <Link to='/users/@me/settings' className='block px-4 py-2 text-white hover:bg-gray-600'>Settings</Link>
        <Link to='/users/@me/organisations' className='block px-4 py-2 text-white hover:bg-gray-600'>Organisations</Link>
        <Link to='/users/@me/projects' className='block px-4 py-2 text-white hover:bg-gray-600'>Projects</Link>
        {this.props.user.admin ? <Link to='/admin' className='block px-4 py-2 text-white hover:bg-gray-600'>Administration Panel</Link> : null}
      </div> : null}
    </div>;
  }
}

export default React.memo(AccountDropdownComponent);
