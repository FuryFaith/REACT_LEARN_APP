import React, {useEffect, useState}from "react";
import './Post.css';
import { Avatar} from '@mui/material';
import { auth, db } from './firebase';
import firebase from "firebase/compat/app";
import MenuPopupState from "./components/MenuPopupState";
import Linkify from 'react-linkify';


function Post({ postId, user ,username, caption, imageUrl }) {
    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState("");

    const componentDecorator = (href, text, key) => (
        <a href={href} key={key} target="_blank" rel="noopener noreferrer">
            {text}
        </a>
    );

    useEffect(() => {
        let unsubscribe;
        if (postId){
            unsubscribe = db
            .collection("posts")
            .doc(postId)
            .collection("comments")
            .orderBy("timestamp","desc")
            .onSnapshot((snapshot) => {
                setComments(snapshot.docs.map((doc) => doc.data()));
            });
        }

    return () => {
        unsubscribe();
    };
}, [postId]);

    const postComment = (e) => {
        e.preventDefault();

        db.collection("posts").doc(postId).collection("comments").add({
        text: comment,
        username: user.displayName,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
        setComment("");
    };

    function deletePost(postId) {
        // event.preventDefault();
        
        db.collection("posts").doc(postId).delete().then(function() {
            console.log("Document successfully deleted!");
        }).catch(function(error) {
            console.log("Error removing document: ", error);            
        });
        // Get a reference to the storage service, which is used to create references in your storage bucket
        var storage = firebase.storage();

        // Create a storage reference from our storage service
        var storageRef = storage.ref();

        // Create a reference to the file to delete
        var desertRef = storageRef.child('images/'+username);

        // Delete the file
        desertRef.delete().then(function() {
        // File deleted successfully

        }).catch(function(error) {
        // Uh-oh, an error occurred!

        });

    }

    function deleteComment(commentToDel) {

        // Spent a whole fucking night and most of an afternoon trying to figure this one out!!!!

        db.collection("posts")
        .doc(postId)
        .collection("comments")
        .where("timestamp", "==", commentToDel)
        .get()
        .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
    
            doc.ref.delete(); 
    
        });
        });
    
    }




    return (
        <div className='post'> 
        <div className='post__header'>
            {/* Username avatar */}
        <Avatar
                className="post__avatar"
                alt={username}
                src='/static/images/avatar/1.jpg'
            /> 
            <h3 className="post__username">{username}</h3>

            {
                    ( user && username === auth.currentUser.displayName)
                    &&
                    <div className="delete__Post">
                    {/* This is where the 3 dots menu appear to delete POSTS */}
                        <MenuPopupState 
                            datatopass={postId}
                            functiontopass={deletePost}
                            labeltopass="Delete this post"
                        />
                    </div>

                }


        </div>
        <img className='post__image' src={imageUrl} alt="Missing!"/>
        <h4 className='post__text' ><strong>{username} </strong>{caption}</h4>

        <div className="post__comments">
        
                {comments.map((comment) => (
                    <div className="comment_container">
                        <p className="post__comment breakfix">
                            <Linkify componentDecorator={componentDecorator}>
                                <strong onClick={comment.username}>
                                        {comment.username}: 
                                </strong> {comment.text}
                            </Linkify>
                        </p>
                        <div className="delete__CommentButton" >
                            {
                                ( user && comment.username === auth.currentUser.displayName)
                                &&
                                <div className="comment__morevert">
                                    
                                    {/* This is where the 3 dots menu appear to delete comments */}
                                    <MenuPopupState 
                                        datatopass={comment.timestamp}
                                        functiontopass={deleteComment}
                                        labeltopass="Delete this comment"
                                    />
                                </div>
                            } 
                        </div>
                        </div>                  
))}
</div>                
                       
        {user && (
        <form className="post__commentBox">
            <input
                className="post__input"
                type="text"
                placeholder="Enter your comments"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
            />
            <button
                className="post__button"
                disabled={!comment}
                type = "submit"
                onClick={postComment}
                >Post
            </button>
        </form>
        )}          
    </div>
    );
}

export default Post;
