// import clientServer, { BASE_URL } from "@/config";
// import DashBoardLayout from "@/Layout/DashboardLayout";
// import UserLayout from "@/Layout/UserLayout";
// import React, { useEffect, useState } from "react";
// import styles from "./index.module.css";
// import { useRouter } from "next/router";
// import { useDispatch, useSelector } from "react-redux";
// import { getAllPosts } from "@/config/redux/action/postAction";
// import {getConnectionsRequest, getMyNetworkAction, sendConnectionRequest,} from "@/config/redux/action/authAction";

// export default function ViewProfilePage({ userProfile }) {
//   const router = useRouter();
//   const dispatch = useDispatch();
//   const postReducer = useSelector((state) => state.postReducer);
//   const authState = useSelector((state) => state.auth);

//   const [userPosts, setUserPosts] = useState([]);
//   const [connectionStatus, setConnectionStatus] = useState("connect"); // "connect" | "pending" | "connected"

//   // Fetch posts & connections
//   const getUserPost = async () => {
//     const token = localStorage.getItem("token");
//     await dispatch(getAllPosts());
//     if (token) {
//       await dispatch(getConnectionsRequest({ token }));
//       await dispatch(getMyNetworkAction({ token }));
//     }
//   };

//   useEffect(() => {
//     getUserPost();
//   }, []);

//   // Filter posts by username
//   useEffect(() => {
//     if (postReducer?.posts?.length && router.query?.username) {
//       const filtered = postReducer.posts.filter(
//         (post) => post.userId.username === router.query.username
//       );
//       setUserPosts(filtered);
//     } else {
//       setUserPosts([]);
//     }
//   }, [postReducer?.posts, router.query?.username]);

//   // Handle Connect button click
//   const handleConnect = async () => {
//     const token = localStorage.getItem("token");
//     if (!token) return;

//     try {
//       const result = await dispatch(
//         sendConnectionRequest({ token, connectionId: userProfile.userId._id })
//       ).unwrap();

//       // ✅ Always refetch after sending
//       await dispatch(getConnectionsRequest({ token }));
//       await dispatch(getMyNetworkAction({ token }));

//       if (result === "Request already sent") {
//         setConnectionStatus("pending");
//       } else {
//         setConnectionStatus("pending");
//       }
//     } catch (err) {
//       console.error("Error sending connection request:", err);
//     }
//   };
  
//   // Check connection status
//   useEffect(() => {


//   // Guard: wait until authState and userProfile are ready
//   if (!authState || !userProfile?.userId?._id) return;

//   // Look for a match in connections or network
//   const match =
//     authState.connections?.find(
//       (conn) => conn.otherUser?._id === userProfile.userId._id
//     ) ||
//     authState.network?.find(
//       (edge) => edge.otherUser?._id === userProfile.userId._id
//     );



//   if (match) {
//     setConnectionStatus(match.status);
//     // console.log("ConnectionStatus set to:", match.status);
//   } else {
//     setConnectionStatus("connect");
//     // console.log("ConnectionStatus set to: connect");
//   }
// }, [authState?.connections, authState?.network, userProfile]);
  

//   return (
//     <UserLayout>
//       <DashBoardLayout>
//         <div className={styles.container}>
//           <div className={styles.backDropContainer}>
//             <img className={styles.backDrop}  src={`${BASE_URL}/${userProfile.userId.profilePicture}`} alt="backdrop" />
//           </div>

//           <div className={styles.profileContainer_details}>

//             <div className={styles.profileContainer_flex}>

//               <div style={{ flex: "0.8" }}>

//                 <div style={{ display: "flex", width: "fit-content", alignItems: "center", gap: "1.2rem"}} >

//                   <h2>{userProfile?.userId?.name || "No Name"}</h2>
//                   <p style={{ color: "gray" }}>
//                     @{userProfile?.userId?.username || "username"}
//                   </p>
//                 </div>

//                 <div style={{ display: "flex", alignItems: "center", gap: "1.2rem" }} >
//                   {connectionStatus === "connect" && (
//                     <button onClick={handleConnect} className={styles.connectBtn}> Connect </button>
//                   )}
//                   {connectionStatus === "pending" && (
//                     <button className={styles.connectedButton}>Pending</button>
//                   )}
//                   {connectionStatus === "connected" && (
//                     <button className={styles.connectedButton}>Connected</button>
//                   )}

//                   <div onClick={async () => {
//                       const response = await clientServer.get(
//                         `/user/download_resume?id=${userProfile.userId._id}`
//                       );
//                       window.open(
//                         `${BASE_URL}/${response.data.message}`,
//                         "_blank"
//                       );
//                     }}
//                     style={{ cursor: "pointer" }} >
//                     <svg style={{ width: "1.2em" }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6" >
//                       <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"  />
//                     </svg>
//                   </div>
//                 </div>

//                 <div>
//                   <p>{userProfile?.bio || "No bio available"}</p>
//                 </div>
//               </div>

//               <div style={{ flex: "0.2" }}>
//                 <h3>Recent Activity</h3>
//                 {userPosts.map((post) => (
//                   <div onClick={() =>{
//                    router.push(`/dashboard?postId=${post._id}`);
//                   }} style={{cursor:"pointer", padding:"0.5rem", borderBottom: "1px solid silver ", cursor: "pointer"}} key={post._id} className={styles.postCard}>
//                     <div className={styles.card}>
//                       <div  className={styles.card_profileContainer}>
//                       {post.media !== "" ? <img src={`${BASE_URL}/${post.media}`} alt="" /> : ""} 
//                       </div>
//                     </div>
//                     {/* <p>{post.body}</p> */}
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>

//           <div className={styles.workHistory}>
//             <h4>Work History</h4>
//              <div className={styles.workHistoryContainer}>
//                       {userProfile.pastWork?.map((work, index) => (
//                         <div key={index} className={styles.workHistoryCard}>                         
//                           <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
//                                 <p>{work.title}</p>
//                                 <p>{work.company_or_organization} - {work.employee_type}</p>
//                                 <p>{work.startMonth} {work.startYear} {" "} - {work.endMonth ? `${work.endMonth} ${work.endYear}` : "Present"}</p>
//                                 <p>{work.location} - {work.location_type}</p>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//           </div>

//           <div className={styles.workHistory}>
//             <h4>Edudcation</h4>
//             <div className={styles.workHistoryContainer}>
//               {userProfile.education?.map((edu, index) => ( 
//                 <div key={index} className={styles.workHistoryCard}>
//                    <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
//                     <p><strong>School:</strong> {edu.school}</p>
//                     <p><strong>Degree:</strong> {edu.degree}</p>
//                     <p><strong>Field:</strong> {edu.fieldOfStudy}</p>
//                       <p>
//                           <strong>Duration:</strong> 
//                             {edu.startMonth} {edu.startYear} -{" "}
//                             {edu.endMonth ? `${edu.endMonth} ${edu.endYear}` : "Present"}
//                       </p>
//                    </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </DashBoardLayout>
//     </UserLayout>
//   );
// }

// // Server side fetch
// export async function getServerSideProps(context) {
//   const request = await clientServer.get("/user/get_profile_based_on_username", {
//     params: { username: context.query.username },
//   });

//   const userProfile = request.data.profiles.find(
//   p => p.userId.username === context.query.username
// ) || { pastWork: [], education: [] };


//   // return { props: { userProfile: request.data.profile } };
//    return { props: { userProfile } };
// }


import clientServer, { BASE_URL } from "@/config";
import DashBoardLayout from "@/Layout/DashboardLayout";
import UserLayout from "@/Layout/UserLayout";
import React, { useEffect, useState } from "react";
import styles from "./index.module.css";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { getAllPosts } from "@/config/redux/action/postAction";
import { getConnectionsRequest, getMyNetworkAction, sendConnectionRequest } from "@/config/redux/action/authAction";

export default function ViewProfilePage({ userProfile }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const postReducer = useSelector((state) => state.postReducer);
  const authState = useSelector((state) => state.auth);

  const [userProfileState, setUserProfileState] = useState(userProfile);
  const [userPosts, setUserPosts] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState("connect"); // "connect" | "pending" | "connected"

  // Sync server-side props to client-side state
  useEffect(() => {
    setUserProfileState(userProfile);
  }, [userProfile]);

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
        sendConnectionRequest({ token, connectionId: userProfileState.userId._id })
      ).unwrap();

      await dispatch(getConnectionsRequest({ token }));
      await dispatch(getMyNetworkAction({ token }));

      setConnectionStatus("pending");
    } catch (err) {
      console.error("Error sending connection request:", err);
    }
  };

  // Check connection status
  useEffect(() => {
    if (!authState || !userProfileState?.userId?._id) return;

    const match =
      authState.connections?.find(
        (conn) => conn.otherUser?._id === userProfileState.userId._id
      ) ||
      authState.network?.find(
        (edge) => edge.otherUser?._id === userProfileState.userId._id
      );

    if (match) setConnectionStatus(match.status);
    else setConnectionStatus("connect");
  }, [authState?.connections, authState?.network, userProfileState]);

  return (
    <UserLayout>
      <DashBoardLayout>
        <div className={styles.container}>
          {/* Profile Banner */}
          <div className={styles.backDropContainer}>
            {/* <img
              className={styles.backDrop}
              src={`${BASE_URL}/${userProfileState.userId.profilePicture}`}
              alt="backdrop"
            /> */}
            <img
                className={styles.backDrop}
                src={`${BASE_URL}/${userProfileState?.userId?.profilePicture || "default.jpg"}`}
                alt="backdrop"
              />
          </div>

          <div className={styles.profileContainer_details}>
            <div className={styles.profileContainer_flex}>
              {/* User Info */}
              <div style={{ flex: "0.8" }}>
                <div
                  style={{
                    display: "flex",
                    width: "fit-content",
                    alignItems: "center",
                    gap: "1.2rem",
                  }}
                >
                  <h2>{userProfileState?.userId?.name || "No Name"}</h2>
                  <p style={{ color: "gray" }}>
                    @{userProfileState?.userId?.username || "username"}
                  </p>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "1.2rem" }}>
                  {connectionStatus === "connect" && (
                    <button onClick={handleConnect} className={styles.connectBtn}>
                      Connect
                    </button>
                  )}
                  {connectionStatus === "pending" && (
                    <button className={styles.connectedButton}>Pending</button>
                  )}
                  {connectionStatus === "connected" && (
                    <button className={styles.connectedButton}>Connected</button>
                  )}

                  {/* Download Resume */}
                  <div
                    onClick={async () => {
                      const response = await clientServer.get(
                        `/user/download_resume?id=${userProfileState.userId._id}`
                      );
                      window.open(`${BASE_URL}/${response.data.message}`, "_blank");
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    <svg
                      style={{ width: "1.2em" }}
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
                      />
                    </svg>
                  </div>
                </div>

                <div>
                  <p>{userProfileState?.bio || "No bio available"}</p>
                </div>
              </div>

              {/* Recent Activity */}
              <div style={{ flex: "0.2" }}>
                <h3>Recent Activity</h3>
                {userPosts.map((post) => (
                  <div
                    onClick={() => router.push(`/dashboard?postId=${post._id}`)}
                    style={{
                      cursor: "pointer",
                      padding: "0.5rem",
                      borderBottom: "1px solid silver",
                    }}
                    key={post._id}
                    className={styles.postCard}
                  >
                    <div className={styles.card}>
                      <div className={styles.card_profileContainer}>
                        {post.media && <img src={`${BASE_URL}/${post.media}`} alt="" />}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Work History */}
          <div className={styles.workHistory}>
            <h4>Work History</h4>
            <div className={styles.workHistoryContainer}>
              {userProfileState?.pastWork?.length > 0 ? (
                userProfileState.pastWork.map((work, idx) => (
                  <div key={idx} className={styles.workHistoryCard}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
                      <p>{work.title}</p>
                      <p>
                        {work.company_or_organization} - {work.employee_type}
                      </p>
                      <p>
                        {work.startMonth} {work.startYear} -{" "}
                        {work.endMonth ? `${work.endMonth} ${work.endYear}` : "Present"}
                      </p>
                      <p>
                        {work.location} - {work.location_type}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p>No Work History</p>
              )}
            </div>
          </div>

          {/* Education */}
          <div className={styles.workHistory}>
            <h4>Education</h4>
            <div className={styles.workHistoryContainer}>
              {userProfileState?.education?.length > 0 ? (
                userProfileState.education.map((edu, idx) => (
                  <div key={idx} className={styles.workHistoryCard}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
                      <p>
                        <strong>School:</strong> {edu.school}
                      </p>
                      <p>
                        <strong>Degree:</strong> {edu.degree}
                      </p>
                      <p>
                        <strong>Field:</strong> {edu.fieldOfStudy}
                      </p>
                      <p>
                        <strong>Duration:</strong>{" "}
                        {edu.startMonth} {edu.startYear} -{" "}
                        {edu.endMonth ? `${edu.endMonth} ${edu.endYear}` : "Present"}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p>No Education History</p>
              )}
            </div>
          </div>
        </div>
      </DashBoardLayout>
    </UserLayout>
  );
}

export async function getServerSideProps(context) {
  try {
    const request = await clientServer.get("/user/get_profile_based_on_username", {
      params: { username: context.query.username },
    });

    const userProfile = request.data.profile
      ? request.data.profile
      : {
          userId: {
            name: "",
            username: "",
            profilePicture: "default.jpg",
            _id: "",
          },
          bio: "",
          currentPost: "",
          pastWork: [],
          education: [],
        };

    return { props: { userProfile } };
  } catch (error) {
    console.error("Error fetching profile:", error.message);

    return {
      props: {
        userProfile: {
          userId: {
            name: "",
            username: "",
            profilePicture: "default.jpg",
            _id: "",
          },
          bio: "",
          currentPost: "",
          pastWork: [],
          education: [],
        },
      },
    };
  }
}


