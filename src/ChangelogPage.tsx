import React, { Component } from 'react';

export default class ChangelogPage extends Component {
    render() {
        return (
            <div>
                <p>Here you can find list of future plans and what was implemented recently.</p>
                <h2>Future plans</h2>
                <ul>
                    <li>
                        Image improvements:
                        <ul>
                            <li>Upload your own images.</li>
                            <li>Change color of images (for SVG images).</li>
                            <li>Generating list of author's of icons if attribution is required.</li>
                            <li>Various ideas for advances images controls.</li>
                        </ul>
                    </li>
                    <li>Card templates.</li>
                    <li>Two-sided cards.</li>
                    <li>UI improvements (snapping, field lock, keyboard support and etc.).</li>
                    <li>PDF generation for all the game.</li>
                    <li>Backgrounds support.</li>
                    <li>Data export/import from JSON and CSV.</li>
                    <li>Possibility to order your games for printing from various printing providers.</li>
                </ul>
                <h2>2019-02-24</h2>
                <ul>
                    <li>Sidebar created for lighter, cleaner and faster UI.</li>
                </ul>
                <h2>2019-02-23</h2>
                <ul>
                    <li>Text rendering changed and should be working properly now.</li>
                    <li>Crash with new card set fixed.</li>
                    <li>Minor UI improvements.</li>
                </ul>
                <h2>2019-02-17</h2>
                <p>Initial public version.</p>
            </div>
        );
    }
}
