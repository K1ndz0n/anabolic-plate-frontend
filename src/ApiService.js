export default class ApiService {
    static API_URL = "https://genuine-sparkle-production-0659.up.railway.app";

    static async getRecipeThumbnails(params) {
        const filteredParams = Object.fromEntries(
            Object.entries(params).filter(([_, value]) =>
            value !== null &&
            value !== undefined &&
            value !== ""
            )
        );

        const query = new URLSearchParams(filteredParams).toString();

        const response = await fetch(
            `${this.API_URL}/api/Recipes/thumbnails?${query}`
        );

        if (!response.ok) {
            throw new Error("Fetch failed");
        }

        return response.json();
    }

    static async getUserRecipeThumbnails(params, username) {
        const filteredParams = Object.fromEntries(
            Object.entries(params).filter(([_, value]) =>
            value !== null &&
            value !== undefined &&
            value !== ""
            )
        );

        const query = new URLSearchParams(filteredParams).toString();

        const response = await fetch(
            `${this.API_URL}/api/Users/${username}/thumbnails?${query}`
        );

        if (!response.ok) {
            throw new Error("Fetch failed");
        }

        return response.json();
    }

    static async getSavedRecipes(params, token) {
        const filteredParams = Object.fromEntries(
            Object.entries(params).filter(([_, value]) =>
            value !== null &&
            value !== undefined &&
            value !== ""
            )
        );

        const query = new URLSearchParams(filteredParams).toString();

        const response = await fetch(
            `${this.API_URL}/api/me/Liked?${query}`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }
        );

        if (!response.ok) {
            throw new Error("Fetch failed");
        }

        return response.json();
    }

    static async getFollowedRecipes(params, token) {
        const filteredParams = Object.fromEntries(
            Object.entries(params).filter(([_, value]) =>
            value !== null &&
            value !== undefined &&
            value !== ""
            )
        );
        
        const query = new URLSearchParams(filteredParams).toString();

        const response = await fetch(
            `${this.API_URL}/api/me/Followed?${query}`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }
        );

        if (!response.ok) {
            throw new Error("Fetch failed");
        }

        return response.json();
    }

    static async getRecipeDetails(id) {
        const response = await fetch(
            `${this.API_URL}/api/Recipes/${id}`
        );

        if (response.status === 404) {
            return null;
        }

        if (!response.ok) {
            throw new Error("Fetch failes");
        }

        return response.json();
    }

    static async getRecipeOpinions(recipeId, page, pageSize) {
        const response = await fetch(
            `${this.API_URL}/api/Opinions/get/${recipeId}?page=${page}&pageSize=${pageSize}`
        );

        if (!response.ok) {
            throw new Error("Fetch failes");
        }

        return response.json();
    }

    static async getRecipeOpinionsWhenLogged(recipeId, page, pageSize, token) {
        const response = await fetch(
            `${this.API_URL}/api/Opinions/get/${recipeId}/WhenLogged?page=${page}&pageSize=${pageSize}`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }
        );

        if (!response.ok) {
            throw new Error("Fetch failes");
        }

        return response.json();
    }

    static async addOpinion(recipeId, opinion, token) {
        const response = await fetch(
            `${this.API_URL}/api/Opinions/add/${recipeId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(opinion)
            }
        );

        let data;
        const contentType = response.headers.get("content-type");

        if (contentType && contentType.includes("application/json")) {
            data = await response.json();
        } else {
            data = await response.text();
        }

        if (!response.ok) {
            if (typeof data === "object" && data.error) {
                throw new Error(data.error);
            }
            
            if (typeof data === "string" && data.length > 0) {
                throw new Error(data);
            }

            throw new Error("Wystąpił nieoczekiwany błąd serwera.");
        }

        return data;
    }

    static async editOpinion(recipeId, opinion, token) {
        const response = await fetch(
            `${this.API_URL}/api/Opinions/edit/${recipeId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(opinion)
            }
        );

        let data;
        const contentType = response.headers.get("content-type");

        if (contentType && contentType.includes("application/json")) {
            data = await response.json();
        } else {
            data = await response.text();
        }

        if (!response.ok) {
            if (typeof data === "object" && data.error) {
                throw new Error(data.error);
            }
            
            if (typeof data === "string" && data.length > 0) {
                throw new Error(data);
            }

            throw new Error("Wystąpił nieoczekiwany błąd serwera.");
        }

        return data;
    }

    static async deleteOpinion(recipeId, token) {
        const response = await fetch(
            `${this.API_URL}/api/Opinions/delete/${recipeId}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }
        );

        let data;
        const contentType = response.headers.get("content-type");

        if (contentType && contentType.includes("application/json")) {
            data = await response.json();
        } else {
            data = await response.text();
        }

        if (!response.ok) {
            if (typeof data === "object" && data.error) {
                throw new Error(data.error);
            }
            
            if (typeof data === "string" && data.length > 0) {
                throw new Error(data);
            }

            throw new Error("Wystąpił nieoczekiwany błąd serwera.");
        }

        return data;
    }

    static async getUserOpinions(username, page, pageSize) {
        const response = await fetch(
            `${this.API_URL}/api/Users/${username}/Opinions?page=${page}&pageSize=${pageSize}`
        );

        if (!response.ok) {
            throw new Error("Fetch failes");
        }

        return response.json();
    }

    static async postLoginData(email, password) {
        const response = await fetch(
            `${this.API_URL}/api/Auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email,
                    password
                })
            }
        );

        let data;
        const contentType = response.headers.get("content-type");

        if (contentType && contentType.includes("application/json")) {
            data = await response.json();
        } else {
            data = await response.text();
        }

        if (!response.ok) {
            if (typeof data === "string" && data.length > 0) {
                throw new Error(data);
            }

            throw new Error("Coś poszło nie tak, spróbuj ponownie później");
        }

        return data;
    }

    static async postRegisterData(userName, email, password, captchaToken) {
        const response = await fetch(
            `${this.API_URL}/api/Auth/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    userName,
                    email,
                    password,
                    captchaToken
                })
            }
        );

        let data;
        const contentType = response.headers.get("content-type");

        if (contentType && contentType.includes("application/json")) {
            data = await response.json();
        } else {
            data = await response.text();
        }

        if (!response.ok) {
            if (typeof data === "string" && data.length > 0) {
                throw new Error(data);
            }

            throw new Error("Coś poszło nie tak, spróbuj ponownie później");
        }

        return data;
    }

    static async getLoggedUser(token) {
        const response = await fetch(
            `${this.API_URL}/api/me`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }
        );

        if (!response.ok) {
            throw new Error("Błąd autoryzacji");
        }

        return response.json();
    }

    static async getUserByUsername(username) {
        const response = await fetch(
            `${this.API_URL}/api/user/${username}`
        );

        if (response.status === 404) {
            return null;
        }

        if (!response.ok) {
            throw new Error("Fetch failed");
        }

        return response.json();
    }

    static async addRecipe(recipeData, token) {
        const response = await fetch(
            `${this.API_URL}/api/Recipes/add`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(recipeData)
            }
        );

        let data;
        const contentType = response.headers.get("content-type");

        if (contentType && contentType.includes("application/json")) {
            data = await response.json();
        } else {
            data = await response.text();
        }

        if (!response.ok) {
            if (typeof data === "object" && data.error) {
                throw new Error(data.error);
            }
            
            if (typeof data === "string" && data.length > 0) {
                throw new Error(data);
            }

            throw new Error("Wystąpił nieoczekiwany błąd serwera.");
        }

        return data;
    }

    static async deleteRecipe(recipeId, token) {
        const response = await fetch(
            `${this.API_URL}/api/Recipes/delete/${recipeId}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`
                },
            }
        );

        return response;
    }

    static async editRecipe(recipeData, token, recipeId) {
        const response = await fetch(
            `${this.API_URL}/api/Recipes/edit/${recipeId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(recipeData)
            }
        );

        let data;
        const contentType = response.headers.get("content-type");

        if (contentType && contentType.includes("application/json")) {
            data = await response.json();
        } else {
            data = await response.text();
        }

        if (!response.ok) {
            if (typeof data === "object" && data.error) {
                throw new Error(data.error);
            }
            
            if (typeof data === "string" && data.length > 0) {
                throw new Error(data);
            }

            throw new Error("Wystąpił nieoczekiwany błąd serwera.");
        }

        return data;
    }

    static async addNutrition(recipeId, nutritionData, token) {
        const response = await fetch(
            `${this.API_URL}/api/Recipes/${recipeId}/Nutrition/add`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(nutritionData)
            }
        );

        let data;
        const contentType = response.headers.get("content-type");

        if (contentType && contentType.includes("application/json")) {
            data = await response.json();
        } else {
            data = await response.text();
        }

        if (!response.ok) {
            if (typeof data === "object" && data.error) {
                throw new Error(data.error);
            }
            
            if (typeof data === "string" && data.length > 0) {
                throw new Error(data);
            }

            throw new Error("Wystąpił nieoczekiwany błąd serwera.");
        }

        return data;
    }

    static async editNutrition(recipeId, nutritionData, token) {
        const response = await fetch(
            `${this.API_URL}/api/Recipes/${recipeId}/Nutrition/edit`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(nutritionData)
            }
        );

        let data;
        const contentType = response.headers.get("content-type");

        if (contentType && contentType.includes("application/json")) {
            data = await response.json();
        } else {
            data = await response.text();
        }

        if (!response.ok) {
            if (typeof data === "object" && data.error) {
                throw new Error(data.error);
            }
            
            if (typeof data === "string" && data.length > 0) {
                throw new Error(data);
            }

            throw new Error("Wystąpił nieoczekiwany błąd serwera.");
        }

        return data;
    }

    static async deleteNutrition(recipeId, token) {
        const response = await fetch(
            `${this.API_URL}/api/Recipes/${recipeId}/Nutrition/delete`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
            }
        );

        let data;
        const contentType = response.headers.get("content-type");

        if (contentType && contentType.includes("application/json")) {
            data = await response.json();
        } else {
            data = await response.text();
        }

        if (!response.ok) {
            if (typeof data === "object" && data.error) {
                throw new Error(data.error);
            }
            
            if (typeof data === "string" && data.length > 0) {
                throw new Error(data);
            }

            throw new Error("Wystąpił nieoczekiwany błąd serwera.");
        }

        return data;
    }

    static async addPhoto(recipeId, formData, token) {
        const response = await fetch(
            `${this.API_URL}/api/Recipes/${recipeId}/Photos/add`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`
                },
                body: formData
            }
        );

        let data;
        const contentType = response.headers.get("content-type");

        if (contentType && contentType.includes("application/json")) {
            data = await response.json();
        } else {
            data = await response.text();
        }

        if (!response.ok) {
            if (typeof data === "object" && data.error) {
                throw new Error(data.error);
            }
            
            if (typeof data === "string" && data.length > 0) {
                throw new Error(data);
            }

            throw new Error("Wystąpił nieoczekiwany błąd serwera.");
        }

        return data;
    }

    static async deletePhoto(photoId, token) {
        const response = await fetch(
            `${this.API_URL}/api/Photos/delete/${photoId}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`
                },
            }
        );

        let data;
        const contentType = response.headers.get("content-type");

        if (contentType && contentType.includes("application/json")) {
            data = await response.json();
        } else {
            data = await response.text();
        }

        if (!response.ok) {
            if (typeof data === "object" && data.error) {
                throw new Error(data.error);
            }
            
            if (typeof data === "string" && data.length > 0) {
                throw new Error(data);
            }

            throw new Error("Wystąpił nieoczekiwany błąd serwera.");
        }

        return data;
    }

    static async getMyRecipeOpinion(recipeId, token) {
        const response = await fetch(
            `${this.API_URL}/api/Recipes/${recipeId}/MyOpinion`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`
                },
            }
        );

        if (!response.ok) {
            return null;
        }

        return response.json();
    }

    static async isLiked(recipeId, token) {
        const response = await fetch(
            `${this.API_URL}/api/Likes/${recipeId}`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }
        )

        if (!response.ok) {
            throw new Error("Wystąpił nieoczekiwany błąd serwera.");
        }

        return response.json();
    }

    static async addLike(recipeId, token) {
        const response = await fetch(
            `${this.API_URL}/api/Likes/${recipeId}`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }
        )

        if (!response.ok) {
            throw new Error("Wystąpił nieoczekiwany błąd serwera.");
        }

        return response.json();
    }

    static async deleteLike(recipeId, token) {
        const response = await fetch(
            `${this.API_URL}/api/Likes/${recipeId}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }
        )

        if (!response.ok) {
            throw new Error("Wystąpił nieoczekiwany błąd serwera.");
        }

        return true;
    }

    static async isFollowed(usernameToFollow, token) {
        const response = await fetch(
            `${this.API_URL}/api/Follows/${usernameToFollow}`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }
        )

        if (!response.ok) {
            throw new Error("Wystąpił nieoczekiwany błąd serwera.");
        }

        return response.json();  
    }

    static async addFollow(usernameToFollow, token) {
        const response = await fetch(
            `${this.API_URL}/api/Follows/${usernameToFollow}`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }
        )

        if (!response.ok) {
            throw new Error("Wystąpił nieoczekiwany błąd serwera.");
        }

        return response.json();
    }

    static async deleteFollow(usernameToFollow, token) {
        const response = await fetch(
            `${this.API_URL}/api/Follows/${usernameToFollow}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }
        )

        if (!response.ok) {
            throw new Error("Wystąpił nieoczekiwany błąd serwera.");
        }

        return true;
    }
}
