import * as React from 'react';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Typography from '@mui/material/Typography';
import {Link} from "react-router-dom";

import Stack from '@mui/material/Stack';




// function handleClick(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) {
//     event.preventDefault();
//     console.info('You clicked a breadcrumb.');
//   }
// const breadcrumbs =[]
export default function Breadcrumb() {
    const breadcrumbs = [
      <Link  key="1" color="inherit" to="/" >
        MUI
      </Link>,
      <Link
       
        key="2"
        color="inherit"
       to="/material-ui/getting-started/installation/"
      
      >
        Core
      </Link>,
      <Typography key="3" sx={{ color: 'text.primary' }}>
        Breadcrumb
      </Typography>,
    ];
    return (
        <Stack spacing={2}>
          <Breadcrumbs separator="›" aria-label="breadcrumb">
            {breadcrumbs}
          </Breadcrumbs>
        </Stack>
      );
}  