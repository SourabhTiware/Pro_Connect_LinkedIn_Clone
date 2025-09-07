import { createSlice } from "@reduxjs/toolkit";
import { getAboutUser, getAllUsers, loginUser, registerUser, getReceivedRequests, getMyNetworkAction, AcceptConnection} from "../../action/authAction";

const initialState = {
  user: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  loggedIn: false,
  message: "",
  isTokenThere: false,
  profileFetched: false,
  received: [], 
  network: [],  
  all_users: [],
  all_profiles_fetched: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    reset: () => initialState,
    handleLoginUser: (state) => {
      state.message = "hello";
    },
    emptyMessage: (state) => {
      state.message = "";
    },
    setTokenIsThere: (state) => {
      state.isTokenThere = true;
    },
    setTokenIsNotThere: (state) => {
      state.isTokenThere = false;
    },
  },

  extraReducers: (builder) => {
    builder
  
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.message = "Login user";
      })
      .addCase(loginUser.fulfilled, (state) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.loggedIn = true;
        state.message = "Login is successful";
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.message = "Registering You...";
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.message = "Registration is successfully, Please login";
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload?.message || "Registration failed";
      })

     
      .addCase(getAboutUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.profileFetched = true;
        state.user = action.payload.profile;
      })

      
      .addCase(getAllUsers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.all_profiles_fetched = true;
        state.all_users = action.payload.profiles;
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload?.message || "Failed to fetch users";
        state.all_profiles_fetched = true;
      })
      
      .addCase(getReceivedRequests.fulfilled, (state, action) => {
        state.received = action.payload.received || [];
      })

      .addCase(getReceivedRequests.rejected, (state, action) => {
        state.message = action.payload?.message || "Failed to fetch received requests";
      })
      
      .addCase(getMyNetworkAction.fulfilled, (state, action) => {
        state.network = action.payload.network || [];
      })

      .addCase(getMyNetworkAction.rejected, (state, action) => {
        state.message = action.payload;
      })
      
      .addCase(AcceptConnection.fulfilled, (state, action) => {
        state.received = state.received.filter(r => r._id !== action.payload.connectionId);
      })

      .addCase(AcceptConnection.rejected, (state, action) => {
        state.message = action.payload?.message || "Failed to accept connection";
      });
  },
});

export const { reset, emptyMessage, setTokenIsThere, setTokenIsNotThere } = authSlice.actions;

export default authSlice.reducer;





// // It means Action/authAction/index.js file authenticate the request and based on the repose Reducer/authReducer/index.js update the state means UI.
// // if log in is true update the UI like user is login 
// // if failed the show the failded sms and pending state showes..

// // i'm right??

// // ChatGPT said:

// // 💯 Exactly — you got it right! 🎉

// // Let me rephrase in your words to lock it in:

// // Action/authAction/index.js → makes the authentication request (login/register) to the backend.

// // If success → gets token + user info

// // If fail → returns error

// // While waiting → stays in pending state

// // Reducer/authReducer/index.js → listens to that action’s result and updates Redux state accordingly:

// // pending → show loading spinner or "Logging in..."

// // fulfilled → update state → mark user as logged in → UI shows dashboard/profile

// // rejected → update state with error message → UI shows "Login failed"

// // So yes:
// // 👉 Action = “talk to backend”
// // 👉 Reducer = “update the store (which updates the UI)”

// // ⚡In short:
// // If login success → UI updates as logged in.
// // If login fail → UI shows error.
// // If login is pending → UI shows loader.