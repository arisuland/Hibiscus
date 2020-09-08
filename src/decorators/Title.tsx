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

import React from 'react';

/**
 * Properly adds a title to the document with a string value or with a function with the included properties
 * @param title The title as a string or a function to get the title from the component's properties
 * @returns A factory function to properly add the document title
 */
export default function Title<V = any>(title: string | ((props: V) => string)) {
  return (WrappedComponent: typeof React.Component): any => {
    return (class DummyTitleComponent extends React.Component<V, {}, {}> { // eslint-disable-line @typescript-eslint/ban-types
      constructor(props: V) {
        super(props);

        this.onUpdateTitle = this.onUpdateTitle.bind(this);
      }

      /**
       * Sets the title of the document
       * @param props The properties from this dummy React component
       */
      private onUpdateTitle(props: V) {
        const docTitle = typeof title === 'string' ? title : title(props);
        if (docTitle) {
          document.title = docTitle;
        }
      }

      componentDidMount() {
        this.onUpdateTitle(this.props);
      }

      componentWillReceiveProps() {
        this.onUpdateTitle(this.props);
      }

      render() {
        return <WrappedComponent {...this.props} />;
      }
    });
  };
}
