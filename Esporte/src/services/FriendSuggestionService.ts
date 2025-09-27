import axios from "axios";
import {api} from "@/src/services/Api";


const API_URL = "/friend-suggestions";


export const getFriendSuggestions = async () => {
  console.log(`Buscando em: ${api.defaults.baseURL}${API_URL}`); // Log para depuração

  const response = await api.get(API_URL);
  console.log(response.data);
  return response.data;
};