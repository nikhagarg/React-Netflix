import React, { useEffect, useState } from 'react';
import "./Nav.css";

// Netflix logo and User Profile Avatar
// we want the nav to be fixed on top and bg color to be transparent. 
// once we start scrolling, bg should be black.
// for that need to add a SCROLLBAR LISTENER. Add it to window. 

function Nav() {
    const [show, setShow] = useState(false);

    useEffect(()  => {
        window.addEventListener("scroll", () => {
            if(window.scrollY > 100) {
                setShow(true);
            } else {
                setShow(false);
            }
        });
        return () => {
            //  remove the listener before userEffect is fired again.
            //  to avoid multiple listeners at a time
            window.removeEventListener("scroll");
        };
    },[]);

    return (
        <div className={`nav ${show && 'nav_with_bg'}`}>
            {/* LOGO */}
            <img
                className="nav_logo"
                src="https://download.logo.wine/logo/Netflix/Netflix-Logo.wine.png"
                alt="Netflix Logo"
                onClick= {() => window.location.reload()}
            />
            {/* AVATAR */}
            <img
                className="nav_avatar"
                src="https://mir-s3-cdn-cf.behance.net/project_modules/disp/366be133850498.56ba69ac36858.png"
                alt="User"
            />
        </div>
    )
}

export default Nav;
