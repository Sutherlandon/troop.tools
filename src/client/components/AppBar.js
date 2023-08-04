import { useState } from 'react';
import MuiAppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import Image from 'next/image';
import Link from 'next/link';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { useSession } from 'next-auth/react';

import logoLight from '@shared/images/brand/Logo-light.png';
import AppMenu from './AppMenu';
import MenuFooter from './MenuFooter';

const drawerWidth = 240;

export default function AppBar(props) {
  const { Submenu } = props;
  const [mobileOpen, setMobileOpen] = useState(false);
  const { data: user } = useSession({ required: true });

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <MuiAppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <Box sx={{ mr: 2, display: { xs: 'block', md: 'none' } }}>
            <Image
              src={logoLight}
              alt='troop.tools logo'
              height={30}
              width={30}
            />
          </Box>
          <Link href='/' passHref style={{
            textDecoration: 'none',
            cursor: 'pointer',
            color: 'white',
          }}>
            <Typography variant='h6'>
              {user.troop}
            </Typography>
          </Link>
          <Box sx={{ flexGrow: 1 }} />
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon fontSize='large' />
          </IconButton>
        </Toolbar>
      </MuiAppBar>
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
        aria-label="mailbox folders"
      >
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Drawer
          anchor='right'
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              borderRight: 'none',
            },
          }}
        >
          <AppMenu handleDrawerToggle={handleDrawerToggle} Submenu={Submenu}/>
          <MenuFooter />
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              borderRight: 'none',
            },
          }}
          open
        >
          <AppMenu handleDrawerToggle={handleDrawerToggle} Submenu={Submenu}/>
          <MenuFooter />
        </Drawer>
      </Box>
    </Box>
  );
}
