# logic-flow-connector



<!-- Auto Generated Below -->


## Properties

| Property                    | Attribute | Description | Type                                                                                                     | Default     |
| --------------------------- | --------- | ----------- | -------------------------------------------------------------------------------------------------------- | ----------- |
| `connectingConnector`       | --        |             | `LogicFlowConnector`                                                                                     | `null`      |
| `connections`               | --        |             | `LogicFlowConnection[]`                                                                                  | `[]`        |
| `onConnection`              | --        |             | `(sourceConnector: HTMLLogicFlowConnectorElement) => Promise<boolean>`                                   | `undefined` |
| `onDisconnection`           | --        |             | `(sourceConnector: HTMLLogicFlowConnectorElement) => Promise<boolean>`                                   | `undefined` |
| `onUpdateFromConnectedNode` | --        |             | `(connector: HTMLLogicFlowConnectorElement, node: HTMLLogicFlowNodeElement, data: any) => Promise<void>` | `undefined` |
| `type`                      | `type`    |             | `"input" \| "output"`                                                                                    | `'input'`   |


## Methods

### `getNode() => Promise<HTMLLogicFlowNodeElement>`



#### Returns

Type: `Promise<HTMLLogicFlowNodeElement>`




----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
