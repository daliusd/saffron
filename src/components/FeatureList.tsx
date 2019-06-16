import React, { Component } from 'react';
import style from './FeatureList.module.css';
import screenshot from './screenshot.png';

export default class FeatureList extends Component {
    render() {
        return (
            <div className={style.features}>
                <div>
                    <img src={screenshot} alt="screenshot" />
                </div>
                Card-a-mon has a lot of required functionality to create a card game from prototype to final product:
                <ul>
                    <li>
                        <strong>Multiple card sets</strong> per game. Each with its own card size and other properties.
                    </li>
                    <li>
                        <strong>Works on modern browsers</strong> both desktop and mobile.
                    </li>
                    <li>
                        <strong>WYSIWYG</strong> editing of cards.
                    </li>
                    <li>
                        <strong>Full images control</strong> - resize, rotation, zoom and panning. Use images from
                        built-in collection of 8000+ images or upload your own.
                    </li>
                    <li>
                        <strong>Powerful text editing</strong> - hundreds of fonts, font size, alignment, variants, line
                        height, rotation and color control, possibility to embed images into text.
                    </li>
                    <li>
                        <strong>Data export/import</strong> to/from JSON and CSV formats.
                    </li>
                    <li>
                        <strong>PDF generation</strong> of full game (all card sets) with cuttings marks for print and
                        play.
                    </li>
                    <li>
                        <strong>PNG generation</strong> for printing in services like The Game Crafter, Make Playings
                        Cards and others.
                    </li>
                </ul>
            </div>
        );
    }
}
