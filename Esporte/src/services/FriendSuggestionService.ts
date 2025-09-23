import axios from "axios";
import {api} from "@/src/services/Api";


const API_URL = "/friend-suggestions";


export const getFriendSuggestions = async () => {
  const response = await api.get(API_URL);
  return response.data;
};