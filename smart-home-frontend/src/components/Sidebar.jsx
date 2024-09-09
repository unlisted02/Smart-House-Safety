import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Box } from '@mui/material';
import { Home, Devices, Lock, Settings, ExitToApp, Weekend, Kitchen as KitchenIcon, Bed, Bathtub } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../auth';
import { ListAlt } from '@mui/icons-material';

const Sidebar = ({ onDevicesClick }) => {
  const navigate = useNavigate();

  const handleDevicesClick = () => {
    onDevicesClick();
    navigate('/devices');
  };

  return (
    <Drawer variant="permanent" anchor="left" className="w-60 bg-slate-100">
      <Box className="flex flex-col h-full">
        <List className="space-y-4 p-4 flex-grow">
          <ListItem button component={Link} to="/" key="Home" className="hover:bg-slate-200 rounded-lg">
            <ListItemIcon className="text-gray-900"><Home /></ListItemIcon>
            <ListItemText primary="Home" className="text-gray-900" />
          </ListItem>
          <ListItem button onClick={handleDevicesClick} key="Devices" className="hover:bg-slate-200 rounded-lg">
            <ListItemIcon className="text-gray-900"><Devices /></ListItemIcon>
            <ListItemText primary="Add Devices" className="text-gray-900" />
          </ListItem>
          <ListItem button component={Link} to="/parental-controls" key="Parental Controls" className="hover:bg-slate-200 rounded-lg">
            <ListItemIcon className="text-gray-900"><Lock /></ListItemIcon>
            <ListItemText primary="Parental Controls" className="text-gray-900" />
          </ListItem>
          <ListItem button component={Link} to="/user-details" key="User Details" className="hover:bg-slate-200 rounded-lg">
            <ListItemIcon className="text-gray-900"><Settings /></ListItemIcon>
            <ListItemText primary="User Details" className="text-gray-900" />
          </ListItem>
          <ListItem button component={Link} to="/living-room" key="Living Room" className="hover:bg-slate-200 rounded-lg">
            <ListItemIcon className="text-gray-900"><Weekend /></ListItemIcon>
            <ListItemText primary="Living Room" className="text-gray-900" />
          </ListItem>
          <ListItem button component={Link} to="/kitchen" key="Kitchen" className="hover:bg-slate-200 rounded-lg">
            <ListItemIcon className="text-gray-900"><KitchenIcon /></ListItemIcon>
            <ListItemText primary="Kitchen" className="text-gray-900" />
          </ListItem>
          <ListItem button component={Link} to="/bedroom" key="Bedroom" className="hover:bg-slate-200 rounded-lg">
            <ListItemIcon className="text-gray-900"><Bed /></ListItemIcon>
            <ListItemText primary="Bedroom" className="text-gray-900" />
          </ListItem>
          <ListItem button component={Link} to="/bathroom" key="Bathroom" className="hover:bg-slate-200 rounded-lg">
            <ListItemIcon className="text-gray-900"><Bathtub /></ListItemIcon>
            <ListItemText primary="Bathroom" className="text-gray-900" />
          </ListItem>
          <ListItem button component={Link} to="/logs" key="All Logs" className="hover:bg-slate-200 rounded-lg">
            <ListItemIcon className="text-gray-900"><ListAlt /></ListItemIcon>
            <ListItemText primary="All Logs" className="text-gray-900" />
          </ListItem>
        </List>
        <List className="p-4">
          <ListItem button onClick={logout} key="Logout" className="hover:bg-slate-200 rounded-lg">
            <ListItemIcon className="text-gray-900"><ExitToApp /></ListItemIcon>
            <ListItemText primary="Logout" className="text-gray-900" />
          </ListItem>
        </List>
      </Box>
    </Drawer>
  );
};

export default Sidebar;