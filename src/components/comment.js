import React from 'react';
import FaCaretUp from 'react-icons/lib/fa/caret-up';
import FaCaretDown from 'react-icons/lib/fa/caret-down';
import * as ReadableAPI from '../utils/ReadableAPI';
import { connect } from 'react-redux';
import { voteComment, deleteComment, editComment } from '../actions/comment_actions';
import serializeForm from 'form-serialize';

class Comment extends React.Component {
  state = {
    isEditing: false
  }

  voteComment = (commentId, option) => {
    ReadableAPI
      .voteComment(commentId, option)
      .then((comment) => {
        this.props.dispatch(voteComment({comment}));
      });
  }

  enableEdit = () => { this.setState({ isEditing: true }) }
  cancelEdit = () => { this.setState({ isEditing: false }) }

  updateComment = (e) => {
    e.preventDefault();
    const values = serializeForm(e.target, { hash: true });
    const { comment } = this.props;
    const timestamp = Date.now();

    ReadableAPI.updateComment(comment.id, timestamp, values.body).then((data) => {
      this.props.dispatch(editComment(data.id, data.timestamp, data.body));
      this.setState({ isEditing: false });
    });
  }

  deleteComment = (commentId) => {
    ReadableAPI.deleteComment(commentId).then((data) => {
      this.props.dispatch(deleteComment(data));
    });
  }

  render() {
    const { comment } = this.props;
    const { isEditing } = this.state;

    return (
      <li className="comment">
        <div className="comment-ranking">
          <button onClick={() => this.voteComment(comment.id, 'upVote')}><FaCaretUp/></button>
          <span className="comment-ranking-value">{comment.voteScore}</span>
          <button onClick={() => this.voteComment(comment.id, 'downVote')}><FaCaretDown/></button>
        </div>
        {isEditing === true
          ? <form onSubmit={this.updateComment}>
              <p><textarea name="body" defaultValue={comment.body}/></p>
              <div className="comment-meta">
                <span className="comment-author">{comment.author}</span> at&nbsp;
                <span className="comment-timestamp">{comment.timestamp}</span>
              </div>
              <div className="comment-controls">
                <button>Update Comment</button>
                <button onClick={() => this.cancelEdit()}>Cancel</button>
                <button onClick={() => this.deleteComment(comment.id)}>Delete Comment</button>
              </div>
            </form>
          : <div>
              <p>{comment.body}</p>
              <div className="comment-meta">
                <span className="comment-author">{comment.author}</span> at&nbsp;
                <span className="comment-timestamp">{comment.timestamp}</span>
              </div>
              <div className="comment-controls">
                <button onClick={() => this.enableEdit()}>Edit Comment</button>
                <button onClick={() => this.deleteComment(comment.id)}>Delete Comment</button>
              </div>
            </div>
        }
        
      </li>
    )
  }
}

export default connect(null)(Comment);