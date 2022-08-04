import React, { Component } from 'react';
import { Menu, Icon } from 'semantic-ui-react';
import { NavLink } from 'react-router-dom';
import '../new.css';


export default class Header extends Component {
  render() {
    return (
      <Menu stackable pointing secondary id="header_bg_color_p2">
        <Menu.Item as={NavLink} exact to="/" id="header_bg_color_p2_menu">
          <img src="/unilever-logo.svg" alt="Unilever Logo" />
          &nbsp; Analítica
        </Menu.Item>
      
        
        <Menu.Item name="reuslts" as={NavLink} exact to="/analytics" id="header_bg_color_p2_menu_2">		        
          <Icon name="upload" />		        
         Results		
        </Menu.Item>
{/*         
        <Menu.Item name="upload" as={NavLink} exact to="/upload">
          <Icon name="upload" />
          Upload PIM Sheet
        </Menu.Item> */}
       
        
      </Menu>
    );
  }
}
