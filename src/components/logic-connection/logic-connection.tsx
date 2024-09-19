import { Component, Host, Method, Prop, Watch, h } from '@stencil/core';
import { Coords } from '../../types/Coords';

@Component({
  tag: 'logic-connection',
  styleUrl: 'logic-connection.css',
  shadow: false,
})
export class LogicConnection {
  @Prop() start: Coords = { x: 0, y: 0 };
  @Prop() end: Coords = { x: 0, y: 0 };
  @Prop() type: 'input' | 'output' = 'input';

  path: string;
  private _capRadius = 5;

  componentWillLoad() {
    // calculate cap width based on connector size
    // grab a .connector element from the dom
    const connector = document.querySelector('.connector');
    if (connector) {
      // get size from css
      const style = getComputedStyle(connector);
      this._capRadius = parseInt(style.width) / 2;
    }
  }

  @Watch('start')
  @Watch('end')
  @Watch('type')
  updatePath() {
    const delta = {
      x: this.end.x - this.start.x,
      y: this.end.y - this.start.y,
    };
    const distance = Math.sqrt(delta.x ** 2 + delta.y ** 2);
    const controlOffset = Math.min(100, distance * 0.35);
    const capOffset = this._capRadius;

    // Generate the path based on type
    if (this.type === 'output') {
      // Calculate start and end points for the path
      const startInset = {
        x: this.start.x + capOffset - 1,
        y: this.start.y,
      };
      const endInset = {
        x: this.end.x - capOffset + 1,
        y: this.end.y,
      };

      this.path = `M ${startInset.x},${startInset.y}
          C ${startInset.x + controlOffset},${startInset.y}
            ${endInset.x - controlOffset},${endInset.y}
            ${endInset.x},${endInset.y}`;
    } else {
      // Calculate start and end points for the path
      const startInset = {
        x: this.start.x - capOffset + 1,
        y: this.start.y,
      };
      const endInset = {
        x: this.end.x + capOffset - 1,
        y: this.end.y,
      };

      this.path = `M ${startInset.x},${startInset.y}
          C ${startInset.x - controlOffset},${startInset.y}
            ${endInset.x + controlOffset},${endInset.y}
            ${endInset.x},${endInset.y}`;
    }
  }

  render() {
    return (
      <Host class="logic-connection">
        <svg class="connection">
          <path class="connection-line" d={this.path}></path>
          {/* Start cap */}
          <circle
            cx={this.start.x}
            cy={this.start.y}
            r="1px"
            class="connection-cap start-cap"
          />
          {/* End cap */}
          <circle
            cx={this.end.x}
            cy={this.end.y}
            r="1px"
            class="connection-cap end-cap"
          />
        </svg>
      </Host>
    );
  }
}
