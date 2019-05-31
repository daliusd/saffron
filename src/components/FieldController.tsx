import { connect } from 'react-redux';
import React from 'react';

import { Dispatch } from '../actions';
import { State } from '../reducers';
import panIcon from './pan.svg';
import zoomIcon from './zoom.svg';
import resizeIcon from './resize.svg';
import rotateIcon from './rotate.svg';
import style from './FieldController.module.css';

interface OwnProps {
    cardId: string;
    placeholderId: string;
    x: number;
    y: number;
    width: number;
    height: number;
    angle: number;
    zoom?: number;
    cx?: number;
    cy?: number;
    children: React.ReactNode;
    onDrag: (x: number, y: number) => void;
    onResize: (width: number, height: number) => void;
    onRotate: (angle: number) => void;
    onZoom?: (zoom: number) => void;
    onPan?: (cx: number, cy: number) => void;
    cardWidth: number;
    cardHeight: number;
    ppmm: number;
}

interface StateProps {
    isActive: boolean;
    isActivePlaceholder: boolean;
    isLocked: boolean;
    snappingDistance: number;
}

interface DispatchProps {
    dispatch: Dispatch;
}

type Props = OwnProps & StateProps & DispatchProps;

class FieldController extends React.Component<Props> {
    moving: boolean;
    cDiv: React.RefObject<HTMLDivElement>;
    panDiv: React.RefObject<HTMLImageElement>;
    zoomDiv: React.RefObject<HTMLImageElement>;
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
    activatedUsingTouch: boolean;
    originalBodyCursor: string | null;

    constructor(props: Props) {
        super(props);
        this.cDiv = React.createRef();
        this.panDiv = React.createRef();
        this.zoomDiv = React.createRef();
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
        this.activatedUsingTouch = false;
        this.originalBodyCursor = null;
    }

    componentDidMount() {
        if (this.cDiv.current === null) return;
        if (this.panDiv.current === null) return;
        if (this.zoomDiv.current === null) return;
        if (this.resizeDiv.current === null) return;
        if (this.rotateDiv.current === null) return;

        this.originalBodyCursor = document.body.style.cursor;

        this.cDiv.current.addEventListener('dragstart', this.handleBrowserDragStart);
        this.cDiv.current.addEventListener('mousedown', this.handleMouseDown);
        this.cDiv.current.addEventListener('touchstart', this.handleTouchStart);
        this.panDiv.current.addEventListener('mousedown', this.handlePanMouseDown);
        this.panDiv.current.addEventListener('touchstart', this.handlePanTouchStart);
        this.zoomDiv.current.addEventListener('mousedown', this.handleZoomMouseDown);
        this.zoomDiv.current.addEventListener('touchstart', this.handleZoomTouchStart);
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

        this.cDiv.current.style.cursor = 'grabbing';

        this.relX = co.clientX - this.cDiv.current.offsetLeft;
        this.relY = co.clientY - this.cDiv.current.offsetTop;
    };

    handleMouseUp = (event: MouseEvent) => {
        this.handleComplete(event, false);

        document.removeEventListener('mousemove', this.handleMouseMove);
        document.removeEventListener('mouseup', this.handleMouseUp);
    };

    handleTouchEnd = (event: TouchEvent) => {
        this.handleComplete(event, true);

        document.removeEventListener('touchmove', this.handleTouchMove);
        document.removeEventListener('touchend', this.handleTouchEnd);
    };

    handleComplete = (event: Event, isTouchEvent: boolean) => {
        const { isLocked } = this.props;

        if (this.cDiv.current === null) return;
        if (this.moving && !isLocked) {
            this.props.onDrag(this.cDiv.current.offsetLeft, this.cDiv.current.offsetTop);
            this.moving = false;
        }
        this.activatedUsingTouch = isTouchEvent;

        this.cDiv.current.style.cursor = 'grab';

        event.preventDefault();
    };

    handleMouseMove = (event: MouseEvent) => {
        this.handleDragMove(event, event.ctrlKey);
        event.preventDefault();
    };

    handleTouchMove = (event: TouchEvent) => {
        this.handleDragMove(event.changedTouches[0], event.ctrlKey);
        event.preventDefault();
    };

    handleDragMove = (co: { clientX: number; clientY: number }, disableSnapping: boolean) => {
        const { isLocked } = this.props;

        if (this.cDiv.current === null || isLocked) return;
        const { ppmm, snappingDistance } = this.props;
        this.moving = true;

        let x = co.clientX - this.relX;
        let y = co.clientY - this.relY;

        if (!disableSnapping && snappingDistance !== 0) {
            x = Math.round(x / ppmm / snappingDistance) * snappingDistance * ppmm;
            y = Math.round(y / ppmm / snappingDistance) * snappingDistance * ppmm;
        }

        this.cDiv.current.style.left = x + 'px';
        this.cDiv.current.style.top = y + 'px';
    };

    // Pan handling

    handlePanMouseDown = (event: MouseEvent) => {
        this.handlePanStart(event);

        document.addEventListener('mousemove', this.handlePanMouseMove);
        document.addEventListener('mouseup', this.handlePanMouseUp);
        event.stopPropagation();
        event.preventDefault();
    };

    handlePanTouchStart = (event: TouchEvent) => {
        this.handlePanStart(event.changedTouches[0]);

        document.addEventListener('touchmove', this.handlePanTouchMove, { passive: false });
        document.addEventListener('touchend', this.handlePanTouchEnd, { passive: false });
        event.stopPropagation();
    };

    handlePanStart = (co: { clientX: number; clientY: number }) => {
        if (this.cDiv.current === null) return;

        document.body.style.cursor = `url(${panIcon}), auto`;

        this.startX = co.clientX;
        this.startY = co.clientY;
    };

    handlePanMouseUp = (event: MouseEvent) => {
        this.handlePanComplete(event);

        document.removeEventListener('mousemove', this.handlePanMouseMove);
        document.removeEventListener('mouseup', this.handlePanMouseUp);
    };

    handlePanTouchEnd = (event: TouchEvent) => {
        this.handlePanComplete(event);

        document.removeEventListener('touchmove', this.handlePanTouchMove);
        document.removeEventListener('touchend', this.handlePanTouchEnd);
    };

    handlePanComplete = (event: Event) => {
        if (this.panDiv.current === null) return;
        document.body.style.cursor = this.originalBodyCursor;

        event.preventDefault();
    };

    handlePanMouseMove = (event: MouseEvent) => {
        this.handlePanMove(event);
        event.preventDefault();
    };

    handlePanTouchMove = (event: TouchEvent) => {
        this.handlePanMove(event.changedTouches[0]);
        event.preventDefault();
    };

    handlePanMove = (co: { clientX: number; clientY: number }) => {
        const { cx, cy, onPan } = this.props;
        if (this.panDiv.current === null || !onPan || cx === undefined || cy === undefined) return;

        let dx = co.clientX - this.startX;
        let dy = co.clientY - this.startY;
        const { rx, ry } = this.rotateVec(dx, dy, -this.currentAngle);

        const newCx = cx + rx;
        const newCy = cy + ry;

        this.startX = co.clientX;
        this.startY = co.clientY;

        onPan(newCx, newCy);
    };

    // Zoom handling

    handleZoomMouseDown = (event: MouseEvent) => {
        this.handleZoomStart(event);

        document.addEventListener('mousemove', this.handleZoomMouseMove);
        document.addEventListener('mouseup', this.handleZoomMouseUp);
        event.stopPropagation();
        event.preventDefault();
    };

    handleZoomTouchStart = (event: TouchEvent) => {
        this.handleZoomStart(event.changedTouches[0]);

        document.addEventListener('touchmove', this.handleZoomTouchMove, { passive: false });
        document.addEventListener('touchend', this.handleZoomTouchEnd, { passive: false });
        event.stopPropagation();
    };

    handleZoomStart = (co: { clientX: number; clientY: number }) => {
        if (this.cDiv.current === null) return;

        document.body.style.cursor = `url(${zoomIcon}), auto`;

        this.startX = co.clientX;
        this.startY = co.clientY;
    };

    handleZoomMouseUp = (event: MouseEvent) => {
        this.handleZoomComplete(event);

        document.removeEventListener('mousemove', this.handleZoomMouseMove);
        document.removeEventListener('mouseup', this.handleZoomMouseUp);
    };

    handleZoomTouchEnd = (event: TouchEvent) => {
        this.handleZoomComplete(event);

        document.removeEventListener('touchmove', this.handleZoomTouchMove);
        document.removeEventListener('touchend', this.handleZoomTouchEnd);
    };

    handleZoomComplete = (event: Event) => {
        if (this.zoomDiv.current === null) return;
        document.body.style.cursor = this.originalBodyCursor;

        event.preventDefault();
    };

    handleZoomMouseMove = (event: MouseEvent) => {
        this.handleZoomMove(event);
        event.preventDefault();
    };

    handleZoomTouchMove = (event: TouchEvent) => {
        this.handleZoomMove(event.changedTouches[0]);
        event.preventDefault();
    };

    handleZoomMove = (co: { clientX: number; clientY: number }) => {
        const { zoom, onZoom } = this.props;
        if (this.zoomDiv.current === null || !onZoom || zoom === undefined) return;

        const dx = co.clientX - this.startX;
        const dy = co.clientY - this.startY;

        this.startX = co.clientX;
        this.startY = co.clientY;

        let z = Math.abs(dx) > Math.abs(dy) ? dx : dy;

        let newZoom = Math.max(zoom + z / 30, 1);
        onZoom(newZoom);
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
        const { isLocked } = this.props;

        if (this.cDiv.current === null || isLocked) return;

        document.body.style.cursor = `url(${resizeIcon}), auto`;

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
        const { isLocked } = this.props;

        if (this.cDiv.current === null) return;

        if (this.moving && !isLocked) {
            const { offsetLeft, offsetTop, clientWidth, clientHeight } = this.cDiv.current;
            this.props.onDrag(offsetLeft, offsetTop);
            this.props.onResize(clientWidth, clientHeight);
            this.moving = false;
        }

        document.body.style.cursor = this.originalBodyCursor;

        event.preventDefault();
    };

    handleResizeMouseMove = (event: MouseEvent) => {
        this.handleResizeMove(event, event.ctrlKey);
        event.preventDefault();
    };

    handleResizeTouchMove = (event: TouchEvent) => {
        this.handleResizeMove(event.changedTouches[0], event.ctrlKey);
        event.preventDefault();
    };

    handleResizeMove = (co: { clientX: number; clientY: number }, disableSnapping: boolean) => {
        const { isLocked, ppmm, snappingDistance } = this.props;

        if (this.cDiv.current === null || isLocked) return;
        this.moving = true;

        const vx = co.clientX - this.startX;
        const vy = co.clientY - this.startY;

        const { rx, ry } = this.rotateVec(vx, vy, -this.currentAngle);

        let w = this.originalW + rx;
        let h = this.originalH + ry;

        if (!disableSnapping && snappingDistance !== 0) {
            w = Math.round(w / ppmm / snappingDistance) * snappingDistance * ppmm;
            h = Math.round(h / ppmm / snappingDistance) * snappingDistance * ppmm;
        }

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
        const { isLocked } = this.props;

        if (this.cDiv.current === null || isLocked) return;

        document.body.style.cursor = `url(${rotateIcon}), auto`;

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
        const { isLocked } = this.props;

        if (this.moving && !isLocked) {
            this.props.onRotate(this.currentAngle);
            this.moving = false;
        }

        document.body.style.cursor = this.originalBodyCursor;

        event.preventDefault();
    };

    handleRotateMouseMove = (event: MouseEvent) => {
        this.handleRotateMove(event, event.ctrlKey);
        event.preventDefault();
    };

    handleRotateTouchMove = (event: TouchEvent) => {
        this.handleRotateMove(event.changedTouches[0], event.ctrlKey);
        event.preventDefault();
    };

    handleRotateMove = (co: { clientX: number; clientY: number }, disableSnapping: boolean) => {
        const { isLocked } = this.props;

        if (this.cDiv.current === null || isLocked) return;
        this.moving = true;

        let angle = Math.atan2(this.centerX - co.clientX, this.centerY - co.clientY);

        angle = this.originalAngle - angle;
        if (!disableSnapping) {
            angle = ((Math.round(((angle / Math.PI) * 180) / 5) * 5) / 180) * Math.PI;
        }

        this.currentAngle = angle;

        this.cDiv.current.style.transform = `rotate(${this.currentAngle}rad)`;
    };

    // Rendering

    render() {
        const { x, y, width, height, angle, zoom, cx, children, isActive, isActivePlaceholder, isLocked } = this.props;

        return (
            <div
                ref={this.cDiv}
                className={`${style.fieldcontroller} ${
                    isActivePlaceholder ? style.fieldcontrolleractiveplaceholder : ''
                } ${isActive ? style.fieldcontrolleractive : ''} ${
                    isActive && this.activatedUsingTouch ? style.touchactivated : ''
                } `}
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
                    src={panIcon}
                    alt="pan"
                    ref={this.panDiv}
                    className={style.controller}
                    style={{
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        cursor: `url(${panIcon}), auto`,
                        display: cx !== undefined && zoom !== undefined && zoom > 1 ? 'initial' : 'none',
                    }}
                />

                {zoom !== undefined && (
                    <img
                        src={zoomIcon}
                        alt="zoom"
                        ref={this.zoomDiv}
                        className={style.controller}
                        style={{
                            position: 'absolute',
                            right: 0,
                            top: 0,
                            cursor: `url(${zoomIcon}), auto`,
                        }}
                    />
                )}

                <img
                    src={resizeIcon}
                    alt="resize"
                    ref={this.resizeDiv}
                    className={style.controller}
                    style={{
                        position: 'absolute',
                        right: 0,
                        bottom: 0,
                        cursor: `url(${resizeIcon}), auto`,
                        display: isLocked ? 'none' : 'initial',
                    }}
                />
                <img
                    src={rotateIcon}
                    alt="rotate"
                    ref={this.rotateDiv}
                    className={style.controller}
                    style={{
                        position: 'absolute',
                        left: 0,
                        bottom: 0,
                        cursor: `url(${rotateIcon}), auto`,
                        display: isLocked ? 'none' : 'initial',
                    }}
                />
            </div>
        );
    }
}

const mapStateToProps = (state: State, props: OwnProps): StateProps => {
    const isActivePlaceholder = props.placeholderId === state.cardsets.activePlaceholder;
    const isActive =
        props.cardId === state.cardsets.activeCard && props.placeholderId === state.cardsets.activePlaceholder;
    const isLocked = state.cardsets.placeholders[props.placeholderId].locked === true;

    return {
        isActive,
        isActivePlaceholder,
        isLocked,
        snappingDistance: state.cardsets.snappingDistance,
    };
};

export default connect<StateProps, DispatchProps, OwnProps, State>(mapStateToProps)(FieldController);
