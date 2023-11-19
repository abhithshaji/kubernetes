import React, { useState } from 'react';
import './SroHome.css'
import { Button, Stack, Badge, Alert, Form, Table, Spinner, Container, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import swal from 'sweetalert';
import SroAddLand from './SroAddLand';
import SroNavbar from './SroNavbar';

function SroHome() {

    const [parameter, setparameter] = useState('');
    const [showSroAddLand, setshowSroAddLand] = useState(false);
    const [showSroSearchLand, setshowSroSearchLand] = useState(false);
    const [showSroDeleteLand, setshowSroDeleteLand] = useState(false);
    const [showSroUpdateLand, setshowSroUpdateLand] = useState(false);

    //error
    const [showParameterError, setshowParameterError] = useState(false);


    const parameterChangeHandler = (e) => {
        switch (e.target.value) {
            case 'sroAddLand': {
                setshowSroAddLand(true);
                setshowSroSearchLand(false);
                setshowSroDeleteLand(false);
                setshowSroUpdateLand(false);
                break;
            }

            case 'sroSearchLand': {
                setshowSroSearchLand(true);
                setshowSroAddLand(false);
                setshowSroDeleteLand(false);
                setshowSroUpdateLand(false);
                break;
            }

            case 'sroDeleteLand': {
                setshowSroDeleteLand(true);
                setshowSroAddLand(false);
                setshowSroSearchLand(false);
                setshowSroUpdateLand(false);
                break;
            }

            case 'sroUpdateLand': {
                setshowSroUpdateLand(true);
                setshowSroAddLand(false);
                setshowSroSearchLand(false);
                setshowSroDeleteLand(false);
                break;
            }
            default: {
                setshowSroAddLand(false);
                setshowSroSearchLand(false);
                setshowSroDeleteLand(false);
                setshowSroUpdateLand(false);
            }

        }
        setparameter(e.target.value)
    }

    return (
        <div className='sro-background'>
            <SroNavbar page='Home' />
        </div>
    )
}

export default SroHome