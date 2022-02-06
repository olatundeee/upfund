import React from "react";
import * as Icon from 'react-bootstrap-icons';
import MarkdownIt from 'markdown-it';
import TurndownService from 'turndown';
//import { Remarkable } from 'remarkable';
//import ReactMarkdown from 'react-markdown'
//import remarkGfm from 'remark-gfm'
//import Markdown from 'markdown-to-jsx';


const hive = require("@hiveio/hive-js")
let md = new MarkdownIt()
const turndownService = new TurndownService()

// If you're in the browser, the Remarkable class is already available in the window
//var md = new Remarkable();

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
        let postBody4 = ''
            if(post) {
                postObj.title = post.title
                postObj.author = author

                let postBody =  post.body
                const markdown = turndownService.turndown(postBody)
                postBody = postBody.replace(/<center>/g, '').replace(/<\/center>/g, '').replace(/<div class="text-justify">/g, '').replace(/<\/div>/g, '').replace(/<div class="pull-left">/g, '').replace(/<div class="pull-right">/g, '').replace(/<hr>/g, '')

                
                postObj.body = md.render(postBody)
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

  function sanitizeHtmlFunc() {
    
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
                    <div className="card-header">
                        <h5 className="card-title">{post.title}</h5>
                    </div>
                    <div className="card-body post-card-body">
                        <div className="card-text text-start" id="post-body-text" dangerouslySetInnerHTML={createMarkup(post.body)} />
                    </div>
                    
                    <div className="card-footer post-footer-area bg-primary row">
                        <div className="vote-post text-white col">< Icon.HandThumbsUp /></div>
                        <div className="view-post text-white col"><a href={`/post?permlink=${post.permlink}&author=${post.author}`} style={{cursor: 'pointer !important'}} className="text-white">< Icon.EyeFill /></a></div>
                        <div className="post-author text-white col badge bg-primary text-white"><b>By: </b>@<a href={`/u/${post.author}`} className="text-white">{post.author}</a></div>
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