import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'logic-node',
  styleUrl: 'logic-node.css',
  shadow: true,
})
export class LogicNode {
  render() {
    return (
      <Host>
        <slot></slot>
      </Host>
    );
  }
}
