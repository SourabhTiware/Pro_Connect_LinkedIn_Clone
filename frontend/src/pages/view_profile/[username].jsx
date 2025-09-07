import clientServer, { BASE_URL } from "@/config";
import DashBoardLayout from "@/Layout/DashboardLayout";
import UserLayout from "@/Layout/UserLayout";
import React, { useEffect, useState } from "react";
import styles from "./index.module.css";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { getAllPosts } from "@/config/redux/action/postAction";
import {getConnectionsRequest, getMyNetworkAction, sendConnectionRequest,} from "@/config/redux/action/authAction";

export default function ViewProfilePage({ userProfile }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const postReducer = useSelector((state) => state.postReducer);
  const authState = useSelector((state) => state.auth);

  const [userPosts, setUserPosts] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState("connect"); // "connect" | "pending" | "connected"


  // console.log("userProfile", userProfile);
  // Fetch posts & connections
  const getUserPost = async () => {
    const token = localStorage.getItem("token");
    await dispatch(getAllPosts());
    if (token) {
      await dispatch(getConnectionsRequest({ token }));
      await dispatch(getMyNetworkAction({ token }));
    }
  };

  useEffect(() => {
    getUserPost();
  }, []);

  // Filter posts by username
  useEffect(() => {
    if (postReducer?.posts?.length && router.query?.username) {
      const filtered = postReducer.posts.filter(
        (post) => post.userId.username === router.query.username
      );
      setUserPosts(filtered);
    } else {
      setUserPosts([]);
    }
  }, [postReducer?.posts, router.query?.username]);


  // Handle Connect button click
  const handleConnect = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const result = await dispatch(
        sendConnectionRequest({ token, connectionId: userProfile.userId._id })
      ).unwrap();

      // ✅ Always refetch after sending
      await dispatch(getConnectionsRequest({ token }));
      await dispatch(getMyNetworkAction({ token }));

      if (result === "Request already sent") {
        setConnectionStatus("pending");
      } else {
        setConnectionStatus("pending");
      }
    } catch (err) {
      console.error("Error sending connection request:", err);
    }
  };
  
  // Check connection status
useEffect(() => {


  // Guard: wait until authState and userProfile are ready
  if (!authState || !userProfile?.userId?._id) return;

  // Look for a match in connections or network
  const match =
    authState.connections?.find(
      (conn) => conn.otherUser?._id === userProfile.userId._id
    ) ||
    authState.network?.find(
      (edge) => edge.otherUser?._id === userProfile.userId._id
    );



  if (match) {
    setConnectionStatus(match.status);
    // console.log("ConnectionStatus set to:", match.status);
  } else {
    setConnectionStatus("connect");
    // console.log("ConnectionStatus set to: connect");
  }
}, [authState?.connections, authState?.network, userProfile]);
  

  return (
    <UserLayout>
      <DashBoardLayout>
        <div className={styles.container}>
          <div className={styles.backDropContainer}>
            <img
              className={styles.backDrop}
              src={`${BASE_URL}/${userProfile.userId.profilePicture}`}
              alt="backdrop"
            />
          </div>

          <div className={styles.profileContainer_details}>

            <div className={styles.profileContainer_flex}>

              <div style={{ flex: "0.8" }}>

                <div style={{ display: "flex", width: "fit-content", alignItems: "center", gap: "1.2rem"}} >

                  <h2>{userProfile?.userId?.name || "No Name"}</h2>
                  <p style={{ color: "gray" }}>
                    @{userProfile?.userId?.username || "username"}
                  </p>
                </div>

                <div
                  style={{ display: "flex", alignItems: "center", gap: "1.2rem" }}
                >
                  {connectionStatus === "connect" && (
                    <button onClick={handleConnect} className={styles.connectBtn}> Connect </button>
                  )}
                  {connectionStatus === "pending" && (
                    <button className={styles.connectedButton}>Pending</button>
                  )}
                  {connectionStatus === "connected" && (
                    <button className={styles.connectedButton}>Connected</button>
                  )}

                  <div
                    onClick={async () => {
                      const response = await clientServer.get(
                        `/user/download_resume?id=${userProfile.userId._id}`
                      );
                      window.open(
                        `${BASE_URL}/${response.data.message}`,
                        "_blank"
                      );
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    <svg style={{ width: "1.2em" }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6" >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"  />
                    </svg>
                  </div>
                </div>

                <div>
                  <p>{userProfile?.bio || "No bio available"}</p>
                </div>
              </div>

              <div style={{ flex: "0.2" }}>
                <h3>Recent Activity</h3>
                {userPosts.map((post) => (
                  <div onClick={() =>{
                   router.push(`/dashboard?postId=${post._id}`);
                  }} style={{cursor:"pointer", padding:"0.5rem", borderBottom: "1px solid silver ", cursor: "pointer"}} key={post._id} className={styles.postCard}>
                    <div className={styles.card}>
                      <div  className={styles.card_profileContainer}>
                      {post.media !== "" ? <img src={`${BASE_URL}/${post.media}`} alt="" /> : ""} 
                      </div>
                    </div>
                    {/* <p>{post.body}</p> */}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className={styles.workHistory}>
            <h4>Work History</h4>
            <div className={styles.workHistoryContainer}>
              {userProfile.pastWork.map((work, index) => (
                <div key={index} className={styles.workHistoryCard}>
                  <p style={{ fontWeight: "bold", display: "flex", alignItems: "center", gap: "0.8rem", }} >
                    {work.company} - {work.position} - {work.years}
                  </p>
                </div>
              ))}
            </div>
          </div>



          <div className={styles.workHistory}>
            <h4>Edudcation</h4>
            <div className={styles.workHistoryContainer}>
              {userProfile.education.map((edu, index) => ( 
                <div key={index} className={styles.workHistoryCard}>
                  <p style={{ fontWeight: "bold", display: "flex", alignItems: "center", gap: "0.8rem", }} >
                    {edu.school} - {edu.degree} - {edu.fieldOfStudy} - {edu.years}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </DashBoardLayout>
    </UserLayout>
  );
}

// Server side fetch
export async function getServerSideProps(context) {
  const request = await clientServer.get("/user/get_profile_based_on_username", {
    params: { username: context.query.username },
  });

  return { props: { userProfile: request.data.profile } };
}
