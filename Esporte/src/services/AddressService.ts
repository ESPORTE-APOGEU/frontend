import axios from "axios";
import { UUID } from 'expo-modules-core/build/uuid/uuid.types.d';
import { Address } from "@/interfaces/Andress";
const { EXPO_PUBLIC_BACKEND_URL } = process.env;
if (!EXPO_PUBLIC_BACKEND_URL) throw new Error("EXPO_PUBLIC_BACKEND_URL env var ausente");
const API_URL = `${EXPO_PUBLIC_BACKEND_URL}/api/v1/users/address`;

class AddressService {
  async getAddresses(token: string | null = null) {
    if(!token) {
        throw new Error("Token is required to fetch addresses");
    }
    try {
      const response = await axios.get(`${API_URL}`, 
        { headers: { 'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }});
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching addresses:", error);
      throw error;
    }
  }

  async saveAddress(token: string | null, address: Address) {
    if(!token) {
        throw new Error("Token is required to fetch addresses");
    }
    if(address.id == null){
        const response = await axios.post(`${API_URL}`, address, 
          { headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` } });
        return response.data;
    } else {
        const response = await axios.put(`${API_URL}`, address, 
          { headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` } });
        return response.data;
    }
  }
  async setDefaultAddress(token: string | null, id: UUID) {
    if(!token) {
        throw new Error("Token is required to set default address");
    }
    const response = await axios.patch(`${API_URL}/set_default/${id}`, {}, {
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
    });
    return response.data;
  }

  async deleteAddress(token: string | null, id: UUID) {
    if(!token) {
        throw new Error("Token is required to delete address");
    }
    if(!id) {
        throw new Error("ID is required to delete address");
    }
    const response = await axios.delete(`${API_URL}/${id}`, {
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
    });
    return response.data;
  }
}

export default new AddressService();
