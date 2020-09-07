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

import { Container } from '..';
import React from 'react';

interface FormPromptProps {
  /**
   * The children to display
   */
  children?: React.ReactNode;

  /**
   * If we should apply the `mx-auto` CSS class to this form prompt
   */
  center?: boolean;

  // TODO: fix this doc
  /**
   * If we make it fullscreen?
   */
  full?: boolean;
}

/**
 * Represents a "prompt" for forms with validation included
 * @template V The type to use
 */
class FormPromptComponent extends React.Component<FormPromptProps> {
  /**
   * Creates a reference for creating a prompt
   */
  private ref: React.RefObject<HTMLFormElement>;

  /**
   * Makes a new [FormPromptComponent]
   * @param props The properties (which is none lol)
   */
  constructor(props: FormPromptProps) {
    super(props);
  
    this.ref = React.createRef();
  }

  /**
   * Renders out this [FormPromptComponent]
   */
  render() {
    const classes: any[] = [
      this.props.center ? 'mx-auto' : null,
      this.props.full ? 'w-full max-w-xs' : null
    ].filter(Boolean);

    return <Container>
      <form ref={this.ref} className={classes.join(' ')}>
        {this.props.children}
      </form>
    </Container>;
  }
}

export default React.memo(FormPromptComponent);
