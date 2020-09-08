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

type Spacing = 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly';

const SpacingTypes = ['start', 'end', 'center', 'between', 'around', 'evenly'];
const Sizes = ['sm', 'md', 'lg', 'xl'];

interface FlexboxJustifyProperties {
  /**
   * The background to use
   */
  background?: string | [string, number];

  /**
   * The grid size to properly add columns to it
   * 
   * ## Types
   * - `start`
   * - `end`
   * - `center`
   * - `between`
   * - `around`
   * - `evenly`
   */
  spacing: Spacing;

  /**
   * The children for this [FlexboxJustifyComponent]
   */
  children: React.ReactNode;

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

class FlexboxJustifyComponent extends React.Component<FlexboxJustifyProperties> {
  render() {
    if (!SpacingTypes.includes(this.props.spacing)) throw new TypeError(`Expected ${SpacingTypes.join(', ')} but received "${this.props.spacing}"`);
    if (this.props.size && !Sizes.includes(this.props.size)) throw new TypeError(`Expected ${Sizes.join(', ')} but received "${this.props.size}"`);
    
    const classes: string[] = [];
    const getNamingScheme = (type: string) => {
      let name = '';
      if (this.props.size) name += `${this.props.size}:`;

      name += type;
      return name;
    };

    if (this.props.background) {
      const items: [string, number | undefined] = typeof this.props.background === 'string' ? [this.props.background, undefined] : this.props.background;
      classes.push(`bg-${items[0]}${items.length === 2 ? `-${items[1]}` : ''}`);
    }

    classes.push(getNamingScheme(`justify-${this.props.spacing}`));
    return <div className={classes.join(' ')}>
      {this.props.children}
    </div>;
  }
}

export default React.memo(FlexboxJustifyComponent);
