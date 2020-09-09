import React, { Component } from 'react';

export default class AboutPage extends Component {
    render() {
        return (
            <div>
                <h2>Help</h2>
                <p>You can learn how to use Card-a-mon from tutorials:</p>
                <ul>
                    <li>
                        <a href="https://blog.ffff.lt/posts/cardamon-tutorial-01/">Creating first game prototype</a>
                    </li>
                    <li>
                        <a href="https://blog.ffff.lt/posts/cardamon-tutorial-02/">Uploading your own images</a>
                    </li>
                    <li>
                        <a href="https://blog.ffff.lt/posts/cardamon-tutorial-03/">Import and export</a>
                    </li>
                    <li>
                        <a href="https://blog.ffff.lt/posts/cardamon-tutorial-04/">PDF generation options</a>
                    </li>
                </ul>
                <p>
                    If tutorials do not answer your question then feel free to contact me by e-mail{' '}
                    <a href="mailto:dalius.dobravolskas@gmail.com">dalius.dobravolskas@gmail.com</a>, on{' '}
                    <a href="https://twitter.com/DaliusD_">twitter</a> or{' '}
                    <a href="https://www.reddit.com/user/daliusd_/">reddit</a>.
                </p>
            </div>
        );
    }
}
