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

import type { State, User } from 'store/types';
import AccountDropdown from 'components/base/AccountDropdown';
import { connect } from 'decorators';
import { Link } from 'react-router-dom';
import React from 'react';

interface NavbarState {
  isOpen: boolean;
}

interface NavbarProps {
  isLoggedIn?: boolean;
  user?: User | null;
}

@connect<State>(state => ({ isLoggedIn: state.isLoggedIn, user: state.user }))
class NavbarComponent extends React.Component<NavbarProps, NavbarState> {
  constructor(props: NavbarProps) {
    super(props);

    this.state = { isOpen: false };
  }
  
  open() {
    const value = !this.state.isOpen;
    this.setState({ isOpen: value });
  }
  
  render() {
    return <header className='bg-darkish sm:flex sm:justify-between sm:items-center sm:px-4 sm:py-3'>
      <div className='flex items-center justify-between px-4 py-3 sm:p-0'>
        <img draggable={false} className='h-8 w-8 mr-2' src='https://augu.dev/images/Nino.png' alt='cutie' />
        <span className='font-semibold text-white text-xl tracking-tight'>Monori |</span>
      </div>
      <div className='flex items-center justify-between px-4 py-3 sm:p-0'>
        <div className='sm:hidden'>
          <button 
            onClick={this.open.bind(this)} 
            type='button' 
            className='block text-white hover:white focus:text-white focus:outline-none'
          >
            <i className='fas fa-bars' />
          </button>
        </div>
      </div>
      <nav className={'block px-2 pt-2 pb-4 sm:flex sm:p-0'}>
        {this.props.isLoggedIn ? <AccountDropdown user={this.props.user!} className='ml-6' /> : <Link to='/login' className='mt-1 block px-2 py-1 text-white font-semibold rounded hover:bg-gray-700 sm:mt-0 sm:ml-2'></Link>}
      </nav>
    </header>;
  }
}

export default React.memo(NavbarComponent);
