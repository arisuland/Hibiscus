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

interface ButtonProps {
  /**
   * Hover for the border
   */
  borderHover?: [string, number];

  /**
   * Received when the button is clicked, it'll perform this action
   */
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;

  /**
   * Background color
   */
  background?: [string, number];

  /**
   * If the button should be disabled
   */
  disabled?: boolean;

  /**
   * If the button should be rounded
   */
  rounded?: boolean;

  /**
   * If it should be outlined
   */
  outline?: boolean;

  /**
   * If it should be in 3D
   */
  threeD?: boolean;

  /**
   * The button's content
   */
  content: string;

  /**
   * The border color
   */
  border?: [string, number];

  /**
   * Text color
   */
  text?: string;

  /**
   * If the content should be bold
   */
  bold?: boolean;

  /**
   * If the button should be in pill-shape
   */
  pill?: boolean;
}

/**
 * Represents a normal button but customisable
 * @see [Tailwind.Button](https://tailwindcss.com/components/buttons)
 */
class ButtonComponent extends React.Component<ButtonProps> {
  render() {
    const classes = [
      'py-2',
      'px-4'
    ];

    if (this.props.borderHover) classes.push(`hover:bg-${this.props.borderHover[0]}-${this.props.borderHover[1]}`);
    if (this.props.background) classes.push(`bg-${this.props.background[0]}-${this.props.background[1]}`);
    if (this.props.disabled) classes.push('opacity-50', 'cursor-not-allowed');
    if (this.props.rounded) classes.push('rounded');
    if (this.props.outline) classes.push('font-semibold', 'hover:border-transparent', 'rounded');
    if (this.props.threeD) classes.push('border-b-4', 'rounded');
    if (this.props.border) classes.push(`border-${this.props.border[0]}-${this.props.border[1]}`);
    if (this.props.text) classes.push(`text-${this.props.text}`);
    if (this.props.bold) classes.push('font-bold');

    return <button className={classes.join(' ')} onClick={this.props.onClick}>
      {this.props.content}
    </button>;
  }
}

export default React.memo(ButtonComponent);
