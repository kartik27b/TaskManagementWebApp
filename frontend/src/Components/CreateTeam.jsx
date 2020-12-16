import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import Field from "./Field";
import { TextField } from "@material-ui/core";
import FormDialog from "./FormDialog";
import { useDispatch, useSelector } from "react-redux";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { useForm } from "react-hook-form";
import { api } from "../extras/api";
import { addTeam } from "../store/data";

export default function CreateTeam({ open, handleClose }) {
  const [values, setValues] = useState([]);
  const users = useSelector((state) => state.data.all_users);
  const { register, errors, handleSubmit } = useForm();
  const dispatch = useDispatch();

  // const addMember = () => {
  //   setNames([value, ...names]);
  // };

  const onSubmit = async (data) => {
    const { teamname } = data;
    const userIds = values.map((user) => user.id);
    console.log(userIds);

    try {
      const res = await api.post("/createteam/", {
        name: teamname,
        users: userIds,
      });
      console.log(res.data);
      dispatch(addTeam(res.data));
      handleClose();
    } catch (err) {
      if (err.response) {
        const ans = err.response.data;
        console.log(ans);
      }
    }
    console.log(data);
  };

  const handleChange = (event, values) => {
    setValues(values);
    console.log(values);
  };

  return (
    <div>
      <FormDialog
        open={open}
        handleClose={handleClose}
        heading="Add a New Team"
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <Field
              autoFocus={true}
              error={!!errors.teamname}
              ref={register({ required: true })}
              errorVal="Should not be empty"
              label="Team Name"
              name="teamname"
            ></Field>
            <Autocomplete
              multiple
              id="tags-outlined"
              options={users}
              getOptionLabel={(user) => user.username}
              filterSelectedOptions
              onChange={handleChange}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  label="Add Team Members"
                  placeholder="Users in Organisation"
                />
              )}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
            <Button type="submit" color="primary">
              Add
            </Button>
          </DialogActions>
        </form>
      </FormDialog>
    </div>
  );
}
