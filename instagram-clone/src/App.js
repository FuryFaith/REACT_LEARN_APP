import React  from "react";
import './App.css';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
//import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Post from './Post';
import { auth, db } from "./firebase";
import { TextField, FormControl} from "@mui/material";




function App() {
  const[posts, setPosts] = React.useState([]);
  const[ open, setOpen ] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [username, setUsername]  = React.useState();
  const [email, setEmail]  = React.useState();
  const [password, setPassword] =  React.useState();
  const [user, setUser] = React.useState(null);


  React.useEffect(() => {
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



// useEffect -> runs a pieace of code under specific condition

React.useEffect(() => { db.collection('posts').onSnapshot(snapshot => {
  setPosts(snapshot.docs.map(doc => ({
    id: doc.id,
    post: doc.data()})
  ));
})
}, []);

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
}


  return (
    <div className="App">

<Button onClick={handleOpen}>Sign up</Button>
       <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <FormControl sx={{ m: 1, width: '20ch' }} variant="outlined" className="app__signup">
          <center>
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
                  id="margin"
                  label="Password"
                  margin="normal"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

              <Button 
                  type="submit" 
                  variant="outlined" 
                  margin="normal"
                  onClick={signUp}>Sign Up</Button>
            </center>
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

        </div>


          {/* //below code maps the posts present in database and pulls them out, and refreshs only the lastest added to db */}
          {
            posts.map(({id, post}) => (
              <Post key ={id} username={post.username} caption={post.caption} imageUrl={post.imageUrl}/>
            ))
          }


    </div>
  );
}

export default App;
