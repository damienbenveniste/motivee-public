import { styled, alpha } from '@mui/material/styles';
import {
  Box,
  ListSubheader,
  ListItemIcon,
  ListItemButton
} from '@mui/material'
import { matchPath } from 'react-router-dom'


export const ListSubheaderStyle = styled((props) => <ListSubheader disableSticky disableGutters {...props} />)(
  ({ theme }) => ({
    ...theme.typography.overline,
    paddingTop: theme.spacing(1),
    paddingLeft: theme.spacing(2),
    paddingBottom: theme.spacing(1),
    color: theme.palette.text.primary,
    transition: theme.transitions.create('opacity', {
      duration: theme.transitions.duration.shorter,
    }),
  })
)

export const ListItemStyle = styled(ListItemButton, {
  shouldForwardProp: (prop) => prop !== 'activeRoot'
})(({ activeRoot, theme }) => ({
  ...theme.typography.body2,
  position: 'relative',
  height: 48,
  textTransform: 'capitalize',
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(1.5),
  marginBottom: theme.spacing(0.5),
  color: theme.palette.text.secondary,
  borderRadius: theme.shape.borderRadius,
  // activeRoot
  ...(activeRoot && {
    ...theme.typography.subtitle2,
    color: theme.palette.primary.main,
    backgroundColor: alpha(theme.palette.primary.main, theme.palette.action.selectedOpacity),
  }),
}));


export function DotIcon() {
  return (
    <ListItemIcon>
      <Box
        component="span"
        sx={{
          width: 4,
          height: 4,
          borderRadius: '50%',
          bgcolor: 'text.disabled',
        }}
      />
    </ListItemIcon>
  );
}

export function getActive(path, pathname) {
  return path ? !!matchPath({ path, end: true }, pathname) : false;
}