import { createAsyncThunk } from "@reduxjs/toolkit";
import clientServer from "@/config";


export const loginUser = createAsyncThunk("user/login", async(userAgent, thunkAPI) =>{

    try{
        const response = await clientServer.post("/login", {
            email: userAgent.email,
            password: userAgent.password
        });

       if(response.data.token){

            localStorage.setItem("token", response.data.token);
        } else{
            return thunkAPI.rejectWithValue({message: "token not provided"});
        }

        return thunkAPI.fulfillWithValue(response.data);

    } catch(error){
        return thunkAPI.rejectWithValue(error.response.data);
    }
})

export const registerUser = createAsyncThunk("user/register", async(user,thunkAPI) =>{
    
    try{

        const response = await clientServer.post("/register", {
            username: user.username,
            password: user.password,
            email: user.email,
            name: user.name
        })

         return thunkAPI.fulfillWithValue(response.data);

    } catch(err){
        return thunkAPI.rejectWithValue(err.response?.data);
    }
})

export const getAboutUser = createAsyncThunk("user/getAboutUser", async (_, thunkAPI) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      return thunkAPI.rejectWithValue({ message: "No token found in localStorage" });
    }

    const response = await clientServer.post(
      "/get_user_and_profile",
      {}, 
      {
        headers: {
          Authorization: `Bearer ${token}` 
        }
      }
    );

    return thunkAPI.fulfillWithValue(response.data);
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data || { message: "Error fetching profile" });
  }
});



export const getAllUsers = createAsyncThunk("user/getAllUsers", async(_, thunkAPI) =>{

  try{

    const response = await clientServer.get("/user/get_all_users");

    return thunkAPI.fulfillWithValue(response.data);

  } catch(err){
    return thunkAPI.rejectWithValue(err.response.data);
  }

})


export const getConnectionsRequest = createAsyncThunk("user/getConnectionRequests", async (user, thunkAPI) => {
  try {
    const response = await clientServer.post("/user/user_connection_request", {
      token: user.token  
    });

    return thunkAPI.fulfillWithValue(response.data);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});


export const getMyConnctionRequests = createAsyncThunk(
  "user/getMyConnctionRequest",
  async (user, thunkAPI) => {
    try {
      const response = await clientServer.post(
        "/user/user_connection_request",
        { token: user.token }
      );

    
      return thunkAPI.fulfillWithValue(response.data.connections);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);


export const AcceptConnection = createAsyncThunk(
  "user/AcceptConnection",
  async ({ connectionId, token, action }, thunkAPI) => {
    try {
      const response = await clientServer.post("/user/accept_connection_request", {
        connectionId,
        token,
        action,
      });
      return { connectionId, action, message: response.data.message };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || { message: "Server error" });
    }
  }
);

export const getReceivedRequests = createAsyncThunk(
  "user/getReceivedRequests",
  async ({ token }, thunkAPI) => {
    try {
      const response = await clientServer.post("/user/connection_requests/received", { token });
      return response.data; 
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || { message: "Server error" });
    }
  }
);



export const getSentRequests = createAsyncThunk(
  "user/getSentRequests",
  async ({ token }, thunkAPI) => {
    try {
      const res = await clientServer.post("/user/connection_requests/sent", { token });
      return thunkAPI.fulfillWithValue(res.data.sent);
    } catch (e) {
      return thunkAPI.rejectWithValue(e.response?.data?.message || e.message);
    }
  }
);


export const getMyNetworkAction = createAsyncThunk(
  "user/getMyNetwork",
  async ({ token }, thunkAPI) => {
    try {
      const response = await clientServer.post("/user/connection_requests/network", { token });
      return thunkAPI.fulfillWithValue(response.data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const sendConnectionRequest = createAsyncThunk(
  "user/sendConnectionRequest",
  async ({ token, connectionId }, thunkAPI) => {
    try {
      const response = await clientServer.post("/user/send_connection_request", { token, connectionId });
      thunkAPI.dispatch(getSentRequests({ token }));
      return thunkAPI.fulfillWithValue(response.data.message);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);




