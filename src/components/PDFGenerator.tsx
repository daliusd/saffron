import { connect } from 'react-redux';
import React, { Component } from 'react';

import { ACTIVITY_CREATING_PDF, State } from '../reducers';
import { Dispatch, gameCreatePdfRequest } from '../actions';
import KawaiiMessage, { Character } from './KawaiiMessage';

interface OwnProps {
    type: string;
    id: string;
}

interface StateProps {
    isCreatingPdf: boolean;
}

interface DispatchProps {
    dispatch: Dispatch;
}

type Props = StateProps & DispatchProps & OwnProps;

interface LocalState {
    pageWidth: number;
    pageHeight: number;
    topBottomMargin: number;
    leftRightMargin: number;
}

export class PDFGenerator extends Component<Props, LocalState> {
    state = {
        pageWidth: 210,
        pageHeight: 297,
        topBottomMargin: 15,
        leftRightMargin: 9,
    };

    handleGeneratePdfClick = () => {
        const { dispatch } = this.props;
        const { pageWidth, pageHeight, topBottomMargin, leftRightMargin } = this.state;

        dispatch(
            gameCreatePdfRequest(
                this.props.type,
                this.props.id,
                pageWidth,
                pageHeight,
                topBottomMargin,
                leftRightMargin,
            ),
        );
    };

    handlePageWidthChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ pageWidth: parseFloat(event.target.value) });
    };

    handlePageHeightChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ pageHeight: parseFloat(event.target.value) });
    };

    handleTopBottomMarginChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ topBottomMargin: parseFloat(event.target.value) });
    };

    handleLeftRightMarginChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ leftRightMargin: parseFloat(event.target.value) });
    };

    render() {
        const { isCreatingPdf } = this.props;

        return (
            <>
                <KawaiiMessage character={Character.Ghost} mood="excited">
                    <p>Here you can generate PDF.</p>
                    <p>Hint 1: A4 page size is 210 mm x 297 mm. Letter page size is 215.9 x 279.4 mm.</p>
                    <p>Hint 2: 1 inch is equal to 25.4 mm.</p>
                </KawaiiMessage>

                <div className="form">
                    <label htmlFor="page_width">Page width (mm):</label>
                    <input
                        id="page_width"
                        type="number"
                        onChange={this.handlePageWidthChange}
                        placeholder="Page width"
                        value={this.state.pageWidth}
                    />
                    <label htmlFor="page_height">Page height (mm):</label>
                    <input
                        id="page_height"
                        type="number"
                        onChange={this.handlePageHeightChange}
                        placeholder="Page Height"
                        value={this.state.pageHeight}
                    />
                    <label htmlFor="page_topbottom_margin">Margin from top/bottom (mm):</label>
                    <input
                        id="page_topbottom_margin"
                        type="number"
                        onChange={this.handleTopBottomMarginChange}
                        placeholder="Top/Bottom margin"
                        value={this.state.topBottomMargin}
                    />
                    <label htmlFor="page_leftright_margin">Margin from left/right (mm):</label>
                    <input
                        id="page_leftright_margin"
                        type="number"
                        onChange={this.handleLeftRightMarginChange}
                        placeholder="Left/Right margin"
                        value={this.state.leftRightMargin}
                    />
                    <button disabled={isCreatingPdf} onClick={this.handleGeneratePdfClick}>
                        Generate PDF
                    </button>
                </div>
            </>
        );
    }
}

const mapStateToProps = (state: State): StateProps => {
    return {
        isCreatingPdf: (state.games.activity & ACTIVITY_CREATING_PDF) === ACTIVITY_CREATING_PDF,
    };
};

export default connect<StateProps, DispatchProps, OwnProps, State>(mapStateToProps)(PDFGenerator);
