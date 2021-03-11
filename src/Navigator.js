import React, { useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { withStyles } from "@material-ui/core/styles";
import Divider from "@material-ui/core/Divider";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import HomeIcon from "@material-ui/icons/Home";
import PeopleIcon from "@material-ui/icons/People";
import DnsRoundedIcon from "@material-ui/icons/DnsRounded";
import PermMediaOutlinedIcon from "@material-ui/icons/PhotoSizeSelectActual";
import PublicIcon from "@material-ui/icons/Public";
import ClassIcon from "@material-ui/icons/Class";
import AddIcon from '@material-ui/icons/Add';
import EqualizerIcon from "@material-ui/icons/Equalizer";
import SchoolIcon from "@material-ui/icons/School";
import { AppContext } from "./context/context";
import AddClassModal from './Component/AddClassModal'
const styles = (theme) => ({
  categoryHeader: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
  categoryHeaderPrimary: {
    color: theme.palette.common.white,
  },
  item: {
    paddingTop: 1,
    paddingBottom: 1,
    color: "rgba(255, 255, 255, 0.7)",
    "&:hover,&:focus": {
      backgroundColor: "rgba(255, 255, 255, 0.08)",
    },
  },
  itemCategory: {
    backgroundColor: "#232f3e",
    boxShadow: "0 -1px 0 #404854 inset",
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    cursor: 'pointer'
  },
  firebase: {
    fontSize: 24,
    color: theme.palette.common.white,
  },
  itemActiveItem: {
    color: "#4fc3f7",
  },
  itemPrimary: {
    fontSize: "inherit",
  },
  itemSecondary: {
    fontSize: "inherit",
  },
  itemIcon: {
    minWidth: "auto",
    marginRight: theme.spacing(2),
  },
  divider: {
    marginTop: theme.spacing(2),
  },
});

function Navigator(props) {
  const { classes, ...other } = props;
  const { user,setCurrent ,setMode} = useContext(AppContext);
  const [categories, setCate] = useState([]);
  const [trigger, setTrigger] = useState({ class_id: "", mode: "" });
  useEffect(() => {
    if (user) {
      let data = [];
      user.class_data.forEach((obj) => {
        data.push({
          id: obj.class_key,
          class_name: obj.class_name,
          children: [
            {
              id: "Class",
              icon: <SchoolIcon />,
              mode: "class",
              active:
                trigger.class_id === obj.class_key && trigger.class_mode === "class"
                  ? true
                  : false,
            },
            {
              id: "Quiz",
              icon: <ClassIcon />,
              mode: "quiz",
              active:
                trigger.class_id === obj.class_key && trigger.class_mode === "quiz"
                  ? true
                  : false,
            },
            {
              id: "Student",
              icon: <PeopleIcon />,
              mode: "student",
              active:
                trigger.class_id === obj.class_key && trigger.class_mode === "student"
                  ? true
                  : false,
            },
            {
              id: "Statistic",
              icon: <EqualizerIcon />,
              mode: "stat",
              active:
                trigger.class_id === obj.class_key && trigger.class_mode === "stat"
                  ? true
                  : false,
            },
          ],
        });
      });
      setCate(data);
    }
  }, [user, trigger]);

  useEffect(() => {
    if (user && trigger.class_id!=='' && trigger.mode!=='') {
      setCurrent(user.class_data.filter(obj=>obj.class_key===trigger.class_id)[0])
    }
      
  },[trigger])

  //console.log('@',trigger)
  //console.log("#", categories);
  return (
    <Drawer variant="permanent" {...other}>
      <List disablePadding>
        <ListItem
          className={clsx(classes.firebase, classes.item, classes.itemCategory)}
        >
          Opgrade Office
        </ListItem>
        <ListItem className={clsx(classes.item, classes.itemCategory)}>
          <ListItemIcon className={classes.itemIcon}>
            <HomeIcon />
          </ListItemIcon>
          <ListItemText
            classes={{
              primary: classes.itemPrimary,
            }}
          >
            Project Admin
          </ListItemText>
        </ListItem>
        {categories.map(({ id, class_name, children }) => (
          <React.Fragment key={id}>
            <ListItem className={classes.categoryHeader}>
              <ListItemText
                classes={{
                  primary: classes.categoryHeaderPrimary,
                }}
              >
                {class_name}
              </ListItemText>
            </ListItem>
            {children.map(({ id: childId, icon, active, mode }) => (
              <ListItem
                key={childId}
                button
                className={clsx(classes.item, active && classes.itemActiveItem)}
                onClick={() => {
                  setMode(mode)
                  setTrigger({ class_id: id, class_mode: mode });
                }}
              >
                <ListItemIcon className={classes.itemIcon}>{icon}</ListItemIcon>
                <ListItemText
                  classes={{
                    primary: classes.itemPrimary,
                  }}
                >
                  {childId}
                </ListItemText>
              </ListItem>
            ))}

            <Divider className={classes.divider} />
          </React.Fragment>
        ))}
        <AddClassModal />
      </List>
    </Drawer>
  );
}

Navigator.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Navigator);
