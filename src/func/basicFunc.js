import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { BASE_URL } from "../constant/BaseConst";

export const formatDate = (isoString) => {
  const date = new Date(isoString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  const diffInWeeks = Math.floor(diffInDays / 7);
  const diffInYears = Math.floor(diffInDays / 365);

  if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  if (diffInHours < 24) return `${diffInHours}h ago`;
  if (diffInDays < 7) return `${diffInDays}d ago`;
  if (diffInWeeks < 52)
    return date.toLocaleDateString("en-US", { day: "2-digit", month: "short" });
  return `${diffInYears}y ago`;
};

export const fetchCurrentUserProfile = async () => {
  const token = await AsyncStorage.getItem("authToken");
  try {
    const response = await fetch(`${BASE_URL}/api/user/profile/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
    });
    const result = await response.json();
    // console.log(result);
    if (response.ok) {
      const userInfo = {
        name: `${result.first_name} ${result.last_name}`,
        username: result.username,
        email: result.email,
        image: result.image,
        cover_image: result.cover_image,
        phone_number: result.phone_number,
        third_party_authenticated_by: result.third_party_authenticated_by,
      };

      await AsyncStorage.setItem("userProfile", JSON.stringify(userInfo));
    }
  } catch (err) {
    console.log(err);
  }
};
