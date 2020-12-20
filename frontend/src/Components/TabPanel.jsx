import { Fragment } from "react";

export default function TabPanel({ children, value, index, ...other }) {
  return value === index && <div {...other}>{value === index && children}</div>;
}
