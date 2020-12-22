import React from "react";
import Button from "@material-ui/core/Button";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import Field from "./Field";
import FormDialog from "./FormDialog";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useServerErrors } from "../extras/hooks";
import { addCategory } from "../store/data";
import { api } from "../extras/api";

export default function CreateCategory({ open, handleClose, teamId }) {
  const dispatch = useDispatch();
  const { register, handleSubmit } = useForm();
  const [isError, , fieldError, setServerErrors] = useServerErrors();

  const onSubmit = async (data) => {
    const { name } = data;
    if (!teamId) {
      return;
    }
    try {
      const res = await api.post("/createcategory/", {
        name,
        team: teamId,
      });
      console.log(res.data);
      setServerErrors(null);
      dispatch(addCategory(res.data));
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
      <FormDialog
        open={open}
        handleClose={handleClose}
        heading="Add a new Category"
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <Field
              autoFocus={true}
              error={isError("name")}
              ref={register}
              errorVal={fieldError["name"]}
              label="Category"
              name="name"
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
              Add Category
            </Button>
          </DialogActions>
        </form>
      </FormDialog>
    </div>
  );
}
