import React, { useEffect, useState } from "react";
import { Button, Container, Form, Image } from "react-bootstrap";
import { addDoc, collection } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { auth, db, storage } from "../firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import SiteNav from "../components/SiteNav";

export default function PostPageAdd() {
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState("");
  const [location, setLocation] = useState("");
  const [rating, setRating] = useState("");
  const [imageName, setImageName] = useState("")
  const [user, loading] = useAuthState(auth);
  // console.log(user.uid)
  const [previewImage, setPreviewImage] = useState("https://zca.sg/img/placeholder")
  const navigate = useNavigate();


  async function addPost() {
    const imageReferance = ref(storage, `images/${image.name}`);
    const response = await uploadBytes(imageReferance, image);
    const imageUrl = await getDownloadURL(response.ref)
    await addDoc(collection(db, "PoopPosts"), { 
      caption: caption,
      image: imageUrl, 
      imageName: imageName, 
      location: location, 
      owner: user.uid, 
      rating:rating });
    navigate("/");
  }

  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/login");
  }, [navigate, user, loading]);

  return (
    <>
      {/* <Navbar variant="light" bg="light">
        <Container>
          <Navbar.Brand href="/">PoopSpots</Navbar.Brand>
          <Nav>
            <Nav.Link href="/add">New Poop</Nav.Link>
            <Nav.Link href="/add" onClick={(e) => signOut(auth)}>Sign Out</Nav.Link>
          </Nav>
        </Container>
      </Navbar> */}
      <SiteNav />
      <Container>
        <h1 style={{ marginBlock: "1rem" }}>Add Poop</h1>
        <Form>
          <Form.Group className="mb-3" controlId="caption">
            <Form.Label>Caption</Form.Label>
            <Form.Control
              type="text"
              placeholder="Lovely poop"
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
	          display: "block",
              objectFit: "cover",
              width: "10rem",
              height: "10rem",
            }}
          />
          <Form.Group className="mb-3" controlId="image">
            <Form.Label>Image URL</Form.Label>
            <Form.Control
              type="file"
              onChange={(e) => {
                const imageFile = e.target.files[0];
                const previewImage = URL.createObjectURL(imageFile);
                setImage(imageFile);
                setImageName(imageFile.name);
                setPreviewImage(previewImage);
                }}
            />
            <Form.Text className="text-muted">
              Make sure the url has a image type at the end: jpg, jpeg, png.
            </Form.Text>
          </Form.Group>
          <Button variant="primary" onClick={async (e) => addPost()}>
            Submit
          </Button>
        </Form>
      </Container>
    </>
  );
}