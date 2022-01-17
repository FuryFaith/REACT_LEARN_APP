import React, { useEffect , useState}  from "react";
import './App.css';
import Post from './Post';
import PostThumb from "./PostThumb";
import { auth, db } from "./firebase";
import { TextField ,  FormControl, Box , Button, Modal, Avatar} from "@mui/material";
import ImageUpload from "./ImageUpload";
import LazyLoad from "react-lazyload";
import InstagramEmbed from "react-instagram-embed";

function backToTop(){
  document.body.scrollTop = 0; // For Safari
  document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}

const Spinner = () => (
  <div className="post loading">
    <img alt="Loading..." src="https://i.gifer.com/ZZ5H.gif" width="20" />
    <h5>Loading...</h5>
  </div>
);


function App() {
  // variables input that are gonna be used in to recieve and pull data

  const[posts, setPosts] = useState([]);
  const[open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [openSignIn, setOpenSignIn] = useState();
  const [username, setUsername]  = useState();
  const [email, setEmail]  = useState();
  const [password, setPassword] =  useState();
  const [user, setUser] = useState(null);
  const [openImageUpload, setOpenImageUpload] = useState(false);


  const [viewmine, setViewMine] = useState(false);
  const [viewwhichuser, setViewWhichUser] = useState('');
  const [viewsinglepost, setViewSinglePost] = useState(false);
  const [singlepostid, setSinglePostId] = useState('');

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
useEffect(() => { db.collection('posts').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
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


function home() {
  setViewMine(false); 
  setViewWhichUser(''); 
  setViewSinglePost(false); 
  backToTop();    
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

      <header className="app__header">

          <img
            className="app__headerImage"
            src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
            alt="app_headerImage missing!"
          />
          <div className="app__loginContainer">
          {/* //logout sing up functinality */}
          { user ? (
            <div className="loginLeft">
            <Button variant="outlined" margin="normal" onClick={() => auth.signOut()}>Logout</Button>
            </div>
                ):(
                <div className="loginRight">
                <Button id="signHeader__toggle"variant="outlined" margin="normal" onClick={() => setOpenSignIn(true)}>Sign In </Button>
                <Button variant="outlined" margin="normal" onClick={handleOpen}>Sign Up</Button>
                </div>
              )
          }
          </div>
        </header>

        <div className="app__posts">
          <div className="app_postsLeft">
          {/* //below code maps the posts present in database and pulls them out, and refreshs only the lastest added to db */}
          {
            // If "View my own posts button was clicked AND user is logged in"
            (viewmine && user)  ? (
              
              <div className="post__thumbs">
              
             {

              posts.filter(({id, post}) => post.username === auth.currentUser.displayName).map(({id, post}) => (
                
                // added te below div so that if anyone clicks on this it will set a variable to enable view on a single post
                
                <LazyLoad 
                  key={id}
                  height={100}
                  offset={[-100, 100]}
                  placeholder={<Spinner />}
                  >
                    <div onClick={() => {setViewSinglePost(true); setSinglePostId(id); setViewMine(false); setViewWhichUser(null); backToTop(); }}>
                      <PostThumb 
                          key={id}
                          postId={id}
                          user={user}
                          username={post.username}
                          caption={post.caption}
                          imageUrl={post.imageUrl}
                      />
                    </div>
                  </LazyLoad>


               ))}
              </div>


              ) : (viewwhichuser)  ? ( // If we want to see other people's list of posts
                              
                  <div className="post__thumbs">
                  
                {

                  posts.filter(({id, post}) => post.username === viewwhichuser).map(({id, post}) => (
                    
                    <LazyLoad 
                    key={id}
                    height={100}
                    offset={[-100, 100]}
                    placeholder={<Spinner />}
                    >
                      <div onClick={() => {setViewSinglePost(true); setSinglePostId(id); setViewMine(false); setViewWhichUser(null); backToTop(); }}>
                        <PostThumb 
                            key={id}
                            postId={id}
                            user={user}
                            username={post.username}
                            caption={post.caption}
                            imageUrl={post.imageUrl}
                        />
                      </div>
                    </LazyLoad> 
                    // added te below div so that if anyone clicks on this it will set a variable to enable view on a single post


                  ))}
                  </div>
                          

            ) : viewsinglepost ? ( 

              // If a single post was selected
        
              posts.filter(({id, post}) => id === singlepostid).map(({id, post}) => (
                <Post 
                    key={id}
                    postId={id}
                    user={user}
                    username={post.username}
                    caption={post.caption}
                    imageUrl={post.imageUrl}
                    imagename={post.imagename}
                    viewwhichuser={setViewWhichUser}
                    viewsinglepost={setViewSinglePost}
                />                             
              ))
                  
            ) : (

              // Else if no posts were selected at all, simply default to display all posts as usual
            
              posts.map(({id, post}) => (

                <LazyLoad 
                  key={id}
                  height={100}
                  offset={[-100, 100]}
                  placeholder={<Spinner />}
                  >
                    <Post 
                        key={id}
                        postId={id}
                        user={user}
                        username={post.username}
                        caption={post.caption}
                        imageUrl={post.imageUrl}
                        imagename={post.imagename}
                        viewwhichuser={setViewWhichUser}
                        viewsinglepost={setViewSinglePost}
                    />  
                  </LazyLoad>

              ))

            )
            }

          </div>

          <div className="app__postsRight no-mobile">
          <InstagramEmbed
              className="floating"
              url='https://www.instagram.com/p/B_MLdgPjg8N/'
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


              <footer className="footer">

              {user ? (

                  <div>
                    <Modal  
                      open={openImageUpload}
                      onClose={() => setOpenImageUpload(false)}
                      aria-labelledby="modal-modal-title"
                      aria-describedby="modal-modal-description"
                    >
                    <ImageUpload 
                    username={user.displayName}
                    closemodal={setOpenImageUpload} 
                    viewwhichuser={setViewWhichUser}
                    viewsinglepost={setViewSinglePost}
                    />                    
                    </Modal>
                    
                    <div className="footer__icons">
                      <div className="footer__left">
                        <img onClick={home} className="app__home" src="https://cdn1.iconfinder.com/data/icons/instagram-ui-colored/48/JD-05-512.png" alt='home icon to go back up'/>         
                      </div>
                    
                      <div className="footer__middle">
                        <img onClick={() => setOpenImageUpload(true)} className="app__add-postImg" src="https://www.shareicon.net/data/128x128/2017/06/22/887600_add_512x512.png" alt='plus icon to add posts'/>
                      </div>

                      <div className="footer__right">
                      <Avatar 
                            onClick={()=> {setViewMine(true); backToTop();}}
                            className="footer__avatar"
                            alt={username}
                            src="https://toogreen.ca/instagreen/static/images/avatar/1.jpg"
                        />  
                    </div>
                    </div>
                    </div>

                  
                  ): (

                    <div className="footer__icons">
                    <div className="footer__left">
                      <img onClick={home} className="app__home" src="https://cdn1.iconfinder.com/data/icons/instagram-ui-colored/48/JD-05-512.png" alt='home icon to go back up'/>         
                    </div>
                    <div className="footer__middle">
                        <h3> Sorry have to login to Upload!</h3>
                    </div>                   
                </div>
                  )}  

                </footer>
    </div>
  );
}

export default App;
