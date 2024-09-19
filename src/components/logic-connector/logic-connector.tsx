import { Component, Host, Prop, h, Element, Method } from '@stencil/core';
import { LogicConnection } from '../logic-connection/logic-connection';

@Component({
  tag: 'logic-connector',
  styleUrl: 'logic-connector.css',
  shadow: false,
})
export class LogicConnector {
  @Element() el: HTMLElement;

  @Prop() type: 'input' | 'output' = 'input';
  @Prop() connectingConnector: LogicConnector | null = null;
  @Prop() connections: LogicConnection[] = [];

  render() {
    const sideClass =
      this.type === 'input' ? 'left-connector' : 'right-connector';
    const typeClass =
      this.type === 'input' ? 'input-connector' : 'output-connector';

    return (
      <Host class={`logic-connector ${typeClass}`}>
        <div
          class={`connector ${sideClass} ${
            this.connections.length > 0 && 'connected'
          }`}
        ></div>
        <div class={`connector-content ${sideClass}`}>
          <slot></slot>
        </div>
      </Host>
    );
  }
}
