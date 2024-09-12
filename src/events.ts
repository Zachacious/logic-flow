import { EventEmitter } from 'tseep';
import { Point } from './components';

export const events = new EventEmitter<{
  // nodeDragStart: (el: HTMLElement, e: MouseEvent | TouchEvent) => void;
  nodeDragMove: (el: HTMLElement, e: MouseEvent | TouchEvent) => void;
  nodeDragEnd: (el: HTMLElement) => void;

  nodeDragStart: (el: HTMLElement, pos: Point, offset: Point) => void;
  nodeDragStopped: (el: HTMLElement) => void;
}>();
