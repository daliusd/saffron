import React, { Component } from 'react';

export default class AboutPage extends Component {
    render() {
        return (
            <div>
                <h2>About</h2>
                <p>
                    "Card-a-mon" is card game development tool. At the moment it is project of single person (me) with a
                    vision. My aim is to create affordable and practical tool to develop card games from A (prototyping)
                    to Z (printing). If you have ideas, suggestions, proposals, comments and etc. then you can contact
                    me by e-mail <a href="mailto:dalius.dobravolskas@gmail.com">dalius.dobravolskas@gmail.com</a>.
                </p>
                <h2>Credits</h2>
                This project is available because of number amazing open source projects. Some of them:
                <ul>
                    <li>
                        <a href="https://reactjs.org/">React</a> and all the ecosystem around it.
                    </li>
                    <li>
                        <a href="https://fonts.google.com/">Google Fonts</a>
                    </li>
                    <li>
                        <a href="https://github.com/game-icons/icons">Game icons</a>
                    </li>
                    <li>
                        <a href="http://pdfkit.org/">PDFKit</a>
                    </li>
                </ul>
                <p>... and many more.</p>
            </div>
        );
    }
}
