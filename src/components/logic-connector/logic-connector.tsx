import { Component, Host, Prop, h } from '@stencil/core';

@Component({
  tag: 'logic-connector',
  styleUrl: 'logic-connector.css',
  shadow: false,
})
export class LogicConnector {
  @Prop() type: 'input' | 'output' = 'input';
  render() {
    const sideClass =
      this.type === 'input' ? 'left-connector' : 'right-connector';
    const typeClass =
      this.type === 'input' ? 'input-connector' : 'output-connector';

    return (
      <Host class={`logic-connector ${typeClass}`}>
        <div class={`connector ${sideClass}`}></div>
        <div class={`connector-content ${sideClass}`}>
          <slot></slot>
        </div>
      </Host>
    );
  }
}
