import axios from "axios";

const API_URL = "http://192.168.100.10:8080/api/v1/friend-suggestions";

export const getFriendSuggestions = async (userId: number) => {
  const response = await axios.get(`${API_URL}/${userId}`);
  return response.data;
};