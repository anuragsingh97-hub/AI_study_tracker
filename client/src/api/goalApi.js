import API from "./axios";

// Create Goal
export const createGoal = (goalData) =>
    // console.log("...",goalData)
  API.post("/goals", goalData);


// Get All Goals
export const getGoals = () =>
  API.get("/goals");

// Get Single Goal
export const getGoal = (id) =>
  API.get(`/goals/${id}`);

// Update Goal
export const updateGoal = (id, data) =>
  API.put(`/goals/${id}`, data);

// Delete Goal
export const deleteGoal = (id) =>
  API.delete(`/goals/${id}`);