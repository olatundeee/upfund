import React from "react";
import * as Icon from 'react-bootstrap-icons';

const hive = require("@hiveio/hive-js")

function Posts() {
  const [posts, setPosts] = React.useState([]);
  let refPosts = []

  React.useEffect(() => {
      async function getPosts() {
        var query = { limit : 30, tag : "hive" };
        let thePosts = await hive.api.getDiscussionsByTrendingAsync(query);
        await thePosts.forEach(async d => {
                console.log(d)
                let json = d.json_metadata
                let onePost = {}
                let title = ``;
                if (d.title.length > 40) {
                    title = d.title.substring(0, 40)
                } else {
                    title = d.title
                }
                if (json) {
                    json = JSON.parse(json)
                    if (json.image) {
                        if (json.image.length > 0) {        
                            onePost = {
                                title: title,
                                permlink: d.permlink,
                                author: d.author,
                                url: d.url,
                                last_update: d.last_update,
                                cover: json.image[0],
                                category: json.tags[0]
                            }
                        }
                    }
                    await refPosts.push(onePost)
                }
            });
            setPosts(refPosts)
        }

      getPosts()
  }, []);

  function postTitleParse(post) {
    
  }

  return (
      

    <div className="posts" id="page-content">
        <div className="row trending-posts">
            <div className="col-lg-12 col-sm-12 col-md-12">
                <div className="section-title text-start" style={{margin: '40px 0'}}>
                    <h2 style={{fontSize: '28px'}}>Trending...</h2>
                </div>
            </div>
            {posts.map((post) => (
                <div className="col-lg-6 col-md-6 col-sm-12 post" key={post.permlink} data-author={post.author}>
                    <div className="card bg-dark text-white">
                        <div className="card-header bg-primary">
                            <h5 className="card-title post-title-wrap text-start"><a href={`/post?permlink=${post.permlink}&author=${post.author}`} className="text-white" style={{cursor: 'pointer !important', textDecoration: 'none'}}>{`${post.title}.....`}</a></h5>
                        </div>
                        <img src={post.cover} className="card-img" height="300px" />
                        <div className="card-img-overlay post-title-section d-flex flex-column justify-content-end">
                        {
                            //<h4 className="card-title post-title-wrap text-end"><a href={`/post?permlink=${post.permlink}&author=${post.author}`} className="text-danger" style={{cursor: 'pointer !important'}}>{post.title}</a></h4>
                        }
                            <p className="card-text text-start post-meta"><span className="badge bg-warning text-white text-start category-badge">{post.category}</span> <span className="badge bg-warning text-white text-start last-update-badge">{post.last_update}</span></p>
                        </div>
                    </div>
                    <div className="card post-footer" style={{margin: '0 2%'}}>
                        <div className="card-footer post-footer-section text-white row">
                            <span className="vote-post text-white col">< Icon.HandThumbsUp /></span>
                            <span className="view-post text-white col">< Icon.EyeFill /></span>
                            <span className="post-author text-white col badge bg-primary text-white"><b>By: </b>@<a href={`/u/${post.author}`} className="text-white">{post.author}</a></span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
  );
}

export default Posts;