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

import { Container, Button } from '../components/tailwind';
import { Title, connect } from '../decorators';
import type { State } from '../store/types';
import React from 'react';

@connect<State>((state) => ({
  isLoggedIn: state.isLoggedIn,
  user: state.user
}), {
  add: () => {
    return {
      type: 'login'
    };
  }
})
@Title('test')
class Home extends React.Component<State & { add(): void }> {
  onClick(event: React.MouseEvent<HTMLButtonElement, React.MouseEvent>) {
    console.log('clicked owo');
    event.preventDefault();

    console.log(this.props); // console-log it
    this.props.add();
  }

  render() {
    return <Container>
      <h1 className='text-black'>Create new state</h1>
      <p className='text-blue-300'>Current User: {this.props.user ? `@${this.props.user.username}` : 'unknown'}</p>
      <Button content='Create!' onClick={(event) => this.onClick(event as any)}></Button>
    </Container>;
  }
}

export default React.memo(Home);
