import { Router } from "express";
import multer from "multer";

import { login, register, update_profile_picture, updateUserProfile, getUserAndProfile,getMyNetwork, getMySentConnectionRequests, getMyReceivedConnectionRequests, updateProfileData, getAllUserProfile, downloadProfile, sendConnectionRequest, getMyConnectionRequests, whatAreMyConnection, acceptConnectionRequest, getUserProfileAndUserBasedOnUsername} from "../controllers/user.controller.js";


const router = Router();

const storage = multer.diskStorage({
    
    destination: (req, file, cb) => {
    cb(null, "uploads/"); 
    },
    filename: (req, file, cb) =>{
        cb(null, file.originalname)
    }

    
});

const upload = multer({storage : storage});

router.route("/update_profile_picture")
    .post(upload.single("profile_picture"), update_profile_picture);

router.route("/register").post(register);

router.route("/login").post(login);

router.route("/user_update").post(updateUserProfile);

router.route("/get_user_and_profile").post(getUserAndProfile);

router.route("/update_profile_data").post(updateProfileData);

router.route("/user/get_all_users").get(getAllUserProfile);

router.route("/user/download_resume").get(downloadProfile);

router.post("/user/send_connection_request", sendConnectionRequest);

router.post("/user/connection_requests/received", getMyReceivedConnectionRequests);

router.post("/user/connection_requests/sent", getMySentConnectionRequests);

router.post("/user/connection_requests/network", getMyNetwork);

router.post("/user/user_connection_request", getMyConnectionRequests);

router.route("/user/user_connection_request").post(whatAreMyConnection);

router.post("/user/accept_connection_request", acceptConnectionRequest);

router.route("/user/get_profile_based_on_username").get(getUserProfileAndUserBasedOnUsername);



export default router;