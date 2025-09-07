import axios from "axios";

// export const BASE_URL = "http://localhost:9090";
export const BASE_URL = "https://pro-connect-linkedin-clone.onrender.com:9090";

const clientServer = axios.create({
  baseURL: BASE_URL,
});

export default clientServer;


// production level la konta server asnar ahe he mahiti nstay aplyala. tya mule ha baseURL create krun apan code base mde use karayacha 
// jya veli url mde changes karayche astil tya veli fkt ithe change kel ki automatic sagali kde changed url use hoto. 