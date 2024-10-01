# logic-flow-viewport



<!-- Auto Generated Below -->


## Properties

| Property                    | Attribute                     | Description | Type                       | Default                                                                       |
| --------------------------- | ----------------------------- | ----------- | -------------------------- | ----------------------------------------------------------------------------- |
| `connectorSnappingDistance` | `connector-snapping-distance` |             | `number`                   | `37`                                                                          |
| `cursors`                   | --                            |             | `{ [x: string]: string; }` | `{     default: 'auto',     panning: 'grabbing',     moving: 'grabbing',   }` |
| `gridBgColor`               | `grid-bg-color`               |             | `string`                   | `'#f7f7f7'`                                                                   |
| `gridLineColor`             | `grid-line-color`             |             | `string`                   | `'#555555'`                                                                   |
| `gridSize`                  | `grid-size`                   |             | `number`                   | `20`                                                                          |
| `gridType`                  | `grid-type`                   |             | `"dot" \| "line"`          | `'line'`                                                                      |
| `maxZoom`                   | `max-zoom`                    |             | `number`                   | `3`                                                                           |
| `minZoom`                   | `min-zoom`                    |             | `number`                   | `0.2`                                                                         |
| `showGrid`                  | `show-grid`                   |             | `boolean`                  | `true`                                                                        |
| `snapToGrid`                | `snap-to-grid`                |             | `boolean`                  | `false`                                                                       |
| `zoomSpeed`                 | `zoom-speed`                  |             | `number`                   | `0.08`                                                                        |


## Methods

### `getContext() => Promise<ViewContext>`



#### Returns

Type: `Promise<ViewContext>`



### `screenToWorldCoords(screenCoords: Coords) => Promise<Coords>`



#### Parameters

| Name           | Type                        | Description |
| -------------- | --------------------------- | ----------- |
| `screenCoords` | `{ x: number; y: number; }` |             |

#### Returns

Type: `Promise<Coords>`




----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
