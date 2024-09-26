import * as React from 'react';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Typography from '@mui/material/Typography';
import { Link, useLocation } from "react-router-dom";
import Stack from '@mui/material/Stack';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';

export default function Breadcrumb() {
  const location = useLocation();
  
  // Tách đường dẫn từ location.pathname (ví dụ "/products/laptops/dell-xps-13")
  const pathnames = location.pathname.split('/').filter((x) => x);

  return (
    <Stack spacing={2}>
      <Breadcrumbs separator="›" aria-label="breadcrumb" className='breadcrumb'>
  
        <Link  to="/" >
          <HomeOutlinedIcon color="inherit"/> 
        </Link>

       
        {pathnames.map((value, index) => {
          const to = `/${pathnames.slice(0, index + 1).join('/')}`;

          const isLast = index === pathnames.length - 1;
          return isLast ? (
            <Typography key={to} sx={{ color: 'text.primary' }}>
              {value.charAt(0).toUpperCase() + value.slice(1)}
            </Typography>
          ) : (
            <Link key={to} color="inherit" to={to} className=''>
              {value.charAt(0).toUpperCase() + value.slice(1)}
            </Link>
          );
        })}
      </Breadcrumbs>
    </Stack>
  );
}
