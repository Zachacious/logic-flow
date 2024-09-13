import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'logic-connection',
  styleUrl: 'logic-connection.css',
  shadow: true,
})
export class LogicConnection {
  render() {
    return (
      <Host>
        <slot></slot>
      </Host>
    );
  }
}
