/**
 * Created by kriz on 22/07/2017.
 */

import React from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { MenuItem, NavItem } from 'react-bootstrap';

const emulateClick = () => document.dispatchEvent(new MouseEvent('click'));

export const NavLink = ({ to, href, children }) => (
    <LinkContainer to={to || href}><NavItem>{children}</NavItem></LinkContainer>);
export const MenuLink = ({ to, href, children }) => (
    <LinkContainer to={to || href}><MenuItem eventKey={to} onSelect={emulateClick}>{children}</MenuItem></LinkContainer>);
