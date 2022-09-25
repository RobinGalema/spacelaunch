import React from 'react';
import './style.scss';

type Props = {
    title? : string;
}

class AppHeader extends React.Component<Props> {
    render() {
        return (
        <header>
            <div className="container">
                <div className="title-wrapper">
                    <h1>{(this.props.title) ? this.props.title : "Title Placeholder"}</h1>
                </div>
            </div>
        </header>
        );
    }
}

export default AppHeader;