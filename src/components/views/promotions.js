import React from "react";
import * as Icon from 'react-bootstrap-icons';
import { css } from "@emotion/react";
import PulseLoader from "react-spinners/PulseLoader";
import ops from "../../services/hiveOps"

const hive = require("@hiveio/hive-js")

// Can be a string as well. Need to ensure each key-value pair ends with ;
const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;

function getUrlParameter(sParam) {
    var sPageURL = window.location.search.substring(1),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
        }
    }
    return false;
};

//let inscrybmde = new InscrybMDE()


const profile = getUrlParameter('user')
const screenWidth = window.screen.width + 'px'
let loggedInUser = localStorage.getItem('username') ? localStorage.getItem('username') : null


function Promotions(v) {
    const [posts, setPosts] = React.useState([]);
    let props = v.props

    console.log(props)


    React.useEffect(() => {
        async function getPosts() {
            
        }

        getPosts()
    }, []);
    return (
        <div className="promotions" id="promo-page-content">
            <p>Promotions here</p>
        </div>
    );
}

export default Promotions;