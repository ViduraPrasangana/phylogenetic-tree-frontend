import React, { Component } from 'react'
import { Button, NavLink } from 'shards-react'
import {  Link } from 'react-router-dom'

export default class RegisterButton extends Component {
    render() {
        return (
            <NavLink tag={Link} to="/register" className="text-nowrap align-items-center" style={{paddingTop:13}}>
            <Button theme="secondary">Sign up</Button>
          </NavLink>
        )
    }
}
