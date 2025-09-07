import React, { useEffect, useId, useState } from "react";
import styles from "./index.module.css"
import UserLayout from "@/Layout/UserLayout";
import DashBoardLayout from "@/Layout/DashboardLayout";
import { useDispatch, useSelector } from "react-redux";
import { getAboutUser } from "@/config/redux/action/authAction";
import clientServer, { BASE_URL } from "@/config";
import { getAllPosts } from "@/config/redux/action/postAction";
import { useRouter } from "next/router";

export default function profilePage(){


    const dispatch = useDispatch();

    const authState = useSelector((state) => state.auth);
    const postReducer = useSelector((state) => state.postReducer)
    const router = useRouter();

    const [userProfile, setUserProfile] = useState({})

    const [userPosts, setUserPosts] = useState([]);
    
    const[isModalOpen, setIsModalOpen] = useState(false);

    const [isModalOpen1, setIsModalOpen1] = useState(false);


    const [inputData, setInputData] = useState({company: "", position: "", years: ""});

    const [inputEduData, setInputEduData] = useState({school: "", degree: "", fieldOfStudy: "", years: ""})

    const handleWorkInputChange = (e) =>{
        const {name, value} = e.target;
        setInputData({...inputData, [name]: value})
    }

    const handleEduInputChange = (e) =>{
        const {name, value} = e.target;
        setInputEduData({...inputEduData, [name]: value})
    }


    useEffect(() =>{
        dispatch(getAboutUser({token: localStorage.getItem("token")}))
        dispatch(getAllPosts())
    }, [])

    useEffect(() =>{
        if(authState.user != undefined){
            setUserProfile(authState.user)

            let post = postReducer.posts.filter((post) =>{
                return post.userId.username === authState.user?.userId?.username
            })
            setUserPosts(post);
        }
        
    },[authState.user, postReducer.posts])

    

    const updateProfilePicture = async(file) =>{
        const formData = new FormData();
        formData.append("profile_picture", file);
        formData.append("token",localStorage.getItem("token"));

        const response = await clientServer.post("/update_profile_picture", formData, {
            headers:{
                "Content-Type": "multipart/form-data",
            },
        });

        dispatch(getAboutUser({token: localStorage.getItem("token")}));
    }

    const updateProfileData = async () =>{

        const request = await clientServer.post("/user_update", {
            token: localStorage.getItem("token"),
            name: userProfile?.userId?.name,

        });

        console.log("update profile data request",request)

        const response = await clientServer.post("/update_profile_data", {
            token: localStorage.getItem("token"),
            name: userProfile.name,
            bio: userProfile.bio,
            currentPost: userProfile.currentPost,
            pastWork: userProfile.pastWork,
            education: userProfile.education
        });

        console.log("response update profile data",response);
        setUserProfile( prev => ( { ...prev, ...response.data.profile } ) );

        dispatch(getAboutUser({token: localStorage.getItem("token")}));
    }



    return(
       <UserLayout>
        <DashBoardLayout>
            { authState.user && userProfile.userId &&
            <div className={styles.container}>
          <div className={styles.backDropContainer}>
            
                <label  htmlFor="profilePictureUpload" className={styles.backDrop_overlay}>
                    <p>Edit</p>
                </label>

                <input onChange={(e) =>{
                    updateProfilePicture(e.target.files[0])
                }} hidden type="file" name="" id="profilePictureUpload" />

            <img src={`${BASE_URL}/${userProfile.userId.profilePicture}`} alt="backdrop" />
         
          </div>

          <div className={styles.profileContainer_details}>

            <div style={{ display: "flex", gap: "0.7rem" }}>

              <div style={{ flex: "0.8" }}>

                <div style={{ display: "flex", width: "fit-content", alignItems: "center",gap: "1.2rem",}} >

                  <input className={styles.nameEdit} type="text" name="" id="" value={userProfile.userId?.name || ""} onChange={(e) =>{
                    setUserProfile({...userProfile, userId: { ...userProfile?.userId, name: e.target.value}}) } }  />

                  <p style={{ color: "gray" }}> @{userProfile?.userId?.username || "username"} </p>
                </div>


                <div>
                    <textarea 

                        value={userProfile.bio} 
                        onChange={ (e) => { setUserProfile( {...userProfile,   bio: e.target.value} ) } }  
                        rows={Math.max(3, Math.ceil(userProfile.bio.length / 80))} style={{width: "100%" , padding: "0.5rem"}} 
                        placeholder="Write your bio">

                    </textarea>

                </div>
              </div>

              <div className={styles.profileContainer} style={{ flex: "0.2"}}>
                <h3>Recent Activity</h3>
                {userPosts.map((post) => (
                  <div onClick={() =>{
                   router.push(`/dashboard?postId=${post._id}`);
                  }} style={{cursor:"pointer", padding:"0.5rem", borderBottom: "1px solid silver "}} key={post._id} className={styles.postCard}>
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
                  <p style={{ fontWeight: "bold", display: "flex",  alignItems: "center", gap: "0.8rem",}} >
                    {work.company} - {work.position}
                 
                  </p>

                  <p> {work.years}</p>
                  
                </div>
              ))}

              <button className={styles.addWorkButton} onClick={() =>{
                setIsModalOpen(true)
              }} >Add Work</button>
            </div>
          </div>


          {/* // Eduction History */}

            <div className={styles.workHistory}>
            <h4>Education</h4>
            <div className={styles.workHistoryContainer}>
              {userProfile.education.map((edu, index) => (
                <div key={index} className={styles.workHistoryCard}>
                  
                  <div style={{display: "flex", alignItems:"center", gap: "2rem"}}>
                    <div >
                        <p>{edu.school}  </p> 
                    </div>

                    <div>
                        {edu.degree}
                    </div>
                   
                   <div > 
                        <p > {edu.fieldOfStudy}  </p>
                   </div>

                   <div>
                    {edu.years}
                   </div>
                  </div>
                  
                </div>
              ))}

              <button className={styles.addWorkButton} onClick={() =>{
                setIsModalOpen1(true)
              }} >Add Education</button>
            </div>
          </div>
{/* end of eduction */}
          {
            userProfile != authState.user &&
            <div onClick={() =>{
                updateProfileData();
            }} className={styles.updateProfileBtn}>
                Update Profile
            </div>
          }

        </div>
        }

        {
            isModalOpen && 

            <div onClick={() =>{
                setIsModalOpen(false);
            }} className={styles.commentsContainer}>

                <div onClick={(e) => {
                    e.stopPropagation();
                    }} className={styles.allCommentsContainer}>

                    <input onChange={handleWorkInputChange} name="company" className={styles.inputField} type="text" placeholder="Enter Company" />
                    <input onChange={handleWorkInputChange} name="position" className={styles.inputField} type="text" placeholder="Enter Position" />
                    <input onChange={handleWorkInputChange} name="years" className={styles.inputField} type="number" placeholder="Enter Years" />

                    <div onClick={() =>{
                        setUserProfile({...userProfile, pastWork: [...userProfile.pastWork, inputData]})
                        setIsModalOpen(false)
                    }} className={styles.updateProfileBtn}>Add Work</div>
                </div>
                
            </div>
        }

        {/* next model */}

                {
                    isModalOpen1 && 

                    <div onClick={() =>{
                        setIsModalOpen1(false);
                    }} className={styles.commentsContainer}>

                        <div onClick={(e) => {
                            e.stopPropagation();
                            }} className={styles.allCommentsContainer}>

                            <input onChange={handleEduInputChange} name="school" className={styles.inputField} type="text" placeholder="Enter school" />
                            <input onChange={handleEduInputChange} name="degree" className={styles.inputField} type="text" placeholder="Enter degree" />
                            <input onChange={handleEduInputChange} name="fieldOfStudy" className={styles.inputField} type="text" placeholder="Enter fieldOfStudy" />
                            <input onChange={handleEduInputChange} name="years" className={styles.inputField} type="text" placeholder="Enter Years" />

                            <div onClick={() =>{
                                setUserProfile({...userProfile, education: [...userProfile.education, inputEduData]})
                                setIsModalOpen1(false)
                            }} className={styles.updateProfileBtn}>Add education</div>
                        </div> 
            </div>
        }
        </DashBoardLayout>
       </UserLayout>
    )
}