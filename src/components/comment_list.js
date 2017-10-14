import React from 'react';
import FaCaretUp from 'react-icons/lib/fa/caret-up';
import FaCaretDown from 'react-icons/lib/fa/caret-down';
import * as ReadableAPI from '../utils/ReadableAPI';
import { getComments } from '../actions/comment_actions';
import { connect } from 'react-redux';

class CommentList extends React.Component {
  state = {
    comments: []
  }
  
  componentDidMount() {
    ReadableAPI.getPostComments(this.props.postId).then((comments) => {
      this.props.dispatch(getComments({comments}))
    });
  }

  render() {
    const { comments } = this.props;
    console.log(this.props);

    return(
      <ul className="comment-list">
        {comments.map((comment) => (
          <li className="comment" key={comment.id}>
            <div className="comment-ranking">
              <button><FaCaretUp/></button>
              <span className="comment-ranking-value">{comment.voteScore}</span>
              <button><FaCaretDown/></button>
            </div>
            <p>{comment.body}</p>
            <div className="comment-meta">
              <span className="comment-author">{comment.author}</span> at&nbsp;
              <span className="comment-timestamp">{comment.timestamp}</span>
            </div>
          </li>
        ))}
      </ul>
    )
  }
}

// TODO: convert this into an array of posts
function mapStateToProps ({ comments }) {
  return {
    comments
  }
}

export default connect(mapStateToProps)(CommentList);