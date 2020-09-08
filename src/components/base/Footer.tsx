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

import { Link } from 'react-router-dom';
import React from 'react';

interface FooterState {
  date: Date;
}

class FooterComponent extends React.Component<{}, FooterState> { // eslint-disable-line @typescript-eslint/ban-types
  constructor(props: any) {
    super(props);

    this.state = { date: new Date() };
  }

  get timestamp() {
    const date = this.state.date;
    return date.getFullYear() === 2020 ? '2020' : `2020-${date.getFullYear()}`;
  }

  render() {
    // You cannot remove the copyright text or you will be asked to
    // not use Monori ever again.
    return <div className='mx-auto mt-20 mb-3'>
      <p className='text-center text-white'>
        Copyright &copy; {this.timestamp} | Made by <a href='https://augu.dev'>August (Chris)</a>
      </p>

      <p className='text-center text-white'>
        <Link to='/privacy'>Privacy Policy</Link> and <Link to='/terms'>Terms of Service</Link>
      </p>
    </div>;
  }
}

export default React.memo(FooterComponent);
