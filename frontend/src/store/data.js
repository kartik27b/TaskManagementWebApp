import { api } from "../extras/api";

// eslint-disable-next-line no-unused-vars
const { createSlice, current } = require("@reduxjs/toolkit");

const dataSlice = createSlice({
  name: "data",
  initialState: {
    isDataLoading: false,
    teams: null,
    team: null,
    team_tasks: null,
    all_users: [],
  },
  reducers: {
    dataLoadingStart(state, action) {
      state.isDataLoading = true;
    },
    dataLoadingEnd(state, action) {
      state.isDataLoading = false;
    },
    setData(state, action) {
      const { teams, users } = action.payload;
      state.teams = teams;
      state.all_users = users;
    },
    addTeam(state, action) {
      state.teams.push(action.payload);
    },
    changeTeam(state, action) {
      const id = action.payload;

      state.team = state.teams.find((team) => team.id === id);
      updateTeamTasksState(state);
    },
    addTasktoCategory(state, action) {
      const task = action.payload;

      const idx = state.team.team_categories.findIndex(
        (category) => category.id === task.category
      );
      state.team.team_categories[idx].category_tasks.push(task);

      updateTeamTasksState(state);
      updateTeamsState(state);
    },
    deleteTaskState(state, action) {
      const task = action.payload;

      const idx = state.team.team_categories.findIndex(
        (category) => category.id === task.category
      );
      const task_index = state.team.team_categories[
        idx
      ].category_tasks.findIndex((curtask) => curtask.id === task.id);

      state.team.team_categories[idx].category_tasks.splice(task_index, 1);

      updateTeamTasksState(state);
      updateTeamsState(state);
    },
    addCategory(state, action) {
      if (state.team.team_categories) {
        state.team.team_categories.push(action.payload);
      } else {
        state.team.team_categories = [];
        state.team.team_categories.push(action.payload);
      }
      updateTeamsState(state);
    },
    changeCategory(state, action) {
      const { task, category } = action.payload;

      if (task.category !== category) {
        // find index of current category
        const category_index = state.team.team_categories.findIndex(
          (category) => category.id === task.category
        );
        //find index of task in current category
        const task_index = state.team.team_categories[
          category_index
        ].category_tasks.findIndex((curtask) => curtask.id === task.id);
        //remove task from current category
        state.team.team_categories[category_index].category_tasks.splice(
          task_index,
          1
        );
        // find index of new category
        const idx = state.team.team_categories.findIndex(
          (cat) => cat.id === category
        );
        // update category of old task
        const newTask = { ...task, category: category };
        // add updated task to new category
        state.team.team_categories[idx].category_tasks.push(newTask);
        // update team state
        state.team_tasks = [];
        state.team.team_categories.map((team, id) => {
          return team.category_tasks.map((task) => state.team_tasks.push(task));
        });

        //update teams state also
        updateTeamsState(state);
      }
    },
  },
});

const updateTeamTasksState = (state) => {
  state.team_tasks = [];
  if (state.team.team_categories) {
    state.team.team_categories.map((team) => {
      return team.category_tasks.map((task) => state.team_tasks.push(task));
    });
  } else {
    state.team.team_categories = [];
    state.team.team_categories.map((team) => {
      return team.category_tasks.map((task) => state.team_tasks.push(task));
    });
  }
};

const updateTeamsState = (state) => {
  const teams_idx = state.teams.findIndex((team) => team.id === state.team.id);
  state.teams[teams_idx] = state.team;
};

export const {
  dataLoadingStart,
  dataLoadingEnd,
  setData,
  addTeam,
  changeTeam,
  deleteTaskState,
  addCategory,
  changeCategory,
  addTasktoCategory,
} = dataSlice.actions;

export const changeCategoryAsync = (dta) => async (dispatch, getState) => {
  const { task, category } = dta;

  if (task.category !== category) {
    const { data } = getState();
    const id = data.team.id;
    try {
      const res = await api.post(`/changecategory/${task.id}/`, {
        category,
        team: id,
      });
      console.log(res.data);
      dispatch(changeCategory(dta));
    } catch (e) {
      console.log(e);
    }
  }
};

export const getEverything = () => async (dispatch) => {
  try {
    dispatch(dataLoadingStart());

    const res = await api.get("/listall/");
    const users = await api.get("/auth/signup/");

    dispatch(setData({ teams: res.data, users: users.data }));
    if (res.data.length !== 0) {
      dispatch(changeTeam(res.data[0].id));
    }
    dispatch(dataLoadingEnd());
  } catch (e) {
    console.log(e);
  }
};

export default dataSlice.reducer;
