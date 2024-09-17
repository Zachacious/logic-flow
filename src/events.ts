import { EventEmitter } from 'tseep';
import { Coords } from './components';

export const events = new EventEmitter<{
  // nodeDragStart: (el: HTMLElement, e: MouseEvent | TouchEvent) => void;
  nodeDragMove: (el: HTMLElement, e: MouseEvent | TouchEvent) => void;
  nodeDragEnd: (el: HTMLElement) => void;

  nodeDragStart: (el: HTMLElement, pos: Coords, offset: Coords) => void;
  nodeDragStopped: (el: HTMLElement) => void;
}>();
