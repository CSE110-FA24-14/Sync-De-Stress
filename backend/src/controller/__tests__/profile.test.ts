import { Request, Response } from "express";
import { createProfile, editProfile } from "../profile";
import { createProfileService, updateProfileService } from "../../services/profile";
import { ProfileInterface } from "../../shared/interface/modelInterface";

jest.mock("../../services/profile");

const mockResponse = () => {
  const res = {} as Response;
  res.status = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res;
};

describe("CreateProfile Controller", () => {
  it("should create a profile successfully", async () => {
    const req = {
      body: {
        authPayload: { id: "user123" },
        username: "testuser",
        dateOfBirth: "1990-01-01",
        year: "Senior",
        major: "Computer Science",
        college: "Engineering",
        classes: "CS101, CS102",
        hobby: "Reading",
        musicPreference: "Rock",
        favArtists: "Artist1, Artist2",
        contact: "testuser@example.com",
        description: "This is a test user.",
      },
    } as Request;

    const res = mockResponse();

    const savedProfile: Partial<ProfileInterface> = {
      userId: "user123",
      username: "testuser",
    };

    (createProfileService as jest.Mock).mockResolvedValue(savedProfile);

    await createProfile(req, res);

    expect(createProfileService).toHaveBeenCalledWith({
      userId: "user123",
      username: "testuser",
      dateOfBirth: new Date("1990-01-01"),
      year: "Senior",
      major: "Computer Science",
      college: "Engineering",
      classes: "CS101, CS102",
      hobby: "Reading",
      musicPreference: "Rock",
      favArtists: "Artist1, Artist2",
      contact: "testuser@example.com",
      description: "This is a test user.",
      friend: [],
      friend_requested: [],
    });

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.send).toHaveBeenCalledWith({
      status: "success",
      message: "Profile for userId user123 has been successfully created",
    });
  });

  it("should handle unexpected errors", async () => {
    const req = {
      body: {
        authPayload: { id: "user123" },
        username: "testuser",
        dateOfBirth: "1990-01-01",
        year: "Senior",
        major: "Computer Science",
        college: "Engineering",
        classes: "CS101, CS102",
        hobby: "Reading",
        musicPreference: "Rock",
        favArtists: "Artist1, Artist2",
        contact: "testuser@example.com",
        description: "This is a test user.",
      },
    } as Request;

    const res = mockResponse();

    const unexpectedError = new Error("Unexpected server error");
    (createProfileService as jest.Mock).mockRejectedValue(unexpectedError);

    await createProfile(req, res);

    expect(createProfileService).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith({
      status: "failure",
      message: "There was a failure while trying to create the profile, please try again",
    });
  });
});

describe("EditProfile Controller", () => {
  it("should edit a profile successfully", async () => {
    const req = {
      body: {
        authPayload: { id: "user123" },
        username: "updatedUser",
        dateOfBirth: "1992-05-01",
        year: "Graduate",
        major: "Data Science",
        college: "Engineering",
        classes: "DS201, DS202",
        hobby: "Gaming",
        musicPreference: "Jazz",
        favArtists: "Artist3, Artist4",
        contact: "updatedUser@example.com",
        description: "Updated profile description.",
      },
    } as Request;

    const res = mockResponse();

    const updatedProfile: Partial<ProfileInterface> = {
      userId: "user123",
      username: "updatedUser",
    };

    (updateProfileService as jest.Mock).mockResolvedValue(updatedProfile);

    await editProfile(req, res);

    expect(updateProfileService).toHaveBeenCalledWith("user123", {
      username: "updatedUser",
      dateOfBirth: new Date("1992-05-01"),
      year: "Graduate",
      major: "Data Science",
      college: "Engineering",
      classes: "DS201, DS202",
      hobby: "Gaming",
      musicPreference: "Jazz",
      favArtists: "Artist3, Artist4",
      contact: "updatedUser@example.com",
      description: "Updated profile description.",
    });

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith({
      status: "success",
      message: "Profile for userId user123 has been successfully updated",
    });
  });

  it("should handle unexpected errors", async () => {
    const req = {
      body: {
        authPayload: { id: "user123" },
        username: "updatedUser",
        dateOfBirth: "1992-05-01",
      },
    } as Request;

    const res = mockResponse();

    const unexpectedError = new Error("Unexpected server error");
    (updateProfileService as jest.Mock).mockRejectedValue(unexpectedError);

    await editProfile(req, res);

    expect(updateProfileService).toHaveBeenCalledWith("user123", expect.any(Object));
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith({
      status: "failure",
      message: "There was a failure while trying to update the profile, please try again",
    });
  });
});
