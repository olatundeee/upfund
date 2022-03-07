import React from 'react'




function CommentBox () {
    return (
        <div className='replyBox' style={{width: '100% !important'}}>
            <textarea type="text" name="comment-input-box" style={{borderRadius: '25px', width: '90%', height: '200px', margin: '5%', padding: '3%'}} />
        </div>
    )
}

export default CommentBox