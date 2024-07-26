import React from 'react'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
// import IconButton from '@mui/material/IconButton'
// import PlaylistPlay from '@mui/icons-material/PlaylistPlay'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import useBrowserData from '../hooks/useBrowserData'

function Item(props) {
  const { sx, ...other } = props;
  return (
    <Box
      sx={{
        p: 1,
        m: 1,
        color: (theme) => (theme.palette.mode === 'dark' ? 'grey.300' : 'grey.800'),
        fontSize: '0.875rem',
        fontWeight: '700',
        ...sx,
      }}
      {...other}
    />
  );
}
Item.propTypes = {
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx: PropTypes.oneOfType([
    PropTypes.arrayOf(
      PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool]),
    ),
    PropTypes.func,
    PropTypes.object,
  ]),
};

const CustomAppBar = (props) => {
  const { t } = useTranslation()
  const { size } = useBrowserData()
  // const onClickMenu = () => console.log("onClickMenu")
  return (
    <AppBar
      sx={{ background: 'transparent', boxShadow: 'none'}}
    >
      <Toolbar>
        <div style={{ width: '100%' }}>
          <Box sx={{
              display: 'flex',
              justifyContent: 'space-between',
              p: 1,
              m: 1,
            }}>
            <Item>
              <img
                src={'/icon/logo-bplus-mobile.svg'}
                alt=""
                style={{height: 52}} />
            </Item>
            <Item>
              <Typography
                sx={{
                    fontFamily: "'Work Sans', sans-serif",
                    fontSize: (size === "sm") ? 25 : (size === "xs") ? 14 : 35,
                    textDecoration: 'none',
                    width: '100%'
                  }}
                color="inherit"
              >
                {t("JohnLongTitle")}
              </Typography>
            </Item>
            <Item>
  {/* To Do!!! Bibelleseplan oder ganzes Video             */}
              {/* <IconButton
                sx={{color: 'white',backgroundColor: 'darkgrey'}}
                onClick={(e) => onClickMenu(e)}>
                <PlaylistPlay/>
              </IconButton> */}
            </Item>
          </Box>
        </div>
      </Toolbar>
    </AppBar>
  )
}

export default CustomAppBar
