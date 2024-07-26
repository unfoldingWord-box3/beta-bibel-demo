import React from 'react'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import PlayArrow from '@mui/icons-material/PlayArrow'
import PlayCircleOutlinedIcon from '@mui/icons-material/PlayCircleOutlined'
import ItemImage from './item-image'
import BibleView from './bible-view'
import BiblePlanDatePicker from './bible-plan-date-picker'
import ChevronLeft from '@mui/icons-material/ChevronLeft'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import Badge from '@mui/material/Badge'
import ChevronRight from '@mui/icons-material/ChevronRight'
import MenuBookIcon from '@mui/icons-material/MenuBook'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import { useTranslation } from 'react-i18next'
import useMediaPlayer from "../hooks/useMediaPlayer"
import { isEmptyObj } from '../utils/obj-functions'
import PropTypes from 'prop-types'
import { format, differenceInCalendarDays } from 'date-fns';
import { de } from 'date-fns/locale/de';

const NewlineText = ({text}) => text.split('\n').map((line,i) => (
  <span key={i}>
    {line}
    <br/>
  </span>
))

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

const PlanEpisode = (props) => {
  const {
    curSerie,
    expanded,
    navigationDate,
    completedList, 
    daysSinceFirst,
    firstDateOfPlan,
    onClickPlay,
    onClickExpand,
    onNewNavigationDate,
    onClickPrev,
    onClickNext,
  } = props
  const { t } = useTranslation()
  const { curPlay } = useMediaPlayer()
  const isPlaying = !isEmptyObj(curPlay)
  const uncompletedEpisodes = daysSinceFirst - completedList?.length
  const episodeNumber = differenceInCalendarDays(navigationDate,firstDateOfPlan)
  const curEp = curSerie?.episodeList[episodeNumber]
  const expandIcon = expanded ? <ExpandLessIcon/> : <MenuBookIcon/>
  const [isDatePickerOpen,setIsDatePickerOpen] = React.useState(false)

  const handleDatePickerOpen = () => setIsDatePickerOpen(true)
  const handleDatePickerClose = () => setIsDatePickerOpen(false)
  const handleDatePickerChange = (date) => {
    setIsDatePickerOpen(false)
    onNewNavigationDate && onNewNavigationDate(date)
  }
  const handleClickPlay = (epNum,ser,ep) => {
    if (!isDatePickerOpen) {
      if (onClickPlay) onClickPlay(epNum,ser,ep)
    } else {
      setIsDatePickerOpen(false)
    }
  }
  return (
    <Box>
      <Grid container alignItems="center" spacing={2}>
        <Grid item>
          {!isPlaying && (<ItemImage
            item={curSerie}
            curEp={curEp}
            onClick={() => handleClickPlay(episodeNumber,curSerie,curEp)}
            width={"100%"}
            float={"left"}
            mTop={0}
          />)}
        </Grid>
        {!isPlaying && !isDatePickerOpen && (
          <IconButton
            onClick={() => handleClickPlay(episodeNumber,curSerie,curEp)}
            sx={{
              margin: 0,
              left: 'auto',
              position: 'absolute',
              right: '45%',
              zIndex: 1000,
            }}
          >
            <PlayCircleOutlinedIcon 
              sx={{
                height: 60,
                width: 60,
              }}
            />
          </IconButton>
        )}
        <div style={{ width: '100%' }}>
          <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
          }}>
            <Item sx={{p: 0, mb: 0}}>
              {(episodeNumber>0) && (
                <IconButton
                  sx={{color: 'white',backgroundColor: 'transparent', p: 0, ml: 1, mb: 0}}
                  onClick={() => onClickPrev()}>
                  <ChevronLeft/>
                </IconButton>
              )}
            </Item>
            <Item sx={{p: 0, mb: 0}}>
              {isDatePickerOpen ? (
                <BiblePlanDatePicker 
                  date={navigationDate}
                  completedList={completedList}
                  daysSinceFirst={daysSinceFirst}
                  firstDateOfPlan={firstDateOfPlan}             
                  isOpen={isDatePickerOpen} 
                  onClose={handleDatePickerClose}
                  onChange={handleDatePickerChange}
                />
              ) : (
                <Button 
                  variant="outlined" 
                  onClick={handleDatePickerOpen}
                  endIcon={(
                    <Badge 
                      badgeContent={(uncompletedEpisodes > 0) ? uncompletedEpisodes : undefined} 
                      color="secondary"
                    >
                      <CalendarMonthIcon
                        size="small"
                      />
                    </Badge>
                  )}
                >
                  {format(navigationDate,"d MMM", {locale: de})}
                </Button>
              )}
            </Item>
            <Item sx={{p: 0, mb: 0}}>
            {(episodeNumber<daysSinceFirst) && (
              <IconButton
                sx={{color: 'white',backgroundColor: 'transparent', p: 0, mb: 0}}
                onClick={() => onClickNext()}>
                <ChevronRight/>
              </IconButton>
            )}
            </Item>
          </Box>
        </div>
      </Grid>
      {curEp && <Typography sx={{pl: 0.5, pt: 1,fontWeight: 400,fontSize: '110%'}}>{t(curEp.title)}</Typography>}
      {curEp && curEp.descr && <Typography sx={{pl: 0.5, pt: 0.5,fontWeight: 100,fontSize: '85%',width: '100%'}}><NewlineText text={t(curEp.descr)}/></Typography>}
      <Grid container alignItems="center" spacing={2}>
        <Grid item>
          <Typography
            sx={{pl: 0.5, fontWeight: 400,fontSize: '90%'}}
          >
            {t(curSerie.title) + ` ${curEp?.begin?.ch},${curEp?.begin?.v}-${curEp?.end?.v}`}
          </Typography>
        </Grid>
        <Grid item>
          <IconButton
            sx={{color: 'black',backgroundColor: 'darkgrey'}}
            onClick={() => onClickExpand(episodeNumber)}>
              {expandIcon}
          </IconButton>
        </Grid>
        {!isPlaying && (
          <Grid item>
            <IconButton
              sx={{color: 'darkblue',backgroundColor: 'darkgrey'}}
              onClick={() => handleClickPlay(episodeNumber,curSerie,curEp)}>
              <PlayArrow/>
            </IconButton>
          </Grid>
        )}
      </Grid>
      {expanded && (
        <div sx={{pt: 0.5,fontWeight: 100,fontSize: '85%',width: '100%'}}>
          <BibleView
            curEp={curEp}
          />
          <br/>
          <Grid item>
            {isPlaying && (<ItemImage
              item={curSerie}
              curEp={curEp}
              onClick={() => handleClickPlay(episodeNumber,curSerie,curEp)}
              width={"100%"}
              float={"left"}
              mTop={0}
            />)}
          </Grid>
        </div>
      )}
    </Box>
  )
}

export default PlanEpisode
