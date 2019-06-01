import { connect } from 'react-redux';
import React from 'react';

import { Dispatch } from '../actions';
import { State } from '../reducers';
import panIcon from './pan.svg';
import zoomIcon from './zoom.svg';
import resizeIcon from './resize.svg';
import rotateIcon from './rotate.svg';
import style from './FieldController.module.css';
import { rotateVec } from '../utils';

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
    onDrag: (x: number, y: number, cardOnly: boolean) => void;
    onResize: (width: number, height: number, cardOnly: boolean) => void;
    onRotate: (angle: number) => void;
    onZoom?: (zoom: number, cardOnly: boolean) => void;
    onPan?: (cx: number, cy: number, cardOnly: boolean) => void;
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

export interface LocalState {
    dragStarted: boolean;
    panStarted: boolean;
    zoomStarted: boolean;
    resizeStarted: boolean;
    startX: number;
    startY: number;
    activatedUsingTouch: boolean;
}

class FieldController extends React.Component<Props, LocalState> {
    moving: boolean;
    cDiv: React.RefObject<HTMLDivElement>;
    panDiv: React.RefObject<HTMLImageElement>;
    zoomDiv: React.RefObject<HTMLImageElement>;
    resizeDiv: React.RefObject<HTMLImageElement>;
    rotateDiv: React.RefObject<HTMLImageElement>;
    centerX: number;
    centerY: number;
    originalAngle: number;
    currentAngle: number;
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
        this.centerX = 0;
        this.centerY = 0;
        this.originalAngle = 0;
        this.originalBodyCursor = null;
        this.state = {
            activatedUsingTouch: false,
            dragStarted: false,
            panStarted: false,
            zoomStarted: false,
            resizeStarted: false,
            startX: 0,
            startY: 0,
        };
    }

    componentDidMount() {
        if (this.cDiv.current === null) return;
        if (this.panDiv.current === null) return;
        if (this.zoomDiv.current === null) return;
        if (this.resizeDiv.current === null) return;
        if (this.rotateDiv.current === null) return;

        this.originalBodyCursor = document.body.style.cursor;

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

    handleBrowserDragStart = (event: React.DragEvent) => {
        event.stopPropagation();
        event.preventDefault();
    };

    // Dragging handling

    handleMouseDown = (event: MouseEvent) => {
        this.handleDragStart(event);

        document.addEventListener('mousemove', this.handleMouseMove);
        document.addEventListener('mouseup', this.handleMouseUp);
    };

    handleTouchStart = (event: TouchEvent) => {
        this.handleDragStart(event.changedTouches[0]);

        document.addEventListener('touchmove', this.handleTouchMove, { passive: false });
        document.addEventListener('touchend', this.handleTouchEnd, { passive: false });
    };

    handleDragStart = (co: MouseEvent | Touch) => {
        if (this.cDiv.current === null) return;

        this.cDiv.current.style.cursor = 'grabbing';

        let startX = co.clientX;
        let startY = co.clientY;
        this.setState({ dragStarted: true, startX, startY });
    };

    handleMouseMove = (event: MouseEvent) => {
        this.handleDragMove(event, event.ctrlKey);
    };

    handleTouchMove = (event: TouchEvent) => {
        this.handleDragMove(event.changedTouches[0], event.ctrlKey);
    };

    handleDragMove = (co: MouseEvent | Touch, disableSnapping: boolean) => {
        const { isLocked, x, y } = this.props;

        if (this.cDiv.current === null || isLocked || !this.state.dragStarted) return;

        const { ppmm, snappingDistance } = this.props;

        let nx = x + co.clientX - this.state.startX;
        let ny = y + co.clientY - this.state.startY;

        if (!disableSnapping && snappingDistance !== 0) {
            nx = Math.round(nx / ppmm / snappingDistance) * snappingDistance * ppmm;
            ny = Math.round(ny / ppmm / snappingDistance) * snappingDistance * ppmm;
        }

        this.setState({ startX: co.clientX, startY: co.clientY });
        this.props.onDrag(nx, ny, true);
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

    handleComplete = (event: MouseEvent | TouchEvent, isTouchEvent: boolean) => {
        const { isLocked, x, y } = this.props;

        if (this.cDiv.current === null) return;

        if (this.state.dragStarted && !isLocked) {
            this.props.onDrag(x, y, false);
            this.setState({ dragStarted: false });
        }
        this.setState({ activatedUsingTouch: isTouchEvent });

        this.cDiv.current.style.cursor = 'grab';

        event.preventDefault();
    };

    // Pan handling

    handlePanMouseDown = (event: MouseEvent) => {
        this.handlePanStart(event);

        document.addEventListener('mousemove', this.handlePanMouseMove);
        document.addEventListener('mouseup', this.handlePanMouseUp);
        event.stopPropagation();
    };

    handlePanTouchStart = (event: TouchEvent) => {
        this.handlePanStart(event.changedTouches[0]);

        document.addEventListener('touchmove', this.handlePanTouchMove, { passive: false });
        document.addEventListener('touchend', this.handlePanTouchEnd, { passive: false });
        event.stopPropagation();
    };

    handlePanStart = (co: MouseEvent | Touch) => {
        document.body.style.cursor = `url(${panIcon}), auto`;

        let startX = co.clientX;
        let startY = co.clientY;
        this.setState({ panStarted: true, startX, startY });
    };

    handlePanMouseMove = (event: MouseEvent) => {
        this.handlePanMove(event);
        event.preventDefault();
    };

    handlePanTouchMove = (event: TouchEvent) => {
        this.handlePanMove(event.changedTouches[0]);
        event.preventDefault();
    };

    handlePanMove = (co: MouseEvent | Touch) => {
        const { cx, cy, onPan } = this.props;
        if (!this.state.panStarted || !onPan || cx === undefined || cy === undefined) return;

        let dx = co.clientX - this.state.startX;
        let dy = co.clientY - this.state.startY;
        const { rx, ry } = rotateVec(dx, dy, -this.currentAngle);

        const newCx = cx + rx;
        const newCy = cy + ry;

        this.setState({ startX: co.clientX, startY: co.clientY });

        onPan(newCx, newCy, true);
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

    handlePanComplete = (event: MouseEvent | TouchEvent) => {
        const { cx, cy, onPan } = this.props;
        if (this.state.panStarted && onPan && cx !== undefined && cy !== undefined) {
            onPan(cx, cy, true);
            this.setState({ panStarted: false });
        }

        document.body.style.cursor = this.originalBodyCursor;
        event.preventDefault();
    };

    // Zoom handling

    handleZoomMouseDown = (event: MouseEvent) => {
        this.handleZoomStart(event);

        document.addEventListener('mousemove', this.handleZoomMouseMove);
        document.addEventListener('mouseup', this.handleZoomMouseUp);
        event.stopPropagation();
    };

    handleZoomTouchStart = (event: TouchEvent) => {
        this.handleZoomStart(event.changedTouches[0]);

        document.addEventListener('touchmove', this.handleZoomTouchMove, { passive: false });
        document.addEventListener('touchend', this.handleZoomTouchEnd, { passive: false });
        event.stopPropagation();
    };

    handleZoomStart = (co: { clientX: number; clientY: number }) => {
        document.body.style.cursor = `url(${zoomIcon}), auto`;

        let startX = co.clientX;
        let startY = co.clientY;
        this.setState({ zoomStarted: true, startX, startY });
    };

    handleZoomMouseMove = (event: MouseEvent) => {
        this.handleZoomMove(event);
        event.preventDefault();
    };

    handleZoomTouchMove = (event: TouchEvent) => {
        this.handleZoomMove(event.changedTouches[0]);
        event.preventDefault();
    };

    handleZoomMove = (co: MouseEvent | Touch) => {
        const { zoom, onZoom } = this.props;
        if (!onZoom || zoom === undefined) return;

        const dx = co.clientX - this.state.startX;
        const dy = co.clientY - this.state.startY;

        let z = Math.abs(dx) > Math.abs(dy) ? dx : dy;

        let newZoom = Math.max(zoom + z / 30, 1);
        this.setState({ startX: co.clientX, startY: co.clientY });

        onZoom(newZoom, true);
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
        document.body.style.cursor = this.originalBodyCursor;
        event.preventDefault();
    };

    // Resize handling

    handleResizeMouseDown = (event: MouseEvent) => {
        this.handleResizeStart(event);

        document.addEventListener('mousemove', this.handleResizeMouseMove);
        document.addEventListener('mouseup', this.handleResizeMouseUp);
        event.stopPropagation();
    };

    handleResizeTouchStart = (event: TouchEvent) => {
        this.handleResizeStart(event.changedTouches[0]);

        document.addEventListener('touchmove', this.handleResizeTouchMove, { passive: false });
        document.addEventListener('touchend', this.handleResizeTouchEnd, { passive: false });
        event.stopPropagation();
    };

    handleResizeStart = (co: MouseEvent | Touch) => {
        const { isLocked } = this.props;

        if (isLocked) return;

        document.body.style.cursor = `url(${resizeIcon}), auto`;

        this.setState({ resizeStarted: true, startX: co.clientX, startY: co.clientY });
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
        const { isLocked, ppmm, width, height, snappingDistance, onResize } = this.props;

        if (isLocked) return;

        const dx = co.clientX - this.state.startX;
        const dy = co.clientY - this.state.startY;

        const { rx, ry } = rotateVec(dx, dy, -this.currentAngle);

        let newWidth = width + rx;
        let newHeight = height + ry;

        if (!disableSnapping && snappingDistance !== 0) {
            newWidth = Math.round(newWidth / ppmm / snappingDistance) * snappingDistance * ppmm;
            newHeight = Math.round(newHeight / ppmm / snappingDistance) * snappingDistance * ppmm;
        }

        this.setState({ startX: co.clientX, startY: co.clientY });
        console.log(newWidth, newHeight);

        onResize(newWidth, newHeight, true);
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

        if (this.state.resizeStarted && !isLocked) {
            const { width, height, onResize } = this.props;
            onResize(width, height, false);
            this.setState({ resizeStarted: false });
        }

        document.body.style.cursor = this.originalBodyCursor;

        event.preventDefault();
    };

    // Rotation handling

    handleRotateMouseDown = (event: MouseEvent) => {
        this.handleRotateStart(event);

        document.addEventListener('mousemove', this.handleRotateMouseMove);
        document.addEventListener('mouseup', this.handleRotateMouseUp);
        event.stopPropagation();
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
                onDragStart={this.handleBrowserDragStart}
                className={`${style.fieldcontroller} ${
                    isActivePlaceholder ? style.fieldcontrolleractiveplaceholder : ''
                } ${isActive ? style.fieldcontrolleractive : ''} ${
                    isActive && this.state.activatedUsingTouch ? style.touchactivated : ''
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
                        display: zoom !== undefined ? 'initial' : 'none',
                    }}
                />

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
    const isActivePlaceholder = props.placeholderId === state.cardset.activeFieldId;
    const isActive = props.cardId === state.cardset.activeCardId && props.placeholderId === state.cardset.activeFieldId;
    const isLocked = state.cardset.fields[props.cardId][props.placeholderId].locked === true;

    return {
        isActive,
        isActivePlaceholder,
        isLocked,
        snappingDistance: state.cardset.snappingDistance,
    };
};

export default connect<StateProps, DispatchProps, OwnProps, State>(mapStateToProps)(FieldController);
