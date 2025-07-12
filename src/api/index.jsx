import axios from "axios";
const API_URL = "http://localhost:6059";

export const getAllPosts = async () => {
  try {
    const response = await axios.get(`${API_URL}/post/all`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.log("Posts can not found", error);
    throw error;
  }
}

export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/user/register`, userData, {
      withCredentials: true,

    });
    return response.data;

  }
  catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
}

export const loginUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/user/login`, userData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error logging in user:", error);
    throw error;
  }
}


export const addPost = async (formData) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(`${API_URL}/post/add`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error adding post:", error);
    throw error;
  }
};


export const myProfile = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_URL}/user/my-profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
}

export const getMyPosts = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_URL}/post/my-posts`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching my posts:", error);
    throw error;
  }
}

export const editPost = async (postData) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.put(`${API_URL}/post/edit`, postData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error updating post:", error);
    throw error;
  }
};


export const searchPostsByTitle = async (title) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_URL}/post/search`, {
      params: { title },
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error searching posts:", error);
    throw error;
  }
};

export const searchPostById=async (id) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_URL}/post/search/post/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching post by ID:", error);
    throw error;
  }
}
