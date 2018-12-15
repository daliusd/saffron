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

    handleMouseDown = (event: SyntheticMouseEvent<>) => {
        this.relX = event.clientX - this.cDiv.current.offsetLeft;
        this.relY = event.clientY - this.cDiv.current.offsetTop;

        document.addEventListener('mousemove', this.handleMouseMove);
        document.addEventListener('mouseup', this.handleMouseUp);
        event.preventDefault();
    };

    handleMouseUp = (event: MouseEvent) => {
        document.removeEventListener('mousemove', this.handleMouseMove);
        document.removeEventListener('mouseup', this.handleMouseUp);
        event.preventDefault();
    };

    handleMouseMove = (event: MouseEvent) => {
        const x = event.clientX - this.relX;
        const y = event.clientY - this.relY;
        this.cDiv.current.style.left = x + 'px';
        this.cDiv.current.style.top = y + 'px';

        event.preventDefault();
    };

    handleResizeMouseDown = (event: SyntheticMouseEvent<>) => {
        this.originalW = this.cDiv.current.clientWidth;
        this.originalH = this.cDiv.current.clientHeight;

        const dx = this.cDiv.current.clientWidth / 2;
        const dy = this.cDiv.current.clientHeight / 2;
        const { rx, ry } = this.rotateVec(-dx, -dy, this.currentAngle);

        this.rotatedPointX = this.cDiv.current.offsetLeft + dx + rx;
        this.rotatedPointY = this.cDiv.current.offsetTop + dy + ry;

        this.startX = event.clientX;
        this.startY = event.clientY;

        document.addEventListener('mousemove', this.handleResizeMouseMove);
        document.addEventListener('mouseup', this.handleResizeMouseUp);
        event.stopPropagation();
        event.preventDefault();
    };

    handleResizeMouseUp = (event: MouseEvent) => {
        document.removeEventListener('mousemove', this.handleResizeMouseMove);
        document.removeEventListener('mouseup', this.handleResizeMouseUp);
        event.preventDefault();
    };

    handleResizeMouseMove = (event: MouseEvent) => {
        const vx = event.clientX - this.startX;
        const vy = event.clientY - this.startY;

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

        event.preventDefault();
    };

    handleRotateMouseDown = (event: SyntheticMouseEvent<>) => {
        const rect = this.cDiv.current.getBoundingClientRect();
        this.centerX = rect.x + this.cDiv.current.clientWidth / 2;
        this.centerY = rect.y + this.cDiv.current.clientHeight / 2;

        this.originalAngle = Math.atan2(this.centerX - event.clientX, this.centerY - event.clientY) + this.currentAngle;

        document.addEventListener('mousemove', this.handleRotateMouseMove);
        document.addEventListener('mouseup', this.handleRotateMouseUp);
        event.stopPropagation();
        event.preventDefault();
    };

    handleRotateMouseUp = (event: MouseEvent) => {
        document.removeEventListener('mousemove', this.handleRotateMouseMove);
        document.removeEventListener('mouseup', this.handleRotateMouseUp);
        event.preventDefault();
    };

    handleRotateMouseMove = (event: MouseEvent) => {
        const angle = Math.atan2(this.centerX - event.clientX, this.centerY - event.clientY);
        this.currentAngle = this.originalAngle - angle;

        this.cDiv.current.style.transform = `rotate(${this.currentAngle}rad)`;

        event.preventDefault();
    };

    render() {
        const { x, y, width, height, children } = this.props;

        return (
            <div
                ref={this.cDiv}
                onMouseDown={this.handleMouseDown}
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
                >
                    ⤿
                </div>
            </div>
        );
    }
}
