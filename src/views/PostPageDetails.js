import React, { useEffect, useState } from "react";
import { Button, Card, Col, Container, Form, Image, Row } from "react-bootstrap";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate, useParams } from "react-router-dom";
import { auth, db, storage } from "../firebase";
import { collection, deleteDoc, doc, getDoc, addDoc, query, where, getDocs } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import SiteNav from "../components/SiteNav";
import { useBootstrapBreakpoints } from "react-bootstrap/esm/ThemeProvider";

export default function PostPageDetails() {
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState("");
  const [location, setLocation] = useState("");
  const [rating, setRating] = useState("");
  const [isOwner, setIsOwner] = useState(false)
  const [user, loading] = useAuthState(auth);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const navigate = useNavigate();
  const params = useParams();
  const id = params.id;
  const [postId, setPostId] = useState(id);
  const [rand, setRand] = useState(1)

  // async function checkOwner(){
  //   const postDocument = await getDoc(doc(db, "PoopPosts", id));
  //   const post = postDocument.data();
  //     if (user.uid === post.owner){
  //       return true;
  //     } else {
  //       return false
  //     }
  // }

  async function deletePost(id) {
    const postDocument = await getDoc(doc(db, "PoopPosts", id));
    const post = postDocument.data();
    const deleteRef = ref(storage, `images/${post.imageName}`)
    await deleteObject(deleteRef).then(() => {
        console.log("deleted from storage")
    }).catch((error) => {
        console.log(error.message);
    });
    await deleteDoc(doc(db, "PoopPosts", id));
    navigate("/");
  }

  async function getPost(id) {
    const postDoc = await getDoc(doc(db, "PoopPosts", id));
    const post = postDoc.data(); 
    setCaption(post.caption);
    setImage(post.image);
    setLocation(post.location);
    setRating(post.rating);
    if (user.uid === post.owner) {
      setIsOwner(true);
    } else {
      setIsOwner(false);
    }
  }
  async function addComment(e){
    e.preventDefault();
    await addDoc(collection(db, "Comments", ), {
      owner: user.uid,
      comment: comment,
      postId: postId
    });
    console.log("posted");
    console.log(postId);
    setComment("");
  }

  async function deleteComment(commentId){
    await deleteDoc(doc(db, "Comments", commentId));
    console.log("comment deleted");
    setRand(Math.random())
    console.log("navigated");
  }

  async function getComments(postId) {
    const commentsQuery = query(collection(db, "Comments"), where("postId", "==", postId));
    const querySnapshot = await getDocs(commentsQuery);
    const commentsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setComments(commentsData);
  }

  useEffect(() => {
    if (loading) return;
    if (!user) navigate("/login");
    getPost(id);
    getComments(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, navigate, user, loading, comment, rand])

  return (
    <>
      <SiteNav />
      <Container>
        <Row style={{ marginTop: "2rem" }}>
          <Col md="6">
            <Image src={image} style={{ width: "100%" }} />
          </Col>
          <Col>
            <Card>
              <Card.Body>
                <Card.Text>Description: {caption}</Card.Text>
                <Card.Text>Location: {location}</Card.Text>
                <Card.Text>Rating: {rating}/10</Card.Text>
                {isOwner && (
                  <>
                    <Card.Link href={`/edit/${id}`}>Edit</Card.Link>
                    <Card.Link
                      onClick={() => deletePost(id)}
                      style={{ cursor: "pointer" }}
                    >
                      Delete
                    </Card.Link>
                  </>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
      <Container style={{ marginTop: "2rem" }}>
        <Form onSubmit={addComment}>
          <Form.Group controlId="newComment">
            <Form.Control
              type="text"
              placeholder="Say something nice..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </Form.Group>
          <Button type="submit" variant="primary" style={{ marginTop: "10px" }}>
            Add Comment
          </Button>
        </Form>
        <div style={{ marginTop: "2rem" }}>
          <h4>Comments:</h4>
          {comments.length === 0 ? (
            <p>No comments yet.</p>
          ) : (
            comments.map((comment) => (
              <Card key={comment.id} style={{ marginBottom: "10px" }}>
                <Card.Body>
                  <Card.Text>{comment.comment}</Card.Text>
                  {comment.owner === user?.uid && (
                    <Button
                      variant="danger"
                      onClick={() => deleteComment(comment.id)}
                    >
                      Delete
                    </Button>
                  )}
                </Card.Body>
              </Card>
            ))
          )}
        </div>
      </Container>
    </>
  );
}