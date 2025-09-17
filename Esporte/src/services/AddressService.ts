import axios from "axios";
import { UUID } from 'expo-modules-core/build/uuid/uuid.types.d';
import { Address } from "@/interfaces/Andress";
const API_URL = "http://192.168.0.105:8081/api/v1/users/address";

class AddressService {
  async getAddresses(token: string | null = null) {
    if(!token) {
        throw new Error("Token is required to fetch addresses");
    }
    try {
      const response = await axios.get(`${API_URL}/testeid`, 
        { headers: { 'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }});
      console.log(response.data);
    return response.data;} catch (error) {
      console.error("Error fetching addresses:", error);
      throw error;
    }
  }

  async saveAddress(address: Address) {
    if(address.id == null){
        const response = await axios.post(`${API_URL}/testeid`, address, { headers: { 'Content-Type': 'application/json' } });
        return response.data;
    } else {
        const response = await axios.put(`${API_URL}/testeid`, address, { headers: { 'Content-Type': 'application/json' } });
        return response.data;
    }
  }
  async setDefaultAddress(id: UUID) {
    let responseData:Address[];
    console.log("Setting default address in service:", id);
    const response = await axios.patch(`${API_URL}/set_default/${id}/testeid`)
    responseData = response.data;
    console.log('DATA:'+responseData);
    return responseData;
  }

  async deleteAddress(id: UUID) {
    const response = await axios.delete(`${API_URL}/${id}/testeid`);
    return response.data;
  }
}

export default new AddressService();
