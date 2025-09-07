import React, { useState, useEffect } from "react";
import UserLayout from "@/Layout/UserLayout";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";

import styles from "./styles.module.css";
import { loginUser, registerUser } from "@/config/redux/action/authAction";
import { emptyMessage } from "@/config/redux/reducer/authReducer";

function LoginComponent() {
  const authState = useSelector((state) => state.auth);
  const router = useRouter();
  const dispatch = useDispatch();

  const [userLogingMethod, setUserLogingMethod] = useState(false);

  const [email, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");


  useEffect(() => {
    if (authState.loggedIn) {
      router.replace("/dashboard");
    }
  }, [authState.loggedIn, router]);

  const handleRegister = async () => {
    const resultAction = await dispatch(
      registerUser({ username, password, email, name })
    );

    if (registerUser.fulfilled.match(resultAction)) {
      setUserLogingMethod(true);   
      dispatch(emptyMessage());    
    }
  };

  const handleLogin = async () => {
    await dispatch(loginUser({ email, password }));
  };

  return (
    <UserLayout>
      <div className={styles.container}>
        <div className={styles.cardContainer}>
          <div className={styles.cardContainer_left}>
            <p className={styles.cardleft_heading}>
              {userLogingMethod ? "Sign In" : "Sign Up"}
            </p>
            <p style={{ color: authState.isError ? "red" : "green" }}>
              {authState.message}
            </p>

            <div className={styles.inputContainer}>
              {!userLogingMethod && (
                <div className={styles.inputRow}>
                  <input onChange={(e) => setUsername(e.target.value)} className={styles.inputField} type="text" placeholder="Username" />
                  <input onChange={(e) => setName(e.target.value)} className={styles.inputField} type="text" placeholder="Name" />
                </div>
              )}

              <input onChange={(e) => setEmailAddress(e.target.value)} className={styles.inputField} type="email"  placeholder="Email" />
              <input onChange={(e) => setPassword(e.target.value)} className={styles.inputField} type="password" placeholder="Password" />

              <button type="button" className={styles.buttonWithOutline} onClick={() => {
                    if (userLogingMethod) {
                      handleLogin();
                    } else {
                      handleRegister();
                    }
                  }}
                >
                  {userLogingMethod ? "Sign In" : "Sign Up"}
              </button>

            </div>
          </div>

          <div className={styles.cardContainer_right}>
            {userLogingMethod ? (
              <p>Don't Have An Account?</p>
            ) : (
              <p>Already have an account?</p>
            )}

            <div
              onClick={() => setUserLogingMethod(!userLogingMethod)}
              style={{ color: "black", textAlign: "center" }}
              className={styles.buttonWithOutline}
            >
              <p>{userLogingMethod ? "Sign Up" : "Sign In"}</p>
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
}

export default LoginComponent;

