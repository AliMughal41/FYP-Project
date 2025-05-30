import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { useDispatch } from "react-redux";



const jobSlice= createSlice({
    name : "jobs",
    initialState:{
        jobs :[],
        loading : false,
        error : null,
        message : null,
        singleJob : {},
        myJob : [],
    },
    reducers:{
        requestForAllJobs(state, action){
            state.loading = true;
            state.error = null;
        },
        successForAllJobs(state, action){
            state.loading = false;
            state.jobs = action.payload;
            state.error = null;
        },
        failureForAllJobs(state, action){
            state.loading = false;
            state.error = action.payload;
        },
        clearAllErrors(state,action){
            state.error = null;
            state.jobs = state.jobs;
        },
        resetJobSlice(state, action){
            state.error = null;
            state.jobs = state.jobs;
            state.loading = false;
            state.message = null;
            state.myJob = state.myJob;
            state.singleJob={};
        },
    }
});


export const fetchJobs =
  (city, niche, searchKeyword = "") =>
  async (dispatch) => {
    try {
      dispatch(jobSlice.actions.requestForAllJobs());
      let link = "http://localhost:4000/api/v1/job/getall?";
      let queryParams = [];
      if (searchKeyword) {
        queryParams.push(`searchKeyword=${searchKeyword}`);
      }
      if (city && city !== "All") {
        queryParams.push(`city=${city}`);
      }

      /***************************************************/
      /* BUG No.3 */
      if (city && city === "All") {
        queryParams = [];
        if (searchKeyword) {
          queryParams.push(`searchKeyword=${searchKeyword}`);
        }
      }
      /***************************************************/

      if (niche) {
        queryParams.push(`niche=${niche}`);
      }

      /***************************************************/
      /* BUG No.4 */
      if (niche && niche === "All") {
        queryParams = [];
        if (searchKeyword) {
          queryParams.push(`searchKeyword=${searchKeyword}`);
        }
        if (city && city !== "All") {
          queryParams.push(`city=${city}`);
        }
      }
      /***************************************************/

      link += queryParams.join("&");
      const response = await axios.get(link, { withCredentials: true });
      dispatch(jobSlice.actions.successForAllJobs(response.data.jobs));
      dispatch(jobSlice.actions.clearAllErrors());
    } catch (error) {
      dispatch(jobSlice.actions.failureForAllJobs(error.response.data.message));
    }
  };

export const fetchSingleJob = (jobId) => async (dispatch) => {
  dispatch(jobSlice.actions.requestForSingleJob());
  try {
    const response = await axios.get(
      `https://job-portal-backend-sifx.onrender.com/api/v1/job/get/${jobId}`,
      { withCredentials: true }
    );
    dispatch(jobSlice.actions.successForSingleJob(response.data.job));
    dispatch(jobSlice.actions.clearAllErrors());
  } catch (error) {
    dispatch(jobSlice.actions.failureForSingleJob(error.response.data.message));
  }
};

export const postJob = (data) => async (dispatch) => {
  dispatch(jobSlice.actions.requestForPostJob());
  try {
    const response = await axios.post(
      `https://job-portal-backend-sifx.onrender.com/api/v1/job/post`,
      data,
      { withCredentials: true, headers: { "Content-Type": "application/json" } }
    );
    dispatch(jobSlice.actions.successForPostJob(response.data.message));
    dispatch(jobSlice.actions.clearAllErrors());
  } catch (error) {
    dispatch(jobSlice.actions.failureForPostJob(error.response.data.message));
  }
};

export const getMyJobs = () => async (dispatch) => {
  dispatch(jobSlice.actions.requestForMyJobs());
  try {
    const response = await axios.get(
      `https://job-portal-backend-sifx.onrender.com/api/v1/job/getmyjobs`,
      { withCredentials: true }
    );
    dispatch(jobSlice.actions.successForMyJobs(response.data.myJobs));
    dispatch(jobSlice.actions.clearAllErrors());
  } catch (error) {
    dispatch(jobSlice.actions.failureForMyJobs(error.response.data.message));
  }
};

export const deleteJob = (id) => async (dispatch) => {
  dispatch(jobSlice.actions.requestForDeleteJob());
  try {
    const response = await axios.delete(
      `https://job-portal-backend-sifx.onrender.com/api/v1/job/delete/${id}`,
      { withCredentials: true }
    );
    dispatch(jobSlice.actions.successForDeleteJob(response.data.message));
    dispatch(clearAllJobErrors());
  } catch (error) {
    dispatch(jobSlice.actions.failureForDeleteJob(error.response.data.message));
  }
};

export const clearAllJobErrors = () => (dispatch) => {
  dispatch(jobSlice.actions.clearAllErrors());
};

export const resetJobSlice = () => (dispatch) => {
  dispatch(jobSlice.actions.resetJobSlice());
};

export default jobSlice.reducer;