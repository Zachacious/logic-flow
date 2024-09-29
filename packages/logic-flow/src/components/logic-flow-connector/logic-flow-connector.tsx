import { Component, Host, Prop, h, Element } from '@stencil/core';
import { LogicFlowConnection } from '../logic-flow-connection/logic-flow-connection';

@Component({
  tag: 'logic-flow-connector',
  styleUrl: 'logic-flow-connector.css',
  shadow: false,
})
export class LogicFlowConnector {
  @Element() el: HTMLElement;

  @Prop() type: 'input' | 'output' = 'input';
  @Prop() connectingConnector: LogicFlowConnector | null = null;
  @Prop() connections: LogicFlowConnection[] = [];

  render() {
    const sideClass =
      this.type === 'input' ? 'left-connector' : 'right-connector';
    const typeClass =
      this.type === 'input' ? 'input-connector' : 'output-connector';

    return (
      <Host class={`logic-flow-connector ${typeClass}`}>
        <div
          class={`connector ${sideClass} ${
            (this.connections.length > 0 && 'connected') || ''
          }`}
        ></div>
        <div class={`connector-content ${sideClass}`}>
          <slot></slot>
        </div>
      </Host>
    );
  }
}
