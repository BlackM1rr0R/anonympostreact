import axios from "axios";
const API_URL = "http://localhost:6060";

export const getAllPosts = async (page = 0, size = 5) => {
  try {
    const response = await axios.get(`${API_URL}/post/all?page=${page}&size=${size}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.log("Posts can not found", error);
    throw error;
  }
};


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
        'Cache-Control': 'no-cache',
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

export const searchPostById = async (id) => {
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


export const allComment = async (postId) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_URL}/comment/post/${postId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    });
    console.log("Comments fetched:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching comments:", error);
    throw error;
  }
}

export const addCommentToPost = async (postId, commentText) => {
  const token = localStorage.getItem("token");
  const response = await axios.post(`${API_URL}/comment/add`, {
    comment: commentText,
    post: { id: postId }
  }, {
    headers: { Authorization: `Bearer ${token}` },
    withCredentials: true,
  });
  return response.data;
};


export const toggleLike = async (postId) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.post(
      `${API_URL}/like/toggle`,
      { post: { id: postId } },  // burada obje oluştur
      {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error toggling like:", error);
    throw error;
  }
};



export const getAllLikes = async (postId) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.get(`${API_URL}/like/post/${postId}`, {
      headers: { Authorization: `Bearer ${token}` },
      withCredentials: true,
    });
    return response.data; // like sayısını döner
  } catch (error) {
    console.error("Error fetching likes:", error);
    throw error;
  }
}

export const deleteAllPosts = async () => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.delete(`${API_URL}/post/delete/all`, {
      headers: { Authorization: `Bearer ${token}` },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting post:", error);
    throw error;
  }
}

export const getLikeCount = async (postId) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.get(`${API_URL}/like/post/${postId}/count`, {
      headers: { Authorization: `Bearer ${token}` },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching likes:", error);
    throw error;
  }
}

export const addDailyQuestion=async (questionData) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.post(`${API_URL}/daily/addDailyQuestion`, questionData, {
      headers: { Authorization: `Bearer ${token}` },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error adding daily question:", error);
    throw error;
  }
}

export const getDailyQuestion = async () => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.get(`${API_URL}/daily/question`, {
      headers: { Authorization: `Bearer ${token}` },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching daily question:", error);
    throw error;
  }
}

export const addAnswerToDailyQuestion = async (answerData) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.post(`${API_URL}/answer/add`, answerData, {
      headers: { Authorization: `Bearer ${token}` },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error adding answer to daily question:", error);
    throw error;
  }
}

export const getAllAnswers = async () => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.get(`${API_URL}/answer/allAnswer`, {
      headers: { Authorization: `Bearer ${token}` },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching all answers:", error);
    throw error;
  }
}

export const getDailyQuestionById = async (id) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.get(`${API_URL}/daily/question/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching daily question by id:", error);
    throw error;
  }
}
export const adminGetAllUsers = async () => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.get(`${API_URL}/admin/allUsers`, {
      headers: { Authorization: `Bearer ${token}` },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching daily question by id:", error);
    throw error;
  }
}

export const adminEditProfile = async (userData) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.put(`${API_URL}/admin/edit-admin-profile`, userData, {
      headers: { Authorization: `Bearer ${token}` },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error editing profile:", error);
    throw error;
  }
}

export const adminDeleteUser = async (userId) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.delete(`${API_URL}/admin/users/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
}
export const adminGetAllPosts = async () => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.get(`${API_URL}/admin/all-post-for-admin`, {
      headers: { Authorization: `Bearer ${token}` },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching daily question by id:", error);
    throw error;
  }
}

export const adminDeletePost = async (postId) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.delete(`${API_URL}/admin/delete-post/${postId}`, {
      headers: { Authorization: `Bearer ${token}` },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting post:", error);
    throw error;
  }
}

export const adminEditPost = async (postId, updatedPost) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.put(`${API_URL}/admin/edit-post/${postId}`, updatedPost, {
      headers: { Authorization: `Bearer ${token}` },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error editing post:", error);
    throw error;
  }
};
export const adminAddNewUser = async (userData) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.post(`${API_URL}/admin/add-new-user`, userData, {
      headers: { Authorization: `Bearer ${token}` },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error adding new user:", error);
    throw error;
  }
}


export const userEditPassword = async (userData) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.put(`${API_URL}/user/edit-profile`, userData, {
      headers: { Authorization: `Bearer ${token}` },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error editing password:", error);
    throw error;
  }
}