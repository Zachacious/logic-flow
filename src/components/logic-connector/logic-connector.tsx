import { Component, Host, Prop, h, Element, Method } from '@stencil/core';
import { LogicConnection } from '../logic-connection/logic-connection';
import { global } from '../../global';

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

  private _uid: string = global().registerConnector(this);

  @Method()
  async getUid() {
    return this._uid;
  }

  @Method()
  async destroy() {
    global().unregisterConnector(this._uid);
  }

  componentDidLoad() {
    const connector = this.el.querySelector('.connector') as HTMLElement;
    const rect = connector.getBoundingClientRect();
    global().connectorRects[this._uid] = {
      left: rect.x,
      top: rect.y,
      width: rect.width,
      height: rect.height,
    };
  }

  disconnectedCallback() {
    global().unregisterConnector(this._uid);
  }

  render() {
    const sideClass =
      this.type === 'input' ? 'left-connector' : 'right-connector';
    const typeClass =
      this.type === 'input' ? 'input-connector' : 'output-connector';

    return (
      <Host class={`logic-connector ${typeClass}`} id={this._uid}>
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
