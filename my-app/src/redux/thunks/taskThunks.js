// redux/thunks/taskThunks.js
export const fetchTasksByOrganization = (orgId) => async (dispatch) => {
  try {
    const res = await axios.get(`/api/tasks/organization/${orgId}`);
    dispatch(setTasks(res.data));
  } catch (err) {
    console.error('❌ Failed to fetch organization tasks', err);
  }
};
