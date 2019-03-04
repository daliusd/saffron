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
                            <li>Change color of images (for SVG images).</li>
                            <li>Generating list of author's of icons if attribution is required.</li>
                            <li>Various ideas for advanced images controls.</li>
                        </ul>
                    </li>
                    <li>Card templates.</li>
                    <li>Two-sided cards.</li>
                    <li>UI improvements (snapping, keyboard support and etc.).</li>
                    <li>PDF generation for all the game.</li>
                    <li>Possibility to order your games for printing from various printing providers.</li>
                </ul>
                <h2>2019-03-03</h2>
                <ul>
                    <li>Data import/export in JSON and CSV formats.</li>
                    <li>
                        Named fields. If multiple fields have the same name then by editing one you change value in all
                        of them. As well named fields look better in data export/import.
                    </li>
                </ul>

                <h2>2019-03-02</h2>
                <ul>
                    <li>You can upload your own images now. Images are limited.</li>
                    <li>
                        Image order support added. E.g.: now you can upload background image and lower it to the bottom.
                    </li>
                    <li>Progress indicators and user messages improvements.</li>
                </ul>

                <h2>2019-02-24</h2>
                <ul>
                    <li>Sidebar created for lighter, cleaner and faster UI.</li>
                    <li>Zoom added to card set for more flexibility while viewing or editing.</li>
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
