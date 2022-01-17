import React from 'react'
import { storage, db } from './firebase';
import firebase from "firebase/compat/app";
import { Button , TextareaAutosize } from "@mui/material";
import './ImageUpload.css';

function ImageUpload({username, closemodal, viewwhichuser, viewsinglepost}) {
    const [image, setImage] = React.useState(null);
    const [caption, setCaption] = React.useState();
    const [progress, setProgress] = React.useState(0);



    const handleChange = (e) => {
        if(e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    const handleUpload = () => {
        // eslint-disable-next-line
        const uploadTask = storage.ref(`/images/${image.name}`).put(image);

        uploadTask.on(
            "state_changed",
            (snapshot) => {
                // progress function....
                const progress = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );

                setProgress(progress);
            },
            (error) => {
                //Error function
                console.log(error);
                alert(error.message);
            },
            () => {
                //complete function .....
                storage 
                    .ref("images")
                    .child(image.name)
                    .getDownloadURL()
                    .then ( url =>{
                        //post image inside db
                        db.collection("posts").add({
                            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                            caption: caption,
                            imageUrl: url,
                            username: username,
                            imagename: image.name
                        });

                        setProgress(0);
                        setCaption("");
                        setImage(null);
                        closemodal(false);

                        // Scroll back to top and reset other states so that it goes back to default list
                        document.body.scrollTop = 0; // For Safari
                        document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
                        viewwhichuser('');
                        viewsinglepost(false);
                    });
            }
        );
    };

    return (
        <div className='imageupload'>

                    <progress className='imageupload__progress' value={progress} max="100" />
                    <TextareaAutosize id="outlined-name" label="Enter a caption...."margin="normal" value={caption} onChange={(e) => setCaption(e.target.value)}
                        />
                    <input type="file" onChange={handleChange} />
                    <Button onClick={handleUpload}>Upload</Button>

        </div>
    )
}

export default ImageUpload 
