import React from "react";
import { Button } from 'reactstrap';

const twitterButton =(props)=>{
    let fileURL = props.videoLink
         return (
            <Button>
                <a style={{color: '#fff'}} class="twitter-share-button" href="https://twitter.com/intent/tweet?text=Hello%20world"
                    data-size="large">Tweet</a>
            </Button>
        )
    }
    
export default twitterButton;