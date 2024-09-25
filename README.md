# Logic Flow Component(under development)

Framework agnostic native web components that allows you to create logic flow diagrams and non-linear editors. Think Unreal Engine's Blueprints or Blenders material editor. View layer only. You'll need to handle the data layer(perhaps some kind of graph structure), saving, loading, etc.

![screenshot](./screenshots/screen1.png)

## Features

- arrange nodes
- connect nodes(click and drag bezier curves)
- inifinite canvas
- pan and zoom
- touch support
- customizable(simple css and component props)
- tree-shakable and small bundle size
- native web components(work with any framework)
- snap to grid(optional)
- customizable grid background or dot grid or no background
- Spacial culling(quadtree) and rendering optimization for high node counts
