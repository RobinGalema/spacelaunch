import React from 'react';
import './style.scss';
import LaunchCard from '../launch-card';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

type Props = {

}

class LaunchOverview extends React.Component<{}, any, Props>{
    constructor(props : any){
        super(props);

        this.state = {
            error: null,
            isLoaded: false,
            items: []
        };
    }

    componentDidMount() {
        fetch("https://spacelaunchnow.me/api/ll/2.1.0/launch/upcoming/?format=json")
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        isLoaded : true,
                        items: result
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


    render() {
        const { error, isLoaded, items} = this.state;

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
                    <div className="launches-container">
                        {items.results.map((item :any)=> (
                            <LaunchCard data={item} key={item.id}></LaunchCard>
                        ))}
                    </div>
                }
            </div>
        )
    }
    
}

export default LaunchOverview;