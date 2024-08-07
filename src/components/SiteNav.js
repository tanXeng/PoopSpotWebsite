// import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { signOut } from 'firebase/auth'; 
import { auth } from '../firebase';

export default function SiteNav(){
 return(
    <Navbar variant="light"  style={{ backgroundColor: 'beige' }}>
        <Container>
          <Navbar.Brand href="/" style={{ fontWeight: 'bold' }}>PoopSpots</Navbar.Brand>
          <Nav>
            <Nav.Link href="/add">New Poop</Nav.Link>
            <Nav.Link href="/add" onClick={(e) => {signOut(auth)}}>Sign Out</Nav.Link>
          </Nav>
        </Container>
      </Navbar>
 )
}


