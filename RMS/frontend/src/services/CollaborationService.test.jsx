import axios from "axios";
import {
  fetchCollaborationRequests,
  acceptCollaborationRequest,
  rejectCollaborationRequest,
  sendCollaborationRequest
} from "./CollaborationService";

jest.mock("axios");

describe("CollaborationService", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("fetchCollaborationRequests should return collaboration data", async () => {
    const mockData = { collaborations: [{ id: "1", status: "Pending" }] };
    axios.get.mockResolvedValue({ data: mockData });

    const result = await fetchCollaborationRequests("M123");

    expect(result).toEqual(mockData.collaborations);
    expect(axios.get).toHaveBeenCalledWith("http://localhost:3000/api/collaborations/M123/Manager");
  });

  test("fetchCollaborationRequests should return an empty array if collaborations is undefined", async () => {
    axios.get.mockResolvedValue({ data: {} });

    const result = await fetchCollaborationRequests("M456");

    expect(result).toEqual([]); // Ensuring it handles missing collaborations properly
  });

  test("fetchCollaborationRequests should throw an error on failure", async () => {
    axios.get.mockRejectedValue(new Error("Network Error"));

    await expect(fetchCollaborationRequests("M123")).rejects.toThrow("Network Error");
  });

  test("acceptCollaborationRequest should call axios.put with Approved status", async () => {
    axios.put.mockResolvedValue({});

    await acceptCollaborationRequest("REQ001");

    expect(axios.put).toHaveBeenCalledWith("http://localhost:3000/api/collaborations/REQ001", {
      status: "Approved",
    });
  });

  test("rejectCollaborationRequest should call axios.put with Rejected status", async () => {
    axios.put.mockResolvedValue({});

    await rejectCollaborationRequest("REQ002");

    expect(axios.put).toHaveBeenCalledWith("http://localhost:3000/api/collaborations/REQ002", {
      status: "Rejected",
    });
  });

  test("sendCollaborationRequest should send a POST request and return data", async () => {
    const mockResponse = { data: { message: "Request Sent" } };
    axios.post.mockResolvedValue(mockResponse);

    const result = await sendCollaborationRequest("A789", "M789");

    expect(axios.post).toHaveBeenCalledWith("http://localhost:3000/api/collaborations", expect.any(Object));
    expect(result).toEqual(mockResponse.data);
  });

  test("sendCollaborationRequest should throw an error on failure", async () => {
    axios.post.mockRejectedValue(new Error("Request Failed"));

    await expect(sendCollaborationRequest("A101", "M101")).rejects.toThrow("Request Failed");
  });
});
