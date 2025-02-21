import axios from "axios";
import {
  createUser,
  fetchUserDetails,
  updateUserProfile,
  fetchUsersByRole,
  toggleUserStatus,
} from "./userService";

jest.mock("axios");

const API_BASE_URL = "http://localhost:3000/api/users";

describe("User Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockToken = "mock-token";
  sessionStorage.setItem("token", mockToken);

  describe("createUser", () => {
    it("should create a user successfully", async () => {
      const mockUser = { username: "testuser", role: "manager" };
      const mockResponse = { data: { success: true, user: mockUser } };

      axios.post.mockResolvedValue(mockResponse);

      const result = await createUser(mockUser);
      expect(axios.post).toHaveBeenCalledWith(
        API_BASE_URL,
        { ...mockUser, role: "Manager" },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${mockToken}`,
          },
        }
      );
      expect(result).toEqual(mockResponse.data);
    });

    it("should throw an error if user creation fails", async () => {
      axios.post.mockRejectedValue({
        response: { data: { message: "User creation failed" } },
      });

      await expect(createUser({ username: "testuser" })).rejects.toThrow(
        "User creation failed"
      );
    });
  });

  describe("fetchUserDetails", () => {
    it("should fetch user details successfully", async () => {
      const mockUser = { username: "testuser", email: "test@example.com" };
      axios.get.mockResolvedValue({ data: { user: mockUser } });

      const result = await fetchUserDetails("testuser");
      expect(axios.get).toHaveBeenCalledWith(`${API_BASE_URL}/testuser`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${mockToken}`,
        },
      });
      expect(result).toEqual(mockUser);
    });

    it("should throw an error if fetching user details fails", async () => {
      axios.get.mockRejectedValue(new Error("Request failed"));

      await expect(fetchUserDetails("testuser")).rejects.toThrow(
        "Failed to fetch user details"
      );
    });
  });

  describe("updateUserProfile", () => {
    it("should update a user profile successfully", async () => {
      const mockResponse = { data: { success: true } };
      axios.put.mockResolvedValue(mockResponse);

      const result = await updateUserProfile("testuser", { email: "new@example.com" });
      expect(axios.put).toHaveBeenCalledWith(
        `${API_BASE_URL}/testuser`,
        { email: "new@example.com" },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${mockToken}`,
          },
        }
      );
      expect(result).toEqual(mockResponse.data);
    });

    it("should throw an error if updating profile fails", async () => {
      axios.put.mockRejectedValue(new Error("Update failed"));

      await expect(updateUserProfile("testuser", {})).rejects.toThrow(
        "Failed to update profile"
      );
    });
  });

  describe("fetchUsersByRole", () => {
    it("should fetch users by role successfully", async () => {
      const mockUsers = [{ username: "user1" }, { username: "user2" }];
      axios.get.mockResolvedValue({ data: { success: true, users: mockUsers } });

      const result = await fetchUsersByRole("artist");
      expect(axios.get).toHaveBeenCalledWith(`${API_BASE_URL}/role/artist`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${mockToken}`,
        },
      });
      expect(result).toEqual(mockUsers);
    });

    it("should throw an error if fetching users by role fails", async () => {
      axios.get.mockRejectedValue(new Error("Fetch failed"));

      await expect(fetchUsersByRole("artist")).rejects.toThrow("Fetch failed");
    });
  });

  describe("toggleUserStatus", () => {
    it("should toggle user active status successfully", async () => {
      const mockUser = { username: "testuser", isActive: true };
      axios.put.mockResolvedValue({ data: { success: true, user: mockUser } });

      const result = await toggleUserStatus("123", true);
      expect(axios.put).toHaveBeenCalledWith(
        `${API_BASE_URL}/toggle/123`,
        { isActive: true },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${mockToken}`,
          },
        }
      );
      expect(result).toEqual(mockUser);
    });

    it("should throw an error if toggling user status fails", async () => {
      axios.put.mockRejectedValue(new Error("Toggle failed"));

      await expect(toggleUserStatus("123", true)).rejects.toThrow("Toggle failed");
    });
  });
});
