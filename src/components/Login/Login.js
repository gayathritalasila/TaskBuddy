import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Navigate } from "react-router-dom";
import { handleLogin } from "./login.actions";
import TaskIcon from "../../../icons/TaskIcon";
import GoogleIcon from "../../../icons/GoogleIcon";
import CirclesIcon from "../../../icons/CirclesIcon";
import "./login.css";

const styles = {
    taskIcon: {
        width: "32px",
        height: "32px",
        marginBottom: "20px",
    },
    googleIcon: {
        width: "20px",
        height: "20px",
        marginRight: "10px",
    },
    image: {
        maxWidth: "100%",
        height: "auto",
        objectFit: "contain",
        // position: "absolute",
    }
};

const Login = () => {
    const user = useSelector((state) => state.login?.user);
    const dispatch = useDispatch();

    if (user) {
        // Redirect to landing page if logged in
        return <Navigate to="/landingPage" />;
    }

    return (
        <div className="container">
            <div className="left-section">
                <div className="logo-container">
                <div className="logo-row">
        <TaskIcon style={styles.taskIcon} />
        <h1 className="logo-text">TaskBuddy</h1>
    </div>
                    <p className="tagline">
                        Streamline your workflow and track progress effortlessly with our all-in-one task management app.
                    </p>
                </div>
                <button className="google-button" onClick={() => handleLogin(dispatch)}>
                    <GoogleIcon style={styles.googleIcon} />
                    Continue with Google
                </button>
            </div>
            <div className="right-section">
                <CirclesIcon style={styles.image} />
            </div>
        </div>
    );
};

export default Login;