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

interface EmbedOptions {
  description: string;
  image?: string;
  title: string;
  url: string;
}

interface EmbedUpdate {
  value: any;
  tag: string;
}

/**
 * Properly adds an "embed"-like structure to the document
 * @param getOptions Function to get the options by it's properties
 */
export default function Embed<V = any>(getOptions: ((props: V) => EmbedOptions) | EmbedOptions) {
  return (WrappedComponent: typeof React.Component) => (class DummyEmbedComponent extends React.Component<V> {
    constructor(props: V) {
      super(props);

      this.onUpdateEmbed = this.onUpdateEmbed.bind(this);
    }

    private onUpdateEmbed(props: V) {
      const options = typeof getOptions === 'object' ? getOptions : getOptions(props);
      const updates: EmbedUpdate[] = [
        {
          tag: 'meta[property="og:title"]',
          value: options.title
        },
        {
          tag: 'meta[property="og:description"]',
          value: options.description
        },
        {
          tag: 'meta[property="og:url"]',
          value: options.url === '/' ? process.env.PUBLIC_URL : `${process.env.PUBLIC_URL}${options.url}`
        }
      ];

      if (options.image) updates.push({
        tag: 'meta[property="og:image"]',
        value: options.image
      });

      updates.forEach(item => {
        if (!item.value) return;

        const query = document.querySelector(item.tag);
        if (query) query.setAttribute('content', item.value);
        else {
          const element = document.createElement('meta');
          element.setAttribute('property', item.tag.slice('meta[property="'.length, item.tag.length - 2));
          element.setAttribute('content', item.value);

          document.head.appendChild(element);
        }
      });
    }

    componentDidMount() {
      this.onUpdateEmbed(this.props);
    }

    render() {
      return <WrappedComponent {...this.props} />;
    }
  });
}
