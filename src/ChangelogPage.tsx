import React, { Component } from 'react';

export default class ChangelogPage extends Component {
    render() {
        return (
            <div>
                <p>Here you can find list of future plans and what was implemented recently.</p>
                <h2>2019-06-28</h2>
                <ul>
                    <li>Show font name using itself in font selection dropdown.</li>
                    <li>Bug fixes.</li>
                </ul>
                <h2>2019-06-23</h2>
                <ul>
                    <li>Security improved.</li>
                    <li>Help page added.</li>
                    <li>Option to rotate cards added.</li>
                    <li>Possibility to get a list of game's attributions added.</li>
                    <li>Undo/Redo exposed in UI (while I suggest using Ctrl+Z and Ctrl+Shift+Z/Ctrl+Y instead).</li>
                </ul>
                <h2>2019-06-22</h2>
                <ul>
                    <li>TIFF, WEBP and GIF support added.</li>
                    <li>No need to keep upload sidebar open to upload images.</li>
                </ul>
                <h2>2019-06-20</h2>
                <ul>
                    <li>Bug fix release: PDF generation, import/export fixes.</li>
                </ul>
                <h2>2019-06-16</h2>
                <ul>
                    <li>Bug fix release.</li>
                </ul>
                <h2>2019-06-08</h2>
                <ul>
                    <li>"Apply to all cards" work on pan and zoom as well.</li>
                    <li>UX on mobile devices (e.g. phones) improved.</li>
                    <li>Other minor fixes.</li>
                </ul>
                <h2>2019-06-04</h2>
                <ul>
                    <li>Possibility to zoom in and pan imaged added.</li>
                    <li>Undo/Redo using Ctrl+Z and Ctrl+Y (or Ctrl+Shift+Z).</li>
                    <li>More small improvements and bug fixes.</li>
                </ul>
                <h2>2019-05-26</h2>
                <ul>
                    <li>Text rendering fixes.</li>
                    <li>Card Sets and Games list are sorted alphabetically now.</li>
                    <li>Image handling improvements.</li>
                </ul>
                <h2>2019-05-18</h2>
                <ul>
                    <li>PDF and PNG generation improvements.</li>
                </ul>
                <h2>2019-05-17</h2>
                <ul>
                    <li>
                        PNG generation for card set or the whole game. This will benefit if you want to publish game via{' '}
                        <a href="https://www.thegamecrafter.com/">The Game Crafter</a>,{' '}
                        <a href="makeplayingcards.com">Make Playing Cards</a> or any other place.
                    </li>
                </ul>
                <h2>2019-04-13</h2>
                <ul>
                    <li>Option to generate cutting marks on front side only.</li>
                    <li>Guillotine cuttings marks on card edges.</li>
                    <li>
                        Field move limitation is removed because if drag field outside of view you can return it using
                        custom positions and size controls.
                    </li>
                    <li>Drag and drop improvement.</li>
                </ul>
                <h2>2019-04-07</h2>
                <ul>
                    <li>Snapping implemented for move, rotation and resize operations.</li>
                    <li>Image search changes and improvements.</li>
                    <li>
                        Drag&Drop support for images. Images can be dropped to text field as well but it is assumed that
                        dropped images are square when generating PDF.
                    </li>
                    <li>Bold and Italic support in text added.</li>
                    <li>Other minor fixes.</li>
                </ul>
                <h2>2019-03-22</h2>
                <ul>
                    <li>Two-sided cards.</li>
                    <li>PDF generation for all the game.</li>
                    <li>More PDF generation options added</li>
                    <li>Change color of images (for SVG images only, e.g. try using with "forms" images).</li>
                    <li>Game rename and delete</li>
                    <li>Card Set rename and delete</li>
                    <li>Text: line height support</li>
                    <li>UI/UX improvements</li>
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
