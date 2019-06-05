import { connect } from 'react-redux';
import React from 'react';
import shortid from 'shortid';

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
    fieldId: string;
    x: number;
    y: number;
    width: number;
    height: number;
    angle: number;
    zoom?: number;
    cx?: number;
    cy?: number;
    children: React.ReactNode;
    onDrag: (x: number, y: number, cardOnly: boolean, group: string) => void;
    onResize: (width: number, height: number, cardOnly: boolean, group: string) => void;
    onRotate: (angle: number, cardOnly: boolean, group: string) => void;
    onZoom?: (zoom: number, cardOnly: boolean, group: string) => void;
    onPan?: (cx: number, cy: number, cardOnly: boolean, group: string) => void;
    cardWidth: number;
    cardHeight: number;
    ppmm: number;
}

interface StateProps {
    isActive: boolean;
    isActiveField: boolean;
    isLocked: boolean;
    isUnclickable: boolean;
    snappingDistance: number;
}

interface DispatchProps {
    dispatch: Dispatch;
}

type Props = OwnProps & StateProps & DispatchProps;

export interface LocalState {
    startX: number;
    startY: number;
    originalAngle: number;
    activatedUsingTouch: boolean;
    group: string;
}

class FieldController extends React.Component<Props, LocalState> {
    cDiv: React.RefObject<HTMLDivElement>;
    panDiv: React.RefObject<HTMLImageElement>;
    zoomDiv: React.RefObject<HTMLImageElement>;
    resizeDiv: React.RefObject<HTMLImageElement>;
    rotateDiv: React.RefObject<HTMLImageElement>;
    originalBodyCursor: string | null;

    constructor(props: Props) {
        super(props);
        this.cDiv = React.createRef();
        this.panDiv = React.createRef();
        this.zoomDiv = React.createRef();
        this.resizeDiv = React.createRef();
        this.rotateDiv = React.createRef();
        this.originalBodyCursor = null;
        this.state = {
            activatedUsingTouch: false,
            startX: 0,
            startY: 0,
            originalAngle: 0,
            group: '',
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
        if (event.touches.length > 1) {
            return; // Let's ignore zooms
        }

        this.handleDragStart(event.changedTouches[0]);

        document.addEventListener('touchmove', this.handleTouchMove, { passive: false });
        document.addEventListener('touchend', this.handleTouchEnd, { passive: false });
        event.preventDefault();
    };

    handleDragStart = (co: MouseEvent | Touch) => {
        if (this.cDiv.current === null) return;

        this.cDiv.current.style.cursor = 'grabbing';

        this.setState({ startX: co.clientX, startY: co.clientY, group: shortid.generate() });
    };

    handleMouseMove = (event: MouseEvent) => {
        this.handleDragMove(event, event.ctrlKey);
    };

    handleTouchMove = (event: TouchEvent) => {
        if (event.touches.length > 1) {
            return; // Let's ignore zooms
        }

        this.handleDragMove(event.changedTouches[0], event.ctrlKey);
    };

    handleDragMove = (co: MouseEvent | Touch, disableSnapping: boolean) => {
        const { isLocked, x, y } = this.props;

        if (isLocked) return;

        const { ppmm, snappingDistance } = this.props;

        let nx = x + co.clientX - this.state.startX;
        let ny = y + co.clientY - this.state.startY;

        if (!disableSnapping && snappingDistance !== 0) {
            nx = Math.round(nx / ppmm / snappingDistance) * snappingDistance * ppmm;
            ny = Math.round(ny / ppmm / snappingDistance) * snappingDistance * ppmm;
        }

        this.setState({ startX: co.clientX, startY: co.clientY });
        this.props.onDrag(nx, ny, true, this.state.group);
    };

    handleMouseUp = (event: MouseEvent) => {
        this.handleComplete(event, false);

        document.removeEventListener('mousemove', this.handleMouseMove);
        document.removeEventListener('mouseup', this.handleMouseUp);
    };

    handleTouchEnd = (event: TouchEvent) => {
        if (event.touches.length > 1) {
            return; // Let's ignore zooms
        }

        this.handleComplete(event, true);

        document.removeEventListener('touchmove', this.handleTouchMove);
        document.removeEventListener('touchend', this.handleTouchEnd);
    };

    handleComplete = (event: MouseEvent | TouchEvent, isTouchEvent: boolean) => {
        const { isLocked, x, y } = this.props;

        if (this.cDiv.current === null) return;

        if (!isLocked) {
            this.props.onDrag(x, y, false, this.state.group);
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
        if (event.touches.length > 1) {
            return; // Let's ignore zooms
        }

        this.handlePanStart(event.changedTouches[0]);

        document.addEventListener('touchmove', this.handlePanTouchMove, { passive: false });
        document.addEventListener('touchend', this.handlePanTouchEnd, { passive: false });
        event.stopPropagation();
    };

    handlePanStart = (co: MouseEvent | Touch) => {
        document.body.style.cursor = `url(${panIcon}), auto`;

        this.setState({ startX: co.clientX, startY: co.clientY, group: shortid.generate() });
    };

    handlePanMouseMove = (event: MouseEvent) => {
        this.handlePanMove(event);
        event.preventDefault();
    };

    handlePanTouchMove = (event: TouchEvent) => {
        if (event.touches.length > 1) {
            return; // Let's ignore zooms
        }

        this.handlePanMove(event.changedTouches[0]);
        event.preventDefault();
    };

    handlePanMove = (co: MouseEvent | Touch) => {
        const { cx, cy, angle, onPan } = this.props;
        if (!onPan || cx === undefined || cy === undefined) return;

        let dx = co.clientX - this.state.startX;
        let dy = co.clientY - this.state.startY;
        const { rx, ry } = rotateVec(dx, dy, -angle);

        const newCx = cx + rx;
        const newCy = cy + ry;

        this.setState({ startX: co.clientX, startY: co.clientY });

        onPan(newCx, newCy, true, this.state.group);
    };

    handlePanMouseUp = (event: MouseEvent) => {
        this.handlePanComplete(event);

        document.removeEventListener('mousemove', this.handlePanMouseMove);
        document.removeEventListener('mouseup', this.handlePanMouseUp);
    };

    handlePanTouchEnd = (event: TouchEvent) => {
        if (event.touches.length > 1) {
            return; // Let's ignore zooms
        }

        this.handlePanComplete(event);

        document.removeEventListener('touchmove', this.handlePanTouchMove);
        document.removeEventListener('touchend', this.handlePanTouchEnd);
    };

    handlePanComplete = (event: MouseEvent | TouchEvent) => {
        const { cx, cy, onPan } = this.props;
        if (onPan && cx !== undefined && cy !== undefined) {
            onPan(cx, cy, true, this.state.group);
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
        if (event.touches.length > 1) {
            return; // Let's ignore zooms
        }

        this.handleZoomStart(event.changedTouches[0]);

        document.addEventListener('touchmove', this.handleZoomTouchMove, { passive: false });
        document.addEventListener('touchend', this.handleZoomTouchEnd, { passive: false });
        event.stopPropagation();
    };

    handleZoomStart = (co: { clientX: number; clientY: number }) => {
        document.body.style.cursor = `url(${zoomIcon}), auto`;

        this.setState({ startX: co.clientX, startY: co.clientY, group: shortid.generate() });
    };

    handleZoomMouseMove = (event: MouseEvent) => {
        this.handleZoomMove(event);
        event.preventDefault();
    };

    handleZoomTouchMove = (event: TouchEvent) => {
        if (event.touches.length > 1) {
            return; // Let's ignore zooms
        }

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

        onZoom(newZoom, true, this.state.group);
    };

    handleZoomMouseUp = (event: MouseEvent) => {
        this.handleZoomComplete(event);

        document.removeEventListener('mousemove', this.handleZoomMouseMove);
        document.removeEventListener('mouseup', this.handleZoomMouseUp);
    };

    handleZoomTouchEnd = (event: TouchEvent) => {
        if (event.touches.length > 1) {
            return; // Let's ignore zooms
        }

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
        if (event.touches.length > 1) {
            return; // Let's ignore zooms
        }

        this.handleResizeStart(event.changedTouches[0]);

        document.addEventListener('touchmove', this.handleResizeTouchMove, { passive: false });
        document.addEventListener('touchend', this.handleResizeTouchEnd, { passive: false });
        event.stopPropagation();
    };

    handleResizeStart = (co: MouseEvent | Touch) => {
        const { isLocked } = this.props;

        if (isLocked) return;

        document.body.style.cursor = `url(${resizeIcon}), auto`;

        this.setState({ startX: co.clientX, startY: co.clientY, group: shortid.generate() });
    };

    handleResizeMouseMove = (event: MouseEvent) => {
        this.handleResizeMove(event, event.ctrlKey);
        event.preventDefault();
    };

    handleResizeTouchMove = (event: TouchEvent) => {
        if (event.touches.length > 1) {
            return; // Let's ignore zooms
        }

        this.handleResizeMove(event.changedTouches[0], event.ctrlKey);
        event.preventDefault();
    };

    handleResizeMove = (co: { clientX: number; clientY: number }, disableSnapping: boolean) => {
        const { isLocked, ppmm, width, height, angle, snappingDistance, onResize } = this.props;

        if (isLocked) return;

        const dx = co.clientX - this.state.startX;
        const dy = co.clientY - this.state.startY;

        const { rx, ry } = rotateVec(dx, dy, -angle);

        let newWidth = width + rx;
        let newHeight = height + ry;

        if (!disableSnapping && snappingDistance !== 0) {
            newWidth = Math.round(newWidth / ppmm / snappingDistance) * snappingDistance * ppmm;
            newHeight = Math.round(newHeight / ppmm / snappingDistance) * snappingDistance * ppmm;
        }

        this.setState({ startX: co.clientX, startY: co.clientY });

        onResize(newWidth, newHeight, true, this.state.group);
    };

    handleResizeMouseUp = (event: MouseEvent) => {
        this.handleResizeComplete(event);

        document.removeEventListener('mousemove', this.handleResizeMouseMove);
        document.removeEventListener('mouseup', this.handleResizeMouseUp);
    };

    handleResizeTouchEnd = (event: TouchEvent) => {
        if (event.touches.length > 1) {
            return; // Let's ignore zooms
        }

        this.handleResizeComplete(event);

        document.removeEventListener('touchmove', this.handleResizeTouchMove);
        document.removeEventListener('touchend', this.handleResizeTouchEnd);
    };

    handleResizeComplete = (event: Event) => {
        const { isLocked } = this.props;

        if (!isLocked) {
            const { width, height, onResize } = this.props;
            onResize(width, height, false, this.state.group);
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
        if (event.touches.length > 1) {
            return; // Let's ignore zooms
        }

        this.handleRotateStart(event.changedTouches[0]);

        document.addEventListener('touchmove', this.handleRotateTouchMove, { passive: false });
        document.addEventListener('touchend', this.handleRotateTouchEnd, { passive: false });
        event.stopPropagation();
    };

    handleRotateStart = (co: { clientX: number; clientY: number }) => {
        const { isLocked, angle } = this.props;

        if (isLocked || this.cDiv.current === null) return;

        document.body.style.cursor = `url(${rotateIcon}), auto`;

        const rect = this.cDiv.current.getBoundingClientRect();
        let startX = rect.left + this.cDiv.current.clientWidth / 2;
        let startY = rect.top + this.cDiv.current.clientHeight / 2;

        let originalAngle = angle + Math.atan2(startX - co.clientX, startY - co.clientY);

        this.setState({ startX, startY, originalAngle, group: shortid.generate() });
    };

    handleRotateMouseMove = (event: MouseEvent) => {
        this.handleRotateMove(event, event.ctrlKey);
        event.preventDefault();
    };

    handleRotateTouchMove = (event: TouchEvent) => {
        if (event.touches.length > 1) {
            return; // Let's ignore zooms
        }

        this.handleRotateMove(event.changedTouches[0], event.ctrlKey);
        event.preventDefault();
    };

    handleRotateMove = (co: MouseEvent | Touch, disableSnapping: boolean) => {
        const { isLocked, onRotate } = this.props;

        if (isLocked) return;

        const { originalAngle, startX, startY } = this.state;

        let curAngle = Math.atan2(startX - co.clientX, startY - co.clientY);
        let newAngle = originalAngle - curAngle;

        if (!disableSnapping) {
            newAngle = ((Math.round(((newAngle / Math.PI) * 180) / 5) * 5) / 180) * Math.PI;
        }

        onRotate(newAngle, true, this.state.group);
    };

    handleRotateMouseUp = (event: MouseEvent) => {
        this.handleRotateComplete(event);

        document.removeEventListener('mousemove', this.handleRotateMouseMove);
        document.removeEventListener('mouseup', this.handleRotateMouseUp);
    };

    handleRotateTouchEnd = (event: TouchEvent) => {
        if (event.touches.length > 1) {
            return; // Let's ignore zooms
        }

        this.handleRotateComplete(event);

        document.removeEventListener('touchmove', this.handleRotateTouchMove);
        document.removeEventListener('touchend', this.handleRotateTouchEnd);
    };

    handleRotateComplete = (event: Event) => {
        const { isLocked } = this.props;

        if (!isLocked) {
            const { angle } = this.props;
            this.props.onRotate(angle, false, this.state.group);
        }

        document.body.style.cursor = this.originalBodyCursor;

        event.preventDefault();
    };

    // Rendering

    render() {
        const {
            x,
            y,
            width,
            height,
            angle,
            zoom,
            cx,
            children,
            isActive,
            isActiveField,
            isLocked,
            isUnclickable,
        } = this.props;

        return (
            <div
                ref={this.cDiv}
                onDragStart={this.handleBrowserDragStart}
                className={`${style.fieldcontroller} ${isActiveField ? style.fieldcontrolleractivefield : ''} ${
                    isActive ? style.fieldcontrolleractive : ''
                } ${isActive && this.state.activatedUsingTouch ? style.touchactivated : ''} `}
                style={{
                    position: 'absolute',
                    left: x,
                    top: y,
                    width: width,
                    height: height,
                    cursor: 'grab',
                    transform: `rotate(${angle}rad)`,
                    pointerEvents: isUnclickable ? 'none' : 'initial',
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
                        display: cx !== undefined && zoom !== undefined ? 'initial' : 'none',
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
    const isActiveField = props.fieldId === state.cardset.present.activeFieldId;
    const isActive =
        props.cardId === state.cardset.present.activeCardId && props.fieldId === state.cardset.present.activeFieldId;
    const fieldInfo = state.cardset.present.fields[props.cardId][props.fieldId];
    const isLocked = fieldInfo.locked === true;
    const isUnclickable = fieldInfo.unclickable === true;

    return {
        isActive,
        isActiveField,
        isLocked,
        isUnclickable,
        snappingDistance: state.cardset.present.snappingDistance,
    };
};

export default connect<StateProps, DispatchProps, OwnProps, State>(mapStateToProps)(FieldController);
