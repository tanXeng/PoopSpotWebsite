import React, { useEffect, useState } from "react";
import { Button, Container, Form, Image } from "react-bootstrap";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate, useParams } from "react-router-dom";
import { auth, db, storage } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, deleteObject, uploadBytes } from "firebase/storage"; 
import SiteNav from "../components/SiteNav"

export default function PostPageUpdate() {
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState("");
  const [previewImage, setPreviewImage] = useState("https://zca.sg/img/placeholder")
  const [location, setLocation] = useState("");
  const [rating, setRating] = useState("");
  const [imageName, setImageName] = useState("");
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();
  const params = useParams();
  const id = params.id;

  async function updatePost() {
    const postDocument = await getDoc(doc(db, "PoopPosts", id));
    const post = postDocument.data();
    const deleteRef = ref(storage, `images/${post.imageName}`)
    await deleteObject(deleteRef).then(() => {
        console.log("new photo to be added")
    }).catch((error) => {
        console.log(error.message);
    });
    const imageReferance = ref(storage, `images/${image.name}`);
    const response = await uploadBytes(imageReferance, image);
    const imageUrl = await getDownloadURL(response.ref);
    // console.log( { 
    //   caption: caption,
    //   image: imageUrl, 
    //   imageName: imageName, 
    //   location: location, 
    //   owner: user.uid, 
    //   rating:rating })
    await updateDoc(doc(db, "PoopPosts", id), { 
      caption: caption,
      image: imageUrl, 
      imageName: imageName, 
      location: location, 
      owner: user.uid, 
      rating:rating });
    navigate(`/poop/${id}`);
    }

  async function getPost(id) {
    const postDoc = await getDoc(doc(db, "PoopPosts", id));
    const post = postDoc.data(); 
    setCaption(post.caption);
    setImage(post.image);
    setPreviewImage(post.image);
    setImageName(post.imageName)
    setLocation(post.location);
    setRating(post.rating);
  }

  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/login");
    getPost(id);
  }, [id, navigate, user, loading]);

  return (
    <div>
      {/* <Navbar variant="light" bg="light">
        <Container>
          <Navbar.Brand href="/">PoopSpots</Navbar.Brand>
          <Nav>
            <Nav.Link href="/add">New Poop</Nav.Link>
            <Nav.Link href="/add" onClick={(e) => {signOut(auth)}}>Sign Out</Nav.Link>
          </Nav>
        </Container>
      </Navbar> */}
       <SiteNav />
      <Container>
        <h1 style={{ marginBlock: "1rem" }}>Update Post</h1>
        <Form>
          <Form.Group className="mb-3" controlId="caption">
            <Form.Label>Caption</Form.Label>
            <Form.Control
              type="text"
              placeholder="Lovely day"
              value={caption}
              onChange={(text) => setCaption(text.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="caption">
            <Form.Label>Location</Form.Label>
            <Form.Control
              type="text"
              placeholder="Where ever this poop was taken"
              value={location}
              onChange={(text) => setLocation(text.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="caption">
            <Form.Label>Rating</Form.Label>
            <Form.Control
              type="number"
              placeholder="Rate it!"
              value={rating}
              max={10}
              min={1}
              onChange={(text) => setRating(text.target.value)}
            />
          </Form.Group>

          <Image
            src={previewImage}
            style={{
              objectFit: "cover",
              width: "10rem",
              height: "10rem",
            }}
          />

          <Form.Group className="mb-3" controlId="image">
            <Form.Label>Image</Form.Label>
            <Form.Control
              type="file"
              onChange={(e) => {
                const imageFile = e.target.files[0];
                const previewImage = URL.createObjectURL(imageFile);
                setImage(imageFile);
                setPreviewImage(previewImage);
              }}
            />
            <Form.Text className="text-muted">
              Make sure the file has a image type at the end: jpg, jpeg, png.
            </Form.Text>
          </Form.Group>
          <Button variant="primary" onClick={(e) => updatePost()}>
            Submit
          </Button>
        </Form>
      </Container>
    </div>
  );
}