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

const Sizes = ['sm', 'md', 'lg', 'xl'];

interface GridProperties {
  /**
   * The grid size to properly add columns to it
   */
  gridSize: number;

  /**
   * The children for this [GridComponent]
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

class GridComponent extends React.Component<GridProperties> {
  render() {
    if (this.props.size && !Sizes.includes(this.props.size)) throw new TypeError(`Expected ${Sizes.join(', ')} but received "${this.props.size}"`);
    
    const gridSize = this.props.gridSize || 3;
    const getNamingScheme = (type: string) => {
      let name = '';
      if (this.props.size) name += `${this.props.size}:`;

      name += type;
      return name;
    };

    return <div className={`grid ${getNamingScheme(`grid-cols-${gridSize}`)}`}>
      {this.props.children}
    </div>;
  }
}

export default React.memo(GridComponent);
