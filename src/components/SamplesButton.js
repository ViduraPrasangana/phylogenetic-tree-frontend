import React, { Component } from 'react'
import { Button, NavLink } from 'shards-react'
import {  Link } from 'react-router-dom'

export default class SamplesButton extends Component {
    render() {
        return (
            <NavLink tag={Link} to="/samples" className="text-nowrap align-items-center" style={{paddingTop:13}}>
            <Button theme="secondary">Try with samples</Button>
            </NavLink>
        )
    }
}
