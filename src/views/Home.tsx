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

import { Title, Embed, connect } from 'decorators';
import type { State, User } from 'store/types';
import { Container } from 'components/tailwind';
import React from 'react';

interface HomeProps {
  isLoggedIn: boolean;
  user: User;
}

interface Feature {
  desc: string;
  name: string;
}

@Title('Monori | Homepage')
@Embed({
  title: 'Monori | Homepage',
  description: 'Simple and open-source translation site for everyone to use, for free.',
  url: 'https://i18n.augu.dev'
})
@connect<State>(state => ({ isLoggedIn: state.isLoggedIn, user: state.user }))
class Home extends React.Component<HomeProps> {
  private features: Feature[] = [
    {
      name: 'test',
      desc: 'furries run this, what did u expect u nonce'
    }
  ];

  render() {
    return <Container center>
      <div className='grid gap-4 sm:gap-6 md:gap-8 lg:gap-12 xl:gap-16'>
        <div className='row-span-2 col-span-2 ml-10 mt-4 mb-2 sm:row-span-1 md:row-span-2 lg:row-span-3 xl:row-span-1'>
          <h1 className='text-white font-bold text-5xl ml-4'>Monori</h1>
          <p className='text-white font-semibold text-xl ml-12 mb-4'>~ Simple and open-source translation site for everyone to use, for free.</p>
          {this.props.isLoggedIn ? <p className='text-white font-semibold text-xl ml-12 mb-4'>~ Welcome back, {this.props.user.username}!</p> : null}
          <hr />
        </div>
        <div className='row-span-2 justify-items-center col-span-2 ml-10 mb-2 sm:row-span-1 md:row-span-2 lg:row-span-3 xl:row-span-1'>
          <h1 className='text-white font-bold text-4xl ml-4'>Features</h1>
          <div className='grid grid-cols-3 mb-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6'>
            {this.features.map(feature =>
              <div className='max-w-sm rounded overflow-hidden shadow-lg bg-white'>
                <div className='px-6 py-4'>
                  <div className='font-bold text-xl mb-2'>{feature.name}</div>
                  <div className='text-gray-700 text-base'>
                    {feature.desc}
                  </div>
                </div>
              </div>
            )}
          </div>
          <hr />
        </div>
      </div>
    </Container>;
  }
}

export default React.memo(Home);
