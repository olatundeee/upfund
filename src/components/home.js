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
                    title = d.title.substring(0, 30)
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

  return (
      

    <div className="posts" id="page-content">
        <div className="row trending-posts">
            <div className="col-lg-12 col-sm-12 col-md-12">
                <div className="section-title text-start" style={{margin: '40px 0'}}>
                    <select>
                        <option>Trending</option>
                        <option>Hot</option>
                        <option>New</option>
                    </select>
                </div>
            </div>
            {posts.map((post) => (
                <div className="col-lg-6 col-md-6 col-sm-12 post" key={post.permlink} data-author={post.author}>
                    <div className="card">
                        <img className="card-img-top" src={post.cover}  height="300px"  />
                        <div className="card-body">
                            <h5 className="card-text post-title-wrap text-center"><a href={`/post?permlink=${post.permlink}&author=${post.author}`} style={{cursor: 'pointer !important', color: 'rgba(var(--bs-warning-rgb),var(--bs-bg-opacity))!important'}}>{post.title}...</a></h5>
                            <p className="card-text text-center post-meta"><span className="badge bg-warning text-white text-start category-badge">{post.category}</span> <span className="badge bg-warning text-white text-start last-update-badge">{post.last_update}</span></p>
                        </div>
                        <div className="card-footer post-footer-area bg-primary row">
                            <div className="vote-post text-white col">< Icon.HandThumbsUp /></div>
                            <div className="view-post text-white col"><a href={`/post?permlink=${post.permlink}&author=${post.author}`} style={{cursor: 'pointer !important'}} className="text-white">< Icon.EyeFill /></a></div>
                            <div className="post-author text-white col badge bg-primary text-white"><b>By: </b>@<a href={`/u/${post.author}`} className="text-white">{post.author}</a></div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
  );
}

export default Posts;