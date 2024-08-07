import {  useEffect, useState } from "react";
import { Container, Image, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db, auth } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import SiteNav from "../components/SiteNav" ;

export default function PostPageHome() {
  const [posts, setPosts] = useState([]);
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();

  async function getAllPosts() {
    const query = await getDocs(collection(db, "PoopPosts"));
    const posts = query.docs.map((doc) => {
      return { id: doc.id, ...doc.data() };
    });
    setPosts(posts);
  }

  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/login");
    getAllPosts();
  }, [navigate, user, loading]);

  const ImagesRow = () => {
    return posts.map((post, index) => <ImageSquare key={index} post={post} />);
  };

  return (
    <>
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
      <Container className="text-center my-4">
        <h1>PoopSpots. Poop right.</h1>
      </Container>
      <Container>
        <Row>
          <ImagesRow />
        </Row>
      </Container>
    </>
  );
}

function ImageSquare({ post }) {
  const { image, id } = post;
  return (
    <Link
      to={`poop/${id}`}
      style={{
        width: "18rem",
        marginLeft: "1rem",
        marginTop: "2rem",
      }}
    >
      <Image
        src={image}
        style={{
          objectFit: "cover",
          width: "18rem",
          height: "18rem",
        }}
      />
    </Link>
  );
}