import { getAboutUser, getAllUsers } from "@/config/redux/action/authAction";
import {createPost, deletePost, getAllComments, postComment } from "@/config/redux/action/postAction/index"
import { getAllPosts,incrementPostLike  } from "@/config/redux/action/postAction";
import DashBoardLayout from "@/Layout/DashboardLayout";
import UserLayout from "@/Layout/UserLayout";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from  "./index.module.css";
import { BASE_URL } from "@/config";
import { resetPostId } from "@/config/redux/reducer/postReducer";

export default function DashBoard() {
  const dispatch = useDispatch();

  const router = useRouter();
  const { postId } = router.query;
  const [highlightedPost, setHighlightedPost] = useState(null);


  const authState = useSelector((state) => state.auth);

  const postState = useSelector((state) => state.postReducer);


useEffect(() => {
  if (postId && postState.posts.length > 0) {
    const element = document.getElementById(`post-${postId}`);
    if (element) {
      
      element.scrollIntoView({ behavior: "smooth", block: "center" });

      setHighlightedPost(postId);

      setTimeout(() => setHighlightedPost(null), 1000);
    }
  }
}, [postId, postState.posts]);

// fetch posts + about user once on mount if token exists
      useEffect(() => {
        const token = localStorage.getItem("token");
          if (token) {
            dispatch(getAllPosts());
            dispatch(getAboutUser({ token }));
        }
      }, [dispatch]);

      useEffect(() => {
        if (!authState.all_profiles_fetched) {
          dispatch(getAllUsers());
        }
      }, [authState.all_profiles_fetched, dispatch]);

      useEffect(() => {
        if (!authState.all_profiles_fetched) {
          dispatch(getAllUsers());
        }
    }, [authState.all_profiles_fetched, dispatch]);   


    const [postContent, setPostContent] = useState("");
    const [fileContent, setFileContent] = useState();
    const [commentText, setCommentText] = useState("");

    const handleUpload = async () =>{

      await dispatch(createPost({file: fileContent, body: postContent}))
      setPostContent("");
      setFileContent(null);
      await dispatch(getAllPosts());
    }

      const visitProfile = (username) => {
  router.push(`/view_profile/${username}`);
};

    if(authState.user){
      
        return (
          <UserLayout>

            <DashBoardLayout>

              <div className={styles.scrollComponent}>

                <div className={styles.wrapper}>
                  
                  <div  className={styles.createPostContainer}>

                    <img onClick={() =>{
                      router.push("/profile")
                    }} className={styles.userProfile} src={`${BASE_URL}/${authState.user?.userId?.profilePicture || "default.jpg"}`} alt="Profile"  
                      />

                      <textarea onChange={(e) => setPostContent(e.target.value)} value={postContent} className={styles.textareaOfContent} name="" id=""></textarea>

                      <label htmlFor="fileUpload">

                        <div className={styles.Fab}>

                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                          </svg>

                        </div>

                      </label>

                      <input onChange={(e) => setFileContent(e.target.files[0])} type="file" id="fileUpload" hidden />
                      {
                        postContent.length > 0 && 
                        
                        <div onClick={handleUpload} className={styles.uploadButton}>
                          Post
                        </div>
                      }
                </div>

                  <div className={styles.postsContainer}>  

                      {
                        postState.posts.map((post) =>{
                          return (
                            <div id={`post-${post._id}`} key={post._id} className={`styles.singleCard ${highlightedPost === post._id ? styles.highlight : ""}`}>

                              <div className={styles.singleCard_profileContainer}>

                                    <div className={styles.singleCard_heading}>

                                      <div onClick={() => visitProfile(post.userId?.username)}  style={{cursor:"pointer"}} >
                                        <img className={styles.userProfile} src={`${BASE_URL}/${post.userId?.profilePicture || "default.jpg"}`} alt="" 
                                           
                                        />
                                      </div>

                                      <div  className={styles.singleCard_username}>
                                              <div>
                                                    <p onClick={() => visitProfile(post.userId?.username)} >{post.userId.name}</p>
                                                    <p onClick={() => visitProfile(post.userId?.username)} className={styles.singleCard_userId} >@{post.userId.username}</p>
                                              </div>

                                              <div>

                                                  {
                                                            post.userId?._id === authState.user?.userId?._id && 
                                                            <div onClick=
                                                            { async() =>{
                                                                await dispatch(deletePost({post_id: post._id}))
                                                                await dispatch(getAllPosts()) }
                                                            } style={{cursor:"pointer"}}>

                                                              <svg style={{height: "1.4em", color:"red"}} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                                  <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                                              </svg>

                                                            </div>
                                                  }

                                                </div>
                                      </div>

                                    </div>

                                <div>
                                      <p className={styles.post_body}>{post.body}</p>

                                      <div className={styles.singleCard_image}>

                                        {post.media !== "" ? <img src={`${BASE_URL}/${post.media}`} alt="" /> : ""} 

                                      </div>
                                  
                                  <div className={styles.optionContainer}>

                                    <div onClick={async () =>{
                                          await dispatch(incrementPostLike({post_id: post._id})) 
                                          dispatch(getAllPosts())
                                        }} className={styles.singleOption_optionContainer}>
                                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z" />
                                          </svg>
                                          <p>{post.likes}</p>

                                    </div>

                                    <div onClick={ async () =>{
                                          dispatch(getAllComments({post_id: post._id}))
                                        }} className={styles.singleOption_optionContainer}>
                                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 0 1 1.037-.443 48.282 48.282 0 0 0 5.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
                                          </svg>
                                          <p>{post.comments}</p>

                                    </div>

                                    <div onClick={() =>{
                                          const text = encodeURIComponent(post.body)
                                          const url = encodeURIComponent("apnacollege.in")

                                          const twitterUrl = `https://twitter.com/intent/tweet?text=${text}&=${url}`;
                                          window.open(twitterUrl,"_blank")
                                        }} className={styles.singleOption_optionContainer}>
                                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" />
                                          </svg>

                                    </div>

                                  </div>

                                </div>
                                
                              </div>

                            </div>
                          )
                        })
                      }
                  </div>

                </div>

              </div>

              {
                postState.postId !== "" &&

                <div onClick={() =>{
                  dispatch(resetPostId())}} className={styles.commentsContainer}>

                    <div onClick={(e) =>{e.stopPropagation()}} className={styles.allCommentsContainer}> 

                      {(!postState.comments || postState.comments.length === 0) && <h2>No Comments</h2>}

                      {
                        postState.comments.length !== 0 && 
                           <div>
                            {
                             postState.comments.map((postComment) => {
                                return (
                                  <div className={styles.singleComment} key={postComment._id}>
                                    <div className={styles.singleComment_profileContainer} > 
                                      <img  className={styles.userProfile} src={`${BASE_URL}/${postComment.userId?.profilePicture || "default.jpg"}`}  alt="" />
                                      <div>
                                        <p style={{fontWeight: "bold", fontSize: "1.2rem"}}>{postComment.userId?.name || "Unknown"}</p>
                                        <p>@{postComment.userId?.username || "unknown"}</p>
                                      </div>
                                    </div>
                                    <p className={styles.singleComment_body}> " {postComment.body} "</p>
                                  </div>
                                );
                              })
                            }

                           </div>
                      }

                      <div className={styles.postCommentContainer}>

                        <input type="text" value={commentText} onChange={(e) => setCommentText(e.target.value)} placeholder="comment" />

                        <div
                            onClick={async () => {
                              if (!commentText || commentText.trim() === "") return;

                                await dispatch(postComment({ post_id: postState.postId, commentBody: commentText }))
                                await dispatch(getAllComments({post_id: postState.postId}))
                                setCommentText("");
                            }}  className={styles.postCommentContainer_commentsBtn}
                          >
                            <p>comments</p>
                          </div>
                      </div>
                    </div>
                </div>
              }

            </DashBoardLayout>

          </UserLayout>
        );
    }
    else{

      return (
          <UserLayout>

            <DashBoardLayout>

              <h2>Loading</h2>

            </DashBoardLayout>

          </UserLayout>
        );
    }
}