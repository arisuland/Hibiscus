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

import { bindActionCreators, Dispatch } from 'redux';
import { connect as connectStore } from 'react-redux';

/**
 * Decorator to connect the Redux store to a class-component
 * @param mapStateToProps Maps the current state to the properties list
 * @param actions Any list of actions to populate this [React.Component]
 * @credit [Evan Turner](https://github.com/evturn/redux-connect-decorator)
 */
export default function connect<TState = {}, TProps = {}>( // eslint-disable-line @typescript-eslint/ban-types
  mapStateToProps: (state: TState, props?: TProps) => any,
  actions?: any
): ClassDecorator {
  return (target: any) => {
    const provide = (dispatch: Dispatch) => bindActionCreators(actions!, dispatch);
    const matching = !actions ? actions : provide;

    return connectStore(mapStateToProps, matching)(target);
  };
}
