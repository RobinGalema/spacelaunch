import React from 'react';
import './style.scss';
import LaunchCard from '../launch-card';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import Row from 'react-bootstrap/Row';

type Props = {

}

class LaunchOverview extends React.Component<{}, any, Props>{
    constructor(props : any){
        super(props);

        this.state = {
            error: null,
            isLoaded: false,
            items: [],
            nextUrl : null,
            offsetLoading : false
        };
    }

    componentDidMount() {
        fetch("https://spacelaunchnow.me/api/ll/2.1.0/launch/upcoming/?format=json")
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        isLoaded : true,
                        items: result.results,
                        nextUrl : result.next
                    })
                },
                (error) => {
                    this.setState({
                        isLoaded : true,
                        error : error.message
                    })
                }
            )
    }

    loadWithOffset = () => {
        if (!this.state.nextUrl) return;

        this.setState({offsetLoading : true});

        fetch(this.state.nextUrl)
            .then(res => res.json())
            .then(
                (result) => {
                    let newItems = [...this.state.items, ...result.results]

                    this.setState({
                        items: newItems,
                        nextUrl : result.next,
                        offsetLoading : false
                    })
                },
                (error) => {
                    this.setState({
                        error : error.message,
                        offsetloading : false
                    })
                }
            )
    }


    render() {
        const { error, isLoaded, items, offsetLoading} = this.state;

        return (
            <div className="container">
                {error ?
                    <p>Something went wrong!</p> : !isLoaded ? (
                    <div className="loading-container">
                        <div className="loader-icon">
                            <FontAwesomeIcon icon={faSpinner} />
                        </div>
                    </div> 
                    ) : 
                    <div className="result-wrapper">
                        <Row>
                            {items.map((item :any)=> (
                                <LaunchCard data={item} key={item.id}></LaunchCard>
                            ))}
                        </Row>

                        <div className="button-container">
                            <button onClick={this.loadWithOffset}>{offsetLoading ? (<FontAwesomeIcon icon={faSpinner} />) : 'Load more'}</button>
                        </div>
                    </div>
                }
            </div>
        )
    }
    
}

export default LaunchOverview;