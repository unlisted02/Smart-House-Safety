// src/components/Sidebar.js
import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { Home, Devices, Lock, Settings } from '@mui/icons-material';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <Drawer variant="permanent" anchor="left" style={{ width: 240 }}>
      <List>
        <ListItem button component={Link} to="/" key="Home">
          <ListItemIcon><Home /></ListItemIcon>
          <ListItemText primary="Home" />
        </ListItem>
        <ListItem button component={Link} to="/devices" key="Devices">
          <ListItemIcon><Devices /></ListItemIcon>
          <ListItemText primary="Devices" />
        </ListItem>
        <ListItem button component={Link} to="/parental-controls" key="Parental Controls">
          <ListItemIcon><Lock /></ListItemIcon>
          <ListItemText primary="Parental Controls" />
        </ListItem>
        <ListItem button component={Link} to="/user-details" key="User Details">
          <ListItemIcon><Settings /></ListItemIcon>
          <ListItemText primary="User Details" />
        </ListItem>
      </List>
    </Drawer>
  );
};

export default Sidebar;
