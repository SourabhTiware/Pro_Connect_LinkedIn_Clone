import React, { useEffect, useId, useState } from "react";
import styles from "./index.module.css"
import UserLayout from "@/Layout/UserLayout";
import DashBoardLayout from "@/Layout/DashboardLayout";
import { useDispatch, useSelector } from "react-redux";
import { getAboutUser } from "@/config/redux/action/authAction";
import clientServer, { BASE_URL } from "@/config";
import { getAllPosts } from "@/config/redux/action/postAction";
import { useRouter } from "next/router";

export default function profilePage()
{


    const dispatch = useDispatch();

    const authState = useSelector((state) => state.auth);
    const postReducer = useSelector((state) => state.postReducer)
    const router = useRouter();

    const [userProfile, setUserProfile] = useState({})

    const [userPosts, setUserPosts] = useState([]);
    
    const[isModalOpen, setIsModalOpen] = useState(false);

    const [isModalOpen1, setIsModalOpen1] = useState(false);


          const [inputData, setInputData] = useState({ 
            title: "", 
            employee_type: "", 
            company_or_organization: "", 
            position: "", 
            startMonth: "", 
            startYear: "", 
            endMonth: "", 
            endYear: "", 
            location: "",
            location_type: "" 
          });

          const [inputEduData, setInputEduData] = useState({
            school: "", 
            degree: "", 
            fieldOfStudy: "", 
            startMonth: "", 
            startYear: "", 
            endMonth: "", 
            endYear: ""
          })

          const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
      ];

      const years = Array.from(new Array(60), (val, index) => new Date().getFullYear() - index);

      const employee_type = ["Full-time", "Part-time", "Self-employed", "Freelance", "Internship", "Trainee"]
      const location_type = ["On-site", "Hybrid", "Remote"]

    const handleWorkInputChange = (e) =>{
        const {name, value} = e.target;
        setInputData({...inputData, [name]: value})
    }
        const handleEduInputChange = (e) => {
      const { name, value } = e.target;
      setInputEduData({ ...inputEduData, [name]: value });
      };

    useEffect(() => {
    dispatch(getAboutUser()); 
    dispatch(getAllPosts());
}, []);

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
                  {/*  */}
                  <div className={styles.workHistory}>
                    <h4>Work History</h4>
                    <div className={styles.workHistoryContainer}>
                      {userProfile.pastWork.map((work, index) => (
                        <div key={index} className={styles.workHistoryCard}>
                                                  
                          <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
                                    <p>{work.title}</p>
                                    <p>{work.company_or_organization} - {work.employee_type}</p>
                                    <p>{work.startMonth} {work.startYear} {" "} - {work.endMonth ? `${work.endMonth} ${work.endYear}` : "Present"}</p>
                                    <p>{work.location} - {work.location_type}</p>
                          </div>
                          
                        </div>
                      ))}


                    </div>
                      <div>
                        <button className={styles.updateProfileBtn} onClick={() =>{
                        setIsModalOpen(true)
                      }} >Add Work</button>
                      </div>
                  </div>


                  {/* // Eduction History */}

            <div className={styles.workHistory}>
                  <h4>Education</h4>
                      <div className={styles.workHistoryContainer}>
                            { userProfile.education.map((edu, index) => (
                                <div key={index} className={styles.workHistoryCard}>
                                  <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
                                    <p><strong>School:</strong> {edu.school}</p>
                                    <p><strong>Degree:</strong> {edu.degree}</p>
                                    <p><strong>Field:</strong> {edu.fieldOfStudy}</p>
                                    <p>
                                      <strong>Duration:</strong> 
                                      {edu.startMonth} {edu.startYear} -{" "}
                                      {edu.endMonth ? `${edu.endMonth} ${edu.endYear}` : "Present"}
                                    </p>
                                  </div>
                                </div>
                              ))}
                        </div>

                        <div>
                              <button className={styles.updateProfileBtn} onClick={() =>{
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
              <div onClick={() =>{ setIsModalOpen(false); }} className={styles.commentsContainer}>

                <div onClick={(e) => { e.stopPropagation(); }} className={styles.allCommentsContainer}>

                                    <p style={{ fontSize: "0.8rem", opacity: 0.6 }}>* Indicates required</p>

                                      
                                      <label htmlFor="title">Title *</label>
                                      <input onChange={handleWorkInputChange} 
                                        id="title" name="title" className={styles.inputField} type="text" placeholder="Ex: Retail Sales Manager" required 
                                      />

                                     

                                      <label>Employee type *</label>
                                    <div className={styles.education_start} style={{ display: "flex", gap: "1rem" }}>
                                        <select name="employee_type" value={inputData.employee_type} onChange={handleWorkInputChange} required>
                                          <option value="">Please select</option>
                                          {employee_type.map((m) => (
                                            <option key={m} value={m}>{m}</option>
                                          ))}
                                        </select>
                                  </div>

                                  
                                      <label htmlFor="company_or_organization">Company or Organization *</label>
                                      <input onChange={handleWorkInputChange}
                                        id="company_or_organization"  name="company_or_organization" className={styles.inputField} type="text" placeholder="Ex: Pro_Connect" required
                                      />

                                     
                                       <input onChange={handleWorkInputChange} name="position" className={styles.inputField} type="text" placeholder="Enter Position" />

                                      
                                      <label>Start Date *</label>
                                      <div className={styles.education_start} style={{ display: "flex", gap: "1rem" }}>
                                        <select name="startMonth" value={inputData.startMonth} onChange={handleWorkInputChange} required>
                                          <option value="">Month</option>
                                          {months.map((m) => (
                                            <option key={m} value={m}>{m}</option>
                                          ))}
                                        </select>

                                        <select name="startYear" value={inputData.startYear} onChange={handleWorkInputChange} required>
                                          <option value="">Year</option>
                                          {years.map((y) => (
                                            <option key={y} value={y}>{y}</option>
                                          ))}
                                        </select>
                                      </div>

                                
                                      <label>End Date (or expected) *</label>
                                      <div className={styles.education_end} style={{ display: "flex", gap: "1rem" }}>
                                        <select name="endMonth" value={inputData.endMonth} onChange={handleWorkInputChange} required>
                                          <option value="">Month</option>
                                          {months.map((m) => (
                                            <option key={m} value={m}>{m}</option>
                                          ))}
                                        </select>

                                        <select name="endYear" value={inputData.endYear} onChange={handleWorkInputChange} required>
                                          <option value="">Year</option>
                                          {years.map((y) => (
                                            <option key={y} value={y}>{y}</option>
                                          ))}
                                        </select>
                                      </div>

                                      <label htmlFor="location">Location</label>
                                      <input onChange={handleWorkInputChange} 
                                        id="location" name="location" className={styles.inputField} type="text" placeholder="Ex: Delhi, India" required 
                                      />

                                      <label>Location type</label>
                                      <select name="location_type" value={inputData.location_type}  onChange={handleWorkInputChange}>
                                        <option value="">please select</option>
                                        {location_type.map((loc) => (
                                          <option key={loc} value={loc}>{loc}</option>
                                        ))}
                                        
                                      </select>
                                      
                                  
                                      <button className={styles.updateProfileBtn}
                                        disabled={ 
                                          !inputData.title ||
                                          !inputData.employee_type ||
                                          !inputData.company_or_organization ||
                                          !inputData.position ||
                                          !inputData.startMonth ||
                                          !inputData.startYear ||
                                          !inputData.endMonth ||
                                          !inputData.endYear ||
                                          !inputData.location ||
                                          !inputData.location_type
                                        }
                                        style={{
                                          opacity:
                                            !inputData.title ||
                                            !inputData.employee_type ||
                                            !inputData.company_or_organization ||
                                            !inputData.startMonth ||
                                            !inputData.startYear ||
                                            !inputData.endMonth ||
                                            !inputData.location ||
                                            !inputData.location_type
                                              ? 0.5
                                              : 1,
                                        }}
                                        onClick={() =>{
                                           setUserProfile({...userProfile, pastWork: [...userProfile.pastWork, inputData]})
                                            setInputData({   // reset inputData
                                                          title: "", 
                                                          employee_type: "", 
                                                          company_or_organization: "", 
                                                          position: "", 
                                                          startMonth: "", 
                                                          startYear: "", 
                                                          endMonth: "", 
                                                          endYear: "", 
                                                          location: "",
                                                          location_type: "" 
                                                        });
                                           setIsModalOpen(false)
                                          }}>
                                        Add Work
                                      </button>
                                    </div>
                                                
                                </div>
            }

                {/* next model */}
                        {
                        isModalOpen1 && (
                  <div onClick={() => setIsModalOpen1(false)} className={styles.commentsContainer} >
                    <div  onClick={(e) => e.stopPropagation()} className={styles.allCommentsContainer} >
                      <p style={{ fontSize: "0.8rem", opacity: 0.6 }}>* Indicates required</p>

                      {/* School */}
                      <label htmlFor="school">School *</label>
                      <input onChange={handleEduInputChange} 
                        id="school" name="school" className={styles.inputField} type="text" placeholder="Ex: Boston University" required 
                      />

                      {/* Degree */}
                      <label htmlFor="degree">Degree *</label>
                      <input onChange={handleEduInputChange}
                        id="degree" name="degree" className={styles.inputField} type="text" placeholder="Ex: Bachelor’s" required
                      />

                      {/* Field of Study */}
                      <label htmlFor="fieldOfStudy">Field of Study *</label>
                      <input onChange={handleEduInputChange}
                        id="fieldOfStudy"  name="fieldOfStudy" className={styles.inputField} type="text" placeholder="Ex: Business" required
                      />

                      {/* Start Date */}
                      <label>Start Date *</label>
                      <div className={styles.education_start} style={{ display: "flex", gap: "1rem" }}>
                        <select name="startMonth" value={inputEduData.startMonth} onChange={handleEduInputChange} required>
                          <option value="">Month</option>
                          {months.map((m) => (
                            <option key={m} value={m}>{m}</option>
                          ))}
                        </select>

                        <select name="startYear" value={inputEduData.startYear} onChange={handleEduInputChange} required>
                          <option value="">Year</option>
                          {years.map((y) => (
                            <option key={y} value={y}>{y}</option>
                          ))}
                        </select>
                      </div>

                      {/* End Date */}
                      <label>End Date (or expected) *</label>
                      <div className={styles.education_end} style={{ display: "flex", gap: "1rem" }}>
                        <select name="endMonth" value={inputEduData.endMonth} onChange={handleEduInputChange} required>
                          <option value="">Month</option>
                          {months.map((m) => (
                            <option key={m} value={m}>{m}</option>
                          ))}
                        </select>

                        <select name="endYear" value={inputEduData.endYear} onChange={handleEduInputChange} required>
                          <option value="">Year</option>
                          {years.map((y) => (
                            <option key={y} value={y}>{y}</option>
                          ))}
                        </select>
                      </div>

                      {/* Grade (Optional) */}
                      <label htmlFor="grade">Grade</label>
                      <input
                        onChange={handleEduInputChange}
                        id="grade"
                        name="grade"
                        className={styles.inputField}
                        type="text"
                        placeholder="Ex: A+"
                      />

                      {/* Add Education Button */}
                      <button
                        disabled={
                          !inputEduData.school ||
                          !inputEduData.degree ||
                          !inputEduData.fieldOfStudy ||
                          !inputEduData.startMonth ||
                          !inputEduData.startYear ||
                          !inputEduData.endMonth ||
                          !inputEduData.endYear
                        }
                        style={{
                          opacity:
                            !inputEduData.school ||
                            !inputEduData.degree ||
                            !inputEduData.fieldOfStudy ||
                            !inputEduData.startMonth ||
                            !inputEduData.startYear ||
                            !inputEduData.endMonth ||
                            !inputEduData.endYear
                              ? 0.5
                              : 1,
                        }}
                        onClick={() => {
                          setUserProfile({
                            ...userProfile,
                            education: [...userProfile.education, inputEduData],
                          });
                          setIsModalOpen1(false);
                        }}
                        className={styles.updateProfileBtn}
                      >
                        Add Education
                      </button>
                    </div>
                  </div>
                )}

        </DashBoardLayout>
       </UserLayout>
    )
}


