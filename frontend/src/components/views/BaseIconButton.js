import { IconButton, Stack, Typography } from "@mui/material"


export default function BaseIconButton({ icon, title, ...props }) {
    return (
  
      <IconButton
        {...props}
        size='small'
        color='inherit'
      >
        <Stack
          justifyContent="center"
          alignItems="center">
          {icon}
          <Typography variant='subtitle2'>
            {title}
          </Typography>
        </Stack>
      </IconButton>
    )
  }