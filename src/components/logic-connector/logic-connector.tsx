import { Component, Host, Prop, h } from '@stencil/core';

@Component({
  tag: 'logic-connector',
  styleUrl: 'logic-connector.css',
  shadow: false,
})
export class LogicConnector {
  @Prop() type: 'input' | 'output' = 'input';
  @Prop() connectingConnector: LogicConnector | null = null;
  @Prop({ mutable: true }) isDrawing: boolean = false;
  render() {
    const sideClass =
      this.type === 'input' ? 'left-connector' : 'right-connector';
    const typeClass =
      this.type === 'input' ? 'input-connector' : 'output-connector';

    return (
      <Host class={`logic-connector ${typeClass}`}>
        <div class={`connector ${sideClass}`}>
          {this.isDrawing && (
            <svg class="connection-layer" xmlns="http://www.w3.org/2000/svg">
              <path class="connection-line" d="" />
            </svg>
          )}
        </div>
        <div class={`connector-content ${sideClass}`}>
          <slot></slot>
        </div>
      </Host>
    );
  }
}
