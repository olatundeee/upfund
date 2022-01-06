import React from "react";
import * as Icon from 'react-bootstrap-icons';
import { Remarkable } from 'remarkable';
//import ReactMarkdown from 'react-markdown'
//import remarkGfm from 'remark-gfm'
//import Markdown from 'markdown-to-jsx';


const hive = require("@hiveio/hive-js")
const showdown  = require('showdown')
const converter = new showdown.Converter()

// If you're in the browser, the Remarkable class is already available in the window
var md = new Remarkable({
    html: false, // Enable HTML tags in source
    xhtmlOut: true, // Use '/' to close single tags (<br />)
    breaks: true, // Convert '\n' in paragraphs into <br>
    linkify: true, // Autoconvert URL-like text to links

    // Enable some language-neutral replacement + quotes beautification
    typographer: true,

    // Double + single quotes replacement pairs, when typographer enabled,
    // and smartquotes on. Set doubles to '«»' for Russian, '„“' for German.
    quotes: '“”‘’'
});

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

const author = getUrlParameter('author')
const permlink = getUrlParameter('permlink')

function Post() {
    

  const [post, setPost] = React.useState([]);

  React.useEffect(() => {
    let postObj = {
        cover: '',
        title: '',
        body: null
    }
    async function getPost() {
        let post = await hive.api.getContentAsync(author, permlink); 
            if(post) {
                postObj.title = post.title
                postObj.body = post.body;
                let json = post.json_metadata
                if (json) {
                    json = JSON.parse(json)
                }
                if (json.image) {
                    if (json.image.length > 0) {
                        postObj.cover = json.image[json.image.length - 1]
                    }
                }
                setPost(postObj)
            }
    }

    getPost()
  }, []);

  function createMarkup(params) {
    return {__html: params};
  }

  return (
      

    <div className="post-detail" id="post-page-content">
        <div className="row">
            <div className="col-lg-2"></div>
            <div className="col-lg-8 col-sm-12" key={post.permlink} data-author={post.author}>
                <div className="jumbotron">
                    <img src={post.cover} height="300px" width="100%"/>
                </div>
                {<div className="card post-card">
                    <div class="card-header">
                        <h5 className="card-title">{post.title}</h5>
                    </div>
                    <div className="card-body post-card-body">
                        <div className="card-text text-start" dangerouslySetInnerHTML={createMarkup(md.render(post.body))}/>
                    </div>
                    <div className="card-footer post-footer-area text-white row">
                        <span className="vote-post text-white col">< Icon.HandThumbsUp /></span>
                        <span className="view-post text-white col">< Icon.Share /></span>
                    </div>
                </div>}
            </div>
            <div className="col-lg-2"></div>
            <hr />
            <br />
            <br />
            <br />
            <br />
        </div>
    </div>
  );
}

export default Post;