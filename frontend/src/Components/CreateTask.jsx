import React from "react";
import Button from "@material-ui/core/Button";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import Field from "./Field";
import FormDialog from "./FormDialog";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { useServerErrors } from "../extras/hooks";
import { api } from "../extras/api";
import { addTasktoCategory } from "../store/data";

export default function CreateTask({ open, teamId, category, handleClose }) {
  const dispatch = useDispatch();

  const { register, handleSubmit } = useForm();
  const [isError, , fieldError, setServerErrors] = useServerErrors();

  const onSubmit = async (data) => {
    const { task_name, description } = data;
    if (!teamId) {
      return;
    }
    try {
      const res = await api.post("/createtask/", {
        task_name,
        team: teamId,
        category,
        description,
      });
      console.log(res.data);
      setServerErrors(null);
      dispatch(addTasktoCategory(res.data));
      handleClose();
    } catch (err) {
      if (err.response) {
        const ans = err.response.data;
        console.log(ans);
        setServerErrors(ans);
      }
    }
  };

  return (
    <div>
      <FormDialog open={open} handleClose={handleClose} heading="Add a Task">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <Field
              autoFocus={true}
              error={isError("task_name")}
              ref={register}
              errorVal={fieldError["task_name"]}
              label="Task Name"
              name="task_name"
            ></Field>
            <Field
              error={isError("description")}
              ref={register}
              errorVal={fieldError["description"]}
              label="Description"
              name="description"
            ></Field>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
            <Button
              // disabled={loading}
              variant="contained"
              color="primary"
              type="submit"
            >
              Add
            </Button>
          </DialogActions>
        </form>
      </FormDialog>
    </div>
  );
}
