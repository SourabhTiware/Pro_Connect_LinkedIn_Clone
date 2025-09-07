import React, { useEffect } from "react";
import UserLayout from "@/Layout/UserLayout";
import DashBoardLayout from "@/Layout/DashboardLayout";
import { useDispatch, useSelector } from "react-redux";
import { getReceivedRequests, AcceptConnection, getMyNetworkAction  } from "@/config/redux/action/authAction";
import styles from "./index.module.css";
import { BASE_URL } from "@/config";
import { useRouter } from "next/router";

export default function MyConnectionsPage() {
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);
  const router = useRouter();

  // Fetch received requests
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      dispatch(getReceivedRequests({ token }))
        .unwrap()
        .then(res => console.log("Received requests fetched:", res))
        .catch(err => console.error(err));


        dispatch(getMyNetworkAction({ token }))
      .unwrap()
      .then(res => console.log("Network fetched:", res))
      .catch(err => console.error(err));
    }
  }, [dispatch]);

  return (
    <UserLayout>
      <DashBoardLayout>
        <div style={{ display: "flex", flexDirection: "column", gap: "1.7rem" }}>
          <h4>Connection Requests</h4>

          {Array.isArray(authState.received) && authState.received.length > 0 ? (
            authState.received.map((req) => (
              <div onClick={() =>{
                router.push(`/view_profile/${req?.userId?.username}`)
              }} key={req._id} className={styles.userCard}>
                <div style={{ display: "flex", alignItems: "center", gap: "1.2rem", justifyContent: "space-between" }}>
                  <div className={styles.profilePicture}>
                    <img src={`${BASE_URL}/${req.userId?.profilePicture || "default.jpg"}`} alt={req.userId?.name || "User"} />
                  </div>
                  <div className={styles.userInfo}>
                    <h3>{req.userId?.name || "Unknown User"}</h3>
                    <p>{req.userId?.username || "N/A"}</p>
                  </div>
                 <button
                  className={styles.connectedButton}
                  onClick={async (e) => {
                    e.stopPropagation();
                    const token = localStorage.getItem("token");
                    try {
                      await dispatch(
                        AcceptConnection({
                          connectionId: req._id,
                          token,
                          action: "accept",
                        })
                      ).unwrap();

                        // ✅ Refetch both received requests and network after accepting
                        dispatch(getReceivedRequests({ token }));
                        dispatch(getMyNetworkAction({ token }));
                      } catch (err) {
                        console.error("Error accepting connection:", err);
                      }
                    }}
                  >
                    Accept
                  </button>
                </div>
              </div>
             ))
            ) : (
            <p style={{ textAlign: "center", paddingTop: "2rem" }}>
              <b>No connection requests pending.</b>
            </p>
          )}



          <h4>My Network</h4>
                    {Array.isArray(authState.network) && authState.network.length > 0 ? 
                    (
                          authState.network.map((edge) => (
                              <div key={edge._id} className={styles.userCard}>
                              <div style={{ display: "flex", alignItems: "center", gap: "1.2rem" }}>
                                  <div className={styles.profilePicture}>
                                  <img
                                      src={`${BASE_URL}/${edge.otherUser?.profilePicture || "default.jpg"}`}
                                      alt={edge.otherUser?.name || "User"}
                                  />
                                  </div>
                                  <div className={styles.userInfo}>
                                  <h3>{edge.otherUser?.name || "Unknown User"}</h3>
                                  <p>{edge.otherUser?.username || "N/A"}</p>
                                  </div>
                              </div>
                              </div>
                          ))
                          ) : (
                          <p>No connections yet.</p>
                        )
                      }
        </div>
      </DashBoardLayout>
    </UserLayout>
  );
}
