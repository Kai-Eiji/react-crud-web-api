import axios from "axios";

export default axios.create({
  baseURL: "https://yu3p46x8q5.execute-api.us-east-2.amazonaws.com/production",
  headers: {
    "Content-type": "application/json",
  }
});