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

const PaddingTypes = ['horizontal', 'vertical'];
const Sizes = ['sm', 'md', 'lg', 'xl'];

interface ContainerProps {
  /**
   * If we should include padding in the container
   */
  padding?: ['horizontal' | 'vertical', number];

  /**
   * If we should center the container (applies the `mx-auto` CSS class)
   */
  center?: boolean;

  /**
   * The size to use
   * 
   * ## Types
   * - `sm` (640px; compatible with `tailwind.config.js`)
   * - `md` (768px; compatible with `tailwind.config.js`)
   * - `lg` (1024px; compatible with `tailwind.config.js`)
   * - `xl` (1280px; compatible with `tailwind.config.js`)
   */
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

type TailwindContainerProps = React.PropsWithChildren<ContainerProps>;

/**
 * A component for fixing an element's width to the current breakpoint.
 * @see [Tailwind.Container](https://tailwindcss.com/docs/container)
 */
class ContainerComponent extends React.Component<TailwindContainerProps> {
  render() {
    if (this.props.size && !Sizes.includes(this.props.size)) throw new TypeError(`Expected ${Sizes.join(', ')} but received "${this.props.size}"`);
    if (this.props.padding) {
      if (!Array.isArray(this.props.padding)) throw new TypeError(`Expected an Array but gotten ${typeof this.props.padding}`);
      if (this.props.padding.length < 1) throw new TypeError('Expected a column-like structure ([a, b]) but gotten none');
      if (typeof this.props.padding[0] !== 'string') throw new TypeError(`Expected "string" but gotten ${typeof this.props.padding[0]}`);
      if (!PaddingTypes.includes(this.props.padding[0])) throw new TypeError(`Expected ${PaddingTypes.join(' or ')} but gotten "${this.props.padding[0]}"`);
      if (typeof this.props.padding[1] !== 'number') throw new TypeError(`Expected "number" but gotten ${typeof this.props.padding[1]}`);
      
      const padding = Number(this.props.padding[1]);
      if (isNaN(padding)) throw new TypeError(`Padding "${padding}" was not a number?`);
    }

    const getNamingScheme = (type: string) => {
      let name = '';
      if (this.props.size) name += `${this.props.size}:`;

      name += type;
      return name;
    };

    const classes = [getNamingScheme('container')];
    if (this.props.center) classes.push(getNamingScheme('mx-auto'));
    if (this.props.padding) {
      const padType = this.props.padding[0] === 'horizontal' ? 'px' : 'p';
      const times = this.props.padding[1];

      classes.push(getNamingScheme(`${padType}-${times}`));
    }

    return <div className={classes.join(' ')}>{this.props.children}</div>;
  }
}

export default React.memo(ContainerComponent);
