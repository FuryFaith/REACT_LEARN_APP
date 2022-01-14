import React, { useEffect , useState}  from "react";
import './App.css';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Post from './Post';
import { auth, db } from "./firebase";
import { TextField, FormControl} from "@mui/material";
import ImageUpload from "./ImageUpload";
import InstagramEmbed from "react-instagram-embed";




function App() {
  // variables input that are gonna be used in to recieve and pull data

  const[posts, setPosts] = useState([]);
  const[ open, setOpen ] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [openSignIn, setOpenSignIn] = useState();
  const [username, setUsername]  = useState();
  const [email, setEmail]  = useState();
  const [password, setPassword] =  useState();
  const [user, setUser] = useState(null);

//this is to take user input and retain ones that are unique , during that session
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser){
        console.log(authUser);
        setUser(authUser);

      }else{
        setUser(null);
      }
    })

    return () => {
      unsubscribe();
    }
  }, [user, username])

  //styling for the modal(login tab)
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 200,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };



// this is to pull data that is in db as snapshots and refresh only the ones that are recently added
useEffect(() => { db.collection('posts').onSnapshot(snapshot => {
  setPosts(snapshot.docs.map(doc => ({
    id: doc.id,
    post: doc.data()})
  ));
})
}, []);


// This is a event condtion that will check for username and  save else return error
const signUp = (event) => {
  event.preventDefault();

  auth
  .createUserWithEmailAndPassword(email, password)
  .then((authUser) => {
    return authUser.user.updateProfile({
      displayName: username
    })
  })
  .catch((error) => alert(error.message));

  setOpen(false);
}

//This is a event condition that will check username and login only those creds based on authetication
const signIn = (event) =>{
  event.preventDefault();

  auth
  .signInWithEmailAndPassword(email, password)
  .catch((error) => alert.apply(error.message))

  setOpenSignIn(false);
}

  return (
    <div className="App">

      {/*  This modal will be used while Signing Up! */}
       <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <FormControl sx={{ m: 1, width: '20ch' }} variant="outlined" className="app__signup">
              <img
                className="app__headerImage"
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                alt="app_headerImage missing!"
              />
              
              <TextField
                  id="outlined-name"
                  label="Username"
                  margin="normal"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />

              <TextField
                  id="outlined-name"
                  label="Email"
                  margin="normal"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

              <TextField
                  id="outlined-password-input"
                  label="Password"
                  type="password"
                  margin="normal"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

              <Button className="signToggles" type="submit" variant="outlined" margin="normal" onClick={signUp}>Sign Up</Button>
            </FormControl>
        </Box>
      </Modal>


      {/* This Modal will be used while Signing In */}
      <Modal
        open={openSignIn}
        onClose={() => setOpenSignIn(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <FormControl sx={{ m: 1, width: '20ch' }} variant="outlined" className="app__signIn">
              <img
                className="app__headerImage"
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                alt="app_headerImage missing!"
              />
              
              <TextField
                  id="outlined-name"
                  type="email"
                  label="Email"
                  margin="normal"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

              <TextField
                  id="outlined-password-input"
                  label="Password"
                  type="password"
                  margin="normal"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

              <Button className="signToggles"  type="submit" variant="outlined" margin="normal" onClick={signIn}>Sign In</Button>
            </FormControl>
        </Box>
      </Modal>



      {/*  Header part ---------------------------- */}
        <div className="app__header">

          <img
            className="app__headerImage"
            src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
            alt="app_headerImage missing!"
          />

          {/* //logout sing up functinality */}
          { user ? (
            <div className="app__loginContainer">
            <Button variant="outlined" margin="normal" onClick={() => auth.signOut()}>Logout</Button>
            </div>
                ):(
                <div className="app__loginContainer">
                <Button id="signHeader__toggle"variant="outlined" margin="normal" onClick={() => setOpenSignIn(true)}>Sign In </Button>
                <Button variant="outlined" margin="normal" onClick={handleOpen}>Sign Up</Button>
                </div>
              )
          }
        </div>

        <div className="app__posts">
          <div className="app_postsLeft">
          {/* //below code maps the posts present in database and pulls them out, and refreshs only the lastest added to db */}
          {
            posts.map(({id, post}) => (
              <Post key ={id} postId={id} user={user} username={post.username} caption={post.caption} imageUrl={post.imageUrl}/>
            ))
          }
          </div>

          <div className="app__postsRight">
          <InstagramEmbed
              url='https://instagr.am/p/Zw9o4/'
              maxWidth={500}
              hideCaption={true}
              containerTagName='div'
              protocol=''
              injectScript
              onLoading={() => {}}
              onSuccess={() => {}}
              onAfterRender={() => {}}
              onFailure={() => {}}
            />
          </div>

        </div>
          {user?.displayName ? (
              <ImageUpload username={user.displayName}/>
              ): (
                <h3 id="imageload__text">Sorry you need to login to upload</h3>
              )}
    </div>
  );
}

export default App;
