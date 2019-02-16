import { connect } from 'react-redux';
import React from 'react';

import { Dispatch } from '../actions';
import { State } from '../reducers';
import resize from './resize.svg';
import rotate from './rotate.svg';
import style from './FieldController.module.css';

interface OwnProps {
    cardId: string;
    placeholderId: string;
    x: number;
    y: number;
    width: number;
    height: number;
    angle: number;
    children: React.ReactNode;
    onDrag: (x: number, y: number) => void;
    onResize: (width: number, height: number) => void;
    onRotate: (angle: number) => void;
}

interface StateProps {
    isActive: boolean;
    isActivePlaceholder: boolean;
}

interface DispatchProps {
    dispatch: Dispatch;
}

type Props = OwnProps & StateProps & DispatchProps;

class FieldController extends React.Component<Props> {
    moving: boolean;
    cDiv: React.RefObject<HTMLDivElement>;
    resizeDiv: React.RefObject<HTMLImageElement>;
    rotateDiv: React.RefObject<HTMLImageElement>;
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

    constructor(props: Props) {
        super(props);
        this.cDiv = React.createRef();
        this.resizeDiv = React.createRef();
        this.rotateDiv = React.createRef();
        this.currentAngle = props.angle;
        this.moving = false;
        this.relX = 0;
        this.relY = 0;
        this.startX = 0;
        this.startY = 0;
        this.originalW = 0;
        this.originalH = 0;
        this.rotatedPointX = 0;
        this.rotatedPointY = 0;
        this.centerX = 0;
        this.centerY = 0;
        this.originalAngle = 0;
    }

    componentDidMount() {
        if (this.cDiv.current === null) return;
        if (this.resizeDiv.current === null) return;
        if (this.rotateDiv.current === null) return;

        this.cDiv.current.addEventListener('dragstart', this.handleBrowserDragStart);
        this.cDiv.current.addEventListener('mousedown', this.handleMouseDown);
        this.cDiv.current.addEventListener('touchstart', this.handleTouchStart);
        this.resizeDiv.current.addEventListener('mousedown', this.handleResizeMouseDown);
        this.resizeDiv.current.addEventListener('touchstart', this.handleResizeTouchStart);
        this.rotateDiv.current.addEventListener('mousedown', this.handleRotateMouseDown);
        this.rotateDiv.current.addEventListener('touchstart', this.handleRotateTouchStart);
    }

    componentDidUpdate() {
        if (this.cDiv.current === null) return;

        this.currentAngle = this.props.angle;
    }

    rotateVec = (x: number, y: number, a: number) => {
        const sinA = Math.sin(a);
        const cosA = Math.cos(a);
        const rx = cosA * x - sinA * y;
        const ry = sinA * x + cosA * y;

        return { rx, ry };
    };

    handleBrowserDragStart = (event: DragEvent) => {
        event.stopPropagation();
        event.preventDefault();
    };

    // Dragging handling

    handleMouseDown = (event: MouseEvent) => {
        this.handleDragStart(event);

        document.addEventListener('mousemove', this.handleMouseMove);
        document.addEventListener('mouseup', this.handleMouseUp);
        event.stopPropagation();
    };

    handleTouchStart = (event: TouchEvent) => {
        this.handleDragStart(event.changedTouches[0]);

        document.addEventListener('touchmove', this.handleTouchMove, { passive: false });
        document.addEventListener('touchend', this.handleTouchEnd, { passive: false });
        event.stopPropagation();
    };

    handleDragStart = (co: { clientX: number; clientY: number }) => {
        if (this.cDiv.current === null) return;
        this.relX = co.clientX - this.cDiv.current.offsetLeft;
        this.relY = co.clientY - this.cDiv.current.offsetTop;
    };

    handleMouseUp = (event: MouseEvent) => {
        this.handleComplete(event);

        document.removeEventListener('mousemove', this.handleMouseMove);
        document.removeEventListener('mouseup', this.handleMouseUp);
    };

    handleTouchEnd = (event: TouchEvent) => {
        this.handleComplete(event);

        document.removeEventListener('touchmove', this.handleTouchMove);
        document.removeEventListener('touchend', this.handleTouchEnd);
    };

    handleComplete = (event: Event) => {
        if (this.cDiv.current === null) return;
        if (this.moving) {
            this.props.onDrag(this.cDiv.current.offsetLeft, this.cDiv.current.offsetTop);
            this.moving = false;
        }
        event.preventDefault();
    };

    handleMouseMove = (event: MouseEvent) => {
        this.handleDragMove(event);
        event.preventDefault();
    };

    handleTouchMove = (event: TouchEvent) => {
        this.handleDragMove(event.changedTouches[0]);
        event.preventDefault();
    };

    handleDragMove = (co: { clientX: number; clientY: number }) => {
        if (this.cDiv.current === null) return;
        this.moving = true;

        const x = co.clientX - this.relX;
        const y = co.clientY - this.relY;
        this.cDiv.current.style.left = x + 'px';
        this.cDiv.current.style.top = y + 'px';
    };

    // Resize handling

    handleResizeMouseDown = (event: MouseEvent) => {
        this.handleResizeStart(event);

        document.addEventListener('mousemove', this.handleResizeMouseMove);
        document.addEventListener('mouseup', this.handleResizeMouseUp);
        event.stopPropagation();
        event.preventDefault();
    };

    handleResizeTouchStart = (event: TouchEvent) => {
        this.handleResizeStart(event.changedTouches[0]);

        document.addEventListener('touchmove', this.handleResizeTouchMove, { passive: false });
        document.addEventListener('touchend', this.handleResizeTouchEnd, { passive: false });
        event.stopPropagation();
    };

    handleResizeStart = (co: { clientX: number; clientY: number }) => {
        if (this.cDiv.current === null) return;
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
        this.handleResizeComplete(event);

        document.removeEventListener('mousemove', this.handleResizeMouseMove);
        document.removeEventListener('mouseup', this.handleResizeMouseUp);
    };

    handleResizeTouchEnd = (event: TouchEvent) => {
        this.handleResizeComplete(event);

        document.removeEventListener('touchmove', this.handleResizeTouchMove);
        document.removeEventListener('touchend', this.handleResizeTouchEnd);
    };

    handleResizeComplete = (event: Event) => {
        if (this.cDiv.current === null) return;
        if (this.moving) {
            const { offsetLeft, offsetTop, clientWidth, clientHeight } = this.cDiv.current;
            this.props.onDrag(offsetLeft, offsetTop);
            this.props.onResize(clientWidth, clientHeight);
            this.moving = false;
        }
        event.preventDefault();
    };

    handleResizeMouseMove = (event: MouseEvent) => {
        this.handleResizeMove(event);
        event.preventDefault();
    };

    handleResizeTouchMove = (event: TouchEvent) => {
        this.handleResizeMove(event.changedTouches[0]);
        event.preventDefault();
    };

    handleResizeMove = (co: { clientX: number; clientY: number }) => {
        if (this.cDiv.current === null) return;
        this.moving = true;

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

    handleRotateMouseDown = (event: MouseEvent) => {
        this.handleRotateStart(event);

        document.addEventListener('mousemove', this.handleRotateMouseMove);
        document.addEventListener('mouseup', this.handleRotateMouseUp);
        event.stopPropagation();
        event.preventDefault();
    };

    handleRotateTouchStart = (event: TouchEvent) => {
        this.handleRotateStart(event.changedTouches[0]);

        document.addEventListener('touchmove', this.handleRotateTouchMove, { passive: false });
        document.addEventListener('touchend', this.handleRotateTouchEnd, { passive: false });
        event.stopPropagation();
    };

    handleRotateStart = (co: { clientX: number; clientY: number }) => {
        if (this.cDiv.current === null) return;
        const rect = this.cDiv.current.getBoundingClientRect();
        this.centerX = rect.left + this.cDiv.current.clientWidth / 2;
        this.centerY = rect.top + this.cDiv.current.clientHeight / 2;

        this.originalAngle = Math.atan2(this.centerX - co.clientX, this.centerY - co.clientY) + this.currentAngle;
    };

    handleRotateMouseUp = (event: MouseEvent) => {
        this.handleRotateComplete(event);

        document.removeEventListener('mousemove', this.handleRotateMouseMove);
        document.removeEventListener('mouseup', this.handleRotateMouseUp);
    };

    handleRotateTouchEnd = (event: TouchEvent) => {
        this.handleRotateComplete(event);

        document.removeEventListener('touchmove', this.handleRotateTouchMove);
        document.removeEventListener('touchend', this.handleRotateTouchEnd);
    };

    handleRotateComplete = (event: Event) => {
        if (this.moving) {
            this.props.onRotate(this.currentAngle);
            this.moving = false;
        }
        event.preventDefault();
    };

    handleRotateMouseMove = (event: MouseEvent) => {
        this.handleRotateMove(event);
        event.preventDefault();
    };

    handleRotateTouchMove = (event: TouchEvent) => {
        this.handleRotateMove(event.changedTouches[0]);
        event.preventDefault();
    };

    handleRotateMove = (co: { clientX: number; clientY: number }) => {
        if (this.cDiv.current === null) return;
        this.moving = true;

        const angle = Math.atan2(this.centerX - co.clientX, this.centerY - co.clientY);
        this.currentAngle = this.originalAngle - angle;

        this.cDiv.current.style.transform = `rotate(${this.currentAngle}rad)`;
    };

    // Rendering

    render() {
        const { x, y, width, height, angle, children, isActive, isActivePlaceholder } = this.props;

        return (
            <div
                ref={this.cDiv}
                className={`${style.fieldcontroller} ${
                    isActivePlaceholder ? style.fieldcontrolleractiveplaceholder : ''
                } ${isActive ? style.fieldcontrolleractive : ''}`}
                style={{
                    position: 'absolute',
                    left: x,
                    top: y,
                    width: width,
                    height: height,
                    cursor: 'grab',
                    transform: `rotate(${angle}rad)`,
                }}
            >
                {children}
                <img
                    src={resize}
                    alt="resize"
                    ref={this.resizeDiv}
                    className={style.controller}
                    style={{
                        position: 'absolute',
                        right: 0,
                        bottom: 0,
                        cursor: `url(${resize}), auto`,
                    }}
                />
                <img
                    src={rotate}
                    alt="rotate"
                    ref={this.rotateDiv}
                    className={style.controller}
                    style={{
                        position: 'absolute',
                        left: 0,
                        bottom: 0,
                        cursor: `url(${rotate}), auto`,
                    }}
                />
            </div>
        );
    }
}

const mapStateToProps = (state: State, props: OwnProps): StateProps => {
    return {
        isActive:
            props.cardId === state.cardsets.activeCard && props.placeholderId === state.cardsets.activePlaceholder,
        isActivePlaceholder: props.placeholderId === state.cardsets.activePlaceholder,
    };
};

export default connect<StateProps, DispatchProps, OwnProps, State>(mapStateToProps)(FieldController);
