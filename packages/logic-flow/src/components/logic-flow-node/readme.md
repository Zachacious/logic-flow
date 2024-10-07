# logic-flow-node



<!-- Auto Generated Below -->


## Properties

| Property    | Attribute    | Description | Type                        | Default          |
| ----------- | ------------ | ----------- | --------------------------- | ---------------- |
| `isVisible` | `is-visible` |             | `boolean`                   | `true`           |
| `position`  | --           |             | `{ x: number; y: number; }` | `{ x: 0, y: 0 }` |
| `startX`    | `start-x`    |             | `number`                    | `0`              |
| `startY`    | `start-y`    |             | `number`                    | `0`              |
| `type`      | `type`       |             | `string`                    | `'default'`      |


## Methods

### `getConnectedNodes(type?: "input" | "output" | "both") => Promise<void>`



#### Parameters

| Name   | Type                            | Description |
| ------ | ------------------------------- | ----------- |
| `type` | `"input" \| "output" \| "both"` |             |

#### Returns

Type: `Promise<void>`



### `getConnectors(type?: "input" | "output" | "both") => Promise<Set<HTMLLogicFlowConnectorElement>>`



#### Parameters

| Name   | Type                            | Description |
| ------ | ------------------------------- | ----------- |
| `type` | `"input" \| "output" \| "both"` |             |

#### Returns

Type: `Promise<Set<HTMLLogicFlowConnectorElement>>`



### `notifyConnectedConnectors(type: "input" | "output" | "both", data: any) => Promise<void>`



#### Parameters

| Name   | Type                            | Description |
| ------ | ------------------------------- | ----------- |
| `type` | `"input" \| "output" \| "both"` |             |
| `data` | `any`                           |             |

#### Returns

Type: `Promise<void>`




----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
