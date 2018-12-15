// @flow
import * as React from 'react';

type Props = {
    x: number,
    y: number,
    width: number,
    height: number,
    children: React.Node,
};

export default class FieldController extends React.Component<Props> {
    cDiv: React.ElementRef<any>;
    relX: number;
    relY: number;
    startX: number;
    startY: number;
    originalW: number;
    originalH: number;
    rotatedPointX: number;
    rotatedPointY: number;
    centerX: number;
    centerY: number;
    originalAngle: number;
    currentAngle: number;

    constructor() {
        super();
        this.cDiv = React.createRef();
        this.currentAngle = 0;
    }

    rotateVec = (x: number, y: number, a: number) => {
        const sinA = Math.sin(a);
        const cosA = Math.cos(a);
        const rx = cosA * x - sinA * y;
        const ry = sinA * x + cosA * y;

        return { rx, ry };
    };

    // Dragging handling

    handleMouseDown = (event: SyntheticMouseEvent<>) => {
        this.handleDragStart(event);

        document.addEventListener('mousemove', this.handleMouseMove);
        document.addEventListener('mouseup', this.handleMouseUp);
        event.preventDefault();
    };

    handleTouchStart = (event: SyntheticTouchEvent<>) => {
        this.handleDragStart(event.changedTouches[0]);

        document.addEventListener('touchmove', this.handleTouchMove);
        document.addEventListener('touchend', this.handleTouchEnd);
    };

    handleDragStart = (co: { clientX: number, clientY: number }) => {
        this.relX = co.clientX - this.cDiv.current.offsetLeft;
        this.relY = co.clientY - this.cDiv.current.offsetTop;
    };

    handleMouseUp = (event: MouseEvent) => {
        document.removeEventListener('mousemove', this.handleMouseMove);
        document.removeEventListener('mouseup', this.handleMouseUp);
        event.preventDefault();
    };

    handleTouchEnd = (event: TouchEvent) => {
        document.removeEventListener('touchmove', this.handleTouchMove);
        document.removeEventListener('touchend', this.handleTouchEnd);
    };

    handleMouseMove = (event: MouseEvent) => {
        this.handleDragMove(event);
        event.preventDefault();
    };

    handleTouchMove = (event: TouchEvent) => {
        this.handleDragMove(event.changedTouches[0]);
    };

    handleDragMove = (co: { clientX: number, clientY: number }) => {
        const x = co.clientX - this.relX;
        const y = co.clientY - this.relY;
        this.cDiv.current.style.left = x + 'px';
        this.cDiv.current.style.top = y + 'px';
    };

    // Resize handling

    handleResizeMouseDown = (event: SyntheticMouseEvent<>) => {
        this.handleResizeStart(event);

        document.addEventListener('mousemove', this.handleResizeMouseMove);
        document.addEventListener('mouseup', this.handleResizeMouseUp);
        event.stopPropagation();
        event.preventDefault();
    };

    handleResizeTouchStart = (event: SyntheticTouchEvent<>) => {
        this.handleResizeStart(event.changedTouches[0]);

        document.addEventListener('touchmove', this.handleResizeTouchMove);
        document.addEventListener('touchend', this.handleResizeTouchEnd);
        event.stopPropagation();
    };

    handleResizeStart = (co: { clientX: number, clientY: number }) => {
        this.originalW = this.cDiv.current.clientWidth;
        this.originalH = this.cDiv.current.clientHeight;

        const dx = this.cDiv.current.clientWidth / 2;
        const dy = this.cDiv.current.clientHeight / 2;
        const { rx, ry } = this.rotateVec(-dx, -dy, this.currentAngle);

        this.rotatedPointX = this.cDiv.current.offsetLeft + dx + rx;
        this.rotatedPointY = this.cDiv.current.offsetTop + dy + ry;

        this.startX = co.clientX;
        this.startY = co.clientY;
    };

    handleResizeMouseUp = (event: MouseEvent) => {
        document.removeEventListener('mousemove', this.handleResizeMouseMove);
        document.removeEventListener('mouseup', this.handleResizeMouseUp);
        event.preventDefault();
    };

    handleResizeTouchEnd = (event: TouchEvent) => {
        document.removeEventListener('touchmove', this.handleResizeTouchMove);
        document.removeEventListener('touchend', this.handleResizeTouchEnd);
    };

    handleResizeMouseMove = (event: MouseEvent) => {
        this.handleResizeMove(event);
        event.preventDefault();
    };

    handleResizeTouchMove = (event: TouchEvent) => {
        this.handleResizeMove(event.changedTouches[0]);
    };

    handleResizeMove = (co: { clientX: number, clientY: number }) => {
        const vx = co.clientX - this.startX;
        const vy = co.clientY - this.startY;

        const { rx, ry } = this.rotateVec(vx, vy, -this.currentAngle);

        const w = this.originalW + rx;
        const h = this.originalH + ry;
        this.cDiv.current.style.width = w + 'px';
        this.cDiv.current.style.height = h + 'px';

        const rotatedV = this.rotateVec(w / 2, h / 2, this.currentAngle);
        const nx = this.rotatedPointX + rotatedV.rx;
        const ny = this.rotatedPointY + rotatedV.ry;

        this.cDiv.current.style.left = nx - w / 2 + 'px';
        this.cDiv.current.style.top = ny - h / 2 + 'px';
    };

    // Rotation handling

    handleRotateMouseDown = (event: SyntheticMouseEvent<>) => {
        this.handleRotateStart(event);

        document.addEventListener('mousemove', this.handleRotateMouseMove);
        document.addEventListener('mouseup', this.handleRotateMouseUp);
        event.stopPropagation();
        event.preventDefault();
    };

    handleRotateTouchStart = (event: SyntheticTouchEvent<>) => {
        this.handleRotateStart(event.changedTouches[0]);

        document.addEventListener('touchmove', this.handleRotateTouchMove);
        document.addEventListener('touchend', this.handleRotateTouchEnd);
        event.stopPropagation();
    };

    handleRotateStart = (co: { clientX: number, clientY: number }) => {
        const rect = this.cDiv.current.getBoundingClientRect();
        this.centerX = rect.x + this.cDiv.current.clientWidth / 2;
        this.centerY = rect.y + this.cDiv.current.clientHeight / 2;

        this.originalAngle = Math.atan2(this.centerX - co.clientX, this.centerY - co.clientY) + this.currentAngle;
    };

    handleRotateMouseUp = (event: MouseEvent) => {
        document.removeEventListener('mousemove', this.handleRotateMouseMove);
        document.removeEventListener('mouseup', this.handleRotateMouseUp);
        event.preventDefault();
    };

    handleRotateTouchEnd = (event: TouchEvent) => {
        document.removeEventListener('touchmove', this.handleRotateTouchMove);
        document.removeEventListener('touchend', this.handleRotateTouchEnd);
    };

    handleRotateMouseMove = (event: MouseEvent) => {
        this.handleRotateMove(event);
        event.preventDefault();
    };

    handleRotateTouchMove = (event: TouchEvent) => {
        this.handleRotateMove(event.changedTouches[0]);
    };

    handleRotateMove = (co: { clientX: number, clientY: number }) => {
        const angle = Math.atan2(this.centerX - co.clientX, this.centerY - co.clientY);
        this.currentAngle = this.originalAngle - angle;

        this.cDiv.current.style.transform = `rotate(${this.currentAngle}rad)`;
    };

    // Rendering

    render() {
        const { x, y, width, height, children } = this.props;

        return (
            <div
                ref={this.cDiv}
                onMouseDown={this.handleMouseDown}
                onTouchStart={this.handleTouchStart}
                style={{
                    position: 'absolute',
                    left: x,
                    top: y,
                    width: width,
                    height: height,
                    border: '1px solid black',
                    cursor: 'grab',
                }}
            >
                {children}
                <div
                    style={{
                        position: 'absolute',
                        right: 0,
                        bottom: 0,
                        cursor: 'se-resize',
                    }}
                    onMouseDown={this.handleResizeMouseDown}
                    onTouchStart={this.handleResizeTouchStart}
                >
                    ↘
                </div>
                <div
                    style={{
                        position: 'absolute',
                        left: 0,
                        bottom: 0,
                    }}
                    onMouseDown={this.handleRotateMouseDown}
                    onTouchStart={this.handleRotateTouchStart}
                >
                    ⤿
                </div>
            </div>
        );
    }
}
